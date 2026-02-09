import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

function ProtectedAdminRoute({ children }) {
    const { isAuthenticated, loading } = useAdminAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
            }}>
                <div style={{ textAlign: 'center', color: '#fff' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#ff6b6b' }}></i>
                    <p style={{ marginTop: '20px', fontSize: '16px' }}>Verifying admin session...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to admin login page, saving the attempted location
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedAdminRoute;
