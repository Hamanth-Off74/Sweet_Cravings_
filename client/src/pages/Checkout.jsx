import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from '../api/axios';
import { validatePromoCode } from '../utils/promoCodes';

function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    zipCode: '',
    instructions: '',
    paymentMethod: 'razorpay'
  });

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const subtotal = getCartTotal();
  const deliveryFee = subtotal >= 500 ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax - promoDiscount;

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyPromo = () => {
    const result = validatePromoCode(promoCode, subtotal);
    if (result.valid) {
      setPromoDiscount(result.discount);
      setAppliedPromo(result.code);
      setPromoError('');
    } else {
      setPromoError(result.message);
      setPromoDiscount(0);
      setAppliedPromo(null);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoError('');
    setAppliedPromo(null);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    const orderData = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      },
      address: {
        street: formData.street,
        city: formData.city,
        zipCode: formData.zipCode,
        instructions: formData.instructions
      },
      items: cart,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      tax: tax,
      total: total,
      paymentMethod: formData.paymentMethod
    };

    try {
      // Handle Cash on Delivery
      if (formData.paymentMethod === 'cod') {
        const response = await axios.post('/api/order', orderData);
        
        if (response.data.success) {
          clearCart();
          navigate('/confirmation', {
            state: {
              orderData: {
                ...orderData,
                orderId: response.data.orderId
              }
            }
          });
        } else {
          alert('Failed to place order: ' + response.data.error);
        }
        return;
      }

      // Handle Razorpay payment
      const response = await axios.post('/api/create-razorpay-order', {
        amount: total,
        currency: 'INR',
        receipt: 'order_' + Date.now()
      });

      if (!response.data.success) {
        alert('Failed to create payment order: ' + response.data.message);
        return;
      }

      const options = {
        key: response.data.key_id,
        amount: response.data.amount,
        currency: response.data.currency,
        name: 'SweetCravings',
        description: 'Order Payment',
        order_id: response.data.order_id,
        handler: async function (paymentResponse) {
          try {
            const verifyRes = await axios.post('/api/verify-payment', {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              orderData: orderData
            });

            clearCart();
            navigate('/confirmation', {
              state: {
                orderData: {
                  ...orderData,
                  orderId: verifyRes.data.orderId
                }
              }
            });
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed!');
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#ff6161'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment cancelled by user');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert('Payment failed: ' + response.error.description);
      });
      razorpay.open();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to create payment order: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="cart-section" style={{paddingBottom: '50px'}}>
      <div className="container">
        <h1 className="section-title">Checkout</h1>
        
        <form onSubmit={handleCheckout} style={{maxWidth: '800px', margin: '0 auto', paddingBottom: '30px'}}>
          {/* Customer Information */}
          <div style={{background: '#fff', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
            <h3 style={{margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <i className="fas fa-user"></i> Customer Information
            </h3>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555'}}>First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px'}}
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555'}}>Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px'}}
                />
              </div>
            </div>
            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555'}}>Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px'}}
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555'}}>Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px'}}
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div style={{background: '#fff', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
            <h3 style={{margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <i className="fas fa-map-marker-alt"></i> Delivery Address
            </h3>
            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555'}}>Street Address</label>
              <input 
                type="text" 
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
                style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px'}}
              />
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555'}}>City</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px'}}
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555'}}>ZIP Code</label>
                <input 
                  type="text" 
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px'}}
                />
              </div>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555'}}>Delivery Instructions (Optional)</label>
              <textarea 
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                rows="3"
                placeholder="Any special instructions for delivery..."
                style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', resize: 'vertical'}}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div style={{background: '#fff', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
            <h3 style={{margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <i className="fas fa-credit-card"></i> Payment Method
            </h3>
            <div style={{display: 'flex', gap: '15px'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="razorpay" 
                  checked={formData.paymentMethod === 'razorpay'}
                  onChange={handleInputChange}
                />
                <span>Pay with Razorpay (Cards/UPI/Wallets)</span>
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cod" 
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
            <p style={{margin: '15px 0 0 0', fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '5px'}}>
              <i className="fas fa-lock"></i> Secure payment powered by Razorpay<br/>
              Supports Credit/Debit Cards, UPI, Netbanking, Wallets & more
            </p>
          </div>

          {/* Promo Code */}
          <div style={{background: '#fff', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
            <h3 style={{margin: '0 0 15px 0', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <i className="fas fa-tag"></i> Have a Promo Code?
            </h3>
            {!appliedPromo ? (
              <>
                <div style={{display: 'flex', gap: '10px'}}>
                  <input 
                    type="text" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    style={{
                      flex: 1, 
                      padding: '12px', 
                      border: '1px solid #ddd', 
                      borderRadius: '6px', 
                      fontSize: '14px',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button 
                    type="button"
                    onClick={handleApplyPromo}
                    style={{
                      padding: '12px 24px',
                      background: '#ff6161',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p style={{margin: '10px 0 0 0', color: '#ff6161', fontSize: '13px'}}>
                    <i className="fas fa-exclamation-circle"></i> {promoError}
                  </p>
                )}
              </>
            ) : (
              <div style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px',
                background: '#e8f5e9',
                borderRadius: '6px',
                border: '1px solid #4caf50'
              }}>
                <div>
                  <span style={{fontSize: '14px', fontWeight: '600', color: '#2e7d32'}}>
                    <i className="fas fa-check-circle"></i> {appliedPromo.code} Applied!
                  </span>
                  <p style={{margin: '4px 0 0 0', fontSize: '13px', color: '#555'}}>
                    {appliedPromo.description}
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={handleRemovePromo}
                  style={{
                    padding: '6px 12px',
                    background: 'transparent',
                    color: '#666',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div style={{background: '#fff', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
            <h3 style={{margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600'}}>Order Summary</h3>
            {cart.map(item => (
              <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px'}}>
                <span>{item.name} (x{item.quantity})</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr style={{margin: '15px 0', border: 'none', borderTop: '1px solid #eee'}} />
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px'}}>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px'}}>
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px'}}>
              <span>Tax</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            {promoDiscount > 0 && (
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#4caf50'}}>
                <span>Promo Discount</span>
                <span>-₹{promoDiscount.toFixed(2)}</span>
              </div>
            )}
            <hr style={{margin: '15px 0', border: 'none', borderTop: '2px solid #eee'}} />
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold'}}>
              <span>Total</span>
              <span style={{color: '#ff6161'}}>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '18px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #ff6161 0%, #ff8787 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 12px rgba(255, 97, 97, 0.3)'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <i className="fas fa-lock"></i> Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
