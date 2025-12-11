import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductReviews from '../components/ProductReviews';
import '../styles/ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Mock product data - in real app, fetch from API
  const product = {
    _id: id,
    name: 'Chocolate Fudge Cake',
    price: 450,
    originalPrice: 600,
    discount: 25,
    rating: 4.8,
    reviews: 156,
    description: 'Indulge in our decadent Chocolate Fudge Cake, made with premium Belgian chocolate and rich cocoa. Layers of moist chocolate sponge with velvety chocolate ganache frosting. Perfect for celebrations or treating yourself!',
    imageURL: '/images/cakes/chocolate-cake.jpg',
    category: 'cakes',
    stock: 8,
    features: [
      'Made with Premium Belgian Chocolate',
      'Freshly Baked Daily',
      'Eggless Option Available',
      'Best Before 3 Days'
    ],
    ingredients: 'All-purpose flour, Cocoa powder, Sugar, Butter, Eggs, Vanilla extract, Baking powder, Dark chocolate, Heavy cream',
    weight: '1 kg',
    servings: '8-10 people'
  };

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.imageURL,
      quantity: quantity
    });
  };

  const toggleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.imageURL,
        rating: product.rating
      });
    }
  };

  const getStockStatus = () => {
    if (product.stock === 0) {
      return { text: 'Out of Stock', color: '#f44336', icon: 'times-circle' };
    } else if (product.stock <= 5) {
      return { text: `Only ${product.stock} left!`, color: '#ff9800', icon: 'exclamation-triangle' };
    } else if (product.stock <= 10) {
      return { text: 'Low Stock', color: '#ffa726', icon: 'info-circle' };
    } else {
      return { text: 'In Stock', color: '#4caf50', icon: 'check-circle' };
    }
  };

  const stockStatus = getStockStatus();

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${product.name} at SweetCravings!`;
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      copy: url
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } else {
      window.open(shareUrls[platform], '_blank');
    }
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a onClick={() => navigate('/')}>Home</a>
          <i className="fas fa-chevron-right"></i>
          <a onClick={() => navigate('/menu')}>Menu</a>
          <i className="fas fa-chevron-right"></i>
          <span>{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="product-detail-grid">
          {/* Product Image */}
          <div className="product-image-section">
            <img src={product.imageURL} alt={product.name} />
            {product.discount > 0 && (
              <div className="discount-badge">{product.discount}% OFF</div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="rating-section">
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <i 
                    key={star}
                    className={`fas fa-star ${star <= Math.round(product.rating) ? 'filled' : ''}`}
                  ></i>
                ))}
                <span className="rating-value">{product.rating}</span>
              </div>
              <span className="reviews-count">({product.reviews} reviews)</span>
            </div>

            <div className="price-section">
              <span className="current-price">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="original-price">₹{product.originalPrice}</span>
                  <span className="discount-percent">{product.discount}% off</span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="stock-status" style={{ color: stockStatus.color }}>
              <i className={`fas fa-${stockStatus.icon}`}></i>
              {stockStatus.text}
            </div>

            {/* Product Meta */}
            <div className="product-meta">
              <div className="meta-item">
                <i className="fas fa-weight"></i>
                <span>Weight: {product.weight}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-users"></i>
                <span>Serves: {product.servings}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-tag"></i>
                <span>Category: {product.category}</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <i className="fas fa-shopping-cart"></i>
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button 
                className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
                onClick={toggleWishlist}
              >
                <i className={`fa${isInWishlist(product._id) ? 's' : 'r'} fa-heart`}></i>
              </button>
            </div>

            {/* Feature Badges */}
            <div className="feature-badges">
              <div className="badge">
                <i className="fas fa-shield-alt"></i>
                <span>100% Safe</span>
              </div>
              <div className="badge">
                <i className="fas fa-undo"></i>
                <span>Easy Returns</span>
              </div>
              <div className="badge">
                <i className="fas fa-headset"></i>
                <span>24/7 Support</span>
              </div>
            </div>

            {/* Social Share */}
            <div className="social-share">
              <span>Share:</span>
              <button onClick={() => handleShare('whatsapp')} title="Share on WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </button>
              <button onClick={() => handleShare('facebook')} title="Share on Facebook">
                <i className="fab fa-facebook"></i>
              </button>
              <button onClick={() => handleShare('twitter')} title="Share on Twitter">
                <i className="fab fa-twitter"></i>
              </button>
              <button onClick={() => handleShare('copy')} title="Copy Link">
                <i className="fas fa-link"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button 
              className={activeTab === 'description' ? 'active' : ''}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={activeTab === 'features' ? 'active' : ''}
              onClick={() => setActiveTab('features')}
            >
              Features
            </button>
            <button 
              className={activeTab === 'ingredients' ? 'active' : ''}
              onClick={() => setActiveTab('ingredients')}
            >
              Ingredients
            </button>
          </div>
          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-panel">
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === 'features' && (
              <div className="tab-panel">
                <ul className="features-list">
                  {product.features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check-circle"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'ingredients' && (
              <div className="tab-panel">
                <p>{product.ingredients}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={product._id} productName={product.name} />
      </div>
    </div>
  );
}

export default ProductDetail;
