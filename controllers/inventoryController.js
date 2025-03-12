<<<<<<< HEAD
// PS-IMS-Backend-main/controllers/inventoryController.js
const Inventory = require('../models/inventory');
const cloudinary = require('../config/cloudinaryConfig');
const Supplier = require('../models/supplierModel');

// GET product by ID
=======
// PS-IMS-Backend/controllers/inventoryController.js
const Inventory = require('../models/inventory');
const Stock = require('../models/stockModel'); // so we can manage quantity
const cloudinary = require('../config/cloudinaryConfig');
const Supplier = require('../models/supplierModel');

// GET product by ID (aggregate stock qty)
>>>>>>> c940ee0e (final updated code)
exports.getProductById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id)
      .populate('supplier')
<<<<<<< HEAD
      .populate('store'); // optional: if you want to populate the store also
=======
      .populate('store'); // if you want store details
>>>>>>> c940ee0e (final updated code)

    if (!item) {
      return res.status(404).json({ error: 'Product not found' });
    }
<<<<<<< HEAD
    return res.json(item);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({
=======

    // find stock doc for this product (assuming one stock doc per product & store)
    const stockDoc = await Stock.findOne({ product: item._id, store: item.store });
    const quantity = stockDoc ? stockDoc.qty : 0;

    // Attach quantity for the response
    const productWithQty = {
      ...item.toObject(),
      quantity
    };

    return res.json(productWithQty);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(500).json({
>>>>>>> c940ee0e (final updated code)
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

<<<<<<< HEAD
// CREATE new product
=======
// CREATE new product + associated stock
// controllers/inventoryController.js

>>>>>>> c940ee0e (final updated code)
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      productId,
      category,
<<<<<<< HEAD
      costPrice,       // NEW
      buyingPrice,    // NEW
=======
      costPrice,
      buyingPrice,
      // quantity is NOT in Inventory, 
      // but we can capture it to create a stock entry
>>>>>>> c940ee0e (final updated code)
      quantity,
      unit,
      expiryDate,
      thresholdValue,
      availability,
      store,
      supplier
    } = req.body;

<<<<<<< HEAD
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
=======
    // 1) Validate supplier if provided
    if (supplier) {
      const existingSupplier = await Supplier.findById(supplier);
      if (!existingSupplier) {
        return res.status(404).json({ message: "Supplier not found for the given ID." });
      }
    }

    // 2) Handle product image upload (if any) via Cloudinary
    let productImgUrl = '';
    if (req.file) {
      // Helper function for uploading from buffer
>>>>>>> c940ee0e (final updated code)
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

<<<<<<< HEAD
      // Perform the upload
=======
>>>>>>> c940ee0e (final updated code)
      const uploadResult = await streamUpload(req.file.buffer);
      productImgUrl = uploadResult.secure_url;
    }

<<<<<<< HEAD
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
=======
    // 3) Create the Inventory doc (no `quantity` in the schema)
    const newProduct = new Inventory({
      store,  // required in schema
      supplier,
      name,
      productId,
      category,
      costPrice: parseFloat(costPrice),
      buyingPrice: parseFloat(buyingPrice),
>>>>>>> c940ee0e (final updated code)
      unit,
      expiryDate,
      thresholdValue: parseInt(thresholdValue),
      availability: (availability === 'false' || availability === false)
        ? false
        : true,
      productImgUrl
    });

    await newProduct.save();
<<<<<<< HEAD
    console.log('Product added successfully');
    return res.status(201).json(newProduct);

  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
=======

    // 4) If user provided a "quantity", create an associated Stock doc
    let createdStock = null;
    if (quantity !== undefined && quantity !== null && quantity !== '') {
      createdStock = new Stock({
        product: newProduct._id,
        store,
        // Optionally track which user created this
        // user: req.user ? req.user.id : null,
        user: req.user ? req.user.id : null,
        qty: parseInt(quantity)
      });
      await createdStock.save();
    }

    console.log('Product added successfully');

    // 5) Return combined data for convenience 
    //    (the UI often expects "quantity" for display, 
    //    so we can merge the Stock doc's qty if available)
    return res.status(201).json({
      ...newProduct.toObject(),
      quantity: createdStock ? createdStock.qty : 0
    });

  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({
>>>>>>> c940ee0e (final updated code)
      message: 'Failed to add product',
      error: error.message
    });
  }
};

<<<<<<< HEAD
// UPDATE product
=======

// UPDATE product + associated stock
>>>>>>> c940ee0e (final updated code)
exports.updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      name,
      productId,
      category,
<<<<<<< HEAD
      costPrice,         // replaced buyingPrice
      buyingPrice,
=======
      costPrice,
      buyingPrice,
      // quantity is for the Stock doc
>>>>>>> c940ee0e (final updated code)
      quantity,
      unit,
      expiryDate,
      thresholdValue,
      supplier,
      productImgUrl,
      store,
      availability
    } = req.body;

