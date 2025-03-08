// PS-IMS-Backend-main/models/orders.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // The Mongoose reference to Inventory doc:
    inventoryRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: false,
    },

    // Existing fields:
    productName: { type: String, required: [true, 'Product name is required'] },
    productId: {
        type: String,
        required: [true, 'Product ID is required'],
        unique: true,
    },
    category: { type: String, required: [true, 'Category is required'] },
    orderValue: { type: Number, required: [true, 'Order value is required'], min: 0 },
    quantity: { type: Number, required: [true, 'Quantity is required'], min: 0 },
    // If you want 'unit' to be a string
    unit: { type: String, required: false },
    buyingPrice: { type: Number, required: [true, 'Buying price is required'], min: 0 },
    dateOfDelivery: { type: Date, required: [true, 'Date of delivery is required'] },
    notifyOnDelivery: { type: Boolean, required: false },
    status: { type: String, required: [true, 'Status is required'] }
});

module.exports = mongoose.model('Orders', orderSchema);
