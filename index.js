require('dotenv').config();
console.log('Cloudinary ENV:', {
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
});

require('./config/cloudinaryConfig.js')
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { orderRouter } = require('./routes/orders.js');
const { storeRoute } = require("./routes/storeRoute.js");
const { supplierRoute } = require("./routes/supplierRoute.js");
const userRoutes = require('./routes/userRoutes')
const dashboardRoutes = require('./routes/dashboard');
const reportsRoutes = require('./routes/reports');
const manageStoreRoute = require('./routes/manageStoreRoute');
const inventoryRoutes = require('./routes/inventory');
const app = express();
const PORT = process.env.PORT || 8080;

// CORS
app.use(cors({
    origin: 'http://localhost:5173' // Allow
}));

app.use(express.json());

// Connect to MongoDB
connectDB();
app.use('/api/orders', orderRouter);
app.use('/api/store', storeRoute);
app.use('/api/supplier', supplierRoute);
app.use('/api/users', userRoutes)
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/manage-store', manageStoreRoute);
app.use('/api/inventory', inventoryRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});