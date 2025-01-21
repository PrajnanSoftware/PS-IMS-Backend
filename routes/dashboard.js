const express = require("express");
const Sales = require("../models/Sales"); // Sales data model
const inventory = require("../models/inventory"); // Inventory data model
const Purchases = require("../models/Purchases"); // Purchases data model
const products = require("../models/product"); // Product data model

const router = express.Router();

/**
 * Dashboard Data API
 * GET /api/dashboard
 * Provides an aggregated summary of Sales, Inventory, Purchases, and Products
 */
router.get("/dashboard", async (req, res) => {
  try {
    // Use MongoDB's aggregation pipeline to efficiently retrieve and calculate data
    const [
      totalSales,
      salesStats,
      inventoryStats,
      totalPurchases,
      purchaseStats,
      totalSuppliers,
      totalCategories,
    ] = await Promise.all([
      Sales.countDocuments(), // Count total sales
      Sales.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$revenue" },
            totalProfit: { $sum: "$profit" },
            totalCost: { $sum: "$cost" },
          },
        },
      ]),
      inventory.aggregate([
        {
          $group: {
            _id: null,
            totalQuantityInHand: { $sum: "$quantityInHand" },
            totalToBeReceived: { $sum: "$toBeReceived" },
          },
        },
      ]),
      Purchases.countDocuments(), // Count total purchases
      Purchases.aggregate([
        {
          $group: {
            _id: null,
            totalCost: { $sum: "$cost" },
            totalReturns: { $sum: "$returns" },
          },
        },
      ]),
      products.distinct("supplier"), // Get unique suppliers
      products.distinct("category"), // Get unique categories
    ]);

    // Construct the response data
    const dashboardData = {
      sales: {
        salesCount: totalSales || 0,
        revenue: `₹${salesStats[0]?.totalRevenue || 0}`,
        profit: `₹${salesStats[0]?.totalProfit || 0}`,
        cost: `₹${salesStats[0]?.totalCost || 0}`,
      },
      inventory: {
        quantityInHand: inventoryStats[0]?.totalQuantityInHand || 0,
        toBeReceived: inventoryStats[0]?.totalToBeReceived || 0,
      },
      purchases: {
        purchaseCount: totalPurchases || 0,
        cost: `₹${purchaseStats[0]?.totalCost || 0}`,
        returnCount: `₹${purchaseStats[0]?.totalReturns || 0}`,
      },
      productSummary: {
        suppliers: totalSuppliers?.length || 0,
        categories: totalCategories?.length || 0,
      },
    };

    // Send the response
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
});

module.exports = router;
