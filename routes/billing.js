const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

// Initialize Razorpay using environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEYID, // Ensure this is set in your .env file
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Ensure this is set in your .env file
});

// Create a Razorpay order
router.post('/payment', async (req, res) => {
  let { amount } = req.body;

  // Convert the amount to a float and then to an integer (paise)
  amount = parseFloat(amount);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount provided' });
  }
  const amountInPaise = Math.round(amount * 100);

  const options = {
    amount: amountInPaise, // Amount in paise
    currency: 'INR',
    receipt: `order_receipt_${Date.now()}`, // Unique receipt id
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Optional: Handle payment success callback
router.post('/payment-success', (req, res) => {
  const { order_id, payment_id } = req.body;
  console.log(`Payment successful for order: ${order_id}, payment ID: ${payment_id}`);
  // Update your database as needed
  res.json({ status: 'success' });
});

// Optional: Handle payment failure callback
router.post('/payment-failure', (req, res) => {
  const { order_id } = req.body;
  console.log(`Payment failed for order: ${order_id}`);
  // Update your database as needed
  res.json({ status: 'failure' });
});

module.exports = router;
