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
      const { name, email, password, confirmPassword, city, phone} = req.body;
  
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
      const newUser = new User({
        name,
        email,
        password: hashedPassword, // Store hashed password
        city,
        phone
      });
  
      // Save the user to the database
      await newUser.save();
  
      res.status(201).json({ id: newUser._id, email: newUser.email, role:newUser.role });
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

        res.status(200).json({                                                 //modified for profile 
            id: user._id,                                                      //Date: 14/02/2025
            name: user.name || '',
            email: user.email,
            phone: user.phone || '',
            city: user.city || ''
        });
    } catch (err) {
        handleErrors(res, err, 'Error fetching account details');
    }
};


// Update User Details                                     
//Implemented update user in the profile and connect this function to EDIT button in the profile
userCtrl.updateUser = async (req, res) => {
  try {
      if (!req.user) {
          return res.status(401).json({ error: "Unauthorized access" });
      }

      const userId = req.user.id;
      const updates = req.body;

      // Check if only email is being updated
      if (Object.keys(updates).length === 1 && updates.email) {
          const existingUser = await User.findOne({ email: updates.email });

          // If the email is taken by another user, prevent update
          if (existingUser && existingUser._id.toString() !== userId) {
              return res.status(400).json({ error: "Email is already registered" });
          }
      }

      // If password is updated, hash it
      if (updates.password) {
          const salt = await bcryptjs.genSalt(12);
          updates.password = await bcryptjs.hash(updates.password, salt);
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updates, { 
          new: true, 
          runValidators: true 
      }).select('-password'); // Exclude password from response

      if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
      }

      res.json(updatedUser);
  } catch (err) {
      if (err.code === 11000) {
          return res.status(400).json({ error: "Email is already registered" });
      }
      handleErrors(res, err, "Error updating user");
  }
};

module.exports = userCtrl;
