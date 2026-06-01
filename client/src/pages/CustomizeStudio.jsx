import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/CustomizeStudio.css';

// ─── Data with Real Images ───────────────────────────────
const TYPES = [
  {
    id: 'Cake', label: 'Cake', basePrice: 280,
    img: '/images/cakes/chocolate-cake.jpg',
    desc: 'Layered & frosted'
  },
  {
    id: 'Brownie', label: 'Brownie', basePrice: 130,
    img: '/images/brownies/Chewy Fudgy-Brownies.jpg',
    desc: 'Rich & fudgy'
  },
  {
    id: 'Cookie', label: 'Cookie', basePrice: 90,
    img: '/images/cookies/double chocolate-cookies.jpg',
    desc: 'Freshly baked'
  },
  {
    id: 'Tart', label: 'Tart', basePrice: 210,
    img: '/images/tarts/fruit-tart.jpeg',
    desc: 'Buttery crust'
  },
];

// image per flavor & type
const FLAVOR_IMAGES = {
  Chocolate:  {
    Cake:    '/images/cakes/chocolate-cake.jpg',
    Brownie: '/images/brownies/Chewy Fudgy-Brownies.jpg',
    Cookie:  '/images/cookies/double chocolate-cookies.jpg',
    Tart:    '/images/tarts/chocolate-tart.jpg',
  },
  Vanilla: {
    Cake:    'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80',
    Brownie: '/images/brownies/Blondie-brownies.jpg',
    Cookie:  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80',
    Tart:    '/images/tarts/custard-tart.jpg',
  },
  Strawberry: {
    Cake:    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
    Brownie: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=600&q=80',
    Cookie:  '/images/cookies/Peanut-Butter-Cookies.jpg',
    Tart:    '/images/tarts/fruit-tart.jpeg',
  },
  RedVelvet: {
    Cake:    '/images/cakes/red velvet-cake.jpg',
    Brownie: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80',
    Cookie:  '/images/cookies/oatmeal raisin-cookies.jpg',
    Tart:    '/images/tarts/lemon-tart.jpg',
  },
  Lemon: {
    Cake:    '/images/cakes/pineapple pastry-cake.jpg',
    Brownie: '/images/brownies/Blondie-brownies.jpg',
    Cookie:  'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80',
    Tart:    '/images/tarts/lemon-tart.jpg',
  },
  BlackForest: {
    Cake:    '/images/cakes/black forest-cake.jpg',
    Brownie: '/images/brownies/Chewy Fudgy-Brownies.jpg',
    Cookie:  '/images/cookies/double chocolate-cookies.jpg',
    Tart:    '/images/tarts/chocolate-tart.jpg',
  },
};

const FLAVORS = [
  { id: 'Chocolate',   label: 'Chocolate',   color: '#3e1f00' },
  { id: 'Vanilla',     label: 'Vanilla',     color: '#f5deb3' },
  { id: 'Strawberry',  label: 'Strawberry',  color: '#e91e63' },
  { id: 'RedVelvet',   label: 'Red Velvet',  color: '#8b0000' },
  { id: 'Lemon',       label: 'Lemon',       color: '#f9d835' },
  { id: 'BlackForest', label: 'Black Forest',color: '#1a0a00' },
];

const FROSTINGS = [
  { id: 'ChocolateGanache', label: 'Chocolate Ganache',   color: '#2c1500' },
  { id: 'CreamCheese',      label: 'Cream Cheese',        color: '#fff8e1' },
  { id: 'WhippedCream',     label: 'Whipped Cream',       color: '#f5f5f5' },
  { id: 'Buttercream',      label: 'Vanilla Buttercream', color: '#ffe4b5' },
  { id: 'StrawberryGlaze',  label: 'Strawberry Glaze',    color: '#e91e63' },
  { id: 'None',             label: 'No Frosting',         color: '#eee'   },
];

