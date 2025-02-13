// PS-IMS-Backend-main/routes/inventory.js
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const upload = require('../config/multerConfig'); // if you use Multer for file upload

// GET all
router.get('/', inventoryController.getAllInventory);

// GET stats
router.get('/stats', inventoryController.getInventoryStats);

// GET one product
router.get('/:id', inventoryController.getProductById);

// CREATE (with file upload example)
router.post('/', upload.single('productImg'), inventoryController.addProduct);

// UPDATE
router.put('/:id', inventoryController.updateInventoryItem);

// DELETE
router.delete('/:id', inventoryController.deleteInventoryItem);

module.exports = router;
