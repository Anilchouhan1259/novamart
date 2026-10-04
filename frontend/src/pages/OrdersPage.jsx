import React, { useState, useEffect } from 'react';
import { orderApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  ShoppingBag,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';

export const OrdersPage = ({ onShopNow }) => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'current', 'past'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async (type) => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderApi.getMyOrders(type);
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders(activeTab);
    }
  }, [activeTab, isAuthenticated]);

  const currentCount = orders.filter((o) => o.currentOrder).length;
  const pastCount = orders.filter((o) => !o.currentOrder).length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PROCESSING':
        return <span className="badge badge-primary">Processing Order</span>;
      case 'SHIPPED':
        return <span className="badge badge-warning" style={{ background: '#fef3c7', color: '#b45309' }}>Shipped on the way</span>;
      case 'DELIVERED':
        return <span className="badge badge-success">Delivered Successfully</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  const renderProgressSteps = (status) => {
    const steps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];
    let activeIndex = 1;
    if (status === 'PROCESSING') activeIndex = 1;
    if (status === 'SHIPPED') activeIndex = 2;
    if (status === 'DELIVERED') activeIndex = 3;
    if (status === 'CANCELLED') activeIndex = -1;

    if (activeIndex === -1) return null;

    return (
      <div style={{ marginTop: '1.25rem', marginBottom: '0.75rem', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          {/* Progress Bar Line */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '20px',
            right: '20px',
            height: '3px',
            background: '#e2e8f0',
            zIndex: 1
          }}>
            <div style={{
              width: `${(activeIndex / (steps.length - 1)) * 100}%`,
              height: '100%',
              background: '#4f46e5',
              transition: 'width 0.4s ease'
            }} />
          </div>

          {steps.map((step, idx) => {
            const isCompleted = idx <= activeIndex;
            return (
              <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isCompleted ? '#4f46e5' : '#ffffff',
                  border: isCompleted ? '2px solid #4f46e5' : '2px solid #cbd5e1',
                  color: isCompleted ? '#ffffff' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  marginBottom: '0.25rem'
                }}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: isCompleted ? 700 : 500,
                  color: isCompleted ? '#1e293b' : '#94a3b8'
                }}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
          My Orders
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
          Monitor your active deliveries and review your past purchases
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '0.75rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('all')}
          className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: '9999px' }}
        >
          All Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('current')}
          className={`btn btn-sm ${activeTab === 'current' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: '9999px' }}
        >
          <Clock size={14} />
          Current Orders ({currentCount})
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`btn btn-sm ${activeTab === 'past' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: '9999px' }}
        >
          <CheckCircle size={14} />
          Past Orders ({pastCount})
        </button>
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTopColor: '#4f46e5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ fontWeight: 600 }}>Loading orders...</p>
        </div>
      ) : error ? (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '1.5rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <AlertCircle size={24} style={{ margin: '0 auto 0.5rem' }} />
          <p style={{ fontWeight: 600 }}>{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 1rem',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Package size={28} style={{ color: '#94a3b8' }} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
            No {activeTab !== 'all' ? activeTab : ''} orders found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            {activeTab === 'current'
              ? 'You have no active orders in progress right now.'
              : activeTab === 'past'
              ? 'You have no past completed orders yet.'
              : 'You haven’t placed any orders yet.'}
          </p>
          <button onClick={onShopNow} className="btn btn-primary btn-sm" style={{ borderRadius: '9999px' }}>
            Start Shopping Now
          </button>
        </div>
      ) : (
        /* Orders List */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              className="card"
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {/* Order Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                paddingBottom: '1rem',
                borderBottom: '1px solid #f1f5f9',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>
                      {order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                    {order.currentOrder && (
                      <span className="badge" style={{ background: '#e0e7ff', color: '#4338ca' }}>
                        Active Current Order
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.8125rem', marginTop: '0.375rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} />
                      {new Date(order.orderDate).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={14} />
                      {order.shippingAddress}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Total Paid</span>
                  <span style={{ fontSize: '1.375rem', fontWeight: 800, color: '#4f46e5' }}>
                    ${Number(order.totalAmount).toFixed(2)}
                  </span>
                  <span className="badge badge-success" style={{ marginTop: '0.25rem' }}>
                    {order.paymentStatus || 'Auto-Paid'}
                  </span>
                </div>
              </div>

              {/* Active Order Delivery Progress Tracker */}
              {order.currentOrder && renderProgressSteps(order.status)}

              {/* Order Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Ordered Items ({order.items.length})
                </span>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: '#f8fafc',
                        borderRadius: '10px',
                        border: '1px solid #f1f5f9'
                      }}
                    >
                      <img
                        src={item.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'}
                        alt={item.productName}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h5 style={{
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          color: '#0f172a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.productName}
                        </h5>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.125rem' }}>
                          <span>Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</span>
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>
                            ${Number(item.subtotal).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
