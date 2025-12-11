import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>SweetCravings</h4>
            <p>Premium desserts delivered fresh to your door. Made with the finest ingredients and lots of love.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Track Your Order</a></li>
              <li><a href="#">Returns Policy</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Info</h4>
            <ul>
              <li><i className="fas fa-phone"></i> (555) 123-4567</li>
              <li><i className="fas fa-envelope"></i> info@sweetcravings.com</li>
              <li><i className="fas fa-map-marker-alt"></i> 123 Sweet Street, Dessert City</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 SweetCravings. All rights reserved. | Designed with ❤️ for dessert lovers</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
