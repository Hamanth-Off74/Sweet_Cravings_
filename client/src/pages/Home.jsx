import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getFeaturedDesserts, getLimitedDesserts } from '../data/desserts';
import OfferBanner from '../components/OfferBanner';
import '../styles/MenuModern.css';

function Home() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [featured] = useState(getFeaturedDesserts());
  const [desserts] = useState(getLimitedDesserts(5));
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Show welcome screen for 3.5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
      // Ensure body scrolling is restored
      document.body.style.overflow = '';
    }, 3500);

    return () => {
      clearTimeout(timer);
      // Always restore scrolling on cleanup
      document.body.style.overflow = '';
    };
  }, [showWelcome]);

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
      imageURL: dessert.imageURL
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

      {/* Dynamic Offers from Admin Panel */}
      <OfferBanner />

      <div className="products-section menu-modern" id="features">
        <div className="container">
          <h2 className="section-title">Featured Desserts</h2>

          <div className="dessert-grid" id="dessert-grid">
            {desserts.map((dessert) => (
              <div
                key={dessert._id}
                className="dessert-card"
                data-category={dessert.category.toLowerCase()}
              >
                {/* Top controls: heart + discount */}
                <button
                  className="card-heart"
                  onClick={() => {
                    if (isInWishlist(dessert._id)) {
                      removeFromWishlist(dessert._id);
                    } else {
                      addToWishlist({
                        id: dessert._id,
                        name: dessert.name,
                        price: dessert.price,
                        image: dessert.imageURL,
                        rating: dessert.rating
                      });
                    }
                  }}
                  aria-label="Add to wishlist"
                >
                  <i className={`fa${isInWishlist(dessert._id) ? 's' : 'r'} fa-heart`}></i>
                </button>
                {dessert.discount > 0 && (
                  <div className="discount-pill">{dessert.discount}% OFF</div>
                )}

                {/* Image */}
                <div className="dessert-image">
                  <img src={dessert.imageURL} alt={dessert.name} />
                </div>

                {/* Info */}
                <div className="dessert-info">
                  <Link
                    to={`/product/${dessert._id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <h3 className="dessert-name">{dessert.name}</h3>
                  </Link>

                  <div className="rating-section">
                    <div className="rating-stars" data-rating={dessert.rating}>
                      <i className="fas fa-star"></i>
                      {dessert.rating}
                    </div>
                    <span className="reviews">({dessert.reviews} reviews)</span>
                  </div>

                  <div className="price-section">
                    <span className="current-price">₹{dessert.price.toFixed(2)}</span>
                    {dessert.originalPrice && dessert.originalPrice > dessert.price && (
                      <>
                        <span className="original-price">₹{dessert.originalPrice.toFixed(2)}</span>
                        <span className="discount-percent">{dessert.discount}% off</span>
                      </>
                    )}
                  </div>

                  <div className="card-actions">
                    <button
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(dessert)}
                    >
                      <i className="fas fa-shopping-cart"></i>
                      Add
                    </button>
                    <button className="review-btn">
                      <i className="fas fa-star"></i>
                      Reviews
                    </button>
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
