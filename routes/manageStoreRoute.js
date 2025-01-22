const express = require('express');
const router = express.Router();
const { getStore, getSupplier, getInventory,getOrder,updateStore, updateSupplier,updateInventory,updateOrder } = require('../controllers/manageStoreController.js');


// Route to get store information
router.get('/store', getStore);
router.get('/supplier', getSupplier);
router.get('/order', getOrder);
router.get("/inventory",getInventory)

// Route to update store information
router.put('/store', updateStore);
router.put('/inventory', updateInventory);
router.put('/supplier', updateSupplier);
router.put('/order', updateOrder);

module.exports = router;
