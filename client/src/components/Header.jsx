import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useCart } from '../context/CartContext';
import { useDarkMode } from '../context/DarkModeContext';
import { useState } from 'react';
import BackgroundSlideshow from './BackgroundSlideshow';
import { HeaderDock } from './ui/header-dock';
import { IconShoppingCart, IconMoon, IconSun, IconReceipt } from '@tabler/icons-react';
import FloatingVoiceButton from './FloatingVoiceButton';

function Header() {
  const { getCartCount } = useCart();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Select Location');
  const [isLocating, setIsLocating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to menu page with search query
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Please enter your city manually.");
      const manualCity = prompt("Enter your city name:");
      if (manualCity) setSelectedLocation(manualCity);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.state || "Unknown";
          setSelectedLocation(city);
        } catch (error) {
          console.error("Error fetching location:", error);
          const manualCity = prompt("Unable to detect city automatically. Please enter your city name:");
          if (manualCity) setSelectedLocation(manualCity);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        setIsLocating(false);

        let errorMsg = "Unable to retrieve your location.";
        if (error.code === 1) {
          errorMsg = "Location access denied. Please enable location permissions in your browser settings.";
        } else if (error.code === 2) {
          errorMsg = "Location unavailable. Please check your network connection.";
        } else if (error.code === 3) {
          errorMsg = "Location request timed out.";
        }

        const manualCity = prompt(`${errorMsg}\n\nWould you like to enter your city manually?`, "New York");
        if (manualCity) {
          setSelectedLocation(manualCity);
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
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
              <div className="location-selector" onClick={handleLocationClick}>
                <i className={`fas ${isLocating ? 'fa-spinner fa-spin' : 'fa-map-marker-alt'}`}></i>
                <div className="location-info">
                  <span className="location-label">Deliver to</span>
                  <span className="location-address">{isLocating ? 'Locating...' : selectedLocation}</span>
                </div>
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>

            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for desserts, cakes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <div className="search-actions">
                <FloatingVoiceButton isInline={true} />
                <button type="submit" className="search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>

            <div className="nav-actions">
              <HeaderDock
                items={[
                  {
                    title: isDarkMode ? 'Light Mode' : 'Dark Mode',
                    icon: isDarkMode ? <IconSun className="w-full h-full" /> : <IconMoon className="w-full h-full" />,
                    onClick: toggleDarkMode
                  },
                  {
                    title: "Orders",
                    icon: <IconReceipt className="w-full h-full" />,
                    href: "/orders"
                  },
                  {
                    title: "Cart",
                    icon: <IconShoppingCart className="w-full h-full" />,
                    href: "/cart",
                    badge: getCartCount() > 0 ? getCartCount() : null
                  }
                ]}
              />

              {/* Clerk Authentication */}
              <SignedOut>
                <div id="guest-actions" className="auth-buttons">
                  <SignInButton mode="modal">
                    <button className="btn btn-nav">Login</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="btn btn-nav btn-outline">Sign Up</button>
                  </SignUpButton>
                </div>
              </SignedOut>

              <SignedIn>
                <div id="user-actions" className="user-profile" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <Link to="/admin/login" style={{
                    width: '40px',
                    height: '40px',
                    minWidth: '40px',
                    minHeight: '40px',
                    background: 'linear-gradient(135deg, #ff6161 0%, #ff8787 100%)',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(255, 97, 97, 0.3)',
                    fontSize: '16px',
                    flexShrink: '0'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 97, 97, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 97, 97, 0.3)';
                  }}
                  title="Admin Panel"
                  >
                    <i className="fas fa-user-shield"></i>
                  </Link>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: 'clerk-user-avatar'
                      }
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        </nav>

        <div className="category-nav">
          <div className="container">
            <div className="category-links">
              <Link to="/menu?category=Cakes" className="category-link">
                <i className="fas fa-birthday-cake"></i> Cakes
              </Link>
              <Link to="/menu?category=Cookies" className="category-link">
                <i className="fas fa-cookie-bite"></i> Cookies
              </Link>
              <Link to="/menu?category=Pies" className="category-link">
                <i className="fas fa-chart-pie"></i> Pies
              </Link>
              <Link to="/menu?category=Italian" className="category-link">
                <i className="fas fa-pizza-slice"></i> Italian
              </Link>
              <Link to="/menu?category=Brownies" className="category-link">
                <i className="fas fa-square"></i> Brownies
              </Link>
              <Link to="/menu?category=Tarts" className="category-link">
                <i className="fas fa-circle"></i> Tarts
              </Link>
              <Link to="/menu?category=Ice%20Cream" className="category-link">
                <i className="fas fa-ice-cream"></i> Ice Cream
              </Link>
              <Link to="/customize" className="category-link" style={{
                background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                color: '#fff',
                borderRadius: '20px',
                padding: '6px 16px',
                fontWeight: '700',
                boxShadow: '0 3px 10px rgba(255,107,107,0.35)',
                animation: 'pulse-glow 2s ease-in-out infinite'
              }}>
                <i className="fas fa-magic"></i> Customize ✨
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
