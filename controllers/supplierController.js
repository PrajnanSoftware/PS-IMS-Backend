const supplier = require("../models/supplierModel.js");
const cloudinary = require("../config/cloudinaryConfig.js");

exports.suppliercreate = async (req, res) => {
  try {
    // 1) If there's a file, upload to Cloudinary
    let profileImgUrl = '';

    if (req.file) {
      // Use a helper function to upload from buffer
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'profile-pic' }, // <-- place images in "profile-pic" folder
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });
      };

      // Actually upload the file’s buffer to Cloudinary
      const uploadResult = await streamUpload(req.file.buffer);
      profileImgUrl = uploadResult.secure_url;
    }

    // 2) Create a new supplier document from req.body
    const supplierData = new supplier({
      ...req.body,
      profileImgUrl, // store the Cloudinary URL
    });

    // 3) Check if a supplier with same email exists
    const { email } = supplierData;
    const supplierExist = await supplier.findOne({ email });
    if (supplierExist) {
      return res.status(400).json({ message: "supplier email already exist." });
    }

    // 4) Save
    const savedsupplier = await supplierData.save();
    res.status(200).json(savedsupplier);
  } catch (error) {
    console.error('Supplier creation error:', error);
    res.status(500).json({ error: "Internal server error." });
  }
};


exports.supplierfetch = async (req, res) => {
    try {
        const supplierFetch = await supplier.find();

        if (supplierFetch.length === 0) {
            return res.status(404).json({ message: " supplier not found." });
        }
        res.status(200).json(supplierFetch);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};


exports.supplierfetchById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplierFetchById = await supplier.findById(id);
        if (!supplierFetchById) {
            return res.status(404).json({ message: "Supplier not found." });
        }
        res.status(200).json(supplierFetchById);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};


exports.supplierupdate = async (req, res) => {
    try {
        const id = req.params.id;
        const supplierExist = await supplier.findOne({ _id: id })
        if (!supplierExist) {
            return res.status(404).json({ message: "supplier not found." })
        }
        const updatesupplier = await supplier.findByIdAndUpdate(id, req.body, { new: true });
        res.status(201).json(updatesupplier);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};


exports.supplierdelete = async (req, res) => {
    try {
        const id = req.params.id;
        const supplierExist = await supplier.findById({ _id: id })
        if (!supplierExist) {
            return res.status(404).json({ message: "supplier not found." })
        }
        await supplier.findByIdAndDelete(id);
        res.status(201).json({ message: "User delete successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};
