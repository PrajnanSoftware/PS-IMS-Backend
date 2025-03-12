<<<<<<< HEAD

// PS-IMS-Backend-main/models/inventory.js
=======
// PS-IMS-Backend/models/inventory.js
>>>>>>> c940ee0e (final updated code)
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

<<<<<<< HEAD
  // NEW fields
  costPrice: { type: Number, required: true },
  buyingPrice: { type: Number, required: true },

  quantity: { type: Number, required: true, min: 0 },
=======
  costPrice: { type: Number, required: true },
  buyingPrice: { type: Number, required: true },

  // REMOVED quantity here
  // unit, expiryDate, thresholdValue remain
>>>>>>> c940ee0e (final updated code)
  unit: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  thresholdValue: { type: Number, required: true },

  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'suppliers', required: false },
  productImgUrl: { type: String, required: false },
  availability: { type: Boolean, required: true },
<<<<<<< HEAD
}, { timestamps: true }); // enable createdAt, updatedAt
=======
}, { timestamps: true });
>>>>>>> c940ee0e (final updated code)

module.exports = mongoose.model('Inventory', inventorySchema);
