const Product = require('../models/productModel'); // Đảm bảo import model Product

exports.getAllProducts = async (req, res) => {
  try {
    // Fetch all products and populate the 'category' field with the 'name'
    const products = await Product.find().populate("category", "name");

    // Group products by category name
    const dogs = products.filter(p => p.category.name === "Dog");
    const cats = products.filter(p => p.category.name === "Cat");
    const accessories = products.filter(p => p.category.name === "Accessory");

    // Render the home page with categorized products and user
    res.render("pages/home", { 
      dogs, 
      cats, 
      accessories, 
      user: req.user || null // Truyền user vào view
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};