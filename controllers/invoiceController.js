const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const { toWords } = require('number-to-words');
const Invoice = require('../models/Invoice');

// Helper function to generate a unique invoice number
const generateInvoiceNumber = () => {
    const timestamp = Date.now(); // Current timestamp
    const randomNumber = Math.floor(Math.random() * 100); // Random number for uniqueness
    return `INV-${timestamp}-${randomNumber}`;
};

// Helper function to get current date in DD/MM/YYYY format
const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Format: DD/MM/YYYY
};

// Controller function to handle invoice generation & storing in DB
exports.generateInvoice = async (req, res) => {
    try {
        const {
            cart,
            sellerName,
            sellerPhone,
            sellerAddress,
            supplierName,
            supplierAddress,
            totalAmount,
            paymentMethod,
            discountPercentage,
            customerName,
            customerPhone,
            customerAddress,
        } = req.body;

        // Basic validation
        if (!cart || !sellerName || !customerName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Prepare data for Invoice model
        const invoiceNumber = generateInvoiceNumber();
        const invoiceDate = new Date(); // You can store full Date object in DB
        // If you want just "DD/MM/YYYY", you could store that string. But storing
        // a real Date object is typically more flexible.

        // Build the `cart` array structure for DB
        // (Mapping the items to the invoiceItemSchema)
        const invoiceItems = cart.map((item) => ({
            product: item._id,          // If you want to store reference to Inventory
            name: item.name,
            quantity: item.quantity,
            price: item.buyingPrice,
        }));

        // Create a new PDFDocument (we'll store it in memory before sending to DB)
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            // Once PDF is fully generated, store in DB as Buffer
            const pdfData = Buffer.concat(buffers);

            // Compute final numeric total if needed in your PDF logic
            // But you already have totalAmount from the request. 
            // If you want it after discounts/taxes in the doc code, adjust accordingly.

            // Create the invoice document in the DB
            const newInvoice = new Invoice({
                invoiceNumber,
                invoiceDate,

                sellerName,
                sellerPhone,
                sellerAddress,
                supplierName,
                supplierAddress,

                customerName,
                customerPhone,
                customerAddress,

                cart: invoiceItems,
                totalAmount: parseFloat(totalAmount),
                paymentMethod,
                discountPercentage: discountPercentage || 0, // default to 0 if not provided

                pdfFile: pdfData, // store PDF as binary
            });

<<<<<<< HEAD
            await newInvoice.save();

=======
            try {
                await newInvoice.save();
                console.log("Invoice successfully saved!");
            } catch (error) {
                console.error("Error saving invoice:", error);
                return res.status(500).json({ error: "Database save failed", details: error.message });
            }
            
>>>>>>> c940ee0e (final updated code)
            // Finally, send the PDF to the client
            // or open in new tab. Here we’ll just send it inline.
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                'inline; filename="invoice-' + invoiceNumber + '.pdf"'
            );
            return res.send(pdfData);
        });

<<<<<<< HEAD
        // ==============================
        // Generate PDF content below
        // ==============================

        // --- (1) Register custom font if you have it ---
=======
         
