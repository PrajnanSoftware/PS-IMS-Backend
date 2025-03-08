// PS-IMS-Backend/models/billingModel.js
const mongoose = require('mongoose');

const BillingSchema = new mongoose.Schema({
    seller: {
        name: String,
        phone: String,
        address: String,
    },
    supplier: {
        name: String,
        address: String,
    },
    customer: {
        name: String,
        phone: String,
        address: String,
    },
    cart: [
        {
            productId: mongoose.Schema.Types.ObjectId,
            name: String,
            quantity: Number,
            price: Number,
        }
    ],
    paymentMethod: String,
    totalAmount: Number,
}, { timestamps: true });

module.exports = mongoose.model('Billing', BillingSchema);
