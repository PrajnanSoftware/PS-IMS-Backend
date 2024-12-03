const express = require('express');
const mongoose = require('mongoose');
const { productRouter } = require('./routes/products')
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

//CORS
app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173' // Allow
}));

app.use(express.json());

// MongoDB
mongoose.connect('mongodb+srv://raghavendravenkatesh1:Prajnan@cluster0.fywx6.mongodb.net/products')
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error(err));

app.use('/v1/products', productRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});