import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, roles = [] }) => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-900">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles.length > 0) {
        // If they have the legacy role string, or they have the specific capability requested
        const hasLegacyRole = roles.includes(user.role);
        const hasAdminCap = roles.includes('admin') && user.isAdmin;
        const hasOrganizerCap = roles.includes('organizer') && user.organizerEnabled;
        
        if (!hasLegacyRole && !hasAdminCap && !hasOrganizerCap) {
            return <Navigate to="/" replace />; // Or unauthorized page
        }
    }

    return children;
};

export default ProtectedRoute;
