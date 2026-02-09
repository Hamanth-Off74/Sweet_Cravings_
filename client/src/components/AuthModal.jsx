import { useState, useEffect } from 'react';
import '../styles/AuthModal.css';

function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  useEffect(() => {
    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Store user data in localStorage
    const userData = {
      name: isLogin ? formData.email.split('@')[0] : formData.name,
      email: formData.email,
      phone: formData.phone
    };
    
    localStorage.setItem('sweetcravings_user', JSON.stringify(userData));
    
    // Call the success callback
    if (onAuthSuccess) {
      onAuthSuccess(userData);
    }
    
    alert(isLogin ? 'Login successful!' : 'Account created successfully!');
    onClose();
  };

  const handleGoogleSignIn = () => {
    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Replace with your actual client ID
        callback: handleGoogleResponse
      });
      
      window.google.accounts.id.prompt();
    } else {
      // Fallback: Simulate Google login
      const userData = {
        name: 'Google User',
        email: 'user@gmail.com',
        phone: '',
        provider: 'google'
      };
      
      localStorage.setItem('sweetcravings_user', JSON.stringify(userData));
      
      if (onAuthSuccess) {
        onAuthSuccess(userData);
      }
      
      alert('Google Sign-In successful!');
      onClose();
    }
  };

  const handleGoogleResponse = (response) => {
    // Decode JWT token to get user info
    const userData = JSON.parse(atob(response.credential.split('.')[1]));
    
    const user = {
      name: userData.name,
      email: userData.email,
      picture: userData.picture,
      provider: 'google'
    };
    
    localStorage.setItem('sweetcravings_user', JSON.stringify(user));
    
    if (onAuthSuccess) {
      onAuthSuccess(user);
    }
    
    alert('Google Sign-In successful!');
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Floating Dessert Decorations */}
        <div className="dessert-float dessert-float-1">🍰</div>
        <div className="dessert-float dessert-float-2">🧁</div>
        <div className="dessert-float dessert-float-3">🍪</div>
        <div className="dessert-float dessert-float-4">🍩</div>
        <div className="dessert-float dessert-float-5">🎂</div>
        <div className="dessert-float dessert-float-6">🍨</div>

        <button className="auth-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="auth-header">
          <div className="auth-icon">
            <i className="fas fa-birthday-cake"></i>
          </div>
          <h2>{isLogin ? 'Welcome Back!' : 'Join SweetCravings'}</h2>
          <p>{isLogin ? 'Login to continue your sweet journey' : 'Create an account to get started'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <div className="input-wrapper">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <div className="input-wrapper">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                name="email"
                placeholder="Email or Mobile Number"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <div className="input-wrapper">
                <i className="fas fa-phone input-icon"></i>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <div className="input-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {isLogin && (
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
          )}

          <button type="submit" className="auth-submit-btn">
            <span>{isLogin ? 'Login' : 'Create Account'}</span>
            <i className="fas fa-arrow-right"></i>
          </button>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <div className="social-login">
            <button type="button" className="social-btn google-btn" onClick={handleGoogleSignIn}>
              <i className="fab fa-google"></i>
              <span>Continue with Google</span>
            </button>
          </div>

          <button type="button" className="auth-toggle-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Create New Account' : 'Already have an account? Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
