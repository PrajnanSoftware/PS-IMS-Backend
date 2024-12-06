const { Router } = require('express');
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProduct
} = require('../controllers/productController');

const productRouter = Router();

// New product
productRouter.post('/', createProduct);

// Read all products
productRouter.get('/', getAllProducts);

// Read a single product
productRouter.get('/:id', getProductById);

// Update a product by ID
productRouter.put('/:id', updateProductById);

// Delete a product
productRouter.delete('/:id', deleteProduct);

module.exports = {
    productRouter: productRouter
};