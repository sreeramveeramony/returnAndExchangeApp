// routes/requests.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Request = require('../models/Request');
const Order = require('../models/Order');

const SHOPIFY_SHOP_URL      = process.env.SHOPIFY_SHOP_URL;     // e.g. my-shop.myshopify.com
const SHOPIFY_ACCESS_TOKEN  = process.env.SHOPIFY_ACCESS_TOKEN;
// Use 2025-10 by default to ensure exchangeLineItems is available
const ADMIN_API_VERSION     = process.env.ADMIN_API_VERSION || '2025-10';

// -----------------------------
// Shopify GraphQL helper
// -----------------------------
async function shopifyGql(query, variables) {
  const url = `https://${SHOPIFY_SHOP_URL}/admin/api/${ADMIN_API_VERSION}/graphql.json`;
  try {
    const resp = await axios({
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
      },
      data: { query, variables },
    });

    if (resp.data?.errors?.length) {
      console.error('Shopify GraphQL top-level errors:', resp.data.errors);
      throw new Error(resp.data.errors.map(e => e.message).join(', '));
    }

    return resp.data?.data;
  } catch (err) {
    const status = err.response?.status;
    const body   = err.response?.data;
    console.error('Shopify GraphQL request failed:', { status, body });
    throw new Error('Failed to execute Shopify GraphQL query.');
  }
}

// -----------------------------
// ROUTE: Find a Shopify order by order number and email (REST)
// -----------------------------
router.post('/lookup-order', async (req, res) => {
  const { orderNumber, email } = req.body;

  if (!orderNumber || !email) {
    return res.status(400).json({ message: 'Order number and email are required.' });
  }

  try {
    const raw = String(orderNumber).trim();
    const nameQuery = raw.startsWith('#') ? raw : `#${raw}`;

    const url =
      `https://${SHOPIFY_SHOP_URL}/admin/api/${ADMIN_API_VERSION}/orders.json?name=${encodeURIComponent(nameQuery)}&status=any`;

    const response = await axios.get(url, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    const orders = response.data?.orders ?? [];
    if (!orders.length) return res.status(404).json({ message: 'Order not found.' });

    const order = orders[0];

    const orderEmail = String(
      order.email || order.contact_email || order?.customer?.email || ''
    ).toLowerCase();

    if (!orderEmail || orderEmail !== String(email).trim().toLowerCase()) {
      return res.status(403).json({ message: 'Email does not match the order records.' });
    }

    return res.json(order);
  } catch (error) {
    console.error('Error looking up Shopify order:', error.response?.data || error.message);
    return res.status(500).json({ message: 'An error occurred while finding your order.' });
  }
});

// -----------------------------
// POST /api/requests - Create a new return/exchange request
// -----------------------------
router.post('/requests', async (req, res) => {
  try {
    console.log('[Request Creation] Body:', JSON.stringify(req.body, null, 2));
    const { type, items, originalOrder } = req.body;

    if (!type || !items || !originalOrder) {
      return res.status(400).json({ message: 'Missing required fields to create a request.' });
    }

    let exchangeItem = null;
    if (type === 'Exchange') {
      exchangeItem = items.find(i => i.requestedAction === 'exchange') || null;
    }

    const newRequest = await Request.create({
      type,
      items,
      exchangeItem,
      originalOrder,
      status: 'Pending',
    });

    // Update the corresponding order in the local DB to track the request
    try {
      await Order.findOneAndUpdate(
        { id: originalOrder.id },  // Find by Shopify order ID
        { 
          $set: { 
            returnRequest: {
              requestType: type,
              status: 'Pending',
              request_id: newRequest._id
            }
          }
        }
      );
    } catch (orderUpdateErr) {
      console.error('Error updating order with return request:', orderUpdateErr);
      // Don't fail the entire request creation if order update fails
    }

    return res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating request:', error);
    return res.status(500).json({
      message: 'Server error while creating request.',
      error: error.message,
    });
  }
});

// -----------------------------
// GET /api/requests - Fetch all requests for the admin dashboard
// -----------------------------
router.get('/requests', async (_req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    return res.json(requests);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch requests', error });
  }
});

