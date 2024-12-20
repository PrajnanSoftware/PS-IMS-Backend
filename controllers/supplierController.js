const supplier =require( "../models/supplierModel.js")

exports.suppliercreate =async(req, res) => {
    try {
        const supplierData = new supplier(req.body);
        const { email } =supplierData;

        const supplierExist = await supplier.findOne({email});

        if(supplierExist) {
           return res.status(400).json({message: "supplier email already exist."});
        }
        const savedsupplier = await supplierData.save();
        res.status(200).json(savedsupplier);

    } catch (error) {
        res.status(500).json({error : "Internal server error."});
    }
}


exports.supplierfetch = async(req, res) => {
    try {
       const supplierFetch = await supplier.find();
       
        if(supplierFetch.length === 0){
           return res.status(404).json({message:" supplier not found."});
       }
       res.status(200).json(supplierFetch);
    } catch (error) {
        res.status(500).json({error : "Internal server error."});
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
        const id =req.params.id;
        const supplierExist = await supplier.findOne({_id:id})
        if(!supplierExist){
            return res.status(404).json({message:"supplier not found."})
        }
        const updatesupplier = await supplier.findByIdAndUpdate(id, req.body,{new:true});
        res.status(201).json(updatesupplier);
    } catch (error) {
        res.status(500).json({error : "Internal server error."});
    }
};


exports.supplierdelete = async (req, res) => {
    try {
        const id =req.params.id;
        const supplierExist = await supplier.findById({_id:id})
        if(!supplierExist){
            return res.status(404).json({message:"supplier not found."})
        }
        await supplier.findByIdAndDelete(id);
        res.status(201).json({message: "User delete successfully."});
    } catch (error) {
        res.status(500).json({error : "Internal server error."});
    }
};
