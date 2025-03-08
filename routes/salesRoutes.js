const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Billing = require("../models/billingModel"); // Ensure this path is correct

router.get("/", async (req, res) => {
    try {
        const sales = await Billing.find(); // Fetch all billings data
        console.log("Fetched Sales Data:", sales); // Debugging log
        if (!sales.length) {
            return res.status(404).json({ message: "No sales data found" });
        }
        res.json(sales);
    } catch (error) {
        console.error("Error fetching sales:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
