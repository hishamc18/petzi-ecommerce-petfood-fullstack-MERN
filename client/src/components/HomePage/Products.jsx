import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import ProductInfoModal from "./ProductInfoModal";
import { fetchProducts } from "../../features/productSlice";
import { addProductToCart } from "../../features/cartSlice";
import { addProductToWishlist, getUserWishlist } from "../../features/wishlistSlice";
import "./homeStyle.css";
import { toast, ToastContainer, Slide } from "react-toastify";

const Products = React.forwardRef((props, ref) => {
    const dispatch = useDispatch();
    const { products, loading, currentPage, hasMore, category } = useSelector((state) => state.products);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleAddToCartClick = (product) => {
        dispatch(addProductToCart(product._id))
            .then((response) => {
                if (response?.payload) {
                    toast.error(response.payload);
                }
                if (response?.payload?.message) {
                    toast.success(response?.payload?.message)
                }
            })
        if (!isAuthenticated) {
            toast.error("Please Login");
        }
    };

    const handleAddToWishlistClick = (product) => {
        dispatch(addProductToWishlist(product._id)).then((response) => {
            if (response.payload.wishlist?.message) {
                toast.info(response.payload.wishlist?.message);
            } else {
                toast.success("Added to wishlist, available under profile");
            }
            dispatch(getUserWishlist());
        });
    };

    const handleImageClick = (product) => {
        setSelectedProduct(product);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    useEffect(() => {
        if (!loading && hasMore) {
            dispatch(fetchProducts({ page: currentPage, limit: 12, category }));
        }
    }, [dispatch, currentPage, hasMore]);

    const handlePrevious = () => {
        if (currentPage > 1) {
            dispatch(fetchProducts({ page: currentPage - 1, limit: 12, category }));
        }
    };

    const handleNext = () => {
        if (hasMore && !loading) {
            dispatch(fetchProducts({ page: currentPage + 1, limit: 12, category }));
        }
    };
    return (
        <div>
            <ToastContainer
                position="top-center"
                autoClose={350}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                draggable
                pauseOnHover
                transition={Slide}
                limit={1}
            />
            <div className="products-container" ref={ref}>
                {products.length === 0 && !loading && <p className="productError">No products found...😞</p>}
                {products.map((product) => (
                    <div className="card" key={product._id}>
                        <div className="wrapper">
                            <div className="card-image" onClick={() => handleImageClick(product)}>
                                <img src={product.image} alt={product.name} />
                            </div>
                            <div className="content">
                                <p className="title">{product.name}</p>
                                <div className="prices">
                                    <p className="title price">₹{product.price}</p>
                                    {product.oldPrice && <p className="title price old-price">₹{product.oldPrice}</p>}
                                </div>
                            </div>
                            <div className="wrapCardButtons">
                                <button className="card-btn" onClick={() => handleAddToCartClick(product)}>
                                    <i className="bx bx-cart"></i> Add to Cart
                                </button>
                                <button className="card-btn2" onClick={() => handleAddToWishlistClick(product)}>
                                    <MdOutlineFavoriteBorder className="wishIcon" />
                                </button>
                            </div>
                        </div>
                        <p className="tag">-50%</p>
                    </div>
                ))}

                {selectedProduct && <ProductInfoModal productId={selectedProduct._id} onClose={closeModal} />}
                {loading && <span className="loader productLoadingSpinner">L &nbsp; ading</span>}
            </div>
            <div className="pagination-controls">
                <button onClick={handlePrevious} disabled={currentPage === 1 || loading} className="pagination-btn">
                    Previous
                </button>
                <button onClick={handleNext} disabled={!hasMore || loading} className="pagination-btn">
                    Next
                </button>
            </div>
        </div>
    );
});

export default Products;
