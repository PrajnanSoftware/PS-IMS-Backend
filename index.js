require('dotenv').config()
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { productRouter } = require('./routes/products');
const { storeRoute }  = require( "./routes/storeRoute.js");
const { supplierRoute }  = require( "./routes/supplierRoute.js");
const userRoutes = require('./routes/userRoutes')
const customerRoutes = require('./routes/customerRoutes')
const dashboardRoutes = require('./routes/dashboard');
const reportsRoutes = require('./routes/reports');
const manageStoreRoute = require('./routes/manageStoreRoute');

const app = express();
const PORT = process.env.PORT || 8080; 

// CORS
app.use(cors({
    origin: 'http://localhost:5173' // Allow
}));

app.use(express.json());

// Connect to MongoDB
connectDB();

app.use('/v1/products', productRouter);
app.use('/api/store',storeRoute);
app.use('/api/supplier',supplierRoute);
app.use('/api/users',userRoutes)
app.use('/api', customerRoutes)
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/manage-store', manageStoreRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});