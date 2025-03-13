const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Định nghĩa các route CRUD
router.get('/admin', categoryController.getAllCategories);
router.get('/create/admin', categoryController.getAddCategory);
router.post('/create/admin', categoryController.postAddCategory);
router.get('/:id/admin', categoryController.getCategoryById);
router.get('/edit/:id/admin', categoryController.getEditCategory);
router.put('/edit/:id/admin', categoryController.editCategory);
router.delete('/:id/admin', categoryController.deleteCategory);

module.exports = router;
