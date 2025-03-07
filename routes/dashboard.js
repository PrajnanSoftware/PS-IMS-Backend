// PS-IMS-Backend-main/routes/dashboard.js

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateUser } = require('../middlewares/authMiddleware');

// GET dashboard data (requires login)
router.get('/', authenticateUser, dashboardController.getDashboardData);

// POST or update dashboard data (requires login)
router.post('/', authenticateUser, dashboardController.createOrUpdateDashboardData);

module.exports = router;
