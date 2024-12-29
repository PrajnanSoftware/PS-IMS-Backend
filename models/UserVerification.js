const mongoose = require('mongoose')
const{Schema, model} = mongoose
const userVerificationSchema = new Schema({
    userId: String,
    uniqueString: String,
    createdAt: Date,
    expiresAt: Date
})
const UserVerification = model('UserVerification', userVerificationSchema)
module.exports = UserVerification