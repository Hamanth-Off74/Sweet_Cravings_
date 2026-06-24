import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../styles/Footer.css';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Column 1: Brand */}
            <div className="footer-column">
              <div className="footer-logo">
                <i className="fas fa-birthday-cake"></i>
                <span>SweetCravings</span>
              </div>
              <p className="footer-description">
                Handcrafted desserts delivered fresh to your door. Satisfy your cravings with our premium collection.
              </p>
              <div className="social-links">
                <a href="https://instagram.com/sweetcravings" target="_blank" rel="noopener noreferrer" title="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://facebook.com/sweetcravings" target="_blank" rel="noopener noreferrer" title="Facebook">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="https://twitter.com/sweetcravings" target="_blank" rel="noopener noreferrer" title="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://youtube.com/sweetcravings" target="_blank" rel="noopener noreferrer" title="YouTube">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/menu">Menu</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/customize">Customize</Link></li>
              </ul>
            </div>

            {/* Column 3: Customer Service */}
            <div className="footer-column">
              <h4>Customer Service</h4>
              <ul className="footer-links">
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#returns">Returns & Refunds</a></li>
                <li><a href="#shipping">Shipping Info</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
              </ul>
            </div>

            {/* Column 4: Contact Info */}
            <div className="footer-column">
              <h4>Contact Us</h4>
              <div className="contact-info">
                <p>
                  <i className="fas fa-phone"></i>
                  <a href="tel:+18001234567">+1-800-123-4567</a>
                </p>
                <p>
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:support@sweetcravings.com">support@sweetcravings.com</a>
                </p>
                <p>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>123 Baker Street<br />Sweet City, SC 12345</span>
                </p>
              </div>
            </div>

            {/* Column 5: Newsletter */}
            <div className="footer-column">
              <h4>Newsletter</h4>
              <p className="newsletter-text">Subscribe to get special offers and new arrivals!</p>
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter-btn">
                  {subscribed ? '✓ Subscribed!' : 'Subscribe'}
                </button>
              </form>
              <div className="payment-methods">
                <p className="payment-title">We Accept</p>
                <div className="payment-icons">
                  <i className="fab fa-cc-visa"></i>
                  <i className="fab fa-cc-mastercard"></i>
                  <i className="fab fa-cc-paypal"></i>
                  <span className="upi-badge">UPI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; 2025 SweetCravings. All rights reserved.</p>
            <p className="made-with">
              <i className="fas fa-heart"></i> Handcrafted with love from the SweetCravings Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
