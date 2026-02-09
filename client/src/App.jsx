import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Confirmation from './pages/Confirmation';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import ProductDetail from './pages/ProductDetail';
import SeasonalEffects from './components/SeasonalEffects';
import './styles/darkmode.css';
import './styles/responsive-fix.css';

// Layout component to conditionally render header/footer
function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <main>{children}</main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <SeasonalEffects />
      <DarkModeProvider>
        <CartProvider>
          <WishlistProvider>
            <AdminAuthProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/confirmation" element={<Confirmation />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/wishlist" element={<Wishlist />} />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedAdminRoute>
                        <Admin />
                      </ProtectedAdminRoute>
                    }
                  />
                </Routes>
              </Layout>
            </AdminAuthProvider>
          </WishlistProvider>
        </CartProvider>
      </DarkModeProvider>
    </Router>
  );
}

export default App;
