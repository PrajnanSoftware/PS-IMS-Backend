// PS-IMS-Backend-main/models/supplierModel.js
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    supplierName: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: Number, required: true },

    // Instead of a single "ProductName" string,
    // we store an array of references (ObjectId) to Inventory docs
    // i.e. the list of products this supplier provides.
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventory',
            required: true,
        }
    ],

    // If you still want a "category" or "buyingPrice" at supplier level, keep them:
    category: { type: String, required: true },
    buyingPrice: { type: Number, required: true }, // was "BuyingPrice" -> rename to keep consistent
    type: { type: String, required: true },        // was "Type"
    onTheWay: { type: Number, default: 0 },

    // Image URL for supplier
    profileImgUrl: { type: String, default: '' },
});

module.exports = mongoose.model('suppliers', supplierSchema);