<<<<<<< HEAD
    // optional: if you want to handle a new image file in update, you'd do cloudinary logic
    // otherwise assume productImgUrl was posted as string

=======
    // 1) Update Inventory fields
>>>>>>> c940ee0e (final updated code)
    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      {
        store,
        supplier,
<<<<<<< HEAD

=======
>>>>>>> c940ee0e (final updated code)
        name,
        productId,
        category,
        costPrice: parseFloat(costPrice),
        buyingPrice: parseFloat(buyingPrice),
<<<<<<< HEAD
        quantity: parseInt(quantity),
=======
>>>>>>> c940ee0e (final updated code)
        unit,
        expiryDate,
        thresholdValue: parseInt(thresholdValue),
        productImgUrl,
        availability: (availability === 'false' || availability === false)
          ? false
<<<<<<< HEAD
          : (quantity > 0)
      },
      { new: true }
    ).populate('supplier').populate('store');
=======
          : true
      },
      { new: true }
    ).populate('supplier store');
>>>>>>> c940ee0e (final updated code)

    if (!updatedItem) {
      return res.status(404).json({ error: 'Product not found' });
    }
<<<<<<< HEAD
    return res.status(200).json(updatedItem);
=======

    // 2) If `quantity` is provided, update the Stock doc
    // findOne by (product: id, store: updatedItem.store)
    let updatedStock = null;
    if (quantity !== undefined) {
      updatedStock = await Stock.findOneAndUpdate(
        { product: id, store: updatedItem.store },
        { qty: parseInt(quantity) },
        { new: true, upsert: true } // upsert if it doesn't exist
      );
    }

    // Return combined data
    return res.status(200).json({
      ...updatedItem.toObject(),
      quantity: updatedStock ? updatedStock.qty : 0
    });
>>>>>>> c940ee0e (final updated code)

  } catch (error) {
    console.error('Failed to update product:', error);
    return res.status(500).json({ error: error.message });
  }
};

<<<<<<< HEAD
// GET all
exports.getAllInventory = async (req, res) => {
  try {
    const items = await Inventory.find()
      .populate('supplier')
      .populate('store'); // optional
=======
// GET all (aggregate stock qty)
exports.getAllInventory = async (req, res) => {
  try {
    // 1) Get all Inventory
    const items = await Inventory.find()
      .populate('supplier')
      .populate('store')
      .lean(); // lean() so we can modify the doc objects

    // 2) For each item, find its stock doc to get `qty`
    //    We'll assume one stock doc per product + store.
    const productIds = items.map(i => i._id);
    // you could do a multi-lookup, but let's keep it simple
    for (let item of items) {
      const stockDoc = await Stock.findOne({ product: item._id, store: item.store });
      item.quantity = stockDoc ? stockDoc.qty : 0;
    }

>>>>>>> c940ee0e (final updated code)
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
<<<<<<< HEAD
=======

    // Also delete the Stock doc? If you want to remove stock for that product
    await Stock.deleteMany({ product: id });

>>>>>>> c940ee0e (final updated code)
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: error.message });
  }
};

// STATS
exports.getInventoryStats = async (req, res) => {
  try {
<<<<<<< HEAD
    const products = await Inventory.find();
=======
    const products = await Inventory.find().lean();
>>>>>>> c940ee0e (final updated code)

    let total = 0;
    let revenue = 0;
    let lowStock = 0;
    let noStock = 0;
    const categorySet = new Set();

<<<<<<< HEAD
    products.forEach(product => {
      total += product.quantity;

      // if you want revenue = sum of costPrice * quantity (or buyingPrice?), define accordingly
      // let's assume revenue from costPrice for example:
      revenue += (product.costPrice || 0) * product.quantity;

      categorySet.add(product.category);

      if (product.quantity <= product.thresholdValue) lowStock++;
      if (product.quantity === 0) noStock++;
    });
=======
    // for each product, get stock qty
    for (let product of products) {
      const stockDoc = await Stock.findOne({ product: product._id, store: product.store });
      const qty = stockDoc ? stockDoc.qty : 0;

      total += qty;

      // if you want to define revenue from costPrice or buyingPrice
      revenue += (product.costPrice || 0) * qty;

      categorySet.add(product.category);

      if (qty <= product.thresholdValue && qty > 0) lowStock++;
      if (qty === 0) noStock++;
    }
>>>>>>> c940ee0e (final updated code)

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
<<<<<<< HEAD
};
=======
};
>>>>>>> c940ee0e (final updated code)
