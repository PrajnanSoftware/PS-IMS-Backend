const mongoose = require('mongoose');
const { Schema } = mongoose;

// This schema represents each item in the invoice cart.
// You can expand fields as needed (for example, you may store GST details, etc.)
const invoiceItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Inventory' }, // Reference to an Inventory model
    name: { type: String, required: true },                    // Product name (for quick read)
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },                   // Product price
    // Add more fields here if needed (e.g., tax rate per item, discount per item, etc.)
});

// This schema represents the entire invoice document stored in the database.
const invoiceSchema = new Schema(
    {
        invoiceNumber: { type: String, required: true, unique: true },
        invoiceDate: { type: Date, required: true },

        // Seller details
        sellerName: { type: String, required: true },
        sellerPhone: { type: String, required: true },
        sellerAddress: { type: String, required: true },

        // Supplier details
        supplierName: { type: String, required: true },
        supplierAddress: { type: String, required: true },

        // Customer details
        customerName: { type: String, required: true },
        customerPhone: { type: String, required: true },
        customerAddress: { type: String, required: true },

        // Cart items referencing the Inventory model
        cart: [invoiceItemSchema],

        // Amounts and payment
        totalAmount: { type: Number, required: true },
        paymentMethod: { type: String, required: true }, // e.g. 'cash', 'razorpay', etc.

        // Optional discount field (in case you want to store discount at invoice level)
        discountPercentage: { type: Number, default: 0 },

        // PDF file stored in binary form
        pdfFile: { type: Buffer }, // The generated invoice PDF as a binary Buffer
    },
    { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
