const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const {protect} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/wishlist/:productId', protect, wishlistController.addProductToWishlist);

router.delete('/wishlist/:productId', protect, wishlistController.removeProductFromWishlist);

router.get('/wishlist', protect, wishlistController.getUserWishlist);

router.delete('/wishlist', protect, wishlistController.clearUserWishlist);

module.exports = router;
