const _ = require('lodash');
const User = require('../models/User');
const UserVerification = require('../models/UserVerification')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const{v4:uuidv4} = require('uuid')

const userCtrl = {};



// User Registration
userCtrl.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const body = req.body;
    const user = new User(body);
    const salt = await bcryptjs.genSalt();
    const encryptedPassword = await bcryptjs.hash(user.password, salt);
    user.password = encryptedPassword;
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json('something went wrong');
  }
};

// User Login
userCtrl.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const body = req.body;
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return res.status(400).json({ error: 'invalid email/password' });
    }
    const checkPassword = await bcryptjs.compare(body.password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ error: 'invalid email/password' });
    }
    const tokenData = {
      id: user._id,
      role: user.role,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET);
    res.json({ token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get User Account Details
userCtrl.account = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select({ password: 0 });
    if (!user) {
      return res.status(400).json('user not found');
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.AUTH_EMAIL,
//         pass: process.env.AUTH_PASS
//     }
// })
// transporter.verify((error, success) => {
//     if(error) {
//         console.log(error)
//     }else{
//         console.log("Ready for messages")
//         console.log(success)
//     }
// })


module.exports = userCtrl;





