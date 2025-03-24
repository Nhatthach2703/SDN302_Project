const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authorizeRole = require('../middleware/auth').authorizeRole;

// Định nghĩa các route CRUD
router.get('/admin', authorizeRole('admin'), categoryController.getAllCategories);
router.get('/create/admin', authorizeRole('admin'), categoryController.getAddCategory);
router.post('/create/admin', authorizeRole('admin'), categoryController.postAddCategory);
router.get('/:id/admin', authorizeRole('admin'), categoryController.getCategoryById);
router.get('/edit/:id/admin', authorizeRole('admin'), categoryController.getEditCategory);
router.put('/edit/:id/admin', authorizeRole('admin'), categoryController.editCategory);
router.delete('/:id/admin', authorizeRole('admin'), categoryController.deleteCategory);

module.exports = router;
