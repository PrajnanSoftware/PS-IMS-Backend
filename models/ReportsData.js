const mongoose = require('mongoose');

const ReportsDataSchema = new mongoose.Schema({
    overview: [
        {
            revenue: { type: Number, required: true },
            total_profit: { type: Number, required: true },
            sales:{ type: Number, required: true },
            net_purchase_value: { type: Number, required: true },
            net_sales_value: { type: Number, required: true },
            mom_profit: { type: Number, required: true },
            yoy_profit:{ type: Number, required: true },

        },
    ],
    bestSellingCategory: [
        {
            category: { type: String, required: true },
            turn_over: { type: Number, required: true },
            increase_by: { type: Number, required: true },

        },   
    ],
    profitRevenue: [
        {
            month: { type: String, required: true },
            revenue: { type: Number, required: true },
            profit: { type: Number, required: true },
        },
    ],
    bestSellingProduct: [
       {
        productName: { type: String, required: true },
        product_id: { type: Number, required: true },
        category: { type: String, required: true },
        remaining_quantity:{ type: Number, required: true },
        turn_over: { type: Number, required: true },
        increase_by:{ type: Number, required: true },
       },
    ],
});

module.exports = mongoose.model('ReportsData', ReportsDataSchema);;