const TOPPINGS = [
  { id: 'Sprinkles',  emoji: '🌈', label: 'Rainbow Sprinkles', price: 30 },
  { id: 'Strawberry', emoji: '🍓', label: 'Fresh Strawberries', price: 50 },
  { id: 'Blueberry',  emoji: '🫐', label: 'Blueberries',        price: 50 },
  { id: 'Walnuts',    emoji: '🪨', label: 'Walnuts & Nuts',      price: 40 },
  { id: 'ChocChips',  emoji: '🍩', label: 'Chocolate Chips',    price: 35 },
  { id: 'Macaron',    emoji: '🍬', label: 'Macarons',           price: 80 },
  { id: 'Cherry',     emoji: '🍒', label: 'Fresh Cherries',     price: 40 },
  { id: 'GoldDust',   emoji: '✨', label: 'Edible Gold Dust',   price: 100 },
];

const SIZES = [
  { id: 'Small',  label: 'Small',  serves: '2–4 people', extra: 0,   h: 28 },
  { id: 'Medium', label: 'Medium', serves: '6–8 people', extra: 80,  h: 38 },
  { id: 'Large',  label: 'Large',  serves: '10+ people', extra: 160, h: 50 },
];

const STEPS = [
  { num: 1, label: 'Type & Flavor' },
  { num: 2, label: 'Frosting'      },
  { num: 3, label: 'Toppings'      },
  { num: 4, label: 'Size & Message'},
];

// ─── Price Calculator ────────────────────────────────────
function calcPrice(config) {
  const base    = TYPES.find(t => t.id === config.type)?.basePrice ?? 0;
  const sizeAdd = SIZES.find(s => s.id === config.size)?.extra ?? 0;
  const topAdd  = config.toppings.reduce((acc, tid) =>
    acc + (TOPPINGS.find(t => t.id === tid)?.price ?? 0), 0);
  const msgAdd  = config.message.trim() ? 20 : 0;
  return base + sizeAdd + topAdd + msgAdd;
}

function getPreviewImage(config) {
  return (FLAVOR_IMAGES[config.flavor] || FLAVOR_IMAGES['Chocolate'])[config.type]
    || '/images/cakes/chocolate-cake.jpg';
}

