require('dotenv').config();
<<<<<<< HEAD

=======
>>>>>>> c940ee0e (final updated code)
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
<<<<<<< HEAD
const { orderRouter } = require('./routes/orders.js');
const { supplierRoute } = require("./routes/supplierRoute.js");
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboard');
=======

const { orderRouter } = require('./routes/orders.js');
const { supplierRoute } = require("./routes/supplierRoute.js");
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboard'); // see below
>>>>>>> c940ee0e (final updated code)
const reportsRoutes = require('./routes/reports');
const manageStoreRoute = require('./routes/manageStoreRoute');
const inventoryRoutes = require('./routes/inventory');
const searchRoutes = require('./routes/searchRoute');
const billingRoutes = require('./routes/billing');    // Razorpay-related routes
const invoiceRoutes = require('./routes/invoiceRoutes'); // Our new invoice routes
<<<<<<< HEAD
const salesRoutes = require('./routes/salesRoutes');
=======
const storeRoute = require('./routes/storeRoute');
const stockRoute = require('./routes/stockRoute');
>>>>>>> c940ee0e (final updated code)

const app = express();
const PORT = process.env.PORT || 8080;

<<<<<<< HEAD
// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();
// Routes
=======
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
>>>>>>> c940ee0e (final updated code)
app.use('/api/search', searchRoutes);
app.use('/api/orders', orderRouter);
app.use('/api/supplier', supplierRoute);
app.use('/api/users', userRoutes);
<<<<<<< HEAD
app.use('/api/dashboard', dashboardRoutes);
=======
app.use('/api/dashboard', dashboardRoutes);  // <== MAKE SURE
>>>>>>> c940ee0e (final updated code)
app.use('/api/reports', reportsRoutes);
app.use('/api/manage-store', manageStoreRoute);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/billing', billingRoutes);      // Razorpay-related routes
<<<<<<< HEAD
app.use('/api/invoices', invoiceRoutes);    
app.use('/api/sales', salesRoutes);
 // Invoice generation + retrieval routes

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
=======
app.use('/api/invoices', invoiceRoutes);     // Invoice generation + retrieval routes
app.use('/api/stores', storeRoute);
app.use('/api/stock', stockRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
>>>>>>> c940ee0e (final updated code)
