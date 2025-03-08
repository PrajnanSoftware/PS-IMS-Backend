// PS-IMS-Backend-main/controllers/userController.js
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userCtrl = {};
const saltRounds = 12; // Recommended for security

// Utility function for error handling
const handleErrors = (res, err, message = 'Internal Server Error', statusCode = 500) => {
  console.error(err); // Log error for debugging
  res.status(statusCode).json({ error: message });
};

// User Registration with Password Confirmation Check
userCtrl.register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(saltRounds);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create a new user
    // If you want to optionally accept store from the request, you can do:
    // const { store } = req.body;
    // then pass store in the user object below. 
    const newUser = new User({
      email,
      password: hashedPassword, // Store hashed password
      // store: storeId,  // only if you want to pass store from front-end
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ id: newUser._id, email: newUser.email, role: newUser.role });
  } catch (err) {
    handleErrors(res, err, 'Error registering user');
  }
};

// User Login
userCtrl.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const checkPassword = user ? await bcryptjs.compare(password, user.password) : false;
    if (!checkPassword) {
      return res.status(400).json({ error: 'Invalid email/password' });
    }

    const tokenData = { id: user._id, role: user.role };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    handleErrors(res, err, 'Error logging in');
  }
};

// Get User Account Details
userCtrl.account = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    handleErrors(res, err, 'Error fetching account details');
  }
};

module.exports = userCtrl;