// -----------------------------
// PATCH /api/requests/:id - Approve/Reject and process Shopify actions
// -----------------------------
router.patch('/requests/:id', async (req, res) => {
  try {
    const { id }     = req.params;
    const { status } = req.body;

    console.log(`[Request Update] ID: ${id} BODY:`, JSON.stringify(req.body, null, 2));

    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found.' });

    const VALID_NEXT = {
      Pending: new Set(['Approved', 'Rejected']),
      Approved: new Set(['Refunded', 'Completed', 'Cancelled']),
      Refunded: new Set(['Completed', 'Cancelled']),
      Rejected: new Set([]),
      Completed: new Set([]),
      Cancelled: new Set([]),
    };
    const canMove = (VALID_NEXT[request.status] || new Set()).has(status);
    if (!canMove && status !== request.status) {
      return res.status(400).json({ message: `Invalid status transition from "${request.status}" to "${status}".` });
    }

    if (status === 'Approved') {
      const orderNumericId = request.originalOrder?.id;
      if (!orderNumericId) {
        return res.status(400).json({ message: 'Request is missing originalOrder.id' });
      }
      const orderGid = `gid://shopify/Order/${orderNumericId}`;
      console.log(`[Shopify] Processing approval for order ${orderGid}`);

      // 1) Fetch FulfillmentLineItem ids for this order
      const fulfillmentDetailsQuery = `
        query GetOrderFulfillmentDetails($id: ID!) {
          order(id: $id) {
            id
            fulfillments {
              id
              fulfillmentLineItems(first: 50) {
                nodes {
                  id
                  quantity
                  lineItem {
                    id      # gid://shopify/LineItem/123456789
                    title
                  }
                }
              }
            }
          }
        }
      `;
      const orderDetails = await shopifyGql(fulfillmentDetailsQuery, { id: orderGid });

      const fulfillments = orderDetails?.order?.fulfillments ?? [];
      const extractNumeric = (gid) => {
        if (!gid || typeof gid !== 'string') return '';
        const parts = gid.split('/');
        return parts[parts.length - 1] || '';
      };

      const fulfillmentMap = {};
      for (const f of fulfillments) {
        const items = f?.fulfillmentLineItems?.nodes ?? [];
        for (const n of items) {
          const liGid = n?.lineItem?.id;      // gid://shopify/LineItem/...
          const liNum = extractNumeric(liGid); // numeric tail
          if (liGid) fulfillmentMap[liGid] = n.id;
          if (liNum) fulfillmentMap[liNum] = n.id;
        }
      }
      if (!Object.keys(fulfillmentMap).length) {
        throw new Error('Order has no fulfilled line items; nothing can be returned.');
      }
      console.log('[Shopify] Fulfillment map:', fulfillmentMap);

      // 2) Build ReturnCreate input (Return only OR Return + Exchange)
      const returnCreateMutation = `
        mutation ReturnCreate($returnInput: ReturnInput!) {
          returnCreate(returnInput: $returnInput) {
            userErrors { field message }
            return { id order { id } }
          }
        }
      `;

      // Always use SIZE_TOO_SMALL per your requirement
      const returnLineItems = request.items.map((item) => {
        const key = String(item.lineItemId);
        const fulfillmentLineItemId = fulfillmentMap[key];
        if (!fulfillmentLineItemId) {
          throw new Error(`Item "${item.title}" (LineItem key: ${item.lineItemId}) cannot be returned because it has not been fulfilled.`);
        }
        // Ensure quantity is always a positive integer
        const quantityValue = parseInt(item.quantity);
        if (isNaN(quantityValue) || quantityValue <= 0) {
          throw new Error(`Invalid quantity for item \"${item.title}\": ${item.quantity}`);
        }
        return {
          fulfillmentLineItemId,
          quantity: quantityValue,
          returnReason: 'SIZE_TOO_SMALL'
        };
      });

      // If this is an Exchange, attach exchangeLineItems to the SAME returnCreate call
      let exchangeLineItems = undefined;
      if (request.type === 'Exchange' && request.exchangeItem) {
        const variantId = request.exchangeItem.variantId;
        if (!variantId) {
          throw new Error('Exchange requires exchangeItem.variantId.');
        }
        
        // Ensure exchange quantity is always a positive integer
        const qty = parseInt(request.exchangeItem.quantity);
        if (isNaN(qty) || qty <= 0) {
          throw new Error(`Invalid exchange quantity: ${request.exchangeItem.quantity}`);
        }
        
        // GraphQL GID for ProductVariant if you stored numeric id
        const variantGid = String(variantId).startsWith('gid://')
          ? variantId
          : `gid://shopify/ProductVariant/${variantId}`;

        exchangeLineItems = [{ variantId: variantGid, quantity: qty }];
      }

      const returnInput = {
        orderId: orderGid,
        returnLineItems,
        ...(exchangeLineItems ? { exchangeLineItems } : {})
        // No refund here by design.
      };

      console.log('[Shopify] ReturnCreate payload:', returnInput);
      const returnResult = await shopifyGql(returnCreateMutation, { returnInput });
      const rErrs = returnResult?.returnCreate?.userErrors ?? [];
      if (rErrs.length) {
        console.error('returnCreate.userErrors:', rErrs);
        throw new Error(rErrs.map(e => e.message).join(', '));
      }

      console.log('[Shopify] Return created:', returnResult?.returnCreate?.return?.id);
      console.log('[Shopify] All actions completed successfully (return + optional exchange).');
    }

    request.status = status;
    const updated = await request.save();
    
    // Update the corresponding order in the local DB with the new status
    try {
      await Order.findOneAndUpdate(
        { id: request.originalOrder.id },  // Find by Shopify order ID
        { 
          $set: { 
            returnRequest: {
              requestType: request.type,
              status: status,
              request_id: request._id
            }
          }
        }
      );
    } catch (orderUpdateErr) {
      console.error('Error updating order with return request status:', orderUpdateErr);
      // Don't fail the entire request update if order update fails
    }
    
    return res.json(updated);
  } catch (error) {
    console.error('Failed to update/process request:', error);
    return res.status(400).json({ message: `Failed to process request: ${error.message}` });
  }
});

