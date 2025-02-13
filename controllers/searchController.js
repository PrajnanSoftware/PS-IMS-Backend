// PS-IMS-Backend/controllers/searchController.js
const Inventory = require('../models/inventory');
const Supplier = require('../models/supplierModel');
const Order = require('../models/orders'); // if you have it
const Store = require('../models/storeModel'); // manage store

exports.globalSearch = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.trim() === '') {
            return res.json([]);
        }

        const searchRegex = new RegExp(query, 'i'); // case-insensitive partial match

        // 1) Inventory search
        const inventoryMatches = await Inventory.find({ name: { $regex: searchRegex } }).limit(10);
        const inventoryResults = inventoryMatches.map(item => ({
            type: 'inventory',
            id: item._id.toString(),
            name: item.name,
            // Just link to the "inventory dashboard" page
            route: `/app/inventory-dashboard`,
        }));

        // 2) Supplier search
        const supplierMatches = await Supplier.find({ supplierName: { $regex: searchRegex } }).limit(10);
        const supplierResults = supplierMatches.map(sup => ({
            type: 'supplier',
            id: sup._id.toString(),
            name: sup.supplierName,
            route: `/app/suppliers`,
        }));

        // 3) Order search
        const orderMatches = await Order.find({ productName: { $regex: searchRegex } }).limit(10);
        const orderResults = orderMatches.map(ord => ({
            type: 'order',
            id: ord._id.toString(),
            name: ord.productName,
            route: `/app/orders`,
        }));

        // 4) Manage Store (Store collection) - match storeName or location
        const storeMatches = await Store.find({
            $or: [
                { storeName: { $regex: searchRegex } },
                { location: { $regex: searchRegex } },
            ],
        }).limit(5);
        const storeResults = storeMatches.map(st => ({
            type: 'manage-store',
            id: st._id.toString(),
            name: st.storeName,
            route: `/app/manage-store`,
        }));

        // 5) Dashboard & Reports placeholders if user typed those words
        let otherResults = [];
        if (/dashboard/i.test(query)) {
            otherResults.push({
                type: 'dashboard',
                id: 'dashboard',
                name: 'Dashboard Page',
                route: `/app`, // main dashboard
            });
        }
        if (/reports?/i.test(query)) {
            otherResults.push({
                type: 'reports',
                id: 'reports',
                name: 'Reports Page',
                route: `/app/reports`,
            });
        }

        // Combine all
        const allResults = [
            ...inventoryResults,
            ...supplierResults,
            ...orderResults,
            ...storeResults,
            ...otherResults,
        ];

        res.json(allResults);
    } catch (error) {
        console.error('Global search error:', error);
        res.status(500).json({ error: 'Failed to perform search' });
    }
};
