import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers, fetchUserByID, blockAndUnblockUser } from "../../features/authSlice";
import { fetchCartDetailsUser } from "../../features/cartSlice"; 
import { fetchUserOrdersById } from "../../features/orderSlice";
import UserDetailsModal from "./UserDetailsModal";
import { toast, ToastContainer, Slide } from "react-toastify";

const UserDetails = () => {
    const dispatch = useDispatch();
    
    // Get users and selectedUser from Redux store
    const { users, user, totalUsers } = useSelector((state) => state.auth);
    const { cartUser } = useSelector((state) => state.cart);
    const { userOrder } = useSelector((state) => state.order)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [ page, setPage ] = useState(1)

    const [showConfirmation, setShowConfirmation] = useState(false);    
    
    // Fetch users when the component mounts
    useEffect(() => {
        dispatch(fetchAllUsers({ page, limit: 10 }));
    }, [dispatch, page]);

    // Function to handle block/unblock button click
    const handleBlockClick = () => {
        setShowConfirmation(true); 
    };

    const confirmBlock = (userId) => {
        dispatch(blockAndUnblockUser(userId))
        .then((response) => {            
            setShowConfirmation(false);
            setIsModalOpen(false)
            if (response.payload.isBlocked) {
                toast.error("Blocked Successfully");
            } else {
                toast.success("Unblocked Successfully");
            }
        })
    };

    const cancelBlock = () => {
        setShowConfirmation(false);
    };

    // Handle opening the modal and selecting the user
    const handleViewDetailsClick = (userId) => {        
        dispatch(fetchUserByID(userId));
        dispatch(fetchCartDetailsUser(userId)); 
        dispatch(fetchUserOrdersById(userId)); 
        setSelectedUser(userId);
        setIsModalOpen(true);
    };

    // Handle modal close
    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setShowConfirmation(false);
    };


        // Handle page navigation
        const handleNextPage = () => {
            if (page < Math.ceil(totalUsers / 10)) {
                setPage(page + 1);
            }
        };
    
        const handlePreviousPage = () => {
            if (page > 1) {
                setPage(page - 1);
            }
        };
    

    
    return (
        <div className="admin-user-details">
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Slide}
            />
            <div className="user-Tables">
                <div>
                    <h2>Unblocked Users</h2>
                    <div className="admin-user-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users?.filter(user => user.isBlocked === false).map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <button className="handleViewBtn" onClick={() => handleViewDetailsClick(user._id)}>
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination-controls paginationInAdminProducts">
                    <button onClick={handlePreviousPage} disabled={page === 1} className="pagination-btn">
                        Previous
                    </button>
                    <button onClick={handleNextPage} disabled={page === Math.ceil(totalUsers / 10)} className="pagination-btn">
                        Next
                    </button>
                </div>
                    </div>
                </div>

                {/* Blocked Users */}
                <div>
                    <h2>Blocked Users</h2>
                    {users?.filter(user => user.isBlocked).length > 0 && (
                        <div className="admin-user-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users?.filter(user => user.isBlocked).map((user) => (
                                        <tr key={user._id}>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <button className="handleViewBtn" onClick={() => handleViewDetailsClick(user._id)}>
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && selectedUser && user && userOrder && (
                <UserDetailsModal onClose={handleModalClose}>
                    <div className="admin-modal-content">
                        <div className="userDetailsInModal">
                            <div className="userDetailsData">
                                <p><strong>Name:</strong> {user?.username}</p>
                                <p><strong>ID:</strong> {user?._id}</p>
                                <p><strong>Email:</strong> {user?.email}</p>
                                <p><strong>Account Created Date:</strong> {user?.createdAt?.slice(0,10)}</p>
                            </div>

                            <div className="adminBlockBtnDiv">
                                <button className="adminBlockBtn" onClick={handleBlockClick}>
                                    {user.isBlocked ? "Unblock" : "Block"}
                                </button>

                                {showConfirmation && (
                                    <div className="confirmation-box">
                                        <button className="yes-btn" onClick={() =>confirmBlock(user?._id)}>Yes</button>
                                        <button className="no-btn" onClick={cancelBlock}>No</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="wrapTablesInUserDetails">
                            <div>
                                <h4>Cart Details</h4>
                                <table className="admin-cart-details">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartUser && cartUser?.length > 0 ? (
                                            cartUser?.map((item) => (
                                                <tr key={item.productId?._id}>
                                                    <td>{item.productId?.name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>₹{item.productId?.price}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3">No items in cart</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <h4>Order Details</h4>
                                <table className="admin-order-details">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Total Amount</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userOrder && userOrder?.length > 0 ? (
                                            userOrder?.map((order) => (
                                                <tr key={order._id}>
                                                    <td>{order._id}</td>
                                                    <td>₹{order.totalAmount}</td>
                                                    <td>{order.status}</td>
                                                    <td>{order?.createdAt?.slice(0, 10)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3">No orders placed</td>
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

export default UserDetails;
