import React from "react";

const ConfirmCancelModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay-order">
            <div className="modal-content">
                <h2 className="confirmCancel">Confirm Order Cancellation</h2>
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="confirm-btn">
                        Cancel Order
                    </button>
                    <button onClick={onCancel} className="cancel-btn">
                        No, Keep Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmCancelModal;
