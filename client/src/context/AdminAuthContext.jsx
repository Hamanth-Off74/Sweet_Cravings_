import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            verifySession(token);
        } else {
            setLoading(false);
        }
    }, []);

    const verifySession = async (token) => {
        try {
            const response = await axios.get('/api/admin/verify', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setAdmin(response.data.admin);
                setIsAuthenticated(true);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Session verification failed:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post('/api/admin/login', {
                username,
                password
            });

            if (response.data.success) {
                const { token, admin } = response.data;
                localStorage.setItem('adminToken', token);
                setAdmin(admin);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return { success: false, error: response.data.error };
            }
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed. Please try again.'
            };
        }
    };

    const logout = async () => {
        const token = localStorage.getItem('adminToken');

        if (token) {
            try {
                await axios.post('/api/admin/logout', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        localStorage.removeItem('adminToken');
        setAdmin(null);
        setIsAuthenticated(false);
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem('adminToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const value = {
        admin,
        isAuthenticated,
        loading,
        login,
        logout,
        getAuthHeaders
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
}

export default AdminAuthContext;
