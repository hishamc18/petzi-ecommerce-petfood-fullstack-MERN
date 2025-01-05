const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const {protect, isAdmin} = require('../middlewares/authMiddleware');

// Add product to cart
router.post('/cart/:productId', protect, cartController.addProductToCart);

// Get user's cart
router.get('/cart', protect, cartController.getCartDetails);


// Remove item from cart
router.delete('/cart/:productId', protect, cartController.deleteFromCart);

// Increase product quantity in cart
router.put('/cart/:productId/increase', protect, cartController.increaseCartQuantity);

// Decrease product quantity in cart
router.put('/cart/:productId/decrease', protect, cartController.decreaseCartQuantity);

// Clear the cart
router.delete('/cart', protect, cartController.clearCart);

router.get('/cart/:userId', protect, isAdmin, cartController.getCartDetailsForUser)

module.exports = router;

