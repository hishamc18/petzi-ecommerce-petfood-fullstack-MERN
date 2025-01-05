

const express = require('express');
const { createOrder, getUserOrders, cancelOrder, verifyPayment, getUserOrderById } = require('../controllers/orderController');
const router = express.Router();
const { protect, isAdmin} = require('../middlewares/authMiddleware'); // Middleware to protect routes

// Create a new order
router.post('/order/create', protect, createOrder);

router.post('/verify-payment', verifyPayment);

// Get all orders for the user (paginated)
router.get('/orders', protect, getUserOrders);

// Cancel an order
router.put('/orders/:orderId/cancel', protect, cancelOrder);

router.get('/orders/:userId', protect, isAdmin, getUserOrderById)

module.exports = router;
