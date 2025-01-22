const express = require("express");

const  { storecreate, storedelete, storefetch, storefetchById, storeupdate }  =
 require("../controllers/storeController.js");

const storeRoute = express.Router();

storeRoute.post("/createstore",storecreate);
storeRoute.get("/getAllstore",storefetch);
storeRoute.get("/getstore/:id",storefetchById);
storeRoute.put("/updatestore/:id",storeupdate);
storeRoute.delete("/deletestore/:id",storedelete); 



module.exports = {
    storeRoute : storeRoute
};