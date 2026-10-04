import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const HeroBanner = ({ onShopNow }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
      borderRadius: '24px',
      color: '#ffffff',
      padding: '3.5rem 2.5rem',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '2.5rem',
      boxShadow: 'var(--shadow-lg)'
    }}>
      {/* Decorative gradient blur balls */}
      <div style={{
        position: 'absolute',
        top: '-40%',
        right: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(129, 140, 248, 0.3) 0%, rgba(79, 70, 229, 0) 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '700px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(8px)',
          padding: '0.375rem 0.875rem',
          borderRadius: '9999px',
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: '#e0e7ff',
          marginBottom: '1.25rem',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Sparkles size={16} style={{ color: '#fbbf24' }} />
          <span>Spring Special Sale • Up to 40% Off</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.25rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '1rem',
          color: '#ffffff'
        }}>
          Premium Gear for Everyday Living.
        </h1>

        <p style={{
          fontSize: '1.0625rem',
          color: '#c7d2fe',
          lineHeight: 1.6,
          marginBottom: '2rem',
          maxWidth: '560px'
        }}>
          Explore curated electronics, designer apparel, and home essentials crafted for modern everyday living.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={onShopNow}
            className="btn btn-primary btn-lg"
            style={{
              background: '#ffffff',
              color: '#4338ca',
              fontWeight: 700,
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
              borderRadius: '9999px'
            }}
          >
            Explore Catalog
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
