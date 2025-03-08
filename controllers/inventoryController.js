// PS-IMS-Backend-main/controllers/inventoryController.js
const Inventory = require('../models/inventory');
const cloudinary = require('../config/cloudinaryConfig');
const Supplier = require('../models/supplierModel');

// GET product by ID
exports.getProductById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id)
      .populate('supplier')
      .populate('store'); // optional: if you want to populate the store also

    if (!item) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(item);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// CREATE new product
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      productId,
      category,
      costPrice,       // NEW
      buyingPrice,    // NEW
      quantity,
      unit,
      expiryDate,
      thresholdValue,
      availability,
      store,
      supplier
    } = req.body;

    // If supplier is provided, ensure it exists
    if (supplier) {
      const existingSupplier = await Supplier.findById(supplier);
      if (!existingSupplier) {
        return res.status(404).json({
          message: "Supplier not found for the given ID."
        });
      }
    }

    // Prepare an empty image URL
    let productImgUrl = '';

    // If there's a file, upload to Cloudinary
    if (req.file) {
      // Helper function to upload from a buffer
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'inventory' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });
      };

      // Perform the upload
      const uploadResult = await streamUpload(req.file.buffer);
      productImgUrl = uploadResult.secure_url;
    }

    // Create and save the new product
    const newProduct = new Inventory({
      store,
      supplier,

      name,
      productId,
      category,
      costPrice: parseFloat(costPrice),       // parse to number
      buyingPrice: parseFloat(buyingPrice), // parse to number
      quantity: parseInt(quantity),
      unit,
      expiryDate,
      thresholdValue: parseInt(thresholdValue),
      availability: (availability === 'false' || availability === false)
        ? false
        : true,
      productImgUrl
    });

    await newProduct.save();
    console.log('Product added successfully');
    return res.status(201).json(newProduct);

  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      message: 'Failed to add product',
      error: error.message
    });
  }
};

// UPDATE product
exports.updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      name,
      productId,
      category,
      costPrice,         // replaced buyingPrice
      buyingPrice,
      quantity,
      unit,
      expiryDate,
      thresholdValue,
      supplier,
      productImgUrl,
      store,
      availability
    } = req.body;

    // optional: if you want to handle a new image file in update, you'd do cloudinary logic
    // otherwise assume productImgUrl was posted as string

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      {
        store,
        supplier,

        name,
        productId,
        category,
        costPrice: parseFloat(costPrice),
        buyingPrice: parseFloat(buyingPrice),
        quantity: parseInt(quantity),
        unit,
        expiryDate,
        thresholdValue: parseInt(thresholdValue),
        productImgUrl,
        availability: (availability === 'false' || availability === false)
          ? false
          : (quantity > 0)
      },
      { new: true }
    ).populate('supplier').populate('store');

    if (!updatedItem) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(updatedItem);

  } catch (error) {
    console.error('Failed to update product:', error);
    return res.status(500).json({ error: error.message });
  }
};

// GET all
exports.getAllInventory = async (req, res) => {
  try {
    const items = await Inventory.find()
      .populate('supplier')
      .populate('store'); // optional
    return res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return res.status(500).json({
      message: 'Failed to fetch inventory',
      error: error.message
    });
  }
};

// DELETE
exports.deleteInventoryItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await Inventory.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: error.message });
  }
};

// STATS
exports.getInventoryStats = async (req, res) => {
  try {
    const products = await Inventory.find();

    let total = 0;
    let revenue = 0;
    let lowStock = 0;
    let noStock = 0;
    const categorySet = new Set();

    products.forEach(product => {
      total += product.quantity;

      // if you want revenue = sum of costPrice * quantity (or buyingPrice?), define accordingly
      // let's assume revenue from costPrice for example:
      revenue += (product.costPrice || 0) * product.quantity;

      categorySet.add(product.category);

      if (product.quantity <= product.thresholdValue) lowStock++;
      if (product.quantity === 0) noStock++;
    });

    const stats = {
      totalProducts: total,
      totalRevenue: revenue,
      lowStockCount: lowStock,
      noStockCount: noStock,
      categories: Array.from(categorySet),
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error('Failed to fetch inventory stats:', error);
    return res.status(500).json({
      message: 'Failed to fetch inventory stats',
      error: error.message
    });
  }
};