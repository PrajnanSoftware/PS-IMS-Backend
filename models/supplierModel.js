const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
    supplierName : {
        type : String,
        required :true
    },
    email : {
        type : String,
        required : true
    },
    contact : {
        type : Number,
        required : true
    },
    ProductName : { 
        type : String,
        required :true
    },
    category : {
        type : String,
        required :true
    },
    BuyingPrice : {
        type : Number,
        required :true
    },
    Type : {
        type : String,
        required :true
    }
})

module.exports = mongoose.model("suppliers",supplierSchema);