const express = require('express');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const { toWords } = require('number-to-words');
const router = express.Router();

// Register the font
const fontPath = path.join(__dirname, 'assets', 'FONT.ttf'); // Path to the font file
let fontAvailable = false;

// Check if the font file exists
if (fs.existsSync(fontPath)) {
    fontAvailable = true;
} else {
    console.warn('Font file NotoSans-Regular.ttf not found. Falling back to Helvetica.');
}

// Function to generate a unique invoice number
const generateInvoiceNumber = () => {
    const timestamp = Date.now(); // Get current timestamp
    const randomNumber = Math.floor(Math.random() * 100); // Add a random number for uniqueness
    return `INV-${timestamp}-${randomNumber}`; // Format: INV-<timestamp>-<randomNumber>
};

// Function to get the current date in DD/MM/YYYY format
const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Format: DD/MM/YYYY
};

router.post('/generate-invoice', async (req, res) => {
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
            customerAddress
        } = req.body;

        // Validate required fields
        if (!cart || !sellerName || !customerName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const doc = new PDFDocument();

        // Register the font if available
        if (fontAvailable) {
            doc.registerFont('NotoSans', fontPath);
        }

        // Set response headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="invoice.pdf"');

        // Pipe the PDF document to the response
        doc.pipe(res);

        // Use the registered font or fall back to Helvetica
        const font = fontAvailable ? 'NotoSans' : 'Helvetica';

        // === INVOICE HEADER ===
        const logoPath = path.join(__dirname, 'assets', 'image.png'); // Path to the logo file
        const logoWidth = 100; // Adjust logo width
        const logoHeight = 50; // Adjust logo height

        // Debugging: Print the logo path
        console.log('Logo Path:', logoPath);

        // Add the logo on the right side
        if (fs.existsSync(logoPath)) {
            try {
                // Position the logo at (x: 450, y: 50) - Right side of the page
                doc.image(logoPath, 450, 50, { width: logoWidth, height: logoHeight });
                console.log('Logo added successfully.');
            } catch (error) {
                console.error('Error loading logo:', error);
            }
        } else {
            console.warn('Logo file not found. Skipping...');
        }

        // Add "TAX INVOICE" text on the left side
        const taxInvoiceTextX = 50; // X position: left side
        const taxInvoiceTextY = 50; // Y position: same as the logo
        doc.fontSize(22).font(font).text('TAX INVOICE', taxInvoiceTextX, taxInvoiceTextY);

        // Add "ORIGINAL FOR RECIPIENT" box directly below "TAX INVOICE"
        const boxX = taxInvoiceTextX; // Align the box with the "TAX INVOICE" text
        const boxY = taxInvoiceTextY + 30; // Y position: below the "TAX INVOICE" text
        const boxWidth = 150; // Box width
        const boxHeight = 20; // Box height

        // Draw the container (rectangle)
        doc.rect(boxX, boxY, boxWidth, boxHeight).stroke();

        // Add text inside the box
        doc.fontSize(10)
           .fillColor('black')
           .text('ORIGINAL FOR RECIPIENT', boxX + 5, boxY + 5, { width: boxWidth - 10, align: 'center' });

        // Draw a horizontal line under the header
        doc.moveTo(50, boxY + boxHeight + 5).lineTo(550, boxY + boxHeight + 5).stroke();

        // === SELLER INFORMATION AND INVOICE DETAILS (TWO COLUMNS) ===
        const tableStartY = 120;
        const leftColumnX = 50;
        const rightColumnX = 350;
        const columnWidth = 250;

        // Left Column (Seller Info)
        doc.fontSize(14).font(font).text(sellerName, leftColumnX, tableStartY);
        doc.fontSize(10).font(font).text(sellerAddress, leftColumnX, tableStartY + 15);
        doc.text(`GSTIN: 12ABCD1234A1ABC`, leftColumnX, tableStartY + 30);
        doc.text(`Email: seller@example.com`, leftColumnX, tableStartY + 45);
        doc.text(`Mobile: 1234567890`, leftColumnX, tableStartY + 60);

        // Right Column (Invoice Details)
        const invoiceNumber = generateInvoiceNumber(); // Generate invoice number
        const invoiceDate = getCurrentDate(); // Get current date
        console.log('Invoice Date:', invoiceDate); // Debugging: Check the value of invoiceDate

        doc.fontSize(10).font(font).text('Invoice No.:', rightColumnX, tableStartY);
        doc.font(font).text(invoiceNumber, rightColumnX + 80, tableStartY); // Dynamic invoice number
        doc.font(font).text('Invoice Date:', rightColumnX, tableStartY + 15);
        doc.font(font).text(invoiceDate, rightColumnX + 80, tableStartY + 15, { width: 100 }); // Dynamic invoice date with proper width

        // Draw a horizontal line below Bill To & Ship To
        doc.moveTo(50, tableStartY + 80).lineTo(550, tableStartY + 80).stroke();

        // === CUSTOMER DETAILS ===
        const customerDetailsY = tableStartY + 100;
        doc.fontSize(12).font(font).text('Customer Details:', leftColumnX, customerDetailsY);
        doc.fontSize(10).font(font).text(`Name: ${customerName}`, leftColumnX, customerDetailsY + 15);
        doc.text(`Phone: ${customerPhone}`, leftColumnX, customerDetailsY + 30);
        doc.text(`Address: ${customerAddress}`, leftColumnX, customerDetailsY + 45);

        // Draw a horizontal line below Customer Details
        doc.moveTo(50, customerDetailsY + 60).lineTo(550, customerDetailsY + 60).stroke();

        // === ITEM TABLE ===
        const startX = 50;
        let startY = customerDetailsY + 80; // Adjusted startY to include customer details
        const colWidths = [30, 140, 60, 30, 60, 60, 50, 60, 60];
        const rowHeight = 30;
        const tableWidth = colWidths.reduce((a, b) => a + b, 0);

        // Table Headers with Gray Background
        doc.rect(startX, startY, tableWidth, rowHeight).fillAndStroke('#d3d3d3', 'black'); // Gray fill for header
        const headers = ['No.', 'Item Name', 'Price', 'Qty', 'Total', 'CGST (2.5%)', 'SGST (2.5%)', 'Discount', 'Net Total'];
        let xPos = startX;
        doc.fillColor('black').font(font); // Set text to black and use the selected font
        headers.forEach((header, index) => {
            doc.text(header, xPos + 5, startY + 7, { width: colWidths[index], align: 'center' });
            xPos += colWidths[index];
        });

        startY += rowHeight;

        // Table Rows
        let grandTotal = 0;
        cart.forEach((item, index) => {
            const rowY = startY + (index * rowHeight);
            const itemTotal = item.buyingPrice * item.quantity;
            const cgst = itemTotal * 0.025;
            const sgst = itemTotal * 0.025;
            const discount = (5 / 100) * itemTotal;
            const netTotal = itemTotal + cgst + sgst - discount;

            grandTotal += netTotal;

            // Draw row
            doc.rect(startX, rowY, tableWidth, rowHeight).stroke();

            // Draw vertical lines between columns
            let colX = startX;
            for (let i = 0; i < colWidths.length; i++) {
                doc.moveTo(colX, startY).lineTo(colX, startY + cart.length * rowHeight).stroke();
                colX += colWidths[i];
            }

            // Fill row content
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

        // === FINAL TOTAL ===
        let finalAmount = Math.round(grandTotal);

        // Final Total Row with Gray Background
        doc.rect(startX, startY, tableWidth, rowHeight).fillAndStroke('#d3d3d3', 'black'); // Gray fill for final row
        let finalRowData = ['', 'FINAL TOTAL', '', '', '', '', '', '', `₹${finalAmount}`];

        xPos = startX;
        doc.fillColor('black').font(font); // Set text to black and use the selected font
        finalRowData.forEach((data, i) => {
            doc.text(data, xPos + 5, startY + 7, { width: colWidths[i], align: 'center' });
            xPos += colWidths[i];
        });

        startY += rowHeight;

        // === AMOUNT IN WORDS ===
        const amountInWords = toWords(finalAmount); // Convert amount to words
        doc.fontSize(10).text(`Amount in Words: ${amountInWords} ONLY`, startX, startY + 10);

        // === QR CODE FOR PAYMENT ===
        if (paymentMethod === 'razorpay') {
            try {
                // Generate QR code data
                const qrData = `Payment Amount: ₹${finalAmount}\nPay here: https://your-payment-link.com`;
        
                // Convert QR code data to a URL
                const qrCodeUrl = await QRCode.toDataURL(qrData);
        
                // Position the QR code near the bottom of the page
                const pageHeight = doc.page.height; // Get the total page height
                const marginBottom = 120; // Distance from the bottom of the page
                const qrCodeWidth = 100; // Width of the QR code
                const qrCodeHeight = 100; // Height of the QR code
                const qrCodeX = 50; // X position (left aligned)
                const qrCodeY = pageHeight - marginBottom - qrCodeHeight; // Y position (near the bottom)
        
                // Add "Payment QR Code" text
                doc.fontSize(14)
                   .text('Payment QR Code:', qrCodeX, qrCodeY - 20, { underline: true });
        
                // Add the QR code image
                doc.image(qrCodeUrl, qrCodeX, qrCodeY, { width: qrCodeWidth, height: qrCodeHeight });
        
                console.log('QR code added successfully.');
            } catch (error) {
                console.error('Error generating QR code:', error);
            }
        }

        // === SIGNATURE ===
        const signaturePath = path.join(__dirname, 'assets', 'image copy.png'); // Ensure the correct path to the signature image
        const pageHeight = doc.page.height; // Get the total page height
        const marginBottom = 120; // Distance from bottom of the page
        const signatureWidth = 120; // Adjust width
        const signatureHeight = 50; // Adjust height
        const signatureX = 400; // Right-side alignment
        const signatureY = pageHeight - signatureHeight - marginBottom; // Positioning near the bottom

        if (fs.existsSync(signaturePath)) {
            doc.image(signaturePath, signatureX, signatureY, { width: signatureWidth, height: signatureHeight });
        } else {
            console.warn('Signature image not found. Skipping...');
        }

        // Draw a line above the Authorized Signatory text (for separation)
        doc.moveTo(signatureX, signatureY + signatureHeight + 5)
            .lineTo(signatureX + signatureWidth, signatureY + signatureHeight + 5)
            .stroke();

        // Add "Authorized Signatory" text below the signature
        doc.fontSize(12).font(font).text('Authorized Signatory', signatureX + 20, signatureY + signatureHeight + 10);

        // Finalize the PDF
        doc.end();
    } catch (error) {
        console.error('Error generating invoice:', error);
        res.status(500).json({ error: 'Failed to generate invoice' });
    }
});

module.exports = router;