const { mongoose } = require('mongoose');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const CustomError = require('../utils/customError');

//add product
const addToCart = async (userId, productId) => {
  const product = await Product.findById(productId);
  if (!product) throw new CustomError('Product not found', 404);

  if (product.stock <= 0) throw new CustomError('Product is out of stock', 400);

  let cart = await Cart.findOne({ userId: userId });
  if (!cart) {
    cart = new Cart({ userId: userId, items: [] });
  }

  const existingItem = cart.items.find((item) => item.productId.toString() === productId);

  if (existingItem) {
    if (existingItem.quantity + 1 > product.stock) {
      throw new CustomError('Not enough stock available', 400);
    }

    existingItem.quantity += 1;
  } else {
    cart.items.push({ productId, quantity: 1 });
  }

  await cart.save();
  return cart;
};

// Get cart details
const getCartDetails = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const cart = await Cart.findOne({ userId: userId })
    .populate('items.productId')
    .skip(skip)
    .limit(limit);
  
  if (!cart) throw new CustomError('Cart not found', 404);
  
  const totalPrice = cart.items.reduce((total, item) => {
    return total + item.productId.price * item.quantity;
  }, 0);

  cart.totalPrice = totalPrice;  // Update the cart's total price field

  await cart.save();  // Save updated cart total
  return { cart, totalPrice };
};




// Delete individual product from cart
const deleteFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new CustomError('Cart not found', 404);

  const existingItem = cart.items.find((item) => item.productId.toString() === productId);
  if (!existingItem) throw new CustomError('Product not found in cart', 404);

  cart.items.pull({ productId });
  await cart.save();
  return cart;
};


// Increase product qty
const increaseQuantity = async (userId, productId) => {
  const cart = await Cart.findOne({ userId: userId });
  if (!cart) throw new CustomError('Cart not found', 404);

  const item = cart.items.find((item) => item.productId.toString() === productId);
  if (!item) throw new CustomError('Product not found in cart', 404);

  const product = await Product.findById(productId);
  if (!product) throw new CustomError('Product not found', 404);

  if (item.quantity + 1 > product.stock) {
    throw new CustomError('Not enough stock available', 400);
  }

  item.quantity += 1;
  await cart.save();

  return cart;
};


// Decrease product quantity
const decreaseQuantity = async (userId, productId) => {
  const cart = await Cart.findOne({ userId: userId });
  if (!cart) throw new CustomError('Cart not found', 404);

  const item = cart.items.find((item) => item.productId.toString() === productId);
  if (!item) throw new CustomError('Product not found in cart', 404);

  const product = await Product.findById(productId);
  if (!product) throw new CustomError('Product not found', 404);

  if (item.quantity === 1) {
    await Cart.updateOne(
      { userId: userId },
      { $pull: { items: { productId: new mongoose.Types.ObjectId(productId) } } }
    );
  } else {
    if (item.quantity > product.stock) {
      throw new CustomError('Not enough stock available', 400);
    }
    item.quantity -= 1;
    await cart.save();
  }
  return cart;
};


// Clear cart
const clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId: userId })
  if (!cart) throw new CustomError('Cart not found', 404);

  cart.items = [];
  await cart.save();
  return cart;
};



const getCartDetailsOfUser = async (userId) => {
  const cart = await Cart.findOne({ userId: userId }).populate('items.productId');
  if (!cart) throw new CustomError('Cart not found', 404);
  return { cart };
};

module.exports = { addToCart, increaseQuantity, decreaseQuantity, getCartDetails, clearCart, deleteFromCart, getCartDetailsOfUser };
