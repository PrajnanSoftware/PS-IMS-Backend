const express = require('express');
const DashboardData = require('../models/DashboardData.js');
const router = express.Router();

// Get dashboard data
router.get('/', async (req, res) => {
  try {
    const data = await DashboardData.findOne(); // Adjust query as needed
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve dashboard data' });
  }
});

// Update or create dashboard data
router.post('/', async (req, res) => {
  try {
    const { salesOverview, purchaseOverview, inventory, productSummary, topSellingStock, lowQuantityStock } = req.body;

    let data = await DashboardData.findOne();

    if (data) {
      // Update existing data
      data.salesOverview = salesOverview;
      data.purchaseOverview = purchaseOverview;
      data.inventory = inventory;
      data.productSummary = productSummary;
      data.topSellingStock = topSellingStock;
      data.lowQuantityStock = lowQuantityStock;
    } else {
      // Create new data
      data = new DashboardData({
        salesOverview,
        purchaseOverview,
        inventory,
        productSummary,
        topSellingStock,
        lowQuantityStock,
      });
    }

    await data.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save dashboard data' });
  }
});

module.exports = router;
