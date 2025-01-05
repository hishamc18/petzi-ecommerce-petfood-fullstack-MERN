import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders, cancelOrder } from "../../features/orderSlice";
import ConfirmCancelModal from "../HomePage/ConfirmCancelModal";

const Orders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { orders, loading } = useSelector((state) => state.order);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);

    useEffect(() => {
        dispatch(fetchUserOrders());
    }, [dispatch]);

    const handleCancelOrder = (orderId) => {
        setOrderToCancel(orderId);
        setIsModalOpen(true);
    };

    const handleConfirmCancel = () => {
        if (orderToCancel) {
            dispatch(cancelOrder(orderToCancel))
                .then((response) => {
                    dispatch(fetchUserOrders());
                    toast.success("Order cancelled successfully!");
                })
                .catch((error) => {
                    toast.error("Error cancelling order.");
                });
        }
        mation;
        setIsModalOpen(false);
    };

    const handleCancelModal = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return <span className="loader lodinInOrder">L &nbsp; ading</span>;
    }

    return (
        <div className="orders-container">
            <h2 className="orders-heading">Order History</h2>
            <button className="backButton" onClick={() => navigate("/")}>
                <i className="bx bx-home"></i>
            </button>
            {orders?.length === 0 ? (
                <p className="no-orders">No orders found.</p>
            ) : (
                <div className={`orders-list ${orders.length > 6 ? "scrollable" : ""}`}>
                    {orders.map((order) => (
                        <div className="order-card" key={order?._id}>
                            <h3 className="order-id">Order ID: #{order?._id}</h3>
                            <p className="orderDate">Order Date: {order?.createdAt.slice(0, 10)}</p>
                            <div className="shipping-details">
                                <h4>Shipping Details:</h4>
                                <p>
                                    <strong>Full Name:</strong> {order?.shippingAddress?.fullName}
                                </p>
                                <p>
                                    <strong>Address:</strong> {order?.shippingAddress?.streetAddress},{" "}
                                    {order?.shippingAddress?.city}, {order?.shippingAddress?.state} -{" "}
                                    {order?.shippingAddress?.postalCode}
                                </p>
                                <p>
                                    <strong>Phone:</strong> {order?.shippingAddress?.phoneNumber}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>Order Status:</strong> {order?.status}
                                </p>
                                <p>
                                    <strong>Payment Status:</strong> {order.razorpayPaymentStatus}
                                </p>
                            </div>
                            <div className="ordered-items">
                                <h4>Items:</h4>
                                <div className="itemsList">
                                    <ul>
                                        {order?.items?.map((item, i) => (
                                            <div className="wrapReviewandList" key={i}>
                                                <li>
                                                    <strong>{item?.productId?.name}</strong> - ₹{item?.productId?.price} x{" "}
                                                    {item?.quantity}
                                                </li>
                                            </div>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="total-amount">
                                <h4>Total Amount:</h4>
                                <p>₹{Math.floor(order?.totalAmount)}</p>
                            </div>
                            <button
                                className="cancel-order"
                                onClick={() => handleCancelOrder(order?._id)}
                                disabled={["shipped", "cancelled", "delivered"].includes(order?.status)}
                            >
                                Cancel Order
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && <ConfirmCancelModal onConfirm={handleConfirmCancel} onCancel={handleCancelModal} />}
        </div>
    );
};

export default Orders;
