// PS-IMS-Backend/routes/manageStoreRoute.js
const express = require('express');
const router = express.Router();
const manageStoreController = require('../controllers/manageStoreController');

// GET store info + inventory overview
router.get('/', manageStoreController.getStoreInfoAndInventory);

// POST or PUT to update store info
router.post('/', manageStoreController.updateStoreInfo);
// or if you prefer PUT: router.put('/', manageStoreController.updateStoreInfo);

// routes/manageStoreRoute.js

router.get('/:id', manageStoreController.getStoreAndInventory);


module.exports = router;
