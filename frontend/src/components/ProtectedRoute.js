

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoadingSpinner = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    }}>
        <div>Loading...</div>
    </div>
);

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    return isAuthenticated() ? children : <Navigate to="/auth" replace />;
};

// Admin-only route
export const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated()) {
        return <Navigate to="/auth" replace />;
    }

    if (!isAdmin()) {
        return <Navigate to="/user-dashboard" replace />;
    }

    return children;
};

// User-only route (redirects admins to admin dashboard)
export const UserRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated()) {
        return <Navigate to="/auth" replace />;
    }

    if (isAdmin()) {
        return <Navigate to="/admin-dashboard" replace />;
    }

    return children;
};

// Public route - redirects authenticated users to their dashboard
export const PublicRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (isAuthenticated()) {
        return <Navigate to={isAdmin() ? "/admin-dashboard" : "/user-dashboard"} replace />;
    }

    return children;
};