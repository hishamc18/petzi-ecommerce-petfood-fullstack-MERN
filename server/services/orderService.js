const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const CustomError = require('../utils/customError');
const razorpayInstance = require('../config/razorpay');

// Create Order
const createOrder = async (userId, shippingAddress, paymentMethod) => {
  // Fetch and validate cart
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    throw new CustomError('Your cart is empty.', 400);
  }

  let totalAmount = 0;
  const orderItems = [];

  // Prepare order items and validate stock
  for (const cartItem of cart.items) {
    const product = cartItem.productId;
    if (!product) throw new CustomError('Product not found.', 404);

    if (product.stock < cartItem.quantity || product.isDeleted) {
      throw new CustomError(`Insufficient stock or deleted product: ${product.name}`, 400);
    }

    let securedPackagingFee = 39
    totalAmount += product.price * cartItem.quantity + securedPackagingFee;
    orderItems.push({ productId: product._id, quantity: cartItem.quantity });

    // Reduce stock
    product.stock -= cartItem.quantity;
    await product.save();
  }

  // Create the order in the database
  const order = await new Order({
    userId,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount,
    status: paymentMethod === 'razorpay' ? 'pending' : 'placed',
  }).save();
  cart.items = [];
  await cart.save();

  // Handle Razorpay payment if selected
  if (paymentMethod === 'razorpay') {
    const options = {
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `order_receipt_${order._id}`,
      payment_capture: 1,
    };

    // Create order with Razorpay
    try {
      const razorpayOrder = await razorpayInstance.orders.create(options);
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      return { order, razorpayOrderId: razorpayOrder.id };
    } catch (error) {
      throw new CustomError('Razorpay order creation failed', 500);
    }
  }
  return { order };
};




// Verify Payment
const verifyPayment = async (paymentId, razorpayOrderId) => {
  const order = await Order.findOne({ razorpayOrderId }).populate('items.productId');
  if (!order || order.razorpayOrderId !== razorpayOrderId) {
    throw new CustomError('Order not found or invalid order ID', 400);
  }

  try {
    // Fetch payment details from Razorpay
    const paymentDetails = await razorpayInstance.payments.fetch(paymentId);

    if (paymentDetails.status === 'captured') {
      order.razorpayPaymentStatus = 'paid';
      order.status = 'placed';
      await order.save();


      return true;
    } else {
      throw new CustomError('Payment verification failed', 400);
    }
  } catch (error) {
    console.error('Error during payment verification:', error);
    throw new CustomError('Payment verification failed', 500);
  }
};

// Get All Orders for User (with pagination)
const getUserOrders = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const orders = await Order.find({ userId }).sort({ createdAt: -1 })
    .populate('items.productId')
    .skip(skip)
    .limit(limit);

  if (!orders.length) throw new CustomError('No orders found for this user', 404);

  return orders;
};

// Cancel an Order
const cancelOrder = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new CustomError('Order not found', 404);
  }
  order.status = 'cancelled';
  order.razorpayPaymentStatus = 'refunded'
  await order.save();
  return order;
};

const getOrderDetailsOfUser = async (userId) => {
  const order = await Order.find({ userId: userId }).sort({ createdAt: -1 }).populate('items.productId');
  if (!order) throw new CustomError('Order not found', 404);
  return { order };
};

module.exports = {
  createOrder,
  getUserOrders,
  cancelOrder,
  verifyPayment,
  getOrderDetailsOfUser,
};




