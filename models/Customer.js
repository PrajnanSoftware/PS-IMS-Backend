const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: false
    },
    address: {
        type: {
            street: {
                type: String,
                required: false
            },
            city: {
                type: String,
                required: false
            },
            state: {
                type: String,
                required: false
            },
            country: {
                type: String,
                required: false
            },
            postalCode: {
                type: String,
                required: false
            }
        },
        required: false
    }
}, {
    timestamps: true
});

const Customer = model('Customer', customerSchema);
module.exports = Customer;
