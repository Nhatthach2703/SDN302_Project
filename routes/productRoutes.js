const express = require('express');
const productController = require('../controllers/ProductController');
const router = express.Router();
router.post('/create', productController.createProduct);
router.get('/create', productController.getAddProductPage);
router.get('/', productController.getAllProducts);
router.get('/edit/:id', productController.getEditProductPage);
router.put('/edit/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/search', productController.searchProducts); // API tìm kiếm
router.get('/suggestion', productController.suggestProducts); // API gợi ý
router.get('/search-page', productController.getSearchPage); // Trang tìm kiếm

module.exports = router;
