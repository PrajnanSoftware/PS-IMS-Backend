const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { productRouter } = require('./routes/products');

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});