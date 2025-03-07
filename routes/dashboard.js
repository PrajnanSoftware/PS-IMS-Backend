// PS-IMS-Backend/routes/dashboard.js

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// GET dashboard data
router.get('/', dashboardController.getDashboardData);

// POST or update dashboard data
router.post('/', dashboardController.createOrUpdateDashboardData);

module.exports = router;
