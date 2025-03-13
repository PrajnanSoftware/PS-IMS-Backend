const express = require('express');
const router = express.Router();
const ReportsData = require('../models/ReportsData');// Import the new model

// Routes
router.get('/overview', (req, res) => {   //GET /api/reports/overview
    res.json(ReportsData.overview);
});

router.get('/best-selling-category', (req, res) => {  //GET /api/reports/best-selling-category
    res.json(ReportsData.bestSellingCategory);
});

router.get('/profit-revenue', (req, res) => { //GET /api/reports/profit-revenue:
    res.json(ReportsData.profitRevenue);
});

router.get('/best-selling-product', (req, res) => { //GET /api/reports/best-selling-product
    res.json(ReportsData.bestSellingProduct);
});

module.exports = router;
