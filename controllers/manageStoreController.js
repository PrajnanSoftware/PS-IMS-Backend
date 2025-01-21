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

exports.updateStoreById = async (req, res) => {
  try {
    const { id } = req.params; // Extracting the store ID from the request parameters
    const updatedStore = await ManageStore.findOneAndUpdate(
      { _id: id }, // Fetch by ID
      req.body, 
      { new: true, upsert: true } // Return the updated document, create if it doesn't exist
    );
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
exports.updateOrderById = async (req, res) => {
  try {
    const { id } = req.params; // Extracting the order ID from the request parameters
    const updatedOrder = await ManageOrder.findOneAndUpdate(
      { _id: id }, // Fetch by ID
      req.body, 
      { new: true, upsert: true } // Return the updated document, create if it doesn't exist
    );
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
  
 // Get Supplier Information
exports.updateSupplierById = async (req, res) => {
  try {
    const { id } = req.params; // Extracting the supplier ID from the request parameters
    const supplier = await ManageSupplier.findOne({ _id: id }); // Fetch by ID

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier information not found' });
    }

    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};



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
exports.updateInventoryById = async (req, res) => {
  try {
    const { id } = req.params; // Extracting the inventory ID from the request parameters
    const updatedInventory = await ManageInventory.findOneAndUpdate(
      { _id: id }, // Fetch by ID
      req.body, 
      { new: true, upsert: true } // Return the updated document, create if it doesn't exist
    );
    res.json(updatedInventory);
  } catch (err) {
    res.status(500).json({ error: 'Unable to update inventory', details: err.message });
  }
};

  
  