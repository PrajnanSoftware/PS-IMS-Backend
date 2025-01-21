const mongoose = require('mongoose');

// ManageStore Schema
const manageStoreSchema = new mongoose.Schema({
    storeInformation: [
        {
            name: { type: String, required: true },
            location: { type: String, required: true },
            phone: { type: String, required: true },
            email: { type: String, required: true },
            operatingHours: { type: String, required: true },
        },
    ],
});

// ManageOrder Schema
const manageOrderSchema = new mongoose.Schema({
    orderInformation: [
        {
            orderNumber: { type: String, required: true },
            supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
            items: [{ itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }, quantity: Number }],
            orderDate: { type: Date, default: Date.now },
        },
    ],
});

const ManageInventorySchema = new mongoose.Schema({
    inventoryOverview: [
        {
            itemName: { type: String, required: true },
            quantity: { type: Number, required: true },
            location: { type: String, required: true },
            lastUpdated: { type: Date, default: Date.now },
        },
    ],
});
// ManagerSupplier schema
const manageSupplierSchema = new mongoose.Schema({
    supplierInformation: [
        {
            name: { type: String, required: true },
            contact: { type: String, required: true },
            email: { type: String, required: true },
            address: { type: String, required: true },
        },
    ],
});

// Export both models
const ManageStore = mongoose.model('ManageStore', manageStoreSchema);
const ManageOrder = mongoose.model('ManageOrder', manageOrderSchema);
const ManageSupplier = mongoose.model('ManagerSupplier',manageSupplierSchema);
const ManageInventory = mongoose.model('ManageInventory',ManageInventorySchema);

module.exports = { ManageStore, ManageOrder, ManageSupplier, ManageInventory };