// ─── Live Preview ────────────────────────────────────────
function LivePreview({ config }) {
  const flavorLabel   = FLAVORS.find(f => f.id === config.flavor)?.label   ?? config.flavor;
  const frostingLabel = FROSTINGS.find(f => f.id === config.frosting)?.label ?? '';
  const typeObj       = TYPES.find(t => t.id === config.type);
  const sizeObj       = SIZES.find(s => s.id === config.size);
  const topLabels     = config.toppings.map(tid => TOPPINGS.find(t => t.id === tid)?.label).filter(Boolean);

  const price    = calcPrice(config);
  const base     = typeObj?.basePrice ?? 0;
  const sizeAdd  = sizeObj?.extra ?? 0;
  const topAdd   = config.toppings.reduce((acc, tid) => acc + (TOPPINGS.find(t => t.id === tid)?.price ?? 0), 0);
  const msgAdd   = config.message.trim() ? 20 : 0;
  const imgSrc   = getPreviewImage(config);

  return (
    <>
      {/* Image Card */}
      <div className="preview-image-card">
        <div className="preview-image-wrap">
          <img
            src={imgSrc}
            alt={`${flavorLabel} ${config.type}`}
            className="preview-dessert-img"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1551655510-555dc3be8633?w=600&q=80'; }}
          />
          <div className="preview-overlay-text">
            <span className="preview-dessert-name">
              {config.size} {flavorLabel} {config.type}
            </span>
            <span className="preview-dessert-sub">
              {frostingLabel !== 'No Frosting' ? `with ${frostingLabel}` : 'No frosting'}
              {topLabels.length > 0 ? ` · ${topLabels.slice(0,2).join(', ')}${topLabels.length > 2 ? ` +${topLabels.length - 2}` : ''}` : ''}
            </span>
          </div>
        </div>

        {config.message.trim() && (
          <div className="preview-message-banner">
            <i className="fas fa-quote-left" style={{ opacity: 0.6 }} />
            {config.message}
            <i className="fas fa-quote-right" style={{ opacity: 0.6 }} />
          </div>
        )}

        <div className="preview-config-list">
          <div className="preview-config-row">
            <span className="preview-config-label"><i className="fas fa-birthday-cake" /> Type</span>
            <span className="preview-config-value">{config.type}</span>
          </div>
          <div className="preview-config-row">
            <span className="preview-config-label"><i className="fas fa-palette" /> Flavor</span>
            <span className="preview-config-value">{flavorLabel}</span>
          </div>
          <div className="preview-config-row">
            <span className="preview-config-label"><i className="fas fa-layer-group" /> Frosting</span>
            <span className="preview-config-value" style={{ fontSize: 12 }}>{frostingLabel}</span>
          </div>
          <div className="preview-config-row">
            <span className="preview-config-label"><i className="fas fa-star" /> Toppings</span>
            <span className="preview-config-value">
              {config.toppings.length > 0 ? `${config.toppings.length} selected` : 'None'}
            </span>
          </div>
          <div className="preview-config-row">
            <span className="preview-config-label"><i className="fas fa-weight" /> Size</span>
            <span className="preview-config-value">{config.size} ({sizeObj?.serves})</span>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="price-summary-card">
        <div className="price-summary-header">
          <i className="fas fa-receipt" /> Order Summary
        </div>
        <div className="price-line">
          <span className="price-line-label">Base {config.type} price</span>
          <span className="price-line-value">₹{base}</span>
        </div>
        {sizeAdd > 0 && (
          <div className="price-line">
            <span className="price-line-label">Size ({config.size})</span>
            <span className="price-line-value plus">+ ₹{sizeAdd}</span>
          </div>
        )}
        {topAdd > 0 && (
          <div className="price-line">
            <span className="price-line-label">Toppings ({config.toppings.length})</span>
            <span className="price-line-value plus">+ ₹{topAdd}</span>
          </div>
        )}
        {msgAdd > 0 && (
          <div className="price-line">
            <span className="price-line-label">Custom message</span>
            <span className="price-line-value plus">+ ₹20</span>
          </div>
        )}
        <div className="price-grand-total">
          <span className="price-grand-label">Total</span>
          <span className="price-grand-value">₹{price}</span>
        </div>
      </div>
    </>
  );
}

