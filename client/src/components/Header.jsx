import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useDarkMode } from '../context/DarkModeContext';
import { useState, useEffect } from 'react';
import BackgroundSlideshow from './BackgroundSlideshow';
import AuthModal from './AuthModal';

function Header() {
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('My Account');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const location = useLocation();

  const handleAuthSuccess = (userData) => {
    setIsLoggedIn(true);
    setUserName(userData.name || 'My Account');
    setShowAuthModal(false);
  };

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('sweetcravings_user');
    if (user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      setUserName(userData.name || 'My Account');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sweetcravings_user');
    setIsLoggedIn(false);
    setUserName('My Account');
    setShowAccountDropdown(false);
  };

  return (
    <>
      <BackgroundSlideshow />
      <div className="bg-overlay"></div>
      
      <header className="header">
        <div className="top-bar">
          <div className="container">
            <div className="top-links">
              <span><i className="fas fa-truck"></i> Free Delivery on orders above ₹500</span>
              <span><i className="fas fa-phone"></i> Customer Support: 1800-123-4567</span>
              <span><i className="fas fa-store"></i> Become a Seller</span>
            </div>
          </div>
        </div>

        <nav className="navbar">
          <div className="container">
            <div className="nav-brand">
              <Link to="/" className="logo">
                <i className="fas fa-birthday-cake"></i>
                SweetCravings
              </Link>
            </div>
            
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search for desserts, cakes, cookies..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="search-btn">
                <i className="fas fa-search"></i>
              </button>
            </div>
            
            <div className="nav-actions">
              <button 
                className={`dark-mode-toggle ${isDarkMode ? 'active' : ''}`}
                onClick={toggleDarkMode}
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              >
                <span className="dark-mode-toggle-slider">
                  <i className={`fas fa-${isDarkMode ? 'moon' : 'sun'}`}></i>
                </span>
              </button>

              {!isLoggedIn ? (
                <div id="guest-actions">
                  <button className="btn btn-nav" onClick={() => setShowAuthModal(true)}>Login</button>
                  <button className="btn btn-nav btn-outline" onClick={() => setShowAuthModal(true)}>Sign Up</button>
                </div>
              ) : (
                <div id="user-actions">
                  <div className="nav-dropdown">
                    <a 
                      href="#" 
                      className="nav-link dropdown-trigger"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowAccountDropdown(!showAccountDropdown);
                      }}
                    >
                      <i className="fas fa-user-circle"></i>
                      <span>{userName}</span>
                      <i className="fas fa-chevron-down"></i>
                    </a>
                    {showAccountDropdown && (
                      <div className="dropdown-menu" style={{display: 'block'}}>
                        <div className="dropdown-items">
                          <Link to="/orders" className="dropdown-item" onClick={() => setShowAccountDropdown(false)}>
                            <i className="fas fa-box"></i> My Orders
                          </Link>
                          <Link to="/wishlist" className="dropdown-item" onClick={() => setShowAccountDropdown(false)}>
                            <i className="fas fa-heart"></i> Wishlist
                          </Link>
                          <a href="#" className="dropdown-item" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                            <i className="fas fa-sign-out-alt"></i> Logout
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Link to="/wishlist" className="nav-link icon-link">
                <i className="fas fa-heart"></i>
                <span className="wishlist-count">{getWishlistCount()}</span>
              </Link>

              <Link to="/cart" className="nav-link icon-link cart-link">
                <i className="fas fa-shopping-cart"></i>
                <span className="cart-count">{getCartCount()}</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="category-nav">
          <div className="container">
            <div className="category-links">
              <Link to="/menu" className="category-link">
                <i className="fas fa-birthday-cake"></i> Cakes
              </Link>
              <Link to="/menu" className="category-link">
                <i className="fas fa-cookie-bite"></i> Cookies
              </Link>
              <Link to="/menu" className="category-link">
                <i className="fas fa-chart-pie"></i> Pies
              </Link>
              <Link to="/menu" className="category-link">
                <i className="fas fa-pizza-slice"></i> Italian
              </Link>
              <Link to="/menu" className="category-link">
                <i className="fas fa-square"></i> Brownies
              </Link>
              <Link to="/menu" className="category-link">
                <i className="fas fa-circle"></i> Tarts
              </Link>
              <Link to="/menu" className="category-link">
                <i className="fas fa-ice-cream"></i> Ice Cream
              </Link>
              <a href="#" className="category-link sale-link">
                <i className="fas fa-tags"></i> Sale
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default Header;
