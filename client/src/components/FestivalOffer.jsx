import React, { useState, useEffect } from 'react';
import '../styles/FestivalOffer.css';

const festivals = [
  { month: 0, name: "Pongal", offer: "20% OFF", color: "#FF9933", image: "https://img.icons8.com/fluency/96/wheat.png" },
  { month: 1, name: "Valentine's", offer: "Buy 1 Get 1", color: "#FF1493", image: "https://img.icons8.com/fluency/96/heart-with-arrow.png" },
  { month: 2, name: "Holi", offer: "30% OFF", color: "#FF3366", image: "https://img.icons8.com/fluency/96/paint-palette.png" },
  { month: 3, name: "Ugadi", offer: "Sweet Deals", color: "#66CC33", image: "https://img.icons8.com/fluency/96/pot.png" },
  { month: 4, name: "Summer", offer: "15% OFF", color: "#FFCC00", image: "https://img.icons8.com/fluency/96/summer.png" },
  { month: 5, name: "Bakrid", offer: "Family Pack", color: "#3399FF", image: "https://img.icons8.com/fluency/96/moon-star.png" },
  { month: 6, name: "Monsoon", offer: "Hot Deals", color: "#9966CC", image: "https://img.icons8.com/fluency/96/rain.png" },
  { month: 7, name: "Rakhi", offer: "Gift Boxes", color: "#FF6600", image: "https://img.icons8.com/fluency/96/gift.png" },
  { month: 8, name: "Ganesh", offer: "Modak Special", color: "#FF9900", image: "https://img.icons8.com/fluency/96/elephant.png" },
  { month: 9, name: "Dussehra", offer: "Mega Sale", color: "#FF3300", image: "https://img.icons8.com/fluency/96/bow-and-arrow.png" },
  { month: 10, name: "Diwali", offer: "50% OFF", color: "#FFD700", image: "https://img.icons8.com/fluency/96/diwali.png" },
  { month: 11, name: "Christmas", offer: "Flat 50% OFF", color: "#D42426", image: "https://img.icons8.com/fluency/96/christmas-reindeer.png" }
];

const FestivalOffer = () => {
  const [currentFestival, setCurrentFestival] = useState(festivals[0]);

  useEffect(() => {
    const month = new Date().getMonth();
    setCurrentFestival(festivals[month] || festivals[0]);
  }, []);

  return (
    <div className="festival-widget" style={{ 
      background: `linear-gradient(135deg, ${currentFestival.color}, ${currentFestival.color}dd)`,
      boxShadow: `0 8px 20px ${currentFestival.color}60`
    }}>
      <div className="festival-img-container">
        <img src={currentFestival.image} alt={currentFestival.name} />
      </div>
      <div className="festival-content">
        <span className="festival-label">{currentFestival.name}</span>
        <div className="festival-offer-badge">
          {currentFestival.offer}
        </div>
      </div>
    </div>
  );
};

export default FestivalOffer;
