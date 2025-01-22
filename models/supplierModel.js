// PS-IMS-Backend-main/models/supplierModel.js
const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
    supplierName: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: Number, required: true },
    ProductName: { type: String, required: true },
    category: { type: String, required: true },
    BuyingPrice: { type: Number, required: true },
    Type: { type: String, required: true },
    onTheWay: { type: Number, default: 0 },

    // <-- New field for image URL
    profileImgUrl: { type: String, default: '' },
});

module.exports = mongoose.model("suppliers", supplierSchema);
