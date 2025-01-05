const asyncHandler = require('../middlewares/asyncHandler');
const orderService = require('../services/orderService');
const CustomError = require('../utils/customError');

// Create Order
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  const userId = req.user._id;
  
  const { order, razorpayOrderId } = await orderService.createOrder(userId, shippingAddress, paymentMethod);
  res.status(201).json({
    message: 'Order created successfully',
    order,
    razorpayOrderId,
  });
});



// Verify Payment 
const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId, orderId } = req.body;
  try {
    const isPaymentVerified = await orderService.verifyPayment(paymentId, orderId);

    if (isPaymentVerified) {
      res.status(200).json({
        message: 'Payment verified successfully',
      });
    } else {
      throw new CustomError('Payment verification failed', 400);
    }
  } catch (error) {
    console.error('Error in payment verification endpoint:', error); 
    res.status(error.status || 500).json({
      message: error.message || 'Something went wrong during payment verification.',
    });
  }
});


// Get User Orders
const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id; 
  const { page, limit } = req.query;

  const orders = await orderService.getUserOrders(userId, page, limit);

  res.status(200).json({
    orders,
  });
});

// Cancel Order
const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const cancelledOrder = await orderService.cancelOrder(orderId);
  res.status(200).json({
    message: 'Order cancelled successfully',
    cancelledOrder,
  });
});


const getUserOrderById = asyncHandler(async (req,res) => {
      const { userId } = req.params;
      const { order } = await orderService.getOrderDetailsOfUser(userId);
      res.status(200).json({ order });
})

module.exports = {
  createOrder,
  getUserOrders,
  cancelOrder,
  verifyPayment,
  getUserOrderById
};