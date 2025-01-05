const asyncHandler = require('../middlewares/asyncHandler');
const cartService = require('../services/cartService');

//add product
const addProductToCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await cartService.addToCart(userId, productId);
    res.status(200).json({ message: 'Product added to cart', cart });
});

//get full cart
const getCartDetails = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const { cart, totalPrice } = await cartService.getCartDetails(userId, page, limit);
    return res.status(200).json({ cart, totalPrice });
  });
  

// delete individual product
const deleteFromCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
  
    const updatedCart = await cartService.deleteFromCart(userId, productId);
    res.status(200).json({ message: 'Product removed from the cart'});
  });
  
//increasing product qty
const increaseCartQuantity = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await cartService.increaseQuantity(userId, productId);
    res.status(200).json({ message: 'Product quantity increased', cart });
});

//decreasing product qty
const decreaseCartQuantity = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await cartService.decreaseQuantity(userId, productId);
    res.status(200).json({ message: 'Product quantity decreased', cart });
});

//clear full cart
const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const cart = await cartService.clearCart(userId);
    res.status(200).json({ message: 'Cart cleared', cart });
});


const getCartDetailsForUser = asyncHandler(async (req, res) => {
    const { userId } = req.params; // Get userId from params (admin should pass the userId)
    const { cart } = await cartService.getCartDetailsOfUser(userId);
    res.status(200).json({ cart });
});

module.exports = {
    addProductToCart,
    increaseCartQuantity,
    decreaseCartQuantity,
    getCartDetails,
    clearCart,
    deleteFromCart,
    getCartDetailsForUser
};
