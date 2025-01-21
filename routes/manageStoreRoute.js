const express = require('express');
const router = express.Router();
const { getStore, getSupplier, getInventory,getOrder,
    updateStoreById,
    updateInventoryById,
    updateSupplierById,
    updateOrderById,  } = require('../controllers/manageStoreController.js');


// Route to get store information
router.get('/store', getStore);
router.get('/supplier', getSupplier);
router.get('/order', getOrder);
router.get("/inventory",getInventory);

// Route to update store information
router.put('/inventory/:id', updateInventoryById);
router.put('/supplier', updateSupplierById);
router.put('/order/:id', updateOrderById);
router.put('/stores/:id',updateStoreById);

module.exports = router;
