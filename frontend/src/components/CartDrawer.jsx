import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../services/api';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  Truck,
  MapPin,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const CartDrawer = ({ isOpen, onClose, onCheckoutSuccess, onOpenAuth }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, fetchCart, loading } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.address) setShippingAddress(user.address);
      if (user.phone) setContactPhone(user.phone);
    }
  }, [user]);

  if (!isOpen) return null;

  const freeShippingThreshold = 50.0;
  const progressPercent = Math.min(100, ((cart.subtotal || 0) / freeShippingThreshold) * 100);
  const diffToFree = (freeShippingThreshold - (cart.subtotal || 0)).toFixed(2);

  const handleInstantBuy = async () => {
    if (!isAuthenticated) {
      onClose();
      onOpenAuth('login');
      return;
    }

    if (!shippingAddress.trim()) {
      setCheckoutError('Please enter a delivery address');
      return;
    }

    setIsSubmitting(true);
    setCheckoutError(null);

    try {
      const order = await orderApi.checkout({
        shippingAddress: shippingAddress.trim(),
        shippingCity: shippingCity.trim() || 'New York',
        shippingZip: shippingZip.trim() || '10001',
        contactPhone: contactPhone.trim() || user.phone,
      });

      // Refresh cart state to empty
      await fetchCart();
      onClose();
      if (onCheckoutSuccess) {
        onCheckoutSuccess(order);
      }
    } catch (err) {
      setCheckoutError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="drawer-content"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '480px' }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <ShoppingBag size={22} style={{ color: '#4f46e5' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Your Cart ({cart.totalItems})
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ background: '#f8fafc', padding: '0.75rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.8125rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600, color: '#334155' }}>
              <Truck size={14} style={{ color: '#4f46e5' }} />
              {diffToFree > 0
                ? `Add $${diffToFree} more for FREE shipping!`
                : '🎉 You have qualified for FREE shipping!'}
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: progressPercent >= 100 ? '#10b981' : '#4f46e5',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
              <div style={{
                background: '#f1f5f9',
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <ShoppingBag size={32} style={{ color: '#94a3b8' }} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                Your cart is empty
              </h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Browse our product catalog and discover items you'll love!
              </p>
              <button onClick={onClose} className="btn btn-primary btn-sm">
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.875rem',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    style={{
                      width: '72px',
                      height: '72px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      background: '#ffffff'
                    }}
                  />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        lineHeight: 1.3,
                        marginBottom: '0.25rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {item.productName}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        ${Number(item.price).toFixed(2)} each
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      {/* Quantity Stepper */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px'
                      }}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ padding: '0.25rem 0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ padding: '0 0.5rem', fontSize: '0.8125rem', fontWeight: 700 }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stockQuantity}
                          style={{ padding: '0.25rem 0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
                          ${Number(item.subtotal).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '0.25rem'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                          onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout Section */}
        {cart.items.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.03)'
          }}>
            {/* Delivery Address Input */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                <MapPin size={14} style={{ color: '#4f46e5' }} />
                Shipping Delivery Address *
              </label>
              <input
                type="text"
                placeholder="e.g. 123 Main St, Apt 4B, New York, NY"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="input"
                style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}
                required
              />
            </div>

            {checkoutError && (
              <p style={{ color: '#dc2626', fontSize: '0.8125rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                {checkoutError}
              </p>
            )}

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>${Number(cart.subtotal).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Shipping</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>
                  {cart.shippingFee === 0 ? (
                    <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
                  ) : (
                    `$${Number(cart.shippingFee).toFixed(2)}`
                  )}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.5rem',
                borderTop: '1px solid #f1f5f9',
                fontSize: '1.125rem',
                fontWeight: 800,
                color: '#0f172a'
              }}>
                <span>Total Amount</span>
                <span style={{ color: '#4f46e5' }}>${Number(cart.total).toFixed(2)}</span>
              </div>
            </div>

            {/* Direct Auto-Buy Button (No payment gateway needed per user requirement) */}
            <div style={{
              background: '#ecfdf5',
              padding: '0.625rem 0.875rem',
              borderRadius: '8px',
              marginBottom: '0.875rem',
              fontSize: '0.75rem',
              color: '#065f46',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle size={15} style={{ color: '#10b981' }} />
              <span>
                <strong>1-Click Direct Purchase:</strong> No credit card or payment step needed. Clicking below immediately completes your order.
              </span>
            </div>

            <button
              onClick={handleInstantBuy}
              disabled={isSubmitting || loading}
              className="btn btn-success"
              style={{
                width: '100%',
                padding: '0.875rem',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Zap size={20} />
              {isSubmitting ? 'Processing Purchase...' : `Buy Now — $${Number(cart.total).toFixed(2)} (Instant)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
