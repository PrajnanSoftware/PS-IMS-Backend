const Inventory = require('../models/Inventory'); // Inventory model
const { validationResult } = require('express-validator');

exports.getAllInventory = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Failed to fetch inventory' });
  }
};

exports.getInventoryStats = async (req, res) => {
  try {
    const totalItems = await Inventory.countDocuments();
    const lowStock = await Inventory.countDocuments({ quantity: { $lt: 10, $gt: 0 } });
    const outOfStock = await Inventory.countDocuments({ quantity: { $eq: 0 } });

    res.status(200).json({
      totalItems,
      lowStock,
      outOfStock,
    });
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    res.status(500).json({ message: 'Failed to fetch inventory stats' });
  }
};

exports.addInventoryItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, sku, quantity, supplier, category } = req.body;

  try {
    const newItem = new Inventory({ name, sku, quantity, supplier, category });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ message: 'Failed to add inventory item' });
  }
};

exports.updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  const { name, sku, quantity, supplier, category } = req.body;

  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      { name, sku, quantity, supplier, category },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ message: 'Failed to update inventory item' });
  }
};

exports.deleteInventoryItem = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await Inventory.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.status(200).json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ message: 'Failed to delete inventory item' });
  }
};