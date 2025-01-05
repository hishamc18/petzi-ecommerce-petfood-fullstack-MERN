import React, { useEffect, useState } from "react";
import "./admin.css";
import Dashboard from "./Dashboard";
import HandleProducts from "./HandleProducts";
import UserDetails from "./UserDetails";
import LogoutModal from "../HomePage/LogoutModal";
import HandleOrders from "./HandleOrders";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, fetchUserDetails } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
    const [dropdownOpen, setDropdtownOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [activeMenu, setActiveMenu] = useState("Dashboard");
    const { adminAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!adminAuthenticated) {
            dispatch(fetchUserDetails()).unwrap();
        }
    }, [dispatch, navigate, adminAuthenticated]);

    const handleProfileClick = () => {
        if (adminAuthenticated) {
            setDropdtownOpen(!dropdownOpen);
        }
    };

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
    };

    const handleLogoutModal = () => {
        setShowConfirm(true);
    };

    const confirmLogout = () => {
        dispatch(logoutUser())
            .unwrap()
            .then((response) => {
                navigate("/login");
                window.location.reload();
            });
        setShowConfirm(false);
    };
    const cancelLogout = () => {
        setShowConfirm(false);
    };

    return (
        <div className="admin-homepage">
            <nav className="adminNavbar">
                <div className="navbar-logo adminlogo">
                    <img src="/logo/logo1.png" alt="logo" />
                    <h1>Admin Panel</h1>
                </div>
                <div className="adminLogoutBtn" onClick={handleProfileClick}>
                    <i className="bx bx-user"></i>
                    <label>Admin</label>
                    {dropdownOpen && adminAuthenticated && (
                        <div className="dropdown-menu">
                            <div className="wrapDropDownIcons">
                                <button className="logout adminlgbtn" onClick={handleLogoutModal}>
                                    <i className="bx bx-log-out"></i>
                                    <span className="logoutText adminLogoutText">Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <div className="adminContainer">
                <div className="adminMenubar">
                    <ul>
                        <li
                            className={activeMenu === "Dashboard" ? "active" : ""}
                            onClick={() => handleMenuClick("Dashboard")}
                        >
                            Dashboard
                        </li>
                        <li
                            className={activeMenu === "HandleProducts" ? "active" : ""}
                            onClick={() => handleMenuClick("HandleProducts")}
                        >
                            Handle Products
                        </li>
                        <li
                            className={activeMenu === "UserDetails" ? "active" : ""}
                            onClick={() => handleMenuClick("UserDetails")}
                        >
                            User Details
                        </li>
                        <li
                            className={activeMenu === "HandleOrders" ? "active" : ""}
                            onClick={() => handleMenuClick("HandleOrders")}
                        >
                            Handle Orders
                        </li>
                    </ul>
                </div>
                <div className="adminContent">
                    {activeMenu === "Dashboard" && <Dashboard />}
                    {activeMenu === "HandleProducts" && <HandleProducts />}
                    {activeMenu === "UserDetails" && <UserDetails />}
                    {activeMenu === "HandleOrders" && <HandleOrders />}
                </div>
            </div>
            {/* for showing the logout modal */}
            {showConfirm && <LogoutModal onConfirm={confirmLogout} onCancel={cancelLogout} />}
        </div>
    );
};

export default AdminHome;
