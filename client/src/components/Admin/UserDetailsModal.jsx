import React from 'react';

const Modal = ({ onClose, children }) => {
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="admin-modal-overlay" onClick={handleOverlayClick}>
            <div className="admin-modal-content">
                <button className="admin-modal-close" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;