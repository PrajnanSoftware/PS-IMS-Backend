// PS-IMS-Backend-main/models/inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    productId: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    buyingPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    thresholdValue: { type: Number, required: true },

    // If you reference suppliers:
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'suppliers', required: false },
    // If you store an image URL from Cloudinary
    productImgUrl: { type: String, required: false },
    availability: { type: Boolean, required: true },
});

module.exports = mongoose.model('Inventory', inventorySchema);
