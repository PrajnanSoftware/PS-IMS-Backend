const express = require("express");
const { suppliercreate, supplierfetch, supplierfetchById, supplierupdate, supplierdelete } = require( "../controllers/supplierController.js");

const supplierRoute = express.Router();

supplierRoute.post("/create",suppliercreate);
supplierRoute.get("/getAll",supplierfetch); 
supplierRoute.get("/get/:id",supplierfetchById);
supplierRoute.put("/update/:id",supplierupdate);
supplierRoute.delete("/delete/:id",supplierdelete);


module.exports = {
    supplierRoute :supplierRoute
}