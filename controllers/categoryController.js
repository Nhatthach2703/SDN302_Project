const Category = require('../models/categoryModel');

// Lấy tất cả categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    console.log("Fetched categories:", categories);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Lấy một category theo ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Invalid ID format", error: error.message });
  }
};

// Tạo mới một category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Kiểm tra nếu name không tồn tại
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const newCategory = new Category({ name });
    await newCategory.save();
    
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: "Invalid input data", error: error.message });
  }
};

// Cập nhật category theo ID
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id, 
      { name, updatedAt: Date.now() }, 
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: "Invalid update data", error: error.message });
  }
};

// Xóa category theo ID
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: "Invalid ID format", error: error.message });
  }
};