// -----------------------------
// GET /api/orders - Fetch all orders from the local DB
// -----------------------------
router.get('/orders', async (_req, res) => {
  try {
    // Fetch all orders sorted by creation date (newest first)
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// -----------------------------
// POST /api/orders/lookup - Lookup a specific order by number and email from local DB
// -----------------------------
router.post('/orders/lookup', async (req, res) => {
  const { orderNumber, email } = req.body;

  if (!orderNumber || !email) {
    return res.status(400).json({ message: 'Order number and email are required.' });
  }

  try {
    const raw = String(orderNumber).trim();
    const nameQuery = raw.startsWith('#') ? raw : `#${raw}`;

    // Find order by name in the local DB
    const order = await Order.findOne({ name: nameQuery });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found in local database.' });
    }

    // Check if email matches
    const orderEmail = String(
      order.email || order.customer?.email || ''
    ).toLowerCase();

    if (!orderEmail || orderEmail !== String(email).trim().toLowerCase()) {
      return res.status(403).json({ message: 'Email does not match the order records.' });
    }

    // Return the order data in the same format expected by the frontend
    // This includes all fields required for the return/exchange process
    const orderResponse = {
      id: order.id,
      name: order.name,
      email: order.email,
      created_at: order.created_at,
      updated_at: order.updated_at,
      financial_status: order.financial_status,
      total_price: order.total_price,
      currency: order.currency,
      customer: order.customer,
      billing_address: order.billing_address,
      shipping_address: order.shipping_address,
      line_items: order.line_items
    };
    
    return res.json(orderResponse);
  } catch (error) {
    console.error('Error looking up order from local DB:', error);
    return res.status(500).json({ message: 'An error occurred while finding your order.' });
  }
});

// -----------------------------
// POST /api/sync-orders - Sync orders from Shopify to local DB
// -----------------------------
router.post('/sync-orders', async (_req, res) => {
  try {
    console.log('Starting order sync from Shopify...');
    
    // Fetch recent orders from Shopify API
    const url = `https://${SHOPIFY_SHOP_URL}/admin/api/${ADMIN_API_VERSION}/orders.json?status=any&limit=50`;
    
    let response;
    try {
      response = await axios.get(url, {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      });
    } catch (shopifyErr) {
      console.error('Error fetching orders from Shopify:', shopifyErr.response?.data || shopifyErr.message);
      return res.status(500).json({ 
        message: 'Failed to fetch orders from Shopify API', 
        error: shopifyErr.message 
      });
    }

    const shopifyOrders = response.data?.orders || [];
    let processed = 0;
    
    for (const shopifyOrder of shopifyOrders) {
      // Check if order already exists in local DB
      const existingOrder = await Order.findOne({ id: shopifyOrder.id });
      
      if (existingOrder) {
        // Only update if we have an email
        const email = shopifyOrder.email || shopifyOrder.contact_email;
        if (email) {
          existingOrder.name = shopifyOrder.name || existingOrder.name;
          existingOrder.email = email;
          existingOrder.created_at = shopifyOrder.created_at || existingOrder.created_at;
          existingOrder.updated_at = shopifyOrder.updated_at || existingOrder.updated_at;
          existingOrder.financial_status = shopifyOrder.financial_status || existingOrder.financial_status;
          existingOrder.total_price = shopifyOrder.total_price || existingOrder.total_price;
          existingOrder.currency = shopifyOrder.currency || existingOrder.currency;
          existingOrder.customer = shopifyOrder.customer || existingOrder.customer;
          existingOrder.billing_address = shopifyOrder.billing_address || existingOrder.billing_address;
          existingOrder.shipping_address = shopifyOrder.shipping_address || existingOrder.shipping_address;
          existingOrder.line_items = shopifyOrder.line_items || existingOrder.line_items;
          
          await existingOrder.save();
        } else {
          console.log(`Skipping update for order ${shopifyOrder.id} - no email available`);
        }
      } else {
        // Create new order in local DB only if email is available
        const email = shopifyOrder.email || shopifyOrder.contact_email;
        if (!email) {
          console.log(`Skipping order ${shopifyOrder.id} - no email available`);
          continue; // Skip orders without email
        }
        
        const orderData = {
          id: shopifyOrder.id,
          name: shopifyOrder.name || '',
          email: email,
          created_at: shopifyOrder.created_at || new Date().toISOString(),
          updated_at: shopifyOrder.updated_at || new Date().toISOString(),
          financial_status: shopifyOrder.financial_status || 'unknown',
          total_price: shopifyOrder.total_price || '0.00',
          currency: shopifyOrder.currency || 'USD',
          customer: shopifyOrder.customer || {},
          billing_address: shopifyOrder.billing_address || {},
          shipping_address: shopifyOrder.shipping_address || {},
          line_items: shopifyOrder.line_items || []
        };
        
        await Order.create(orderData);
      }
      processed++;
    }
    
    console.log(`Sync completed. Processed ${processed} orders.`);
    return res.json({ 
      message: `Successfully synced ${processed} orders from Shopify`, 
      processed: processed 
    });
    
  } catch (error) {
    console.error('Error syncing orders:', error);
    return res.status(500).json({ 
      message: 'Failed to sync orders from Shopify', 
      error: error.message 
    });
  }
});

// -----------------------------
// PATCH /api/orders/:id/update-status - Update order status in local DB when return is approved
// -----------------------------
router.patch('/orders/:id/update-status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Find the order by its Shopify ID (numeric)
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID format.' });
    }
    const order = await Order.findOne({ id: orderId });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found in local database.' });
    }
    
    // Update the return request status for this order
    if (order.returnRequest) {
      // Preserve the existing request type if it exists
      order.returnRequest.status = status;
    } else {
      // If no existing return request, we can't set type without additional info
      // So we just initialize with status
      order.returnRequest = {
        status: status
      };
    }
    
    await order.save();
    
    return res.json({ 
      message: `Order status updated successfully`, 
      orderId: order.id 
    });
    
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ 
      message: 'Failed to update order status', 
      error: error.message 
    });
  }
});

module.exports = router;
