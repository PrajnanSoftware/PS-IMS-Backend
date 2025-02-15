const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: {type: String , required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["Super admin", "Zone admin", "Branch admin", "staff"], // Allowed roles
        default: "staff" // Default role should be one from the enum
    },
    city: {type: String, required: true},       // Modified model to implement profile                    Date : 14/02/2025      
    phone: {type :Number, required: true}
});

const User = model('User', userSchema);
module.exports = User;
