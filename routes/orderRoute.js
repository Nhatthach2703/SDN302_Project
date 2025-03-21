const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authorizeRole } = require('../middleware/auth');

router.get('/admin', authorizeRole('admin'), orderController.viewAllOrders);
router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.post('/checkout', orderController.checkout)
router.get('/:id', orderController.getOrderById);
router.patch('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
