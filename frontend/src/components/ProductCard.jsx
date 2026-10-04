import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Star, Eye } from 'lucide-react';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart, loading } = useCart();

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product.id, 1);
    }
  };

  return (
    <div
      className="card card-hover"
      onClick={() => onQuickView(product)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Product Image Container */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '80%', overflow: 'hidden', background: '#f8fafc' }}>
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.06)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />

        {/* Category Pill */}
        <span
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            color: '#334155',
            fontSize: '0.6875rem',
            fontWeight: 700,
            padding: '0.25rem 0.625rem',
            borderRadius: '9999px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {product.category}
        </span>

        {/* Stock Badge */}
        {isOutOfStock ? (
          <span
            className="badge badge-danger"
            style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}
          >
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span
            className="badge badge-warning"
            style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}
          >
            Only {product.stockQuantity} left
          </span>
        ) : null}

        {/* Quick View Floating Button */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.75rem',
            background: '#ffffff',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            opacity: 0.9,
          }}
          title="Quick View"
        >
          <Eye size={16} style={{ color: '#4f46e5' }} />
        </div>
      </div>

      {/* Product Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
            <Star size={14} style={{ fill: '#fbbf24', stroke: '#fbbf24' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
              {product.rating || '4.8'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              ({product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'sold out'})
            </span>
          </div>

          {/* Product Name */}
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '0.5rem',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.name}
          </h3>

          {/* Description snippet */}
          <p style={{
            fontSize: '0.8125rem',
            color: '#64748b',
            lineHeight: 1.45,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart Action */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid #f1f5f9',
          gap: '0.5rem'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Price</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock || loading}
            className={`btn btn-sm ${isOutOfStock ? 'btn-secondary' : 'btn-primary'}`}
            style={{ borderRadius: '9999px', padding: '0.5rem 0.875rem' }}
          >
            <ShoppingCart size={15} />
            {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};
