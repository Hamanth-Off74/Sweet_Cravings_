import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { desserts } from '../data/desserts';
import QuickView from '../components/QuickView';

function Menu() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredDesserts, setFilteredDesserts] = useState(desserts);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredDesserts(desserts);
    } else {
      setFilteredDesserts(desserts.filter(d => d.category === category));
    }
  };

  const handleAddToCart = (dessert) => {
    addToCart({
      id: dessert._id,
      name: dessert.name,
      price: dessert.price,
      image: dessert.imageURL
    });
  };

  const categories = ['all', 'Cakes', 'Cookies', 'Pies', 'Italian', 'Brownies', 'Tarts', 'Ice Cream'];

  return (
    <div className="products-section">
      <div className="container">
        <h1 className="section-title">Our Dessert Collection</h1>
        
        {/* Advanced Filters */}
        <div className="advanced-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <div className="filter-buttons">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryFilter(category)}
                  >
                    {category === 'all' ? 'All Items' : category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="dessert-grid" id="dessert-grid">
          {filteredDesserts.map(dessert => (
            <div key={dessert._id} className="dessert-card" data-category={dessert.category}>
              <div className="dessert-image">
                <img src={dessert.imageURL} alt={dessert.name} />
                {dessert.discount > 0 && (
                  <div className="discount-badge">{dessert.discount}% OFF</div>
                )}
                {dessert.price >= 1000 && (
                  <div className="free-delivery-badge">FREE Delivery</div>
                )}
                <button 
                  className="wishlist-icon"
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
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: isInWishlist(dessert._id) ? '#ff6161' : '#999',
                    fontSize: '18px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                  }}
                >
                  <i className={`fa${isInWishlist(dessert._id) ? 's' : 'r'} fa-heart`}></i>
                </button>
                <button
                  className="quickview-btn"
                  onClick={() => {
                    setQuickViewProduct(dessert);
                    setShowQuickView(true);
                  }}
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    background: 'rgba(255, 97, 97, 0.95)',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className="fas fa-eye"></i> Quick View
                </button>
              </div>
              <div className="dessert-info">
                <Link to={`/product/${dessert._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 className="dessert-name" style={{ cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#ff6161'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>{dessert.name}</h3>
                </Link>
                <p className="dessert-description">{dessert.description}</p>
                
                <div className="rating-section">
                  <div className="rating-stars" data-rating={dessert.rating}>
                    <i className="fas fa-star"></i>
                    {dessert.rating}
                  </div>
                  <span className="reviews">({dessert.reviews} reviews)</span>
                </div>
                
                <div className="price-section">
                  <span className="dessert-price current-price">₹{dessert.price.toFixed(2)}</span>
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
                    <i className="fas fa-shopping-cart"></i> Add to Cart
                  </button>
                  <button className="review-btn">
                    <i className="fas fa-star"></i> Reviews
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <QuickView 
        product={quickViewProduct}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </div>
  );
}

export default Menu;
