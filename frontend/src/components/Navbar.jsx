import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  User,
  LogOut,
  Package,
  Shield,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export const Navbar = ({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  onOpenAuth,
}) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (currentView !== 'catalog') {
      setCurrentView('catalog');
    }
  };

  return (
    <header className="navbar">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px', gap: '1rem' }}>
        {/* Brand Logo */}
        <div
          onClick={() => { setCurrentView('catalog'); setIsMobileMenuOpen(false); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', textDecoration: 'none' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
            color: '#ffffff',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
          }}>
            <ShoppingBag size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>
              Nova<span style={{ color: '#4f46e5' }}>Mart</span>
            </span>
          </div>
        </div>

        {/* Search Bar (Desktop/Tablet) */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            flex: '1',
            maxWidth: '460px',
            position: 'relative',
            display: 'none',
          }}
          className="search-form-desktop"
        >
          <input
            type="text"
            placeholder="Search products by title, category, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{
              paddingLeft: '2.5rem',
              paddingRight: '1rem',
              borderRadius: '9999px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              height: '42px',
            }}
          />
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '0.875rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              pointerEvents: 'none',
            }}
          />
        </form>

        <style>{`
          @media (min-width: 640px) {
            .search-form-desktop {
              display: block !important;
            }
          }
        `}</style>

        {/* Desktop Nav Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Shop Link */}
          <button
            onClick={() => setCurrentView('catalog')}
            className={`btn btn-sm ${currentView === 'catalog' ? 'btn-secondary' : 'btn-ghost'}`}
            style={{ fontWeight: 600, display: 'none' }}
            id="nav-shop-btn"
          >
            Shop
          </button>

          {/* Orders Link */}
          {isAuthenticated && (
            <button
              onClick={() => setCurrentView('orders')}
              className={`btn btn-sm ${currentView === 'orders' ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ fontWeight: 600, display: 'none' }}
              id="nav-orders-btn"
            >
              <Package size={16} style={{ color: '#4f46e5' }} />
              My Orders
            </button>
          )}

          {/* Admin Dashboard Link */}
          {isAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`btn btn-sm ${currentView === 'admin' ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ fontWeight: 600, background: currentView === 'admin' ? '#ecfdf5' : 'transparent', color: '#047857', display: 'none' }}
              id="nav-admin-btn"
            >
              <Shield size={16} style={{ color: '#059669' }} />
              Admin Portal
            </button>
          )}

          <style>{`
            @media (min-width: 768px) {
              #nav-shop-btn, #nav-orders-btn, #nav-admin-btn {
                display: inline-flex !important;
              }
            }
          `}</style>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{
              position: 'relative',
              padding: '0.5rem 0.875rem',
              borderRadius: '9999px',
              border: '1px solid #e2e8f0',
              fontWeight: 600,
            }}
            title="Open Shopping Cart"
          >
            <ShoppingCart size={18} style={{ color: '#4f46e5' }} />
            <span style={{ display: 'none' }} className="cart-text">Cart</span>
            {cart.totalItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #ffffff',
                }}
              >
                {cart.totalItems}
              </span>
            )}
          </button>

          {/* User Auth Section */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '9999px',
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isAdmin ? '#10b981' : '#4f46e5',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}>
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.fullName?.split(' ')[0] || user.email}
                </span>
                <ChevronDown size={14} style={{ color: '#64748b' }} />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '220px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid #e2e8f0',
                    zIndex: 60,
                    overflow: 'hidden',
                  }}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{user.fullName}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                    <span className={`badge ${isAdmin ? 'badge-success' : 'badge-primary'}`} style={{ marginTop: '0.375rem' }}>
                      {isAdmin ? 'Admin Role' : 'Customer'}
                    </span>
                  </div>

                  <div style={{ padding: '0.375rem' }}>
                    <button
                      onClick={() => { setCurrentView('orders'); setIsUserMenuOpen(false); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#334155',
                        background: 'none',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                      <Package size={16} style={{ color: '#4f46e5' }} />
                      My Orders (Past & Current)
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => { setCurrentView('admin'); setIsUserMenuOpen(false); }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.5rem 0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: '#059669',
                          background: 'none',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#ecfdf5'}
                        onMouseLeave={(e) => e.target.style.background = 'none'}
                      >
                        <Shield size={16} style={{ color: '#059669' }} />
                        Admin Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#dc2626',
                        background: 'none',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginTop: '0.25rem',
                        borderTop: '1px solid #f1f5f9',
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => onOpenAuth('login')}
                className="btn btn-ghost btn-sm"
                style={{ fontWeight: 600 }}
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: '9999px' }}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="btn btn-ghost btn-sm mobile-menu-btn"
            style={{ display: 'inline-flex', padding: '0.5rem' }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              onClick={() => { setCurrentView('catalog'); setIsMobileMenuOpen(false); }}
              className="btn btn-secondary"
              style={{ justifyContent: 'flex-start' }}
            >
              <ShoppingBag size={18} style={{ color: '#4f46e5' }} />
              Product Catalog
            </button>

            {isAuthenticated && (
              <button
                onClick={() => { setCurrentView('orders'); setIsMobileMenuOpen(false); }}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start' }}
              >
                <Package size={18} style={{ color: '#4f46e5' }} />
                My Orders (Current & Past)
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => { setCurrentView('admin'); setIsMobileMenuOpen(false); }}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', color: '#047857' }}
              >
                <Shield size={18} style={{ color: '#059669' }} />
                Admin Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
