const mongoose = require('mongoose');
const salesSchema = new mongoose.Schema({
    seller: {
        name: String,
        phone: String,
        address: String
    },
    supplier: {
        name: String,
        address: String
    },
    customer: {
        name: String,
        phone: String,
        address: String
    },
    cart: [{
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        quantity: Number,
        price: Number
    }],
    paymentMethod: String,
    totalAmount: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Billing', salesSchema);
