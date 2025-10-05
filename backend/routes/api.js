// routes/requests.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Request = require('../models/Request');

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
      Approved: new Set(['Completed', 'Cancelled']),
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
        return {
          fulfillmentLineItemId,
          quantity: Number(item.quantity) || 1,
          returnReason: 'SIZE_TOO_SMALL'
        };
      });

      // If this is an Exchange, attach exchangeLineItems to the SAME returnCreate call
      let exchangeLineItems = undefined;
      if (request.type === 'Exchange' && request.exchangeItem) {
        const variantId = request.exchangeItem.variantId;
        const qty       = Number(request.exchangeItem.quantity) || 1;
        if (!variantId) {
          throw new Error('Exchange requires exchangeItem.variantId.');
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
    return res.json(updated);
  } catch (error) {
    console.error('Failed to update/process request:', error);
    return res.status(400).json({ message: `Failed to process request: ${error.message}` });
  }
});

module.exports = router;
