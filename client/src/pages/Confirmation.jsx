import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { useCart } from '../context/CartContext';
import '../styles/Confirmation.css';

/* ─── Confetti ─── */
const COLORS = ['#ff6b6b', '#25d366', '#ffc107', '#a78bfa', '#38bdf8', '#fb923c'];

function ConfettiPiece({ style }) {
  return <div className="confetti-piece" style={style} />;
}

function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    background: COLORS[i % COLORS.length],
    width: `${8 + Math.random() * 8}px`,
    height: `${8 + Math.random() * 8}px`,
    animationDuration: `${1.5 + Math.random() * 2.5}s`,
    animationDelay: `${Math.random() * 1.5}s`,
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
  }));

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <ConfettiPiece
          key={p.id}
          style={{
            left: p.left,
            background: p.background,
            width: p.width,
            height: p.height,
            animationName: 'confetti-fall',
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            borderRadius: p.borderRadius,
          }}
        />
      ))}
    </div>
  );
}

/* ─── WhatsApp Message Builder ─── */
function buildWhatsAppMessage(orderData) {
  if (!orderData) return '';

  const { orderId, customer, items, total, paymentMethod, address } = orderData;

  const itemLines = items
    .map(item => `  🍰 ${item.name} × ${item.quantity} — ₹${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');

  const payLabel = paymentMethod === 'cod' || paymentMethod === 'cash'
    ? '💵 Cash on Delivery'
    : '💳 Online (Stripe)';

  const msg =
`🎉 *Order Confirmed — SweetCravings!*

👤 *Name:* ${customer?.firstName} ${customer?.lastName}
📦 *Order ID:* ${orderId}

🛒 *Items Ordered:*
${itemLines}

💰 *Total Paid:* ₹${Number(total).toFixed(2)}
${payLabel}
📍 *Delivery To:* ${address?.street}, ${address?.city}

🍮 Your desserts are being lovingly prepared. Delivery in ~45 mins!

Thank you for choosing SweetCravings! 🧁❤️`;

  return msg;
}

/* ─── Main Component ─── */
export default function Confirmation() {
  const location = useLocation();
  const { clearCart } = useCart();
  const query = new URLSearchParams(location.search);
  const sessionId = query.get('session_id');
  const orderId = query.get('order_id');

  const [orderData, setOrderData] = useState(location.state?.orderData || null);
  const [loading, setLoading] = useState(!!sessionId);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [previewExpanded, setPreviewExpanded] = useState(false);

  // Hide confetti after 4 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  // Verify Stripe payment session if query parameters are present
  useEffect(() => {
    if (sessionId && orderId && !orderData) {
      const verifyStripePayment = async () => {
        try {
          const response = await axios.post('/api/verify-stripe-session', {
            session_id: sessionId,
            order_id: orderId
          });

          if (response.data.success) {
            setOrderData(response.data.order);
            clearCart(); // Clear cart now that payment is confirmed!
          } else {
            setError(response.data.error || 'Payment verification failed');
          }
        } catch (err) {
          console.error('Failed to verify Stripe payment:', err);
          setError('Failed to verify payment session. Please contact customer support.');
        } finally {
          setLoading(false);
        }
      };
      verifyStripePayment();
    }
  }, [sessionId, orderId, orderData, clearCart]);

  const waMessage = buildWhatsAppMessage(orderData);
  const waUrl = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;

  // Fallback order details for display when no state passed
  const displayOrder = orderData || {
    orderId: 'SC-' + Date.now(),
    customer: { firstName: 'Valued', lastName: 'Customer' },
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    total: 0,
    paymentMethod: 'stripe',
    address: { street: '', city: '' }
  };

  const payLabel =
    displayOrder.paymentMethod === 'cod' || displayOrder.paymentMethod === 'cash'
      ? 'Cash on Delivery'
      : 'Online Payment (Stripe)';

  if (loading) {
    return (
      <div className="confirmation-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#ff6b6b', marginBottom: '20px' }}></i>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c1810', fontFamily: 'Playfair Display, serif' }}>Verifying Payment...</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>Please do not close this window or refresh the page.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="confirmation-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '20px' }}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: '#ff6b6b', marginBottom: '20px' }}></i>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c1810', fontFamily: 'Playfair Display, serif' }}>Payment Verification Failed</h2>
        <p style={{ color: '#666', margin: '10px 0 30px 0' }}>{error}</p>
        <Link to="/checkout" className="action-btn primary" style={{ background: '#ff6b6b', color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: '8px' }}>
          Back to Checkout
        </Link>
      </div>
    );
  }

  return (
    <>
      {showConfetti && <Confetti />}

      <div className="confirmation-page">
        <div className="confirmation-card">

          {/* ─── Header ─── */}
          <div className="confirmation-header">
            <div className="success-icon-wrap">
              <i className="fas fa-check" />
            </div>
            <h1>Order Confirmed! 🎉</h1>
            <p>Your desserts are being lovingly prepared</p>
            {displayOrder.orderId && (
              <div className="order-id-badge">
                <i className="fas fa-receipt" />
                {displayOrder.orderId}
              </div>
            )}
          </div>

          {/* ─── Body ─── */}
          <div className="confirmation-body">

            {/* ETA Banner */}
            <div className="eta-banner">
              <i className="fas fa-cookie-bite" />
              Estimated Delivery: <strong>30 – 45 minutes</strong> 🛵
            </div>

            {/* Order Items */}
            {displayOrder.items && displayOrder.items.length > 0 && (
              <div className="order-summary-section">
                <div className="section-label">🛒 Your Order</div>
                {displayOrder.items.map((item, i) => (
                  <div className="order-item-row" key={i}>
                    <div className="order-item-name">
                      <i className="fas fa-circle" />
                      {item.name}
                      <span className="item-qty-badge">×{item.quantity}</span>
                    </div>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="order-total-row">
                  <span>Total Paid</span>
                  <span>₹{Number(displayOrder.total).toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Delivery Info Chips */}
            <div className="delivery-info">
              <div className="info-chip">
                <i className="fas fa-user" />
                <div className="info-chip-content">
                  <strong>Customer</strong>
                  <span>{displayOrder.customer?.firstName} {displayOrder.customer?.lastName}</span>
                </div>
              </div>
              <div className="info-chip">
                <i className="fas fa-credit-card" />
                <div className="info-chip-content">
                  <strong>Payment</strong>
                  <span>{payLabel}</span>
                </div>
              </div>
              {displayOrder.address?.city && (
                <div className="info-chip">
                  <i className="fas fa-map-marker-alt" />
                  <div className="info-chip-content">
                    <strong>Deliver To</strong>
                    <span>{displayOrder.address.street}, {displayOrder.address.city}</span>
                  </div>
                </div>
              )}
              <div className="info-chip">
                <i className="fas fa-clock" />
                <div className="info-chip-content">
                  <strong>Order Time</strong>
                  <span>{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>

            {/* ─── WhatsApp Section ─── */}
            <div className="whatsapp-section">
              <div className="whatsapp-icon-big">
                <i className="fab fa-whatsapp" />
              </div>
              <h3>Share your order on WhatsApp!</h3>
              <p>Send your order summary to yourself or share with friends & family 🎉</p>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-send-btn"
              >
                <i className="fab fa-whatsapp" />
                Send via WhatsApp
              </a>

              {/* Message Preview Toggle */}
              <div className="whatsapp-preview" style={{ marginTop: '16px' }}>
                <button
                  onClick={() => setPreviewExpanded(p => !p)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#388e3c', fontSize: '12px', fontWeight: '700',
                    textTransform: 'uppercase', letterSpacing: '1px',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '0', marginBottom: previewExpanded ? '10px' : '0'
                  }}
                >
                  💬 {previewExpanded ? 'Hide' : 'Preview'} Message
                  <i className={`fas fa-chevron-${previewExpanded ? 'up' : 'down'}`} style={{ fontSize: '10px' }} />
                </button>
                {previewExpanded && (
                  <pre style={{
                    fontSize: '12px', color: '#333', whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word', fontFamily: 'Outfit, sans-serif',
                    margin: '0', lineHeight: '1.6', background: '#f9f9f9',
                    padding: '10px', borderRadius: '8px'
                  }}>
                    {waMessage}
                  </pre>
                )}
              </div>
            </div>

            {/* ─── Action Buttons ─── */}
            <div className="confirmation-actions">
              <Link to="/orders" className="action-btn primary">
                <i className="fas fa-box-open" />
                My Orders
              </Link>
              <Link to="/menu" className="action-btn secondary">
                <i className="fas fa-shopping-bag" />
                Order More
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
