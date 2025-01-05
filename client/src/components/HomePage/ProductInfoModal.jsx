import React from "react";
import { useSelector } from "react-redux";
import "./homeStyle.css";

const ProductModal = ({ productId, onClose }) => {
    const product = useSelector((state) => state.products.products.find((item) => item._id === productId));

    if (!product) {
        return (
            <div className="productInfoModal-overlay">
                <div className="productInfoModal-content">
                    <span className="productInfoModal-close-button" onClick={onClose}>
                        &times;
                    </span>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="productInfoModal-overlay">
            <div className="productInfoModal-content">
                <span className="productInfoModal-close-button" onClick={onClose}>
                    &times;
                </span>
                <div className="product-info-modal-alldataWrap">
                    <div>
                        <div className="productInfoModal-image">
                            <img src={product.image} alt={product.name} />
                        </div>
                        <h2 className="productInfoModal-title">{product.name}</h2>
                        <div className="productInfoModal-prices">
                            <p className="productInfoModal-price">₹{product.price.toFixed(2)}</p>
                            {product.oldPrice && (
                                <p className="productInfoModal-old-price">₹{product.oldPrice.toFixed(2)}</p>
                            )}
                        </div>
                    </div>
                    <div className="product-info-modal-rightdata-wrap">
                        <p className="productInfoModal-description">
                            <strong>Description: </strong>
                            {product.description}
                        </p>
                        <p className="productInfoModal-ingredients">
                            <strong>Ingredients:</strong> {product.ingredients}
                        </p>
                        <div>
                            <p className="productInfoModal-seller">
                                <strong>Seller:</strong> {product.seller}
                            </p>
                            <p className="productInfoModal-stock">
                                <strong>Item Left:</strong> {product.stock} Nos
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
