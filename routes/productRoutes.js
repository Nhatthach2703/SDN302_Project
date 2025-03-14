const express = require('express');
const productController = require('../controllers/ProductController');
const router = express.Router();

router.post('/create/admin', productController.createProduct);
router.get('/create/admin', productController.getAddProductPage);
router.get('/admin', productController.getAllProducts);
router.get('/:id', productController.getProductDetail);
router.get('/edit/:id/admin', productController.getEditProductPage);
router.put('/edit/:id/admin', productController.updateProduct);
router.delete('/:id/admin', productController.deleteProduct);
router.get('/search', productController.searchProducts); // API tìm kiếm
router.get('/suggestion', productController.suggestProducts); // API gợi ý
router.get('/search-page', productController.getSearchPage); // Trang tìm kiếm
router.get('/', productController.getProductsByCategory);
// router.get('/detail/:id', productController.getProductById);
module.exports = router;
