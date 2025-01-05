import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, deleteProduct, editProduct, fetchProducts } from "../../features/productSlice";
import Modal from "./Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./admin.css";

const HandleProducts = () => {
    const dispatch = useDispatch();
    const { products, loading, total, totalCatProducts, totalDogProducts } = useSelector((state) => state.products);

    // State for pagination
    const [ page, setPage ] = useState(1);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ isEditing, setIsEditing ] = useState(false);

    const [ selectedCategory, setSelectedCategory ] = useState("");
    const [ searchTerm, setSearchTerm ] = useState()
    const [ suggestions, setSuggestions ] = useState("")

    useEffect(() => {
        dispatch(fetchProducts({ page, limit: 12, category: selectedCategory }));
    }, [dispatch, page, selectedCategory]);

    const [productData, setProductData] = useState({
        id: "",
        name: "",
        price: "",
        oldPrice: "",
        image: "",
        category: "",
        seller: "",
        stock: "",
        description: "",
        ingredients: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAddProduct = () => {
        setIsEditing(false);
        setProductData({
            id: "",
            name: "",
            price: "",
            oldPrice: "",
            image: "",
            category: "",
            seller: "",
            stock: "",
            description: "",
            ingredients: "",
        });
        setIsModalOpen(true);
    };

    const handleSaveProduct = () => {
        if (productData.name && productData.price && productData.category && productData.seller && productData.image) {
            if (isEditing) {
                const updatedProduct = { ...productData }; // Copy all fields
                console.log(updatedProduct);
                
                dispatch(editProduct({ productId: updatedProduct.id, updateData: updatedProduct })).then((response) => {
                    dispatch(fetchProducts({ page, limit: 12, category: selectedCategory })).then((response) => {
                        toast.success("Product updated successfully!");
                    })
                });
            } else {
                const newProduct = {
                    name: productData.name,
                    price: parseFloat(productData.price),
                    oldPrice: parseFloat(productData.oldPrice) || null,
                    image: productData.image,
                    category: productData.category,
                    seller: productData.seller,
                    stock: parseInt(productData.stock),
                    description: productData.description,
                    ingredients: productData.ingredients,
                };
                dispatch(addProduct(newProduct))
                    .unwrap()
                    .then((response) => {
                        dispatch(fetchProducts({}))
                        toast.success("Product added successfully!");
                    })
                    .catch((error) => {
                        toast.error(error);
                    });
            }
            setIsModalOpen(false);
        } else {
            toast.error("Please fill in all required fields.");
        }
    };

    const handleDeleteProduct = (id) => {
        toast(
            ({ closeToast }) => (
                <div className="productDeleteConfirm">
                    <p>Are you sure you want to delete this product?</p>
                    <div>
                        <button
                            onClick={() => {
                                console.log(id);

                                dispatch(deleteProduct(id)).then((response) => {
                                    dispatch(fetchProducts({ page, limit: 12, category: selectedCategory }));
                                });
                                toast.success("Product deleted successfully!");
                                closeToast();
                            }}
                            className="deleteconfirmButton"
                        >
                            Yes
                        </button>
                        <button onClick={closeToast} className="deletecancelButton">
                            No
                        </button>
                    </div>
                </div>
            ),
            {
                closeOnClick: false,
                autoClose: false,
            }
        );
    };

    const handleEditProduct = (product) => {
        setIsEditing(true);
        setProductData({
            id: product._id,
            name: product.name,
            price: product.price,
            oldPrice: product.oldPrice,
            image: product.image,
            category: product.category,
            seller: product.seller,
            stock: product.stock,
            description: product.description,
            ingredients: product.ingredients,
        });
        setIsModalOpen(true);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        dispatch(fetchProducts({ page: 1, limit: 12, category: e.target.value }));
    };

    // Handle page navigation
    const handleNextPage = () => {
        if (page < Math.ceil(total / 12)) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProductData((prevData) => ({
            ...prevData,
            image: file,
        }));
    };

//search
     const debounce = (func, delay) => {
            let timeout;
            return (...args) => {
              clearTimeout(timeout);
              timeout = setTimeout(() => func(...args), delay);
            };
          };
    
        const searchProducts = debounce((searchValue) => {
            dispatch(fetchProducts({ name: searchValue, page: 1, limit: 12 }));
        }, 400);
    
    
        const handleSearch = (e) => {
            const searchValue = e.target.value.toLowerCase();
            setSearchTerm(searchValue);
    
            if (searchValue.length > 0) {
                const filteredSuggestions = products.filter(
                    (product) =>
                        product.name.toLowerCase().includes(searchValue) || product.category.toLowerCase().includes(searchValue)
                );
                setSuggestions(filteredSuggestions);
                searchProducts(searchValue);
            } else {
                setSuggestions([]);
                dispatch(fetchProducts({ page: 1, limit: 12, category: null }));
            }
        }

    
        const handleSuggestionClick = (suggestion) => {
            setSearchTerm(suggestion.name.toLowerCase());
        };
    
        const handleBlur = () => {
            setSuggestions([]);
        };


    return (
        <div className="handle-products">
            <div className="wrapAddBtnandCard">
                <div className="Admincard">
                    <div className="Cardcontent">
                        <h3 className="Cardheading">Product Overview</h3>
                        <p>
                            <strong>Total Products: </strong>
                            {total}
                        </p>
                        <p>
                            <strong>Cat Products:</strong>
                            {totalCatProducts}
                        </p>
                        <p>
                            <strong>Dog Products: </strong>
                            {totalDogProducts}
                        </p>
                    </div>
                </div>
                <button onClick={handleAddProduct} className="addEditbutton">
                    <span>Add Product</span>
                </button>
                <div className="Admincard">
                    <div className="Cardcontent">
                        <h4 className="Cardheading">Seller Overview</h4>
                        <p>
                            <strong>Total Sellers: </strong>
                            28
                        </p>
                        <p>
                            <strong>Cat: </strong>
                            11
                        </p>
                        <p>
                            <strong>Dog: </strong>
                            17
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="viewAndSearch">
            <div className="adminSearchProducts view-switch">
                    <input type="text" onBlur={handleBlur} placeholder="Search for products..." onChange={handleSearch}></input>
                    {suggestions.length > 0 && (
                        <ul className="suggestions-list suggestions-list-admin">
                            {suggestions.map((suggestion) => (
                                <li key={suggestion._id || suggestion.name} onClick={() => handleSuggestionClick(suggestion)}>
                                    {suggestion.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="view-switch">
                    <select onChange={handleCategoryChange} value={selectedCategory}>
                        <option value="">All</option>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="productsListing">
                <h2>Current Products</h2>
                {loading ? (
                    <p>Loading products...</p>
                ) : (
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Old Price</th>
                                <th>Image</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Seller</th>
                                <th>Description</th>
                                <th>Ingredients</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product.name}</td>
                                        <td>₹{product.price.toFixed(2)}</td>
                                        <td>₹{product.oldPrice}</td>
                                        <td>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={{ width: "70px", height: "60px" }}
                                            />
                                        </td>
                                        <td>{product.category}</td>
                                        <td>{product.stock}</td>
                                        <td>{product.seller}</td>
                                        <td>{product.description}</td>
                                        <td>{product.ingredients}</td>
                                        <td>
                                            <div className="productActions">
                                                <button onClick={() => handleEditProduct(product)}>Edit</button>
                                                <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
                <div className="pagination-controls paginationInAdminProducts">
                    <button onClick={handlePreviousPage} disabled={page === 1} className="pagination-btn">
                        Previous
                    </button>
                    <button onClick={handleNextPage} disabled={page === Math.ceil(total / 12)} className="pagination-btn">
                        Next
                    </button>
                </div>
            </div>

            {/* Modal for Adding/Editing Products */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="product-form">
                    <div>
                        <h3>{isEditing ? "Edit Product" : "Add New Product"}</h3>
                    </div>
                    <div className="productFieldContainer">
                        <div className="productField">
                            <label>Product Name</label>
                            <input type="text" name="name" value={productData.name} onChange={handleInputChange} />
                        </div>
                        <div className="productField">
                            <label>Price</label>
                            <input type="number" name="price" value={productData.price} onChange={handleInputChange} />
                        </div>
                        <div className="productField">
                            <label>Old Price</label>
                            <input
                                type="number"
                                name="oldPrice"
                                value={productData.oldPrice}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="productField">
                            <label>Upload Image</label>
                            <input type="file" name="imageFile" accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>

                    <div className="productFieldContainer">
                        <div className="productField">
                            <label>Category</label>
                            <select name="category" value={productData.category} onChange={handleInputChange}>
                                <option value="">Select Category</option>
                                <option value="cat">Cat</option>
                                <option value="dog">Dog</option>
                            </select>
                        </div>
                        <div className="productField">
                            <label>Stock</label>
                            <input type="number" name="stock" value={productData.stock} onChange={handleInputChange} />
                        </div>
                        <div className="productField">
                            <label>Seller</label>
                            <input type="text" name="seller" value={productData.seller} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="productFieldContainer">
                        <div className="productFieldINCDES">
                            <label>Description</label>
                            <textarea name="description" value={productData.description} onChange={handleInputChange} />
                        </div>
                        <div className="productFieldINCDES">
                            <label>Ingredients</label>
                            <textarea name="ingredients" value={productData.ingredients} onChange={handleInputChange} />
                        </div>
                    </div>
                    <button className="addEditbutton updateBtn" onClick={handleSaveProduct}>
                        {isEditing ? "Update" : "Add"}
                    </button>
                </div>
            </Modal>
            <ToastContainer position="top-center" autoClose={330} hideProgressBar={false} newestOnTop={true} limit={1} />
        </div>
    );
};

export default HandleProducts;