// ─── Step 1: Type & Flavor ───────────────────────────────
function Step1({ config, setConfig }) {
  return (
    <>
      <h2 className="form-section-title">Choose Dessert Type</h2>
      <p className="form-section-subtitle">What would you like to customize today?</p>
      <div className="pro-option-grid cols-4" style={{ marginBottom: 28 }}>
        {TYPES.map(t => (
          <div
            key={t.id}
            className={`pro-option-card ${config.type === t.id ? 'selected' : ''}`}
            onClick={() => setConfig(c => ({ ...c, type: t.id }))}
          >
            <img
              src={t.img}
              alt={t.label}
              className="pro-option-image"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1551655510-555dc3be8633?w=200&q=80'; }}
            />
            <span className="pro-option-name">{t.label}</span>
            <span className="pro-option-sub">from ₹{t.basePrice}</span>
          </div>
        ))}
      </div>

      <hr className="form-divider" />

      <h2 className="form-section-title">Choose Flavor</h2>
      <p className="form-section-subtitle">This will determine the taste and colour of your dessert</p>
      <div className="pro-option-grid cols-3">
        {FLAVORS.map(f => (
          <div
            key={f.id}
            className={`swatch-card ${config.flavor === f.id ? 'selected' : ''}`}
            onClick={() => setConfig(c => ({ ...c, flavor: f.id }))}
          >
            <div className="swatch-circle" style={{ background: f.color }} />
            <span className="swatch-label">{f.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Step 2: Frosting ────────────────────────────────────
function Step2({ config, setConfig }) {
  return (
    <>
      <h2 className="form-section-title">Choose Your Frosting</h2>
      <p className="form-section-subtitle">Select the frosting style for the outside of your dessert</p>
      <div className="pro-option-grid cols-3">
        {FROSTINGS.map(f => (
          <div
            key={f.id}
            className={`pro-option-card ${config.frosting === f.id ? 'selected' : ''}`}
            onClick={() => setConfig(c => ({ ...c, frosting: f.id }))}
          >
            <div
              style={{
                width: 48, height: 48, borderRadius: '50%',
                background: f.color,
                margin: '0 auto 10px',
                border: '3px solid rgba(0,0,0,0.08)',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)',
              }}
            />
            <span className="pro-option-name" style={{ fontSize: 12 }}>{f.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Step 3: Toppings ────────────────────────────────────
function Step3({ config, setConfig }) {
  const toggle = id => setConfig(c => ({
    ...c,
    toppings: c.toppings.includes(id)
      ? c.toppings.filter(t => t !== id)
      : [...c.toppings, id],
  }));

  return (
    <>
      <h2 className="form-section-title">Add Toppings</h2>
      <p className="form-section-subtitle">Select as many as you like — each adds a little extra ✨</p>
      <div className="toppings-pill-list">
        {TOPPINGS.map(t => (
          <div
            key={t.id}
            className={`topping-pill ${config.toppings.includes(t.id) ? 'selected' : ''}`}
            onClick={() => toggle(t.id)}
          >
            <span className="topping-pill-emoji">{t.emoji}</span>
            <span>{t.label}</span>
            <span className="topping-pill-price">+ ₹{t.price}</span>
          </div>
        ))}
      </div>
      {config.toppings.length === 0 && (
        <p style={{ color: '#bbb', fontSize: 13, textAlign: 'center', marginTop: 16 }}>
          No toppings added — that's perfectly fine!
        </p>
      )}
    </>
  );
}

// ─── Step 4: Size & Message ──────────────────────────────
function Step4({ config, setConfig }) {
  return (
    <>
      <h2 className="form-section-title">Choose Portion Size</h2>
      <p className="form-section-subtitle">Pick the right size for your occasion</p>
      <div className="size-cards-row" style={{ marginBottom: 28 }}>
        {SIZES.map(s => (
          <div
            key={s.id}
            className={`size-option-card ${config.size === s.id ? 'selected' : ''}`}
            onClick={() => setConfig(c => ({ ...c, size: s.id }))}
          >
            <div className="size-cake-img">
              <div
                className="size-block"
                style={{ width: 32 + SIZES.indexOf(s) * 14, height: s.h }}
              />
            </div>
            <span className="size-name-txt">{s.label}</span>
            <span className="size-serves">{s.serves}</span>
            <span className="size-price-tag">{s.extra === 0 ? 'Base price' : `+ ₹${s.extra}`}</span>
          </div>
        ))}
      </div>

      <hr className="form-divider" />

      <h2 className="form-section-title">Personalise Your Message</h2>
      <p className="form-section-subtitle">
        Add a custom message to be written on your dessert — <strong>₹20 extra</strong>
      </p>
      <textarea
        className="pro-message-input"
        rows={3}
        maxLength={50}
        placeholder='e.g. "Happy Birthday Priya! 🎂" or "Congratulations! 🎉"'
        value={config.message}
        onChange={e => setConfig(c => ({ ...c, message: e.target.value }))}
      />
      <div className="message-hint">
        <span><i className="fas fa-info-circle" /> Leave blank if not needed</span>
        <span>{config.message.length}/50 characters</span>
      </div>
    </>
  );
}

// ─── Main Component ──────────────────────────────────────
export default function CustomizeStudio() {
  const { addToCart } = useCart();
  const navigate      = useNavigate();
  const [step, setStep]         = useState(1);
  const [showToast, setShowToast] = useState(false);

  const [config, setConfig] = useState({
    type:     'Cake',
    flavor:   'Chocolate',
    frosting: 'ChocolateGanache',
    toppings: [],
    size:     'Medium',
    message:  '',
  });

  const price      = calcPrice(config);
  const typeObj    = TYPES.find(t => t.id === config.type);
  const flavorLabel = FLAVORS.find(f => f.id === config.flavor)?.label ?? '';

  const handleAddToCart = () => {
    const toppingNames = config.toppings.map(tid => TOPPINGS.find(t => t.id === tid)?.label).filter(Boolean);
    const frostingLabel = FROSTINGS.find(f => f.id === config.frosting)?.label ?? '';
    const custom = [
      `Flavor: ${flavorLabel}`,
      `Frosting: ${frostingLabel}`,
      toppingNames.length ? `Toppings: ${toppingNames.join(', ')}` : null,
      config.message ? `Message: "${config.message}"` : null,
    ].filter(Boolean).join(' | ');

    addToCart({
      id:          'custom-' + Date.now(),
      name:        `Custom ${config.size} ${flavorLabel} ${config.type}`,
      price,
      imageURL:    getPreviewImage(config),
      isCustom:    true,
      customDescription: custom,
    });

    setShowToast(true);
    setTimeout(() => { setShowToast(false); navigate('/cart'); }, 2200);
  };

  return (
    <div className="studio-page">
      {/* Hero */}
      <div className="studio-hero">
        <div className="studio-hero-inner">
          <div className="studio-hero-tag">
            <i className="fas fa-magic" /> Dessert Customizer
          </div>
          <h1>Design Your Perfect Dessert</h1>
          <p>Handcrafted to your exact taste — delivered fresh to your door</p>
        </div>
      </div>

      {/* Breadcrumb Nav */}
      <div className="studio-breadcrumb">
        <div className="studio-breadcrumb-inner">
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                className={`breadcrumb-step ${step === s.num ? 'active' : ''} ${step > s.num ? 'done' : ''}`}
                onClick={() => step > s.num && setStep(s.num)}
              >
                <div className="step-num">
                  {step > s.num ? <i className="fas fa-check" style={{ fontSize: 10 }} /> : s.num}
                </div>
                <span className="step-label-text">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="breadcrumb-divider">
                  <i className="fas fa-chevron-right" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="studio-main">
        {/* Left: Form */}
        <div className="studio-form-panel">
          {step === 1 && <Step1 config={config} setConfig={setConfig} />}
          {step === 2 && <Step2 config={config} setConfig={setConfig} />}
          {step === 3 && <Step3 config={config} setConfig={setConfig} />}
          {step === 4 && <Step4 config={config} setConfig={setConfig} />}

          <div className="step-nav-bar">
            {step > 1 && (
              <button className="btn-step-back" onClick={() => setStep(s => s - 1)}>
                <i className="fas fa-arrow-left" /> Back
              </button>
            )}
            {step < 4 ? (
              <button className="btn-step-next" onClick={() => setStep(s => s + 1)}>
                Continue <i className="fas fa-arrow-right" />
              </button>
            ) : (
              <button className="btn-step-next" onClick={handleAddToCart} style={{ background: '#c96b63' }}>
                <i className="fas fa-shopping-bag" /> Add to Cart — ₹{price}
              </button>
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="studio-preview-panel">
          <LivePreview config={config} />
          <button className="btn-add-to-cart-pro" onClick={handleAddToCart}>
            <i className="fas fa-shopping-bag" />
            Add to Cart — ₹{price}
          </button>
          <p className="cart-btn-note">
            <i className="fas fa-lock" /> Secure checkout · Free cancellation within 1 hour
          </p>
        </div>
      </div>

      {/* Toast */}
      <div className={`pro-toast ${showToast ? 'show' : ''}`}>
        <div className="toast-check"><i className="fas fa-check" /></div>
        Custom {config.type.toLowerCase()} added to your cart!
      </div>
    </div>
  );
}
