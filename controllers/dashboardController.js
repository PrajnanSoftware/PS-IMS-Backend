
const Inventory = require('../models/inventory');
const Supplier = require('../models/supplierModel');

exports.getDashboardData = async (req, res) => {
    try {
        const allInventory = await Inventory.find();
        let totalQuantityInHand = 0;
        let totalToBeReceived = 0;


        allInventory.forEach(item => {
            totalQuantityInHand += item.quantity;
        });

        const lowQuantityArr = allInventory
            .filter(item => item.quantity <= item.thresholdValue)
            .map(item => ({
                name: item.name,
                remainingQuantity: item.quantity,
            }));

        const distinctCategories = await Inventory.distinct('category');
        const numberOfCategories = distinctCategories.length;

        const suppliersCount = await Supplier.countDocuments();

// lorem ipsum  dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nisl tincidunt tincidunt. Nullam nec purus nec nisl
// lorem ipsum  dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nisl tincidunt tincidunt. Nullam nec purus nec nisl
// lorem ipsum  dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nisl tincidunt tincidunt. Nullam nec purus nec nisl

        const topSellingArr = [
            { name: 'dummy A', soldQuantity: 50, remainingQuantity: 20, price: 400 },
            // ...
        ];
        // Sales & Purchase Overviews 
        // If you have real logic from Orders or Purchase, do aggregations. 
        // For now, placeholders:
        const salesOverview = [
            {
                sales: 832,
                revenue: 18300,
                profit: 868,
                cost: 17432
            }
        ];
        const purchaseOverview = [
            {
                purchase: 82,
                cost: 18300,
                cancel: 5,
                return: 17
            }
        ];
        // lorem ipsum  dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nisl tincidunt tincidunt. Nullam nec purus nec nisl
// lorem ipsum  dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nisl tincidunt tincidunt. Nullam nec purus nec nisl
// lorem ipsum  dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nisl tincidunt tincidunt. Nullam nec purus nec nisl

        const dashboardData = {
            salesOverview,
            purchaseOverview,
            inventory: [
                {
                    quantityInHand: totalQuantityInHand,
                    toBeReceived: totalToBeReceived
                }
            ],
            productSummary: [
                {
                    numberOfSuppliers: suppliersCount,
                    numberOfCategories: numberOfCategories
                }
            ],
            topSellingStock: topSellingArr,
            lowQuantityStock: lowQuantityArr,
        };

        res.json(dashboardData);

    } catch (error) {
        console.error('Error calculating dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};


exports.createOrUpdateDashboardData = async (req, res) => {
    try {
        const {
            salesOverview,
            purchaseOverview,
            inventory,
            productSummary,
            topSellingStock,
            lowQuantityStock
        } = req.body;

        let data = await DashboardData.findOne();

        if (data) {
            data.salesOverview = salesOverview;
            data.purchaseOverview = purchaseOverview;
            data.inventory = inventory;
            data.productSummary = productSummary;
            data.topSellingStock = topSellingStock;
            data.lowQuantityStock = lowQuantityStock;
        } else {
            data = new DashboardData({
                salesOverview,
                purchaseOverview,
                inventory,
                productSummary,
                topSellingStock,
                lowQuantityStock,
            });
        }

        await data.save();
        res.status(201).json(data);
    } catch (err) {
        console.error('Failed to save dashboard data:', err);
        res.status(500).json({ error: 'Failed to save dashboard data' });
    }
};
