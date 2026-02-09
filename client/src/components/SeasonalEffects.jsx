import React, { useEffect, useState } from 'react';
import '../styles/SeasonalEffects.css';

const SeasonalEffects = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    setMonth(currentMonth);
    
    // Generate elements based on month
    let newElements = [];
    const count = 30; // Number of particles

    // December (11) - Snow
    if (currentMonth === 11) {
      newElements = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100 + '%',
        animationDuration: Math.random() * 5 + 5 + 's', // 5-10s
        animationDelay: Math.random() * 5 + 's',
        opacity: Math.random() * 0.5 + 0.3,
        size: Math.random() * 10 + 10 + 'px',
        type: 'snow'
      }));
    }
    // February (1) - Hearts
    else if (currentMonth === 1) {
      newElements = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100 + '%',
        animationDuration: Math.random() * 10 + 10 + 's',
        animationDelay: Math.random() * 10 + 's',
        size: Math.random() * 15 + 10 + 'px',
        type: 'heart'
      }));
    }
    // October (9) or November (10) - Sparkles/Lights (Diwali)
    else if (currentMonth === 9 || currentMonth === 10) {
      newElements = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDuration: Math.random() * 2 + 1 + 's',
        animationDelay: Math.random() * 2 + 's',
        size: Math.random() * 4 + 2 + 'px',
        type: 'sparkle'
      }));
    }
    // June (5) or July (6) - Rain
    else if (currentMonth === 5 || currentMonth === 6) {
      newElements = Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100 + '%',
        animationDuration: Math.random() * 1 + 0.5 + 's',
        animationDelay: Math.random() * 2 + 's',
        type: 'rain'
      }));
    }

    setElements(newElements);
  }, []);

  if (elements.length === 0) return null;

  return (
    <div className="seasonal-effects-container">
      {month === 11 && elements.map(el => (
        <div 
          key={el.id} 
          className="snowflake" 
          style={{
            left: el.left,
            fontSize: el.size,
            opacity: el.opacity,
            animationDuration: el.animationDuration,
            animationDelay: el.animationDelay
          }}
        >
          ❄
        </div>
      ))}

      {month === 1 && elements.map(el => (
        <div 
          key={el.id} 
          className="floating-heart" 
          style={{
            left: el.left,
            fontSize: el.size,
            animationDuration: el.animationDuration,
            animationDelay: el.animationDelay
          }}
        >
          ❤
        </div>
      ))}

      {(month === 9 || month === 10) && elements.map(el => (
        <div 
          key={el.id} 
          className="sparkle" 
          style={{
            left: el.left,
            top: el.top,
            width: el.size,
            height: el.size,
            animationDuration: el.animationDuration,
            animationDelay: el.animationDelay
          }}
        />
      ))}

      {(month === 5 || month === 6) && elements.map(el => (
        <div 
          key={el.id} 
          className="raindrop" 
          style={{
            left: el.left,
            animationDuration: el.animationDuration,
            animationDelay: el.animationDelay
          }}
        />
      ))}
    </div>
  );
};

export default SeasonalEffects;
