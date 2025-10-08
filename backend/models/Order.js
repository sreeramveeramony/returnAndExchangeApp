const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Line item schema to match Shopify order structure
const lineItemSchema = new Schema({
  id: { type: Number, required: true },  // Shopify line item ID
  variant_id: { type: Number, required: true },
  title: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: String, required: true }, // price as string (e.g., "19.99")
  variant_title: { type: String },
  product_id: { type: Number },
  image_url: { type: String },
  grams: { type: Number }
}, { _id: false });

// Order schema
const orderSchema = new Schema({
  // Shopify order ID (numeric)
  id: { type: Number, required: true, unique: true },
  
  // Basic order info
  name: { type: String, required: true },  // e.g., "#1001"
  email: { type: String, required: true }, // Keep this required since order lookup depends on it
  created_at: { type: String, required: true },  // ISO date string from Shopify
  updated_at: { type: String, required: true },
  
  // Financial status
  financial_status: { type: String, required: true },
  total_price: { type: String, required: true },  // price as string (e.g., "19.99")
  currency: { type: String, default: 'INR' },
  
  // Customer info
  customer: {
    id: Number,
    email: String,
    first_name: String,
    last_name: String,
    phone: String
  },
  
  // Address information
  billing_address: {
    first_name: String,
    last_name: String,
    address1: String,
    address2: String,
    city: String,
    province: String,
    country: String,
    zip: String,
    phone: String
  },
  
  shipping_address: {
    first_name: String,
    last_name: String,
    address1: String,
    address2: String,
    city: String,
    province: String,
    country: String,
    zip: String,
    phone: String
  },
  
  // Line items
  line_items: [lineItemSchema],
  
  // Any return/exchange request associated with this order
  returnRequest: {
    requestType: {
      type: String,  // 'Return' or 'Exchange'
      enum: ['Return', 'Exchange']
    },
    status: {
      type: String,  // 'Pending', 'Approved', 'Refunded', 'Rejected', 'Completed', 'Cancelled'
      enum: ['Pending', 'Approved', 'Refunded', 'Completed', 'Cancelled', 'Rejected']
    },
    request_id: mongoose.Schema.Types.ObjectId  // Reference to Request model
  }
}, { timestamps: true });  // Add createdAt/updatedAt automatically

module.exports = mongoose.model('Order', orderSchema);