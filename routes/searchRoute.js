// PS-IMS-Backend/routes/searchRoute.js
const express = require('express');
const router = express.Router();
const { globalSearch } = require('../controllers/searchController');

// GET /api/search?query=...
router.get('/', globalSearch);

module.exports = router;
