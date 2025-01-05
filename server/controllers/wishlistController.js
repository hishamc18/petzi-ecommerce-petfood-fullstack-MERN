
const wishlistService = require('../services/wishlistService');
const asyncHandler = require('../middlewares/asyncHandler');

// Add product
const addProductToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const wishlist = await wishlistService.addToWishlist(userId, productId);
  res.status(200).json({
    message: 'Product added to wishlist',
    wishlist,
  });
});

// delete product
const removeProductFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;  

  const wishlist = await wishlistService.removeFromWishlist(userId, productId);
  res.status(200).json({
    message: 'Product removed from wishlist',
    wishlist,
  });
});

// Get full wishlist of user
const getUserWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const wishlist = await wishlistService.getWishlist(userId);
  res.status(200).json({
    message: 'Wishlist fetched successfully',
    wishlist,
  });
});

// Clear the full wishlist
const clearUserWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const wishlist = await wishlistService.clearWishlist(userId);
  res.status(200).json({
    message: 'Wishlist cleared successfully',
    wishlist,
  });
});

module.exports = {
  addProductToWishlist,
  removeProductFromWishlist,
  getUserWishlist,
  clearUserWishlist,
};