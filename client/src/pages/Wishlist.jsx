import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      imageURL: item.imageURL
    });
  };

  return (
    <div className="cart-section">
      <div className="container">
        <h1 className="section-title" style={{color: '#ff6161'}}>
          <i className="fas fa-heart"></i> My Wishlist
        </h1>
        
        {wishlist.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <i className="fas fa-heart-broken" style={{fontSize: '80px', color: '#ffcdd2', marginBottom: '20px'}}></i>
            <h2 style={{color: '#333', marginBottom: '10px'}}>Your wishlist is empty</h2>
            <p style={{color: '#666', marginBottom: '30px'}}>
              Save your favorite desserts here and never lose track of what you love!
            </p>
            <Link to="/menu" style={{
              display: 'inline-block',
              padding: '14px 40px',
              background: 'linear-gradient(135deg, #ff6161 0%, #ff8787 100%)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px'
            }}>
              Browse Desserts
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            padding: '20px 0'
          }}>
            {wishlist.map(item => (
              <div key={item.id} style={{
                background: '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                position: 'relative'
              }}>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: '#ff6161',
                    fontSize: '18px',
                    cursor: 'pointer',
                    zIndex: 10,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.background = '#ff6161';
                    e.target.style.color = '#fff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                    e.target.style.color = '#ff6161';
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
                
                <img 
                  src={item.image} 
                  alt={item.name} 
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />
                
                <div style={{padding: '20px'}}>
                  <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '18px',
                    color: '#333',
                    fontWeight: '600'
                  }}>
                    {item.name}
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <span style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#ff6161'
                    }}>
                      ₹{item.price.toFixed(2)}
                    </span>
                    {item.rating && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '14px',
                        color: '#ffa500'
                      }}>
                        <i className="fas fa-star"></i>
                        <span>{item.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(item)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'linear-gradient(135deg, #ff6161 0%, #ff8787 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <i className="fas fa-shopping-cart"></i> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
