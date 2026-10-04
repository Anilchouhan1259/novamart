import React from 'react';
import { CheckCircle2, Package, ArrowRight, X, Clock, MapPin } from 'lucide-react';

export const CheckoutSuccessModal = ({ order, isOpen, onClose, onViewOrders, onContinueShopping }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', padding: '2.5rem 2rem', textAlign: 'center' }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
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

        {/* Animated Success Badge */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: '#d1fae5',
          color: '#059669',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <CheckCircle2 size={44} />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
          Purchase Confirmed!
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
          Thank you! Your order was automatically placed and processed without any payment hurdles.
        </p>

        {/* Order Details Card */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1.25rem',
          textAlign: 'left',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Order ID</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{order.orderNumber}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Payment Status</span>
              <span className="badge badge-success">{order.paymentStatus || 'PAID'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
            <span>Order Status</span>
            <span className="badge badge-primary">{order.status || 'PROCESSING'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
            <span>Shipping To</span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>{order.shippingAddress}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px dashed #cbd5e1', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
            <span>Total Amount Paid</span>
            <span style={{ color: '#4f46e5' }}>${Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => { onClose(); onViewOrders(); }}
            className="btn btn-primary flex-1"
            style={{ padding: '0.75rem' }}
          >
            <Package size={18} />
            View in My Orders
          </button>
          <button
            onClick={() => { onClose(); onContinueShopping(); }}
            className="btn btn-secondary flex-1"
            style={{ padding: '0.75rem' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
