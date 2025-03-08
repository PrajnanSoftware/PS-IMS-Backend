// PS-IMS-Backend-main/controllers/stockController.js
const Stock = require('../models/stockModel');

// CREATE a new stock entry
exports.createStock = async (req, res) => {
  try {
    const { product, store, user, qty } = req.body;

    // Build new stock doc
    const newStock = new Stock({
      product,
      store,
      user,
      qty,
    });

    const savedStock = await newStock.save();
    res.status(201).json(savedStock);
  } catch (error) {
    console.error('Error creating stock:', error);
    res.status(500).json({ error: error.message });
  }
};

// READ all stock entries
exports.getAllStock = async (req, res) => {
  try {
    // If you want the actual product/store/user docs, populate them:
    const stocks = await Stock.find()
      .populate('product', 'name productId') // second arg is fields you want
      .populate('store', 'storeName')
      .populate('user', 'name email');

    res.status(200).json(stocks);
  } catch (error) {
    console.error('Error fetching stock:', error);
    res.status(500).json({ error: error.message });
  }
};

// READ single stock by ID
exports.getStockById = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findById(id)
      .populate('product', 'name productId')
      .populate('store', 'storeName')
      .populate('user', 'name email');

    if (!stock) {
      return res.status(404).json({ error: 'Stock entry not found' });
    }
    res.status(200).json(stock);
  } catch (error) {
    console.error('Error fetching stock by ID:', error);
    res.status(500).json({ error: error.message });
  }
};

// UPDATE stock by ID
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { product, store, user, qty } = req.body;

    const updatedStock = await Stock.findByIdAndUpdate(
      id,
      { product, store, user, qty },
      { new: true }
    ).populate('product store user');

    if (!updatedStock) {
      return res.status(404).json({ error: 'Stock entry not found' });
    }

    res.status(200).json(updatedStock);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE stock by ID
exports.deleteStock = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStock = await Stock.findByIdAndDelete(id);

    if (!deletedStock) {
      return res.status(404).json({ error: 'Stock entry not found' });
    }

    res.status(200).json({ message: 'Stock entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({ error: error.message });
  }
};
