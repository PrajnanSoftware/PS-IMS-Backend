const mongoose = require('mongoose');

const DashboardDataSchema = new mongoose.Schema({
  salesOverview: [
    {
      sales: { type: Number, required: true },
      revenue:{ type: Number, required: true },
      profit: { type: Number, required: true },
      cost: { type: Number, required: true },
    },
  ],
  purchaseOverview:[
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
  productSummary:[ 
    {
      numberOfSuppliers:{ type: Number, required: true },
      numberOfCategories: { type: Number, required: true },
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
      name:{ type: String, required: true },
      remainingQuantity: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model('DashboardData', DashboardDataSchema);
