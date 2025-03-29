// PS-IMS-Backend-main/routes/inventory.js
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const upload = require('../config/multerConfig'); // if you use Multer for file upload
const { authenticateUser } = require('../middlewares/authMiddleware');
// GET all
router.get('/', inventoryController.getAllInventory);

// GET stats
router.get('/stats', inventoryController.getInventoryStats);

// GET one product
router.get('/:id', inventoryController.getProductById);

// CREATE (with file upload example)
router.post(
    '/',
    authenticateUser,
    upload.single('productImg'),
    inventoryController.addProduct
);

// UPDATE
router.put(
    '/:id',
    authenticateUser,
    inventoryController.updateInventoryItem
);

// DELETE
router.delete(
    '/:id',
    authenticateUser,
    inventoryController.deleteInventoryItem
);
module.exports = router;
