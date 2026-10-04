import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutSuccessModal } from './components/CheckoutSuccessModal';
import { ProductCatalog } from './pages/ProductCatalog';
import { OrdersPage } from './pages/OrdersPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ShoppingBag, Heart, ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';

const MainContent = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { isCartOpen, setIsCartOpen } = useCart();

  const [currentView, setCurrentView] = useState('catalog'); // 'catalog', 'orders', 'admin'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);

  const [latestOrder, setLatestOrder] = useState(null);
  const [checkoutSuccessOpen, setCheckoutSuccessOpen] = useState(false);

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const handleCheckoutSuccess = (order) => {
    setLatestOrder(order);
    setCheckoutSuccessOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Body */}
      <main style={{ flex: 1, paddingTop: '1.5rem' }}>
        {currentView === 'catalog' && (
          <ProductCatalog
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onQuickView={handleQuickView}
          />
        )}

        {currentView === 'orders' && (
          <OrdersPage
            onShopNow={() => setCurrentView('catalog')}
          />
        )}

        {currentView === 'admin' && (
          isAdmin ? (
            <AdminDashboard />
          ) : (
            <div className="container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444', marginBottom: '0.5rem' }}>
                Admin Access Restricted
              </h2>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                You must be logged in as an Administrator (e.g. admin@ecommerce.com) to access this portal.
              </p>
              <button onClick={() => handleOpenAuth('login')} className="btn btn-primary btn-sm">
                Sign In with Admin Account
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: '#0f172a',
        color: '#94a3b8',
        padding: '3rem 0 1.5rem',
        marginTop: 'auto',
        borderTop: '1px solid #1e293b'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                  color: '#ffffff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShoppingBag size={20} />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                  Nova<span style={{ color: '#818cf8' }}>Mart</span>
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#94a3b8' }}>
                Modern fullstack e-commerce solution powered by Spring Boot, MySQL, JWT security, and React. Built for seamless zero-friction shopping.
              </p>
            </div>

            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem' }}>Quick Navigation</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <li>
                  <button onClick={() => setCurrentView('catalog')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                    Featured Catalog
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('orders')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                    Current & Past Orders
                  </button>
                </li>
                {isAdmin && (
                  <li>
                    <button onClick={() => setCurrentView('admin')} style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer', padding: 0 }}>
                      Admin Portal
                    </button>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem' }}>Instant Purchase</h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#94a3b8' }}>
                Items are purchased immediately upon clicking "Buy Now" with automatic payment fulfillment and instant stock update.
              </p>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>No Payment Card Required</span>
                <span className="badge badge-primary" style={{ fontSize: '0.6875rem' }}>Instant Auto-Paid</span>
              </div>
            </div>

            <div>
              <h4 style={{ color: '#ffffff', fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem' }}>Demo Accounts</h4>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>
                  <strong style={{ color: '#ffffff' }}>Customer:</strong> user@ecommerce.com / user123
                </div>
                <div>
                  <strong style={{ color: '#ffffff' }}>Admin:</strong> admin@ecommerce.com / admin123
                </div>
              </div>
            </div>
          </div>

          <div style={{
            paddingTop: '1.5rem',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8125rem'
          }}>
            <span>© {new Date().getFullYear()} NovaMart E-Commerce. All rights reserved.</span>
            <span>Spring Boot + React + MySQL + JWT</span>
          </div>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <Toast />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onBuyNow={() => setIsCartOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckoutSuccess={handleCheckoutSuccess}
        onOpenAuth={handleOpenAuth}
      />

      <CheckoutSuccessModal
        order={latestOrder}
        isOpen={checkoutSuccessOpen}
        onClose={() => setCheckoutSuccessOpen(false)}
        onViewOrders={() => setCurrentView('orders')}
        onContinueShopping={() => setCurrentView('catalog')}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainContent />
      </CartProvider>
    </AuthProvider>
  );
}
