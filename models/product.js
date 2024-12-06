const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: [true, 'Product name is required'] },
    productId: { type: String, required: [true, 'Product ID is required'], unique: true },
    category: { type: String, required: [true, 'Category is required'] },
    orderValue: { type: Number, required: [true, 'Order value is required'], min: 0 },
    quantity: { type: Number, required: [true, 'Quantity is required'], min: 0 },
    unit: { type: Number, required: false, min: 0 },
    buyingPrice: { type: Number, required: [true, 'Buying price is required'], min: 0 },
    dateOfDelivery: { type: Date, required: [true, 'Date of delivery is required'] },
    notifyOnDelivery: { type: Boolean, required: false },
    status: { type: String, required: [true, 'Status is required'] }
});

module.exports = mongoose.model('Product', productSchema);