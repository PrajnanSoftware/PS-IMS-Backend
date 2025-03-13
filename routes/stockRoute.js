// PS-IMS-Backend-main/routes/stockRoute.js
const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// CREATE
router.post('/', stockController.createStock);
// READ all
router.get('/', stockController.getAllStock);
// READ one
router.get('/:id', stockController.getStockById);
// UPDATE
router.put('/:id', stockController.updateStock);
// DELETE
router.delete('/:id', stockController.deleteStock);

module.exports = router;
