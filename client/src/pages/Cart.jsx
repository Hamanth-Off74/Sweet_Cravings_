import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  
  const subtotal = getCartTotal();
  const deliveryFee = subtotal >= 500 ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="cart-section">
      <div className="container">
        
        <div id="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-cart"></i>
              <h2>Your cart is empty</h2>
              <p>Add some delicious desserts to get started!</p>
              <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
            </div>
          ) : (
            <>
            <h1 className="section-title">Shopping Cart</h1>
            <div className="cart-layout" style={{display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', alignItems: 'start', maxWidth: '1200px', margin: '0 auto'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                {cart.map(item => (
                  <div key={item.id} className="cart-item" style={{
                    background: '#fff',
                    padding: '15px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <img src={item.imageURL || item.image} alt={item.name} style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }} />
                    <div style={{flex: 1}}>
                      <h3 style={{margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600'}}>{item.name}</h3>
                      <p style={{margin: 0, color: '#ff6161', fontWeight: '500'}}>₹{item.price.toFixed(2)} each</p>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{
                        width: '30px',
                        height: '30px',
                        border: '1px solid #ddd',
                        background: '#f5f5f5',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}>-</button>
                      <span style={{minWidth: '30px', textAlign: 'center', fontWeight: '600'}}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{
                        width: '30px',
                        height: '30px',
                        border: '1px solid #ddd',
                        background: '#f5f5f5',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{
                      background: '#ff6161',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 15px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}>
                      <i className="fas fa-trash"></i> Remove
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="order-summary" style={{
                background: '#fff',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                position: 'sticky',
                top: '100px'
              }}>
                <h3 style={{margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600'}}>Order Summary</h3>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px'}}>
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px'}}>
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px'}}>
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <hr style={{margin: '15px 0', border: 'none', borderTop: '1px solid #eee'}} />
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold'}}>
                  <span>Total</span>
                  <span style={{color: '#ff6161'}}>₹{total.toFixed(2)}</span>
                </div>
                <Link to="/checkout" style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #ff6161 0%, #ff8787 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  textDecoration: 'none',
                  transition: 'transform 0.2s'
                }}>
                  Proceed to Checkout
                </Link>
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
