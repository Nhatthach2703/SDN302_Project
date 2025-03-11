const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
var mongoose = require('mongoose');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name');
        res.render('products/listadmin', { products });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Render the add product page
exports.getAddProductPage = async (req, res) => {
    try {
        const categories = await Category.find(); // Get category list
        res.render('products/addadmin', { categories }); // Render EJS page
    } catch (error) {
        console.error("Error loading add product page:", error);
        res.status(500).send("Error loading add product page");
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, category, type, price, stock, image, description, petDetails } = req.body;
        const existingCategory = await Category.findById(category);
        if (!existingCategory) return res.status(400).send('Invalid category');

        const newProduct = new Product({ name, category, type, price, stock, image, description, petDetails });
        await newProduct.save();

        res.redirect('/products'); // Redirect to product list
    } catch (error) {
        res.status(500).send('Server error while adding product');
    }
};

// Render the edit product page
exports.getEditProductPage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).render("products/editadmin", { error: "Invalid product ID", product: null, categories: [] });
        }

        const product = await Product.findById(id).populate("category", "name");

        if (!product) {
            return res.status(404).render("products/editadmin", { error: "Product not found", product: null, categories: [] });
        }

        const categories = await Category.find();
        res.render("products/editadmin", { product, categories, error: null }); // Pass error = null to avoid issues
    } catch (error) {
        console.error("Error retrieving product:", error);
        res.status(500).render("products/editadmin", { error: "Server error", product: null, categories: [] });
    }
};

// Update product information
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).render("products/editadmin", {
                error: "Invalid product ID",
                product: null,
                categories: await Category.find(), // Load product categories
            });
        }

        // Extract data from request
        const { name, category, type, price, stock, image, description, petDetails } = req.body;

        // Validate required fields
        if (!name || !category || !price || !stock) {
            return res.status(400).render("products/editadmin", {
                error: "Please fill in all required product details",
                product: { _id: id, name, category, type, price, stock, image, description, petDetails },
                categories: await Category.find(),
            });
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, category, type, price, stock, image, description, petDetails, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        // Check if product exists
        if (!updatedProduct) {
            return res.status(404).render("products/editadmin", {
                error: "Product not found",
                product: null,
                categories: await Category.find(),
            });
        }

        // Redirect to product list after successful update
        res.redirect("/products");

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).render("products/editadmin", {
            error: "Server error, please try again!",
            product: null,
            categories: await Category.find(),
        });
    }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.redirect('/products');
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
