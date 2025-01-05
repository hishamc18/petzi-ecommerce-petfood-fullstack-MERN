const { number } = require('joi');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phoneNumber: {type: Number, required: true}
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      set: v => Math.round(v)
    },
    expectedDeliveryDate: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 
      },
    },
    paymentDate: {
      type: Date,
    },
    status: { type: String, enum: ['placed', 'shipped', 'delivered', 'pending', 'cancelled'] },
    razorpayOrderId: {
      type: String, // Store the Razorpay order ID here
    },
    razorpayPaymentId: {
      type: String, // Store the Razorpay payment ID here
    },
    razorpayPaymentStatus: {
      type: String, // Store the Razorpay payment status (paid/failed) here
      enum: ['paid', 'failed', 'pending', 'captured', 'refunded'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
