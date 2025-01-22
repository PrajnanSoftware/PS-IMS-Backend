const mongoose =require ("mongoose");

const storeSchema = new mongoose.Schema({
    storeName:{
        type: String,
        required:true,
    },
    phoneNumber:{
        type: Number,
        required:true,
    },
    email:{
        type: String,
        required:true,
    },
    streetName:{
        type: String,
        required:true,
    }, 
    landMark:{
        type: String,
        required:true,
    },
    postalCode:{
        type: Number,
        required:true,
    },
    city:{
        type: String,
        required:true,
    },
    state:{
        type: String,
        required:true,
    },
    country:{ 
        type: String,
        required:true, 
    },
});


module.exports = mongoose.model("stores",storeSchema); 