>>>>>>> c940ee0e (final updated code)
        const fontPath = path.join(__dirname, '..', 'assets', 'font.ttf');
        let fontAvailable = fs.existsSync(fontPath);

        if (fontAvailable) {
            doc.registerFont('CustomFont', fontPath);
        }
        const fontToUse = fontAvailable ? 'CustomFont' : 'Helvetica';

        // (2) Add your logo if available
        const logoPath = path.join(__dirname, '..', 'assets', 'image.png');
        const logoExists = fs.existsSync(logoPath);
        const logoWidth = 100;
        const logoHeight = 50;
        if (logoExists) {
            doc.image(logoPath, 450, 50, { width: logoWidth, height: logoHeight });
        }

        // (3) "TAX INVOICE" on the left
        doc.fontSize(22).font(fontToUse).text('TAX INVOICE', 50, 50);

        // (4) "ORIGINAL FOR RECIPIENT" box
        const boxX = 50;
        const boxY = 80;
        const boxWidth = 150;
        const boxHeight = 20;
        doc
            .rect(boxX, boxY, boxWidth, boxHeight)
            .stroke();
        doc
            .fontSize(10)
            .text('ORIGINAL FOR RECIPIENT', boxX + 5, boxY + 5, { width: boxWidth - 10, align: 'center' });

        // (5) Horizontal line under the header
        doc
            .moveTo(50, boxY + boxHeight + 5)
            .lineTo(550, boxY + boxHeight + 5)
            .stroke();

        // (6) Seller & Invoice Details 
        const tableStartY = 120;
        const leftColumnX = 50;
        const rightColumnX = 350;
        // Left column: Seller info
        doc.fontSize(14).font(fontToUse).text(sellerName, leftColumnX, tableStartY);
        doc.fontSize(10)
            .text(sellerAddress, leftColumnX, tableStartY + 15)
            .text(`GSTIN: 12ABCD1234A1ABC`, leftColumnX, tableStartY + 30)
            .text(`Email: seller@example.com`, leftColumnX, tableStartY + 45)
            .text(`Mobile: ${sellerPhone}`, leftColumnX, tableStartY + 60);

        // Right column: Invoice details
        doc
            .text('Invoice No.:', rightColumnX, tableStartY)
            .text(invoiceNumber, rightColumnX + 80, tableStartY)
            .text('Invoice Date:', rightColumnX, tableStartY + 15)
            .text(getCurrentDate(), rightColumnX + 80, tableStartY + 15, { width: 100 });

        // (7) Horizontal line
        doc
            .moveTo(50, tableStartY + 80)
            .lineTo(550, tableStartY + 80)
            .stroke();

        // (8) Customer details
        const customerDetailsY = tableStartY + 100;
        doc.fontSize(12).text('Customer Details:', leftColumnX, customerDetailsY);
        doc.fontSize(10)
            .text(`Name: ${customerName}`, leftColumnX, customerDetailsY + 15)
            .text(`Phone: ${customerPhone}`, leftColumnX, customerDetailsY + 30)
            .text(`Address: ${customerAddress}`, leftColumnX, customerDetailsY + 45);

        doc
            .moveTo(50, customerDetailsY + 60)
            .lineTo(550, customerDetailsY + 60)
            .stroke();

        // (9) Item table headers
        let startX = 50;
        let startY = customerDetailsY + 80;
<<<<<<< HEAD
        const colWidths = [30, 140, 60, 30, 60, 60, 50, 60, 60];
=======
        const colWidths = [25, 120, 50, 30, 60, 50, 45, 50, 70];
