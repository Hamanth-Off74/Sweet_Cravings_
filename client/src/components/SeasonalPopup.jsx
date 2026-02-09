import React, { useEffect, useState } from 'react';
import '../styles/SeasonalPopup.css';

const seasonalData = {
  0: { // January
    theme: 'theme-pongal',
    title: 'Happy Pongal!',
    subtitle: 'Harvest the Sweetness',
    offers: [
      { icon: 'fas fa-sun', text: 'Flat 20% OFF on Sweets' },
      { icon: 'fas fa-gift', text: 'Free Gift Box on Orders > ₹500' }
    ],
    color: '#FF9933'
  },
  1: { // February
    theme: 'theme-valentine',
    title: 'Happy Valentine\'s',
    subtitle: 'Share the Love & Sweetness',
    offers: [
      { icon: 'fas fa-heart', text: 'Buy 1 Get 1 Free on Cakes' },
      { icon: 'fas fa-kiss-wink-heart', text: 'Special Heart Shape Customization' }
    ],
    color: '#FF69B4'
  },
  10: { // November (Diwali usually)
    theme: 'theme-diwali',
    title: 'Happy Diwali!',
    subtitle: 'Festival of Lights & Sweets',
    offers: [
      { icon: 'fas fa-fire', text: 'Flat 50% OFF on All Sweets' },
      { icon: 'fas fa-box-open', text: 'Family Pack @ ₹999 Only' }
    ],
    color: '#FFD700'
  },
  11: { // December
    theme: 'theme-christmas',
    title: 'Merry Christmas',
    subtitle: 'Jingle All The Way To Sweetness',
    offers: [
      { icon: 'fas fa-snowflake', text: 'Flat 50% OFF on Plum Cakes' },
      { icon: 'fas fa-gifts', text: 'Buy 2 Get 2 Free on Cookies' }
    ],
    color: '#D42426'
  }
};

const defaultTheme = {
  theme: 'theme-generic',
  title: 'Welcome!',
  subtitle: 'Indulge in Pure Sweetness',
  offers: [
    { icon: 'fas fa-tag', text: 'Flat 10% OFF on First Order' }
  ],
  color: '#ff9a9e'
};

const SeasonalPopup = ({ onClose }) => {
  const [currentData, setCurrentData] = useState(defaultTheme);
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    // Prevent body scrolling when popup is open
    // document.body.style.overflow = 'hidden';
    
    const month = new Date().getMonth();
    if (seasonalData[month]) {
      setCurrentData(seasonalData[month]);
    }

    // Generate snowflakes if Christmas
    if (month === 11) {
      const flakes = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100 + '%',
        animationDuration: Math.random() * 3 + 2 + 's',
        animationDelay: Math.random() * 2 + 's',
        opacity: Math.random(),
        size: Math.random() * 10 + 10 + 'px'
      }));
      setSnowflakes(flakes);
    }

    // Restore body scrolling when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="seasonal-popup-overlay">
      <div className={`seasonal-popup-content ${currentData.theme}`}>
        <button className="seasonal-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        {currentData.theme === 'theme-christmas' && (
          <div className="snow-container">
            {snowflakes.map(flake => (
              <div 
                key={flake.id} 
                className="snowflake" 
                style={{
                  left: flake.left,
                  animationDuration: flake.animationDuration,
                  animationDelay: flake.animationDelay,
                  opacity: flake.opacity,
                  fontSize: flake.size
                }}
              >
                ❄
              </div>
            ))}
          </div>
        )}

        <h1 className="popup-title">{currentData.title}</h1>
        <p className="popup-subtitle">{currentData.subtitle}</p>

        <div className="offer-badge-container">
          {currentData.offers.map((offer, index) => (
            <div key={index} className="offer-badge">
              <i className={offer.icon}></i>
              <span>{offer.text}</span>
            </div>
          ))}
        </div>

        <button className="shop-now-btn" onClick={onClose}>
          Order Now
        </button>
      </div>
    </div>
  );
};

export default SeasonalPopup;
