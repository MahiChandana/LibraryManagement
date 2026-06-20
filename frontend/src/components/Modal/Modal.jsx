import React, { useEffect } from 'react';
import './Modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onConfirm = null, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  confirmBtnStyle = 'btn-primary',
  isActionModal = false, // If true, displays built-in confirm/cancel action buttons
  isSubmitting = false
}) => {
  
  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop') {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container card">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close Modal" disabled={isSubmitting}>
            &times;
          </button>
        </div>

        <div className="modal-content-body">
          {children}
        </div>

        {isActionModal && (
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose} 
              disabled={isSubmitting}
            >
              {cancelText}
            </button>
            <button 
              type="button" 
              className={`btn ${confirmBtnStyle}`} 
              onClick={onConfirm} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
