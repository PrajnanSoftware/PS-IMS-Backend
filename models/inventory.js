// PS-IMS-Backend/models/inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  name: { type: String, required: true },
  productId: { type: String, required: true, unique: true },
  category: { type: String, required: true },

  costPrice: { type: Number, required: true },
  buyingPrice: { type: Number, required: true },

  // REMOVED quantity here
  // unit, expiryDate, thresholdValue remain
  unit: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  thresholdValue: { type: Number, required: true },

  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'suppliers', required: false },
  productImgUrl: { type: String, required: false },
  availability: { type: Boolean, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
