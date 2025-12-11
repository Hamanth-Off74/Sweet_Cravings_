import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getFeaturedDesserts, getLimitedDesserts } from '../data/desserts';

function Home() {
  const { addToCart } = useCart();
  const [featured] = useState(getFeaturedDesserts());
  const [desserts] = useState(getLimitedDesserts(5));
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Hide welcome screen after 3 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-advance slideshow
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featured.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featured.length]);

  const changeSlide = (direction) => {
    setCurrentSlide((prev) => {
      const newSlide = prev + direction;
      if (newSlide < 0) return featured.length - 1;
      if (newSlide >= featured.length) return 0;
      return newSlide;
    });
  };

  const handleAddToCart = (dessert) => {
    addToCart({
      id: dessert._id,
      name: dessert.name,
      price: dessert.price,
      image: dessert.imageURL
    });
  };

  return (
    <>
      {/* Welcome Screen Overlay */}
      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-content">
            <div className="welcome-animation">
              <i className="fas fa-birthday-cake welcome-icon"></i>
            </div>
            <h1 className="welcome-title">WELCOME TO</h1>
            <h2 className="welcome-brand">SWEETCRAVINGS</h2>
            <p className="welcome-tagline">Indulge in Pure Sweetness</p>
            <div className="welcome-loader">
              <div className="loader-bar"></div>
            </div>
          </div>
        </div>
      )}

      <div className="slideshow-container">
        {featured.map((dessert, index) => (
          <div key={dessert._id} className={`slide fade ${index === currentSlide ? 'active' : ''}`}>
            <div className="slide-content">
              <div className="slide-image">
                <img src={dessert.imageURL} alt={dessert.name} />
              </div>
              <div className="slide-text">
                <h1>{dessert.name}</h1>
                <p>{dessert.description}</p>
                <div className="slide-price">
                  <span className="current-price">₹{dessert.price.toFixed(2)}</span>
                  {dessert.originalPrice && (
                    <span className="original-price">₹{dessert.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <div className="slide-buttons">
                  <Link to="/menu" className="btn btn-primary">
                    <i className="fas fa-shopping-cart"></i> Order Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation arrows */}
        <div className="slide-nav">
          <button className="slide-btn prev" onClick={() => changeSlide(-1)}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="slide-btn next" onClick={() => changeSlide(1)}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        {/* Slide indicators */}
        <div className="slide-indicators">
          {featured.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>

      <div className="products-section" id="features">
        <div className="container">
          <h2 className="section-title">Featured Desserts</h2>
          
          <div className="dessert-grid">
            {desserts.map((dessert) => (
              <div 
                key={dessert._id} 
                className="dessert-card" 
                data-category={dessert.category.toLowerCase()} 
                data-price={dessert.price} 
                data-rating={dessert.rating}
              >
                <div className="dessert-image">
                  <img src={dessert.imageURL} alt={dessert.name} />
                  {dessert.discount > 0 && (
                    <div className="discount-badge">{dessert.discount}% OFF</div>
                  )}
                  <button className="add-to-wishlist-btn" data-id={dessert._id}>
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
                <div className="dessert-info">
                  <h3 className="dessert-name">{dessert.name}</h3>
                  <p className="dessert-description">
                    {dessert.description.substring(0, 60)}...
                  </p>
                  
                  <div className="rating-section">
                    <div className="star-rating" data-rating={dessert.rating}>
                      <span className="rating-value">
                        <i className="fas fa-star"></i> {dessert.rating}
                      </span>
                    </div>
                    <span className="reviews-count">({dessert.reviews})</span>
                  </div>
                  
                  <div className="price-section">
                    <span className="current-price">₹{dessert.price.toFixed(2)}</span>
                    {dessert.originalPrice && dessert.originalPrice > dessert.price && (
                      <span className="original-price">₹{dessert.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <div className="card-actions">
                    <button
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(dessert)}
                    >
                      <i className="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button className="view-reviews-btn">Reviews</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/menu" className="btn btn-secondary">
              <i className="fas fa-eye"></i> View All Desserts
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
