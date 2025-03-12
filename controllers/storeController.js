<<<<<<< HEAD
// crud and single store************
// PS-IMS-Backend/controllers/storeController.js
const Store = require('../models/storeModel');

/**
 * CREATE a new store
 * POST /api/stores
 */
exports.createStore = async (req, res) => {
    try {
        const { storeName, location, phone, email, operatingHours } = req.body;

        const newStore = new Store({
            storeName,
            location,
            phone,
            email,
            operatingHours,
        });

        const savedStore = await newStore.save();
        res.status(201).json(savedStore);
    } catch (error) {
        console.error('Error creating store:', error);
        res.status(500).json({ error: 'Failed to create store', details: error.message });
    }
};

/**
 * READ all stores
 * GET /api/stores
 */
exports.getAllStores = async (req, res) => {
    try {
        const stores = await Store.find();
        res.status(200).json(stores);
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({ error: 'Failed to fetch stores', details: error.message });
    }
};

/**
 * READ single store by ID
 * GET /api/stores/:id
 */
exports.getStoreById = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await Store.findById(id);

        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        res.status(200).json(store);
    } catch (error) {
        console.error('Error fetching store by ID:', error);
        res.status(500).json({ error: 'Failed to fetch store', details: error.message });
    }
};

/**
 * UPDATE store by ID
 * PUT /api/stores/:id
 */
exports.updateStore = async (req, res) => {
    try {
        const { id } = req.params;
        const { storeName, location, phone, email, operatingHours } = req.body;

        const updatedStore = await Store.findByIdAndUpdate(
            id,
            { storeName, location, phone, email, operatingHours },
            { new: true }
        );

        if (!updatedStore) {
            return res.status(404).json({ error: 'Store not found' });
        }

        res.status(200).json(updatedStore);
    } catch (error) {
        console.error('Error updating store:', error);
        res.status(500).json({ error: 'Failed to update store', details: error.message });
    }
};

/**
 * DELETE store by ID
 * DELETE /api/stores/:id
 */
exports.deleteStore = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStore = await Store.findByIdAndDelete(id);

        if (!deletedStore) {
            return res.status(404).json({ error: 'Store not found' });
        }

        res.status(200).json({ message: 'Store deleted successfully' });
    } catch (error) {
        console.error('Error deleting store:', error);
        res.status(500).json({ error: 'Failed to delete store', details: error.message });
    }
};
=======
// crud and single store************
// PS-IMS-Backend/controllers/storeController.js
const Store = require('../models/storeModel');

/**
 * CREATE a new store
 * POST /api/stores
 */
exports.createStore = async (req, res) => {
    try {
        const { storeName, location, phone, email, operatingHours } = req.body;

        const newStore = new Store({
            storeName,
            location,
            phone,
            email,
            operatingHours,
        });

        const savedStore = await newStore.save();
        res.status(201).json(savedStore);
    } catch (error) {
        console.error('Error creating store:', error);
        res.status(500).json({ error: 'Failed to create store', details: error.message });
    }
};

/**
 * READ all stores
 * GET /api/stores
 */
exports.getAllStores = async (req, res) => {
    try {
        const stores = await Store.find();
        res.status(200).json(stores);
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({ error: 'Failed to fetch stores', details: error.message });
    }
};

/**
 * READ single store by ID
 * GET /api/stores/:id
 */
exports.getStoreById = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await Store.findById(id);

        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        res.status(200).json(store);
    } catch (error) {
        console.error('Error fetching store by ID:', error);
        res.status(500).json({ error: 'Failed to fetch store', details: error.message });
    }
};

/**
 * UPDATE store by ID
 * PUT /api/stores/:id
 */
exports.updateStore = async (req, res) => {
    try {
        const { id } = req.params;
        const { storeName, location, phone, email, operatingHours } = req.body;

        const updatedStore = await Store.findByIdAndUpdate(
            id,
            { storeName, location, phone, email, operatingHours },
            { new: true }
        );

        if (!updatedStore) {
            return res.status(404).json({ error: 'Store not found' });
        }

        res.status(200).json(updatedStore);
    } catch (error) {
        console.error('Error updating store:', error);
        res.status(500).json({ error: 'Failed to update store', details: error.message });
    }
};

/**
 * DELETE store by ID
 * DELETE /api/stores/:id
 */
exports.deleteStore = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStore = await Store.findByIdAndDelete(id);

        if (!deletedStore) {
            return res.status(404).json({ error: 'Store not found' });
        }

        res.status(200).json({ message: 'Store deleted successfully' });
    } catch (error) {
        console.error('Error deleting store:', error);
        res.status(500).json({ error: 'Failed to delete store', details: error.message });
    }
};
>>>>>>> c940ee0e (final updated code)
