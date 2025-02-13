// PS-IMS-Backend/models/storeModel.js
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    storeName: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    operatingHours: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);
