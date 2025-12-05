import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../api/apiService';

const AdminRoute = ({ children }) => {
    const currentUser = authService.getCurrentUser();
    const isAdmin = currentUser && currentUser.role === 'admin';

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
