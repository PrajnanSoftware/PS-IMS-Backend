require('dotenv').config();
console.log('Cloudinary ENV:', {
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
});

require('./config/cloudinaryConfig.js');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const { orderRouter } = require('./routes/orders.js');
const { supplierRoute } = require("./routes/supplierRoute.js");
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboard'); // see below
const reportsRoutes = require('./routes/reports');
const manageStoreRoute = require('./routes/manageStoreRoute');
const inventoryRoutes = require('./routes/inventory');
const searchRoutes = require('./routes/searchRoute');
const billingRoutes = require('./routes/billing');
const storeRoute = require('./routes/storeRoute');
const stockRoute = require('./routes/stockRoute');

const app = express();
const PORT = process.env.PORT || 8080;

// 1) CORS config
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true
}));

// 2) JSON + Body Parser
app.use(express.json());
app.use(bodyParser.json());

// 3) Connect to MongoDB
connectDB();

// 4) Routes
app.use('/api/search', searchRoutes);
app.use('/api/orders', orderRouter);
app.use('/api/supplier', supplierRoute);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);  // <== MAKE SURE
app.use('/api/reports', reportsRoutes);
app.use('/api/manage-store', manageStoreRoute);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/stores', storeRoute);
app.use('/api/stock', stockRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
