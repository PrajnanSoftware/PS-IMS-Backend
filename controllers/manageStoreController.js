const { ManageStore, ManageOrder, ManageSupplier, ManageInventory} = require('../models/manageStoreModel.js'); // Import both models

// Get Store Information
exports.getStore = async (req, res) => {
  try {
    const store = await ManageStore.findOne();
    if (!store) {
      return res.status(404).json({ error: 'Store information not found' });
    }
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Update Store Information
exports.updateStore = async (req, res) => {
  try {
    const updatedStore = await ManageStore.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updatedStore);
  } catch (err) {
    res.status(500).json({ error: 'Unable to update store', details: err.message });
  }
};

// Get Order Information
exports.getOrder = async (req, res) => {
  try {
    const orders = await ManageOrder.findOne();
    if (!orders) {
      return res.status(404).json({ error: 'Order information not found' });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Update Order Information
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await ManageOrder.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: 'Unable to update order', details: err.message });
  }
};

// Get Supplier Information
exports.getSupplier = async (req, res) => {
    try {
      const supplier = await ManageSupplier.findOne();
      if (!supplier) {
        return res.status(404).json({ error: 'Supplier information not found' });
      }
      res.json(supplier);
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  };
  
  // Update Supplier Information
  exports.updateSupplier = async (req, res) => {
    try {
      const updatedSupplier = await ManageSupplier.findOneAndUpdate({}, req.body, { new: true, upsert: true });
      res.json(updatedSupplier);
    } catch (err) {
      res.status(500).json({ error: 'Unable to update Supplier', details: err.message });
    }
  };

  // Get Inventory Information
exports.getInventory = async (req, res) => {
    try {
      const inventory = await ManageInventory.findOne();
      if (!inventory) {
        return res.status(404).json({ error: 'Inventory information not found' });
      }
      res.json(inventory);
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  };
  
  // Update Inventory Information
  exports.updateInventory = async (req, res) => {
    try {
      const updatedInventory = await ManageInventory.findOneAndUpdate({}, req.body, { new: true, upsert: true });
      res.json(updatedInventory);
    } catch (err) {
      res.status(500).json({ error: 'Unable to update Inventory', details: err.message });
    }
  };
  
  