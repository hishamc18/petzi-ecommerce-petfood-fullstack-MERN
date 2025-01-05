import React from "react";
import { useDispatch } from "react-redux";
import { fetchProducts, setCategory } from "../../features/productSlice";
import "./homeStyle.css";

const Category = ({ scrollToProducts }) => {
    const dispatch = useDispatch();

    const handleCategoryClick = (category) => {
        dispatch(setCategory(category));
        dispatch(fetchProducts({ page: 1, limit: 12, category })); 
        scrollToProducts();
    };

    return (
        <div className="category-container">
            <h2>Select Category</h2>
            <div className="category-buttons">
                <div className="pet">
                    <button
                        onClick={() => handleCategoryClick("dog")}
                        className="category-btn"
                    >
                        <img src="/category/Dog.jpg" alt="Dog" />
                    </button>
                    <label>Dog</label>
                </div>
                <div className="pet">
                    <button
                        onClick={() => handleCategoryClick("")}
                        className="category-btn"
                    >
                        <img src="/category/all-products.jpg" alt="All Products" />
                    </button>
                    <label>All Products</label>
                </div>
                <div className="pet">
                    <button
                        onClick={() => handleCategoryClick("cat")}
                        className="category-btn"
                    >
                        <img src="/category/Cat.png" alt="Cat" />
                    </button>
                    <label>Cat</label>
                </div>
            </div>
        </div>
    );
};

export default Category;