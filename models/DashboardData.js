const mongoose = require('mongoose');

const DashboardDataSchema = new mongoose.Schema({
  salesOverview: [
    {
      sales: { type: Number, required: true },
      revenue: { type: Number, required: true },
      profit: { type: Number, required: true },
      cost: { type: Number, required: true },
    },
  ],
  purchaseOverview: [
    {
      purchase: { type: Number, required: true },
      cost: { type: Number, required: true },
      cancel: { type: Number, required: true },
      return: { type: Number, required: true },
    },
  ],
  inventory: [
    {
      quantityInHand: { type: Number, required: true },
      toBeReceived: { type: Number, required: true },
    },
  ],
  topSellingStock: [
    {
      name: { type: String, required: true },
      soldQuantity: { type: Number, required: true },
      remainingQuantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  lowQuantityStock: [
    {
      name: { type: String, required: true },
      remainingQuantity: { type: Number, required: true },
    },
  ],
  productSummary: [
    {
      numberOfSuppliers: { type: Number, required: true },
      numberOfCategories: { type: Number, required: true },
    },
  ],
});

// Set the transformation logic for the output
DashboardDataSchema.set('toJSON', {
  transform: (doc, ret) => {
    // Delete unwanted fields at the root level (if any exist)
    delete ret.sales; // Not applicable in this schema but retained for example
    delete ret.revenue;
    delete ret.profit;
    delete ret.cost;
    delete ret.purchases;

  },
});

// Export the model
module.exports = mongoose.model('DashboardData', DashboardDataSchema);