>>>>>>> c940ee0e (final updated code)
        const rowHeight = 30;
        const tableWidth = colWidths.reduce((a, b) => a + b, 0);

        // Header row (gray background)
        doc.rect(startX, startY, tableWidth, rowHeight).fillAndStroke('#d3d3d3', 'black');
        const headers = ['No.', 'Item Name', 'Price', 'Qty', 'Total', 'CGST (2.5%)', 'SGST (2.5%)', 'Discount', 'Net Total'];
        let xPos = startX;
        doc.fillColor('black').font(fontToUse);
        headers.forEach((header, index) => {
            doc.text(header, xPos + 5, startY + 7, { width: colWidths[index], align: 'center' });
            xPos += colWidths[index];
        });

        startY += rowHeight;

        // (10) Rows
        let grandTotal = 0;
        cart.forEach((item, index) => {
            const rowY = startY + index * rowHeight;
            doc.rect(startX, rowY, tableWidth, rowHeight).stroke();

            // Example calculation (adapt as needed):
            const itemTotal = item.buyingPrice * item.quantity;
            const cgst = itemTotal * 0.025;
            const sgst = itemTotal * 0.025;
            const discount = ((discountPercentage || 0) / 100) * itemTotal;
            const netTotal = itemTotal + cgst + sgst - discount;
            grandTotal += netTotal;

            // Draw vertical lines
            let colX = startX;
            for (let i = 0; i < colWidths.length; i++) {
                doc
                    .moveTo(colX, rowY)
                    .lineTo(colX, rowY + rowHeight)
                    .stroke();
                colX += colWidths[i];
            }

            xPos = startX;
            const rowData = [
                index + 1,
                item.name,
                `₹${item.buyingPrice.toFixed(2)}`,
                item.quantity,
                `₹${itemTotal.toFixed(2)}`,
                `₹${cgst.toFixed(2)}`,
                `₹${sgst.toFixed(2)}`,
                `₹${discount.toFixed(2)}`,
                `₹${netTotal.toFixed(2)}`
            ];
            rowData.forEach((data, i) => {
                doc.text(data, xPos + 5, rowY + 7, { width: colWidths[i], align: 'center' });
                xPos += colWidths[i];
            });
        });

        startY += cart.length * rowHeight;

        // (11) Final total
        let finalAmount = Math.round(grandTotal);
        doc.rect(startX, startY, tableWidth, rowHeight).fillAndStroke('#d3d3d3', 'black');
        let finalRowData = ['', 'FINAL TOTAL', '', '', '', '', '', '', `₹${finalAmount}`];
        xPos = startX;
        finalRowData.forEach((data, i) => {
            doc.text(data, xPos + 5, startY + 7, { width: colWidths[i], align: 'center' });
            xPos += colWidths[i];
        });
        startY += rowHeight;

        // (12) Amount in words
        const amountInWords = toWords(finalAmount);
        doc.fontSize(10).text(`Amount in Words: ${amountInWords.toUpperCase()} ONLY`, startX, startY + 10);

        // (13) QR Code if paymentMethod is "razorpay"
        if (paymentMethod === 'razorpay') {
            try {
                const qrData = `Payment Amount: ₹${finalAmount}\nPay here: https://your-payment-link.com`;
                const qrCodeUrl = await QRCode.toDataURL(qrData);
                const pageHeight = doc.page.height;
                const marginBottom = 120;
                const qrCodeWidth = 100;
                const qrCodeHeight = 100;
                const qrCodeX = 50;
                const qrCodeY = pageHeight - marginBottom - qrCodeHeight;

                doc.fontSize(14).text('Payment QR Code:', qrCodeX, qrCodeY - 20, { underline: true });
                doc.image(qrCodeUrl, qrCodeX, qrCodeY, { width: qrCodeWidth, height: qrCodeHeight });
            } catch (error) {
                console.error('Error generating QR code:', error);
            }
        }

        // (14) Signature 
        const signaturePath = path.join(__dirname, '..', 'assets', 'image copy.png');
        const signatureExists = fs.existsSync(signaturePath);
        const pageHeight = doc.page.height;
        const marginBottom = 120;
        const signatureWidth = 120;
        const signatureHeight = 50;
        const signatureX = 400;
        const signatureY = pageHeight - signatureHeight - marginBottom;

        if (signatureExists) {
            doc.image(signaturePath, signatureX, signatureY, { width: signatureWidth, height: signatureHeight });
        }

        doc
            .moveTo(signatureX, signatureY + signatureHeight + 5)
            .lineTo(signatureX + signatureWidth, signatureY + signatureHeight + 5)
            .stroke();
        doc.fontSize(12).text('Authorized Signatory', signatureX + 20, signatureY + signatureHeight + 10);

        // End the PDF
        doc.end();

    } catch (error) {
        console.error('Error generating invoice:', error);
        return res.status(500).json({ error: 'Failed to generate invoice' });
    }
};

exports.getAllInvoices = async (req, res) => {
<<<<<<< HEAD
  try {
    const invoices = await Invoice.find({});
    return res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return res.status(500).json({ error: 'Failed to fetch invoices' });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    // Populate 'cart.product' if you want to load Inventory details
    const invoice = await Invoice.findById(id).populate('cart.product');
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    return res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice by ID:', error);
    return res.status(500).json({ error: 'Failed to fetch invoice' });
  }
};

exports.downloadInvoicePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    if (!invoice.pdfFile) {
      return res.status(404).json({ error: 'Invoice PDF not found' });
    }

    // Optional: attach a filename
    const filename = invoice.invoiceNumber
      ? `${invoice.invoiceNumber}.pdf`
      : 'invoice.pdf';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Send the PDF buffer
    return res.send(invoice.pdfFile);
  } catch (error) {
    console.error('Error downloading invoice PDF:', error);
    return res.status(500).json({ error: 'Failed to download invoice PDF' });
  }
=======
    try {
        const invoices = await Invoice.find({});
        return res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return res.status(500).json({ error: 'Failed to fetch invoices' });
    }
};

exports.getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        // Populate 'cart.product' if you want to load Inventory details
        const invoice = await Invoice.findById(id).populate('cart.product');
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        return res.json(invoice);
    } catch (error) {
        console.error('Error fetching invoice by ID:', error);
        return res.status(500).json({ error: 'Failed to fetch invoice' });
    }
};

exports.downloadInvoicePdf = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        if (!invoice.pdfFile) {
            return res.status(404).json({ error: 'Invoice PDF not found' });
        }

        // Optional: attach a filename
        const filename = invoice.invoiceNumber
            ? `${invoice.invoiceNumber}.pdf`
            : 'invoice.pdf';

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Send the PDF buffer
        return res.send(invoice.pdfFile);
    } catch (error) {
        console.error('Error downloading invoice PDF:', error);
        return res.status(500).json({ error: 'Failed to download invoice PDF' });
    }
>>>>>>> c940ee0e (final updated code)
};
