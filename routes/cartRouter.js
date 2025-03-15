const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Định nghĩa các route
router.get('/:userId', cartController.getCart);
router.post('/add', cartController.addToCart);
router.patch('/update', cartController.updateCartItem);
router.delete('/remove', cartController.removeCartItem);
router.delete('/clear', cartController.clearCart);

module.exports = router;
