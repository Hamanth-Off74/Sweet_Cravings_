import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    : '💳 Online (Razorpay)';

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
  const orderData = location.state?.orderData || null;
  const [showConfetti, setShowConfetti] = useState(true);
  const [previewExpanded, setPreviewExpanded] = useState(false);

  // Hide confetti after 4 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

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
    paymentMethod: 'razorpay',
    address: { street: '', city: '' }
  };

  const payLabel =
    displayOrder.paymentMethod === 'cod' || displayOrder.paymentMethod === 'cash'
      ? 'Cash on Delivery'
      : 'Online Payment (Razorpay)';

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
