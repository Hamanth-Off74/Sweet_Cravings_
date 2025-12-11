import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { DarkModeProvider } from './context/DarkModeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Confirmation from './pages/Confirmation';
import Admin from './pages/Admin';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import ProductDetail from './pages/ProductDetail';
import './styles/darkmode.css';

function App() {
  return (
    <Router>
      <DarkModeProvider>
        <CartProvider>
          <WishlistProvider>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/wishlist" element={<Wishlist />} />
              </Routes>
            </main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </DarkModeProvider>
    </Router>
  );
}

export default App;
