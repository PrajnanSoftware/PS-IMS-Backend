const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userVerificationSchema = new Schema({
    userId: { type: String, required: true },
    uniqueString: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, required: true }
});

const UserVerification = model('UserVerification', userVerificationSchema);
module.exports = UserVerification;
