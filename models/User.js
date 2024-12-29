const mongoose = require('mongoose')
const{Schema, model} = mongoose
const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    role: { type: String, required: true, enum: ['admin', 'manager', 'customer']}
})
const User = model('User', userSchema)
module.exports = User