import React, { useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserWishlist, removeProductFromWishlist, clearUserWishlist } from "../../features/wishlistSlice";
import "react-toastify/dist/ReactToastify.css";
import { addProductToCart } from "../../features/cartSlice";
import { toast, ToastContainer, Slide } from "react-toastify";

const Wishlist = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { wishlist, loading } = useSelector((state) => state.wishlist);

    // Fetch user wishlist on component mount
    useEffect(() => {
        dispatch(getUserWishlist());
    }, [dispatch]);

    // Handle remove product from wishlist
    const handleRemoveFromWishlist = (productId) => {
        dispatch(removeProductFromWishlist(productId)).then(() => {
            dispatch(getUserWishlist());
        });
    };

    const handleAddToCart = (productId) => {
        dispatch(addProductToCart(productId))
            .then((response) => {
                if (response.meta?.rejectedWithValue) {
                    toast.error(response.payload);
                } else {
                    toast.success(response.payload.message);
                }
            })
            .catch((error) => {
                toast.error(error);
            });
    };

    // Handle clear wishlist
    const handleClearWishlist = () => {
        dispatch(clearUserWishlist()).then((response) => {
            toast.success(response.payload.message);
        });
    };

    return (
        <div className="wishlist-container">
            <ToastContainer
                position="top-center"
                autoClose={1300}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                draggable
                pauseOnHover
                transition={Slide}
                limit={1}
            />
            <div className="wishlist-header">
                <h2>Wishlist</h2>
                <div className="wishListBtnsWrap">
                    <button className="backButton homebtn" onClick={() => navigate("/")}>
                        <i className="bx bx-home"></i>
                    </button>
                    <button className="clear-btn" onClick={handleClearWishlist}>
                        Clear
                    </button>
                </div>
            </div>

            {loading ? (
                <span className="loader loadingInWishlist">L &nbsp; ading</span>
            ) : wishlist?.length === 0 ? (
                <p className="empty-wishlist">Your wishlist is empty.</p>
            ) : (
                <div className="wishlist-items">
                    {wishlist?.map((item) => (
                        <div className="wishlist-card" key={item.productId._id}>
                            <img className="wishlist-image" src={item.productId.image} alt={item.productId.name} />
                            <div className="wishlist-info">
                                <h3>{item.productId.name}</h3>
                                <p className="wishlist-price">₹{item.productId.price}</p>
                                <div className="cart-actions">
                                    <div onClick={() => handleRemoveFromWishlist(item.productId._id)} className="del">
                                        <div>
                                            <MdDeleteForever />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(item.productId._id)}
                                        className="addtoCartbtnInWishlist"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
