const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productId: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    orderValue: { type: Number, required: true },
    quantity: { type: Number, required: true },
    unit: { type: Number, required: false },
    buyingPrice: { type: Number, required: true },
    dateOfDelivery: { type: Date, required: true },
    notifyOnDelivery: { type: Boolean, required: false },
    status: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);