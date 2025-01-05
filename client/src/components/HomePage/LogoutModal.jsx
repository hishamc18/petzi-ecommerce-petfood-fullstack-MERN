import React from "react";

const LogoutModal = ({ onConfirm, onCancel }) => {
    
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="confirmLogout">Confirm Logout</h2>
                <p>Are you sure you want to log out?</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="confirm-btn">
                        Log Out
                    </button>
                    <button onClick={onCancel} className="cancel-btn">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;