const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Sub-schema for individual items in a request
const itemSchema = new Schema({
    lineItemId: { type: Number, required: true },
    variantId: { type: Number },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: String, required: true },
    requestedAction: { type: String, required: true, enum: ['return', 'exchange'] }
}, { _id: false });

const requestSchema = new Schema({
    // Type of request: Return or Exchange
    type: {
        type: String,
        required: true,
        enum: ['Return', 'Exchange']
    },
    // Array of items being returned or exchanged
    items: [itemSchema],
    // The specific item requested for an exchange
    exchangeItem: {
        type: Object, // Storing as a flexible object
        required: false
    },
    // A complete snapshot of the original Shopify order
    originalOrder: {
        type: Object,
        required: true
    },
    // The current status of the request
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);

