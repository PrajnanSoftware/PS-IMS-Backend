const Order = require('../models/orders.js');

// Create a new order
exports.createOrder = async (req, res) => {
    const order = new Order(req.body);
    try {
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Read all orders
exports.getAllOrders = async (req, res) => {
    try {
        // Pull out the `status` query param, if present
        const { status } = req.query;

        // Build a filter object. If `status` exists, we use it; otherwise, return everything
        let filter = {};
        if (status) {
            // Remember to match the exact status string in your DB,
            // e.g. "Out for Delivery" or "Confirmed"
            filter.status = status;
        }

        const orders = await Order.find(filter);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Read a single order
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an order by ID
exports.updateOrderById = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get order statistics
// Get order statistics
exports.getOrderStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        // console.log('Total Orders:', totalOrders);

        const totalReceived = await Order.countDocuments({ status: 'Reached' });
        // console.log('Total Received:', totalReceived);

        const totalRevenue = await Order.aggregate([{ $match: { status: 'Reached' } }, { $group: { _id: null, total: { $sum: "$orderValue" } } }]);
        // console.log('Total Revenue:', totalRevenue);

        const totalReturned = await Order.countDocuments({ status: 'Returned' });
        // console.log('Total Returned:', totalReturned);

        const totalReturnCost = await Order.aggregate([{ $match: { status: 'Returned' } }, { $group: { _id: null, total: { $sum: "$orderValue" } } }]);
        // console.log('Total Return Cost:', totalReturnCost);

        const onTheWay = await Order.countDocuments({ status: 'Out for Delivery' });
        // console.log('On The Way:', onTheWay);

        const onTheWayCost = await Order.aggregate([{ $match: { status: 'Out for Delivery' } }, { $group: { _id: null, total: { $sum: "$orderValue" } } }]);
        // console.log('On The Way Cost:', onTheWayCost);

        res.status(200).json({
            totalOrders,
            totalReceived,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalReturned,
            totalReturnCost: totalReturnCost[0]?.total || 0,
            onTheWay,
            onTheWayCost: onTheWayCost[0]?.total || 0
        });
    } catch (error) {
        console.error('Error fetching order statistics:', error);
        res.status(500).json({ message: error.message });
    }
};

