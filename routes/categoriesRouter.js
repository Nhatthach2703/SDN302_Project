const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Định nghĩa các route CRUD
router.get('/', categoryController.getAllCategories);
router.get('/create', categoryController.getAddCategory);
router.post('/create', categoryController.postAddCategory);
router.get('/:id', categoryController.getCategoryById);
router.get('/edit/:id', categoryController.getEditCategory);
router.put('/edit/:id', categoryController.editCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
