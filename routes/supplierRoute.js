// PS-IMS-Backend-main/routes/supplierRoute.js
const express = require("express");
const {
  suppliercreate,
  supplierfetch,
  supplierfetchById,
  supplierupdate,
  supplierdelete
} = require("../controllers/supplierController.js");
const upload = require("../config/multerConfig");

const supplierRoute = express.Router();

// Add "upload.single('profileImage')" for image upload
supplierRoute.post("/create", upload.single('profileImage'), suppliercreate);

supplierRoute.get("/getAll", supplierfetch);
supplierRoute.get("/get/:id", supplierfetchById);
supplierRoute.put("/update/:id", supplierupdate);
supplierRoute.delete("/delete/:id", supplierdelete);

module.exports = {
  supplierRoute
};
