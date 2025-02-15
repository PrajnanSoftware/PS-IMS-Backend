const { Router } = require('express');
const {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderById,
    deleteOrder,
    getOrderStats,
    
} = require('../controllers/orderController');

const orderRouter = Router();

// Get order statistics
orderRouter.get('/stats',  getOrderStats); 

// New order
orderRouter.post('/', createOrder);

// Read all orders
orderRouter.get('/', getAllOrders);

// Read a single order
orderRouter.get('/:id', getOrderById);

// Update an order by ID
orderRouter.put('/:id', updateOrderById);

// Delete an order
orderRouter.delete('/:id', deleteOrder);


module.exports = {
    orderRouter: orderRouter
};