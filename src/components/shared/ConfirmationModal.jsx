import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirmer', confirmColor = 'danger' }) => {
    if (!isOpen) return null;

    const getBtnClass = () => {
        switch (confirmColor) {
            case 'danger': return 'btn btn-danger';
            case 'warning': return 'btn btn-warning';
            case 'success': return 'btn btn-success';
            default: return 'btn btn-primary';
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <AlertTriangle size={24} color="var(--color-warning)" />
                        {title}
                    </h3>
                    <button onClick={onClose} className="btn-icon">×</button>
                </div>
                <div className="modal-body">
                    <p style={{ color: 'var(--color-gray-700)' }}>{message}</p>
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="btn btn-secondary">
                        Annuler
                    </button>
                    <button onClick={onConfirm} className={getBtnClass()}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
