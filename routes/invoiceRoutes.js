// routes/invoiceRoutes.js

const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// GET all invoices
router.get('/', invoiceController.getAllInvoices);

// GET a single invoice by ID
router.get('/:id', invoiceController.getInvoiceById);

// Download existing PDF from the DB
router.get('/:id/download', invoiceController.downloadInvoicePdf);

// Generate a new invoice (and store PDF in DB)
router.post('/generate-invoice', invoiceController.generateInvoice);

module.exports = router;