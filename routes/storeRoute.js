// PS-IMS-Backend/routes/storeRoute.js
const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// Full CRUD
router.post('/', storeController.createStore);
router.get('/', storeController.getAllStores);
router.get('/:id', storeController.getStoreById);
router.put('/:id', storeController.updateStore);
router.delete('/:id', storeController.deleteStore);

module.exports = router;
