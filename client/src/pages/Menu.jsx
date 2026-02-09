import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { desserts } from '../data/desserts';
import QuickView from '../components/QuickView';
import OfferBanner from '../components/OfferBanner';
import FestivalSpecials from '../components/FestivalSpecials';
import FloatingVoiceButton from '../components/FloatingVoiceButton';
import '../styles/MenuModern.css';

function Menu() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDesserts, setFilteredDesserts] = useState(desserts);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  // Handle URL query params for search and category
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    let filtered = desserts;

    // Apply category filter from URL
    if (categoryParam && categoryParam !== 'all') {
      setSelectedCategory(categoryParam);
      filtered = filtered.filter(d => d.category === categoryParam);
    } else {
      setSelectedCategory('all');
    }

    // Apply search filter from URL
    if (searchParam) {
      setSearchQuery(searchParam);
      const searchLower = searchParam.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchLower) ||
        d.description.toLowerCase().includes(searchLower) ||
        d.category.toLowerCase().includes(searchLower)
      );
    } else {
      setSearchQuery('');
    }

    setFilteredDesserts(filtered);
  }, [searchParams]);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    let filtered = desserts;

    if (category !== 'all') {
      filtered = filtered.filter(d => d.category === category);
    }

    // Also apply current search if any
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchLower) ||
        d.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredDesserts(filtered);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    let filtered = desserts;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(d => d.category === selectedCategory);
    }

    // Apply search
    if (query) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchLower) ||
        d.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredDesserts(filtered);
  };

  const handleAddToCart = (dessert) => {
    addToCart({
      id: dessert._id,
      name: dessert.name,
      price: dessert.price,
      imageURL: dessert.imageURL
    });
  };

  const categories = ['all', 'Cakes', 'Cookies', 'Pies', 'Italian', 'Brownies', 'Tarts', 'Ice Cream'];

  return (
    <>
      {/* Dynamic Offers from Admin Panel */}
      <OfferBanner />

      {/* Festival Special Items */}
      <FestivalSpecials />
      <div className="products-section menu-modern">
        <div className="container">
          <h1 className="section-title">Our Dessert Collection</h1>

          {/* Search Bar for Menu Page */}
          {searchQuery && (
            <div className="search-results-info">
              <p>
                Showing results for: <strong>"{searchQuery}"</strong>
                <span className="results-count">({filteredDesserts.length} items found)</span>
              </p>
            </div>
          )}

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

          {filteredDesserts.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>No desserts found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button className="btn btn-primary" onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setFilteredDesserts(desserts);
              }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="dessert-grid" id="dessert-grid">
              {filteredDesserts.map(dessert => (
                <div key={dessert._id} className="dessert-card" data-category={dessert.category}>
                  {/* Heart icon top-left */}
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

                  {/* Discount badge */}
                  {dessert.discount > 0 && (
                    <div className="discount-pill">{dessert.discount}% OFF</div>
                  )}

                  {/* Image */}
                  <Link to={`/product/${dessert._id}`}>
                    <div className="dessert-image">
                      <img src={dessert.imageURL} alt={dessert.name} />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="dessert-info">
                    <Link to={`/product/${dessert._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 className="dessert-name">{dessert.name}</h3>
                    </Link>

                    <div className="rating-section">
                      <div className="rating-stars" data-rating={dessert.rating}>
                        <i className="fas fa-star"></i>
                        <span>{dessert.rating}</span>
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
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <QuickView
          product={quickViewProduct}
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
        />
      </div>
    </>
  );
}

export default Menu;
