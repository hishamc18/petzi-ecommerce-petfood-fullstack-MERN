import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { MdOutlinePets } from "react-icons/md";
import "./homeStyle.css";
import { logoutUser } from "../../features/authSlice";
import LogoutModal from "./LogoutModal";
import { fetchCartDetails } from "../../features/cartSlice";
import { fetchProducts } from "../../features/productSlice";

const Navbar = ({ setSearchTerm, scrollToProducts }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { products } = useSelector((state) => state.products);
    const { cart } = useSelector((state) => state.cart);
    const [suggestions, setSuggestions] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [toastMessage, setToastMessage] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if(isAuthenticated){
            dispatch(fetchCartDetails());
        }
    }, [dispatch, navigate]);

    const handleCartAccess = () => {
        if (!isAuthenticated) {
            setToastMessage("Please Login to Access Your Cart.");
        } else {
            navigate("/cart");
        }
    };

    const handleProfileClick = () => {
        if (!user) {
            navigate('/login')
            // window.location.reload()
        } else {
            toggleDropdown();
        }
    };

    const handleOrderAccess = () => {
        if (!isAuthenticated) {
            setToastMessage("Please Login to Access Your Orders.");
        } else {
            navigate("/orders");
        }
    };

    const handlePetFoods = () => {
        scrollToProducts();
        setCategory(null);
    };

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
    };
    

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.name.toLowerCase());
    };

    const handleBlur = () => {
        setSuggestions([]);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    //logout
    const handleLogoutClick = () => {
        setShowConfirm(true);
    };

    const confirmLogout = () => {
        dispatch(logoutUser())
            .then(() => {
                navigate("/");
            })
            .catch((error) => {
                console.error("Logout error:", error);
            });
        setShowConfirm(false);
    };

    const cancelLogout = () => {
        setShowConfirm(false);
    };

    const refresh = () => {
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <div onClick={refresh} className="navbar-logo">
                {/* <img src="src/assets/logo/logo1.png" alt="logo" /> */}
                <img src="/logo/logo1.png" alt="logo" />
            </div>
            {toastMessage && <div className="toast">{toastMessage}</div>}
            <div className="navbar-icons">
                <div className="navbar-icon orders petFood" onClick={handlePetFoods}>
                    <MdOutlinePets />
                    <label>Pet Foods</label>
                </div>
                <div onClick={handleOrderAccess} className="navbar-iconCart orders orders1">
                    <TbTruckDelivery className="orderIcon" />
                    <label>Orders</label>
                </div>
                <div className="navbar-iconCart" onClick={handleCartAccess}>
                    <div className="cartlogoname">
                        <i className="bx bx-cart"></i>
                        <label>Cart</label>
                    </div>
                    <div className="count">
                        {isAuthenticated ? (
                            cart?.items?.length > 0 && <span className="cart-badge">{cart?.items?.length}</span>
                        ) : (
                            <span>0</span>
                        )}
                    </div>
                </div>
                <div className="navbar-icon" onClick={handleProfileClick} ref={dropdownRef}>
                    <i className="bx bx-user"></i>
                    <label>{isAuthenticated ? user.username : "Login"}</label>

                    {dropdownOpen && isAuthenticated && (
                        <div className="dropdown-menu">
                            <div className="wrapDropDownIcons">
                                <button className="logout" onClick={handleLogoutClick}>
                                    <i className="bx bx-log-out"></i>
                                    <span className="logoutText">Logout</span>
                                </button>
                                <button
                                    className="logout-button"
                                    onClick={() => {
                                        navigate("/wishlist");
                                    }}
                                >
                                    <MdOutlineFavoriteBorder className="wishIcon" />
                                    <span className="wishListText">Wishlist</span>
                                </button>
                            </div>
                            <div
                                onClick={() => {
                                    navigate("orders");
                                }}
                                className="navbar-iconCart orders"
                            >
                                <TbTruckDelivery className="orderIcon" />
                                <label>Orders</label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="navbar-search">
                <input type="text" onBlur={handleBlur} placeholder="Search for products..." onChange={handleSearch}></input>
                <div className="searchIcon">
                    <i className="bx bx-search-alt-2"></i>
                </div>
                {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((suggestion) => (
                            <li key={suggestion._id || suggestion.name} onClick={() => handleSuggestionClick(suggestion)}>
                                {suggestion.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {showConfirm && <LogoutModal onConfirm={confirmLogout} onCancel={cancelLogout} />}
        </nav>
    );
};

export default Navbar;
