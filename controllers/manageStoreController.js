// PS-IMS-Backend/controllers/manageStoreController.js
const Store = require('../models/storeModel');
const Inventory = require('../models/inventory');

/**
 * GET /api/manage-store
 * Returns store info + inventory overview
 */
exports.getStoreInfoAndInventory = async (req, res) => {
  try {
    // 1) Store info
    // We assume there's exactly one Store doc. 
    // If we want to ensure at least one doc, we can create if not found.
    let store = await Store.findOne();
    if (!store) {
      // optionally create a default store if not found:
      store = new Store({
        storeName: 'Example Store',
        location: '23 Main St, City, Country',
        phone: '23713172813',
        email: 'info@example.com',
        operatingHours: '9:00AM - 6:00PM',
      });
      await store.save();
    }

    // 2) Inventory summary
    // - total items = sum of quantity across Inventory
    // - optionally, we can return the entire inventory list 
    //   if we want to display in a table.
    const allInventory = await Inventory.find();

    // total items is sum of "quantity" across all Inventory
    let totalItems = 0;
    allInventory.forEach(item => {
      totalItems += item.quantity;
    });

    // Build an array of inventory items to display:
    // e.g. { name, quantity, location??, lastUpdated??? }
    // "location" might not exist in the Inventory schema, so we can skip or 
    // just store a placeholder if your schema doesn't track location.
    // "lastUpdated" can come from item.updatedAt if you have timestamps in inventory.
    const inventoryOverview = allInventory.map(item => ({
      _id: item._id,
      name: item.name,
      quantity: item.quantity,
      // location: "Main Store" or item.location if that field existed
      lastUpdated: item.updatedAt || item.createdAt,
    }));

    // 3) Combine data for response
    const responseData = {
      store: {
        storeName: store.storeName,
        location: store.location,
        phone: store.phone,
        email: store.email,
        operatingHours: store.operatingHours,
      },
      inventorySummary: {
        totalItems,
      },
      inventoryOverview, // array of items
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching store and inventory:', error);
    res.status(500).json({ error: 'Failed to retrieve store info' });
  }
};

/**
 * POST /api/manage-store (or PUT /:id)
 * Updates the single store doc (store info).
 */
exports.updateStoreInfo = async (req, res) => {
  try {
    const { storeName, location, phone, email, operatingHours } = req.body;

    // Get the single store doc or create if not found
    let store = await Store.findOne();
    if (!store) {
      store = new Store();
    }

    // Update fields
    store.storeName = storeName || store.storeName;
    store.location = location || store.location;
    store.phone = phone || store.phone;
    store.email = email || store.email;
    store.operatingHours = operatingHours || store.operatingHours;

    await store.save();
    res.status(200).json({ message: 'Store info updated successfully', store });
  } catch (error) {
    console.error('Error updating store info:', error);
    res.status(500).json({ error: 'Failed to update store info' });
  }
};

// controllers/manageStoreController.js

exports.getStoreAndInventory = async (req, res) => {
  try {
    const { id } = req.params; // store _id
    const store = await Store.findById(id);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Suppose each inventory doc has a field "store" if you want store-specific inventory
    // or else we fetch all inventory for demonstration
    const allInventory = await Inventory.find({ store: store._id });

    // or Inventory.find({ storeId: id }) if your inventory docs store a "storeId"

    // sum up quantity
    let totalItems = 0;
    allInventory.forEach(item => {
      totalItems += item.quantity;
    });

    const inventoryOverview = allInventory.map(item => ({
      _id: item._id,
      name: item.name,
      quantity: item.quantity,
      lastUpdated: item.updatedAt || item.createdAt,
    }));

    const responseData = {
      store,
      inventorySummary: { totalItems },
      inventoryOverview,
    };

    res.json(responseData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch store + inventory' });
  }
};
