const express = require('express');
const productController = require('../controllers/ProductController');
const router = express.Router();
const authorizeRole = require('../middleware/auth').authorizeRole;

router.get('/search', productController.searchProducts); // API tìm kiếm
router.get('/suggestion', productController.suggestProducts); // API gợi ý
router.get('/search-page/:id', productController.getSearchPage); // Trang tìm kiếm
router.get('/', productController.getProductsByCategory);
router.post('/create/admin', authorizeRole('admin'), productController.createProduct);
router.get('/create/admin', authorizeRole('admin'), productController.getAddProductPage);
router.get('/admin', authorizeRole('admin'), productController.getAllProducts);
router.get('/get/:id', productController.getProductDetail);
router.get('/edit/:id/admin', authorizeRole('admin'), productController.getEditProductPage);
router.put('/edit/:id/admin', authorizeRole('admin'), productController.updateProduct);
router.delete('/:id/admin', authorizeRole('admin'), productController.deleteProduct);
//
//
//
// router.get('/detail/:id', productController.getProductById);
module.exports = router;
