import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, ShoppingCart, Star, Zap, Check, ShieldCheck, Truck } from 'lucide-react';

export const ProductDetailModal = ({ product, isOpen, onClose, onBuyNow }) => {
  const { addToCart, loading } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = async () => {
    if (!isOutOfStock) {
      await addToCart(product.id, quantity);
      onClose();
    }
  };

  const handleInstantBuy = async () => {
    if (!isOutOfStock) {
      const added = await addToCart(product.id, quantity);
      if (added) {
        onClose();
        if (onBuyNow) onBuyNow();
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', padding: '0', overflow: 'hidden' }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            color: '#64748b'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {/* Image Section */}
          <div style={{ background: '#f8fafc', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                width: '100%',
                maxHeight: '380px',
                objectFit: 'contain',
                borderRadius: '12px'
              }}
            />
          </div>

          {/* Details Section */}
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="badge badge-primary">{product.category}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={16} style={{ fill: '#fbbf24', stroke: '#fbbf24' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{product.rating || '4.8'}</span>
                </div>
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', lineHeight: 1.25 }}>
                {product.name}
              </h2>

              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#4f46e5', marginBottom: '1rem' }}>
                ${Number(product.price).toFixed(2)}
              </div>

              <p style={{ color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {product.description}
              </p>

              {/* Stock Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isOutOfStock ? '#ef4444' : '#10b981'
                }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isOutOfStock ? '#ef4444' : '#059669' }}>
                  {isOutOfStock ? 'Currently Out of Stock' : `${product.stockQuantity} units available in stock`}
                </span>
              </div>

              {/* Quantity Stepper */}
              {!isOutOfStock && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>
                    Quantity
                  </label>
                  <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{ padding: '0.5rem 0.875rem', background: '#f8fafc', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                      -
                    </button>
                    <span style={{ padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.9375rem', minWidth: '40px', textAlign: 'center' }}>
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      style={{ padding: '0.5rem 0.875rem', background: '#f8fafc', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || loading}
                  className="btn btn-secondary flex-1"
                  style={{ padding: '0.75rem' }}
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>

                <button
                  onClick={handleInstantBuy}
                  disabled={isOutOfStock || loading}
                  className="btn btn-primary flex-1"
                  style={{ padding: '0.75rem' }}
                >
                  <Zap size={18} />
                  1-Click Buy Now
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Truck size={14} /> Free Shipping Over $50
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={14} /> Instant Auto-Payment
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
