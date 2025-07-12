require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB Atlas!');
})
.catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
})

app.use(express.json());

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String
})

const Product = mongoose.model('Product', productSchema);

// Create a new product (POST /products)
app.post('/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch(err) {
        res.status(400).json({ message: err.message })
    }
})

// Get all products (GET /products)
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

// Get a single product by ID (GET /products/:id)
app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

// Update a product by ID (PATCH /products/:id)
app.patch('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch(err) {
        res.status(400).json({ message: err.message })
    }
})

// Delete a product by ID (DELETE /products/:id)
app.delete('/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});