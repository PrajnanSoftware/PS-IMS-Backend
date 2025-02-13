const Inventory = require('../models/inventory');
const cloudinary = require('../config/cloudinaryConfig'); 

const Supplier = require('../models/supplierModel');
exports.getProductById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id).populate('supplier');
    if (!item) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    let {
      name,
      productId,
      category,
      buyingPrice,
      quantity,
      unit,
      expiryDate,
      thresholdValue,
      supplier,
      availability,
    } = req.body;

    if (supplier) {
      const existingSupplier = await Supplier.findById(supplier);
      if (!existingSupplier) {
        return res
          .status(404)
          .json({ message: "Supplier not found for the given ID." });
      }
    }

    // Prepare an empty image URL (will set it if we have a file)
    let productImgUrl = '';

    // If there's a file, upload it to Cloudinary using upload_stream and memory buffer
    if (req.file) {
      // Helper function to upload from a buffer
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            // Upload options:
            { folder: 'inventory' }, // Store in "inventory" folder in Cloudinary
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          // Stream the file buffer to Cloudinary
          stream.end(buffer);
        });
      };

      // Perform the upload
      const uploadResult = await streamUpload(req.file.buffer);
      // Store the URL returned by Cloudinary
      productImgUrl = uploadResult.secure_url;
    }

    // Create and save the new product in MongoDB
    const newProduct = new Inventory({
      name,
      productId,
      category,
      buyingPrice,
      quantity,
      unit,
      expiryDate,
      thresholdValue,
      supplier: supplier || null,
      availability,
      // productImgUrl if you're uploading
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Failed to add product:', error);
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
};

// -------------- UPDATE PRODUCT --------------
exports.updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    productId,
    category,
    buyingPrice,
    quantity,
    unit,
    expiryDate,
    thresholdValue,
    supplier,
    productImgUrl,
  } = req.body;

  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      {
        name,
        productId,
        category,
        buyingPrice,
        quantity,
        unit,
        expiryDate,
        thresholdValue,
        supplier,
        productImgUrl,
        availability: quantity > 0,
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Failed to update product:', error);
    return res.status(500).json({ error: error.message });
  }
};

// -------------- GET ALL --------------
exports.getAllInventory = async (req, res) => {
  try {
    const items = await Inventory.find();
    return res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return res.status(500).json({ message: 'Failed to fetch inventory' });
  }
};

// -------------- DELETE --------------
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

// -------------- STATS --------------
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
      revenue += product.buyingPrice * product.quantity;
      categorySet.add(product.category);

      if (product.quantity <= product.thresholdValue) {
        lowStock++;
      }
      if (product.quantity === 0) {
        noStock++;
      }
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
    return res.status(500).json({ message: 'Failed to fetch inventory stats', error: error.message });
  }
};
