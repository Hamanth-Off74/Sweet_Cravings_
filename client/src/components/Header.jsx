import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { useCart } from '../context/CartContext';
import { useDarkMode } from '../context/DarkModeContext';
import { useState } from 'react';
import BackgroundSlideshow from './BackgroundSlideshow';
import { HeaderDock } from './ui/header-dock';
import { IconShoppingCart, IconMoon, IconSun, IconReceipt } from '@tabler/icons-react';
import FloatingVoiceButton from './FloatingVoiceButton';

const DeliveryDetailsPage = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    address: user?.unsafeMetadata?.address || '',
    phone: user?.unsafeMetadata?.phone || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          address: formData.address,
          phone: formData.phone
        }
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div style={{ padding: '24px', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#333', margin: 0 }}>Delivery Profile</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            style={{ padding: '6px 12px', background: '#f0f0f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            Edit
          </button>
        )}
      </div>

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery Address</h4>
        {isEditing ? (
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            placeholder="Enter your full delivery address"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', minHeight: '60px', fontFamily: 'inherit' }}
          />
        ) : (
          <p style={{ margin: 0, fontSize: '15px', color: '#444', lineHeight: '1.5' }}>
            <i className="fas fa-map-marker-alt" style={{color: '#ff6b6b', marginRight: '8px'}}></i>
            {formData.address || 'No delivery address saved yet.'}
          </p>
        )}
      </div>

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Number</h4>
        {isEditing ? (
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="Enter your phone number"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontFamily: 'inherit' }}
          />
        ) : (
          <p style={{ margin: 0, fontSize: '15px', color: '#444' }}>
            <i className="fas fa-phone-alt" style={{color: '#ff6b6b', marginRight: '8px'}}></i>
            {formData.phone || 'No phone number saved yet.'}
          </p>
        )}
      </div>

      {isEditing ? (
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            style={{ flex: 1, padding: '10px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            onClick={() => {
              setIsEditing(false);
              setFormData({ address: user?.unsafeMetadata?.address || '', phone: user?.unsafeMetadata?.phone || '' });
            }}
            disabled={isSaving}
            style={{ flex: 1, padding: '10px', background: '#ccc', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <p style={{ marginTop: '20px', fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
          * Your details will be automatically used to speed up your checkout.
        </p>
      )}
    </div>
  );
};


function Header() {
  const { getCartCount } = useCart();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Coimbatore');
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
    setIsLocating(true);
    setTimeout(() => {
      const areas = [
        'RS Puram, Coimbatore',
        'Peelamedu, Coimbatore',
        'Gandhipuram, Coimbatore',
        'Ramanathapuram, Coimbatore',
        'Saravanampatti, Coimbatore',
        'Saibaba Colony, Coimbatore',
        'Race Course, Coimbatore'
      ];
      const randomArea = areas[Math.floor(Math.random() * areas.length)];
      setSelectedLocation(randomArea);
      setIsLocating(false);
      alert(`Location set to: ${randomArea}\n(Delivery is available across Coimbatore areas only)`);
    }, 600);
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
                  >
                    <UserButton.UserProfilePage
                      label="Delivery Details"
                      url="delivery"
                      labelIcon={<i className="fas fa-truck"></i>}
                    >
                      <DeliveryDetailsPage />
                    </UserButton.UserProfilePage>
                  </UserButton>
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
