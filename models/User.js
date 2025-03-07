// PS-IMS-Backend-main/models/User.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, default: '' },        // If you want a "name" field
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Super admin", "Zone admin", "Branch admin", "staff"],
    default: "staff"
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: false
  },

  // Add these new fields:
  city:   { type: String, default: '' },
  phone:  { type: String, default: '' },
  profileUrl: { type: String, default: '' }
}, { timestamps: true });

const User = model('User', userSchema);
module.exports = User;
