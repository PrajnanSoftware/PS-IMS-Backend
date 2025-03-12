<<<<<<< HEAD
// // productid
// .storeid
// users (one who uses the app)
// qty
// above are imp
// add otheres to if needed

// also CRUD 

// // imp for billing

// PS-IMS-Backend-main/models/stockModel.js
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory', // references the "Inventory" model
        required: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',     // references the "Store" model
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',      // references your user model (assuming "User")
        required: true
    },
    qty: {
        type: Number,
        required: true,
        min: 0
    },
    // Optionally, you can add fields like "description", "lastUpdated", "barcodeId", etc.
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);
=======
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
>>>>>>> c940ee0e (final updated code)
