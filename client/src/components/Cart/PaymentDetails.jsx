import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder, verifyPayment } from "../../features/orderSlice";
import { useNavigate } from "react-router-dom";
import { fetchCartDetails } from "../../features/cartSlice"; 
import "./cartStyle.css";
import { toast, ToastContainer, Slide } from "react-toastify";

const PaymentDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [shippingDetails, setShippingDetails] = useState({
        fullName: "",
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        phoneNumber: "",
        country: "INDIA",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [paymentError, setPaymentError] = useState(null);

    // Fetch cart state from Redux store
    const { cart, loading } = useSelector((state) => state.cart);

    useEffect(() => {
        if (!cart || cart.items?.length === 0) {
            dispatch(fetchCartDetails())
                .unwrap()
        }
    }, [dispatch, cart]);

    const securedPackagingFee = 39;
    const finalAmount = cart?.totalPrice + securedPackagingFee;

    // Validate shipping details
    const validateForm = () => {
        let formErrors = {};
        Object.keys(shippingDetails).forEach((key) => {
            if (!shippingDetails[key]) {
                formErrors[key] = `Please enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`;
            }
        });
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };


    //submission handling
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            const orderData = {
                shippingAddress: {
                    address: `${shippingDetails.streetAddress}, ${shippingDetails.city}, ${shippingDetails.state}, ${shippingDetails.postalCode}`,
                    phoneNumber: shippingDetails.phoneNumber,
                    country: shippingDetails.country,
                    fullName: shippingDetails.fullName,
                    city: shippingDetails.city,
                    postalCode: shippingDetails.postalCode,
                },
                orderedItems: cart?.items || [],
                totalAmount: finalAmount,
                paymentMethod: "razorpay",
            };

            dispatch(placeOrder(orderData))
                .unwrap()
                .then((response) => {
                    if (response.razorpayOrderId) {
                        openRazorpayPayment(response.razorpayOrderId, finalAmount);
                    }
                })
                .catch((error) => {
                    toast.error('Stock not available')
                    setIsSubmitting(false);
                });
        }
    };

    // Handle Razorpay payment
    const openRazorpayPayment = (razorpayOrderId, amount) => {
        const options = {
            key: import.meta.env.RAZORPAY_KEY_ID,
            amount: amount,
            currency: "INR",
            name: "Petzi Pet Food",
            description: "Product Payment",
            order_id: razorpayOrderId,
            handler: function (response) {
                const paymentData = {
                    paymentId: response.razorpay_payment_id,
                    orderId: razorpayOrderId,
                };
                dispatch(verifyPayment(paymentData))
                    .unwrap()
                    .then(() => {
                        navigate("/");
                    })
                    .catch((error) => {
                        console.error("Payment verification failed:", error);
                        toast.error(error.message);
                        setPaymentError("Payment verification failed, please try again.");
                        setIsSubmitting(false);
                    });
            },
            prefill: {
                name: shippingDetails.fullName,
                contact: shippingDetails.phoneNumber,
            },
            theme: {
                color: "#F37254",
            },
            method: {
                card: true,
                upi: true,
                netbanking: true,
                wallet: true,
                app: false,
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };

    // Handle input change for shipping details
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails({
            ...shippingDetails,
            [name]: value,
        });
    };

    if (loading) {
        return <span class="loader">L &nbsp; ading</span>
        
    }
 
    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={320}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                pauseOnHover
                transition={Slide}
                limit={1}
            />
            <div className="price-details">
                <h2>Price Details</h2>
                <div className="price-item">
                    <span>Price ({cart?.items?.length} items)</span>
                    <span>₹{Math.floor(cart?.totalPrice)}</span>
                </div>
                <div className="price-item">
                    <span>Delivery Charges</span>
                    <h4>Free</h4>
                </div>
                <div className="price-item">
                    <span>Secured Packaging Fee</span>
                    <span>₹{securedPackagingFee}</span>
                </div>
                <div className="price-item">
                    <span>Payment Method</span>
                    <span>Online (No COD)</span>
                </div>
                <hr />
                <div className="price-item total">
                    <span>Total Amount</span>
                    <span>₹{Math.floor(finalAmount)}</span>
                </div>
            </div>

            <div className="shippingDetails">
                <h2>Shipping Details</h2>
                <div className="address">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="fullName"
                            placeholder={errors.fullName || "Full Name"}
                            value={shippingDetails.fullName}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="streetAddress"
                            placeholder={errors.streetAddress || "Street Address"}
                            value={shippingDetails.streetAddress}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder={errors.city || "City"}
                            value={shippingDetails.city}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="statePin">
                            <input
                                type="text"
                                name="state"
                                placeholder={errors.state || "State"}
                                value={shippingDetails.state}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="postalCode"
                                placeholder={errors.postalCode || "Postal Code"}
                                value={shippingDetails.postalCode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder={errors.phoneNumber || "Phone Number"}
                            value={shippingDetails.phoneNumber}
                            onChange={handleInputChange}
                            required
                        />
                        <button className="proceed-btn" disabled={isSubmitting}>
                            {isSubmitting ? "Processing Payment..." : "Proceed To Payment"}
                        </button>
                        {paymentError && <div className="error-message">{paymentError}</div>}
                    </form>
                </div>
            </div>
        </>
    );
};

export default PaymentDetails;
