const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
var mongoose = require('mongoose');

exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.find().populate('category', 'name');
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error });
    }
  };
  
  // Lấy một sản phẩm theo ID
  exports.getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate('category', 'name');
      if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error });
    }
  };
  
  // Tạo sản phẩm mới
  exports.createProduct = async (req, res) => {
    try {
      const { name, category, type, price, stock, image, description, petDetails } = req.body;
      const existingCategory = await Category.findById(category);
      if (!existingCategory) return res.status(400).json({ message: 'Danh mục không hợp lệ' });
  
      const newProduct = new Product({ name, category, type, price, stock, image, description, petDetails });
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error });
    }
  };
  
  // Cập nhật sản phẩm theo ID
  exports.updateProduct = async (req, res) => {
    try {
      const { name, category, type, price, stock, image, description, petDetails } = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { name, category, type, price, stock, image, description, petDetails, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!updatedProduct) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error });
    }
  };
  
  // Xóa sản phẩm theo ID
  exports.deleteProduct = async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      res.status(200).json({ message: 'Sản phẩm đã bị xóa' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error });
    }
  };