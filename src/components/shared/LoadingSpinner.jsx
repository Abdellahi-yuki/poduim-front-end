import React from 'react';
import '../../styles/index.css';

const LoadingSpinner = ({ message = 'Chargement...' }) => {
    return (
        <div className="loading-container">
            <div style={{ textAlign: 'center' }}>
                <div className="spinner"></div>
                {message && (
                    <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-gray-600)' }}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default LoadingSpinner;
