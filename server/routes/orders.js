// routes/orders.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getOrders);
router.get('/user', orderController.getOrdersByUserId); // Новый маршрут
router.post('/', orderController.addOrder);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
