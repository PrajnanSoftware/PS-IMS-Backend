const Billing = require('../models/billingModel.js');

// Fetch all sales (only completed/reached orders)
exports.getAllSales = async (req, res) => {
    try {
        const sales = await Billing.find({ status: 'Reached' });
        console.log(sales);
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get sales statistics
exports.getSalesStats = async (req, res) => {
    try {
        const totalSales = await Billing.countDocuments({ status: 'Reached' });

        const totalRevenue = await Billing  .aggregate([
            { $match: { status: 'Reached' } },
            { $group: { _id: null, total: { $sum: "$orderValue" } } }
        ]);

        res.status(200).json({
            totalSales,
            totalRevenue: totalRevenue[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
