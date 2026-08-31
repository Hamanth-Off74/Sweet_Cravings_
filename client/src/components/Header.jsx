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

        <nav className="navbar" style={{ background: '#ff003c', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* Left: Brand Logo & Delivering To */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <Link to="/" className="logo" style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'system-ui' }}>
                <i className="fas fa-birthday-cake" style={{ color: '#fff' }}></i>
                <span style={{ fontWeight: '800', letterSpacing: '-0.5px' }}>SweetCravings</span>
              </Link>

              <div className="location-selector" onClick={handleLocationClick} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', cursor: 'pointer', fontSize: '13px', background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <i className={`fas ${isLocating ? 'fa-spinner fa-spin' : 'fa-map-marker-alt'}`} style={{ color: '#fff', fontSize: '14px' }}></i>
                <span style={{ fontWeight: '500' }}>Delivering To: <strong style={{ textDecoration: 'underline' }}>{isLocating ? 'Locating...' : selectedLocation.split(',')[0]}</strong></span>
                <i className="fas fa-chevron-down" style={{ fontSize: '9px' }}></i>
              </div>
            </div>

            {/* Center: Search Bar */}
            <form className="search-bar" onSubmit={handleSearch} style={{ flex: '1', maxWidth: '500px', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-search" style={{ position: 'absolute', left: '16px', color: '#888', fontSize: '15px' }}></i>
              <input
                type="text"
                placeholder="Search For Cakes, Occasion, Flavour And More..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  width: '100%',
                  padding: '12px 45px 12px 42px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  outline: 'none',
                  background: '#fff',
                  color: '#333',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              />
              <div style={{ position: 'absolute', right: '12px', display: 'flex', alignItems: 'center' }}>
                <FloatingVoiceButton isInline={true} />
              </div>
            </form>

            {/* Right: Action Links */}
            <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {/* Dark Mode toggle */}
              <button 
                onClick={toggleDarkMode}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '11px', gap: '4px', padding: 0 }}
              >
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`} style={{ fontSize: '18px' }}></i>
                <span style={{ fontWeight: '500' }}>Theme</span>
              </button>

              {/* Track Order */}
              <Link to="/orders" style={{ textDecoration: 'none', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                <i className="fas fa-receipt" style={{ fontSize: '18px' }}></i>
                <span style={{ fontWeight: '500' }}>Track Order</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" style={{ textDecoration: 'none', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '11px', position: 'relative' }}>
                <i className="fas fa-shopping-cart" style={{ fontSize: '18px' }}></i>
                <span style={{ fontWeight: '500' }}>Cart</span>
                {getCartCount() > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-4px',
                    background: '#fff',
                    color: '#ff003c',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* Login / Profile */}
              <SignedOut>
                <SignInButton mode="modal">
                  <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '11px', padding: 0 }}>
                    <i className="fas fa-user" style={{ fontSize: '18px' }}></i>
                    <span style={{ fontWeight: '500' }}>Login/Signup</span>
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Admin Panel */}
                  <Link to="/admin/login" style={{ textDecoration: 'none', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                    <i className="fas fa-user-shield" style={{ fontSize: '18px' }}></i>
                    <span style={{ fontWeight: '500' }}>Admin</span>
                  </Link>

                  {/* Profile Button */}
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
