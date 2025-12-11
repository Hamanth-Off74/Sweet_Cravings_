import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/QuickView.css';

function QuickView({ product, isOpen, onClose }) {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!isOpen || !product) return null;

  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.imageURL
      });
    }
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  const toggleWishlist = () => {
    if (inWishlist) {
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

  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div className="quickview-content" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="quickview-grid">
          <div className="quickview-images">
            <img 
              src={product.imageURL} 
              alt={product.name}
              className="quickview-main-image"
            />
            {product.discount > 0 && (
              <div className="quickview-badge discount">{product.discount}% OFF</div>
            )}
          </div>

          <div className="quickview-info">
            <h2 className="quickview-title">{product.name}</h2>
            
            <div className="quickview-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i} 
                    className={`fas fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                  ></i>
                ))}
                <span>{product.rating}</span>
              </div>
              <span className="reviews-count">({product.reviews} reviews)</span>
            </div>

            <p className="quickview-description">{product.description}</p>

            <div className="quickview-price">
              <span className="current-price">₹{product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="original-price">₹{product.originalPrice.toFixed(2)}</span>
                  <span className="save-badge">Save ₹{(product.originalPrice - product.price).toFixed(2)}</span>
                </>
              )}
            </div>

            {product.price >= 1000 && (
              <div className="free-delivery-notice">
                <i className="fas fa-truck"></i> Free Delivery on this item!
              </div>
            )}

            <div className="quickview-quantity">
              <label>Quantity:</label>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <i className="fas fa-minus"></i>
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>

            <div className="quickview-actions">
              <button className="btn-add-cart" onClick={handleAddToCart}>
                <i className="fas fa-shopping-cart"></i>
                Add to Cart
              </button>
              <button 
                className={`btn-wishlist ${inWishlist ? 'active' : ''}`}
                onClick={toggleWishlist}
              >
                <i className={`fa${inWishlist ? 's' : 'r'} fa-heart`}></i>
              </button>
            </div>

            <div className="quickview-features">
              <div className="feature">
                <i className="fas fa-shield-alt"></i>
                <span>100% Safe & Secure</span>
              </div>
              <div className="feature">
                <i className="fas fa-undo"></i>
                <span>Easy Returns</span>
              </div>
              <div className="feature">
                <i className="fas fa-headset"></i>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickView;
