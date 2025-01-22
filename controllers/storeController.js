const store =require("../models/storeModel.js")

exports.storecreate = async (req, res) => {
    try {
        const storeData = new store(req.body);
        const {email } = storeData;

        const storeExist = await store.findOne({email});
        if(storeExist) {
            return res.status(400).json({message:"Store already exists"});
        }
        const savedStore = await storeData.save();
        res.status(200).json(savedStore);
    } catch (error) {
        res.status(500).json({error:"Internal server error"});
    }

};


exports.storefetch = async (req, res ) => {
    try {
        const stores = await store.find();
        if(stores.length ===0) {
            return res.status(404).json({message: "Store not found."});
        }
        res.status(200).json(stores);
    } catch (error) {
        res.status(500).json({error:"Internal server error"});
    }
};


exports.storefetchById = async (req, res) => {
    try {
        const { id } = req.params;
        const storeFetchById = await store.findById(id);
        if (!storeFetchById) {
            return res.status(404).json({ message: "store not found." });
        }
        res.status(200).json(storeFetchById);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};


exports.storeupdate = async (req, res )=> {
    try {
        const id = req.params.id;
        const storeExist = await store.findOne({ _id:id});
        if(!storeExist) {
            return res.status(404).json({message:"store not found"});
        }
        const updateStore = await store.findByIdAndUpdate(id, req.body,{new:true});
        res.status(201).json(updateStore);
    } catch (error) {
        res.status(500).json({error:"Internal server error"});
    }
}; 


exports.storedelete = async (req, res )=> {
    try {
        const id = req.params.id;
        const storeExist = await store.findOne({ _id:id});
        if(!storeExist) {
            return res.status(404).json({message:"store not found"});
        }
        await store.findByIdAndDelete(id);
        res.status(201).json({message:"Store deleted successfully."});
    } catch (error) {
        res.status(500).json({error:"Internal server error"});
    }
}; 