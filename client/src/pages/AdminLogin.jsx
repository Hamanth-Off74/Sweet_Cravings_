import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import '../styles/AdminLogin.css';

function AdminLogin() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login, isAuthenticated } = useAdminAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/admin';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.username, formData.password);

        if (result.success) {
            const from = location.state?.from?.pathname || '/admin';
            navigate(from, { replace: true });
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="admin-login-container">
            {/* Background Effects */}
            <div className="admin-login-bg">
                <div className="admin-login-shape shape-1"></div>
                <div className="admin-login-shape shape-2"></div>
                <div className="admin-login-shape shape-3"></div>
            </div>

            <div className="admin-login-card">
                {/* Logo/Icon */}
                <div className="admin-login-header">
                    <div className="admin-login-icon">
                        <i className="fas fa-user-shield"></i>
                    </div>
                    <h1>Admin Portal</h1>
                    <p>Sweet Cravings Management System</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="admin-login-form">
                    {error && (
                        <div className="admin-login-error">
                            <i className="fas fa-exclamation-circle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="admin-form-group">
                        <label htmlFor="username">Username</label>
                        <div className="admin-input-wrapper">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter admin username"
                                required
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label htmlFor="password">Password</label>
                        <div className="admin-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="admin-login-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <i className="fas fa-arrow-right"></i>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="admin-login-footer">
                    <p>
                        <i className="fas fa-shield-alt"></i>
                        Secure admin access only
                    </p>
                </div>
            </div>

            {/* Demo Credentials Hint */}
            <div className="admin-demo-hint">
                <p><strong>Demo Credentials:</strong> admin / sweetcravings123</p>
            </div>
        </div>
    );
}

export default AdminLogin;
