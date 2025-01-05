import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllOrders } from "../../features/orderSlice";
import { toast, ToastContainer, Slide } from "react-toastify";
import UserDetailsModal from "./UserDetailsModal";
import { toggleOrderStatus } from "../../features/orderSlice";


const HandleOrders = () => {
  const dispatch = useDispatch();

  // Get orders and pagination data from Redux store
  const { allOrders, totalOrders } = useSelector((state) => state.order);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchAllOrders({ page, limit: 10 }));
  }, [dispatch, page]);

  const handleViewDetailsClick = (orderId) => {
    const order = allOrders.find((order) => order._id === orderId);
    setSelectedOrder(order);
    setIsModalOpen(true); 
  };

  //toggle order status
const handleToggleStatusClick = (orderId) => {
    dispatch(toggleOrderStatus(orderId))
      .unwrap()
      .then((updatedOrder) => {
        setSelectedOrder((prevState) => {
          if (prevState._id === updatedOrder._id) {
            return { ...prevState, status: updatedOrder.status };
          }
          return prevState;
        });
      })
      .catch((error) => {
        toast.error(error)
      });
  };
  

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleNextPage = () => {
    if (page < Math.ceil(totalOrders / 10)) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  
  return (
    <div className="admin-handleOrder">
      <ToastContainer
        position="top-center"
        autoClose={300}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
        limit={1}
      />

      <div className="user-Table orders-table">
        <h2>All Orders</h2>
        <div className="admin-user-table admin-order-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total Amount</th>
                <th>Order Status</th>
                <th>Payment Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allOrders && allOrders.length > 0 ? (
                allOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>{order.status}</td>
                    <td>{order.razorpayPaymentStatus}</td>
                    <td>{order.createdAt.slice(0, 10)}</td>
                    <td>
                      <button className="handleViewBtn" onClick={() => handleViewDetailsClick(order._id)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No orders available</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination-controls">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={page === Math.ceil(totalOrders / 10)}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && selectedOrder && (
        <UserDetailsModal onClose={handleModalClose}>
          <div className="admin-modal-content">
            <div className="userDetailsInModal">
              <div className="userDetailsData">
                <p><strong>Name:</strong> {selectedOrder.userId.username}</p>
                <p><strong>ID:</strong> {selectedOrder.userId._id}</p>
                <p><strong>Email:</strong> {selectedOrder.userId.email}</p>
                <p><strong>Account Created Date:</strong> {selectedOrder.userId.createdAt.slice(0, 10)}</p>
              </div>

              <div className="adminBlockBtnDiv">
                <button onClick={() => {handleToggleStatusClick(selectedOrder._id)}} className="adminBlockBtn">
                {selectedOrder.status}
                </button>
              </div>
            </div>

            <div className="shippingAndOrderModal">
                <div>
                    <h4>Shipping Details</h4>
                    <p><strong>Address:</strong> {selectedOrder.shippingAddress.address}</p>
                    <p><strong>Phone:</strong> {selectedOrder.shippingAddress.phoneNumber}</p>
                  </div>
                  <div>
                    <h4>Order Details</h4>
                    <p><strong>Payment Status:</strong> {selectedOrder.razorpayPaymentStatus}</p>
                    <p><strong>Order Status:</strong> {selectedOrder.status}</p>
                  </div>
            </div>

            <div className="wrapTablesInUserDetails">


              <div>
                <h4>Product Details</h4>
                <table className="admin-cart-details">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item) => (
                        <tr key={item.productId._id}>
                          <td>{item.productId.name}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.productId.price}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">No products in this order</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </UserDetailsModal>
      )}
    </div>
  );
};

export default HandleOrders;
