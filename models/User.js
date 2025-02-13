const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["Super admin", "Zone admin", "Branch admin", "staff"], // Allowed roles
        default: "staff" // Default role should be one from the enum
    },
});

const User = model('User', userSchema);
module.exports = User;
