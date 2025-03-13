// PS-IMS-Backend/models/stockModel.js
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    qty: {
        type: Number,   // make sure it's Number, not ObjectId
        required: true,
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);
