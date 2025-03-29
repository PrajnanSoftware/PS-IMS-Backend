const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cloudinary = require("../config/cloudinaryConfig.js");

const userCtrl = {};
const saltRounds = 12;

// Utility function for error handling
const handleErrors = (res, err, message = 'Internal Server Error', statusCode = 500) => {
  console.error(err);
  res.status(statusCode).json({ error: message });
};

// User Registration
userCtrl.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, city, phone } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcryptjs.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      city,
      phone,
      profileUrl: ''
    });

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

    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid email/password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    handleErrors(res, err, 'Error logging in');
  }
};

// Get Logged-in User Details
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

// Update User Profile (including Profile Picture)
userCtrl.updateUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const userId = req.user.id;
    let updates = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    };

    // If a new profile picture is uploaded, store it on Cloudinary
    if (req.file) {
      // we create a promise that resolves once the stream callback fires
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'profile-pics' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        // now pipe the file buffer into Cloudinary
        stream.end(req.file.buffer);
      });

      // now we can safely use uploadResult.secure_url
      updates.profileUrl = uploadResult.secure_url;
    }


    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcryptjs.hash(updates.password, saltRounds);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    handleErrors(res, err, "Error updating user");
  }
};

// Return all user docs
userCtrl.fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // or .select('name email') if you want fewer fields
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};


module.exports = userCtrl;
