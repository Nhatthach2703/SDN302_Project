const express = require('express');
const productController = require('../controllers/ProductController');
const router = express.Router();
router.post('/create', productController.createProduct);
router.get('/create', productController.getAddProductPage);
router.get('/', productController.getAllProducts);
router.get('/edit/:id', productController.getEditProductPage);
router.put('/edit/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
