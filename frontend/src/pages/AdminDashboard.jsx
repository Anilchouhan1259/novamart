import React, { useState, useEffect } from 'react';
import { productApi, orderApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Package,
  DollarSign,
  TrendingUp,
  Search,
  X,
  AlertCircle,
  CheckCircle,
  Truck
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'

  // Products State
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productSearch, setProductSearch] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stockQuantity: 10,
    imageUrl: '',
    rating: 4.8,
    featured: false,
  });

  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err) {
      setActionError(err.message || 'Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const data = await orderApi.getAllAdmin();
      setOrders(data);
    } catch (err) {
      setActionError(err.message || 'Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const showNotification = (msg, isErr = false) => {
    if (isErr) {
      setActionError(msg);
      setTimeout(() => setActionError(null), 3500);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(null), 3500);
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'Electronics',
      stockQuantity: 10,
      imageUrl: '',
      rating: 4.8,
      featured: false,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description || '',
      price: prod.price,
      category: prod.category,
      stockQuantity: prod.stockQuantity,
      imageUrl: prod.imageUrl || '',
      rating: prod.rating || 4.5,
      featured: prod.featured || false,
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productApi.update(editingProduct.id, {
          ...productForm,
          price: parseFloat(productForm.price),
          stockQuantity: parseInt(productForm.stockQuantity, 10),
        });
        showNotification('Product updated successfully!');
      } else {
        await productApi.create({
          ...productForm,
          price: parseFloat(productForm.price),
          stockQuantity: parseInt(productForm.stockQuantity, 10),
        });
        showNotification('Product created successfully!');
      }
      setIsProductModalOpen(false);
      fetchProducts();
    } catch (err) {
      showNotification(err.message || 'Operation failed', true);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await productApi.delete(id);
        showNotification('Product removed from catalog');
        fetchProducts();
      } catch (err) {
        showNotification(err.message || 'Failed to delete product', true);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      showNotification(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      showNotification(err.message || 'Failed to update order status', true);
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Admin Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ background: '#ecfdf5', padding: '0.5rem', borderRadius: '10px' }}>
              <Shield size={24} style={{ color: '#059669' }} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
              Admin Portal
            </h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Manage product inventory, track customer orders, and update shipping fulfillment
          </p>
        </div>

        {activeTab === 'products' && (
          <button onClick={handleOpenAddProduct} className="btn btn-primary" style={{ borderRadius: '9999px' }}>
            <Plus size={18} />
            Add New Product
          </button>
        )}
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle size={18} style={{ color: '#10b981' }} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={18} />
          <span>{actionError}</span>
        </div>
      )}

      {/* Metric Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Total Revenue</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            ${totalRevenue.toFixed(2)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>All instant payments</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Customer Orders</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            {orders.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 600 }}>Processed systemwide</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Catalog Items</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            {products.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Available products</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('products')}
          className={`btn btn-sm ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: '9999px' }}
        >
          <Package size={16} />
          Products ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`btn btn-sm ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: '9999px' }}
        >
          <Truck size={16} />
          Customer Orders ({orders.length})
        </button>
      </div>

      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div>
          {/* Search Table */}
          <div style={{ marginBottom: '1rem', maxWidth: '360px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Filter products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          </div>

          <div className="card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 700 }}>
                  <th style={{ padding: '0.875rem 1rem' }}>Product</th>
                  <th style={{ padding: '0.875rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.875rem 1rem' }}>Price</th>
                  <th style={{ padding: '0.875rem 1rem' }}>Stock</th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(filteredProducts) ? filteredProducts : []).map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={p.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'}
                        alt={p.name}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: #{p.id}</div>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span className="badge badge-primary">{p.category}</span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                      ${Number(p.price).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span className={`badge ${p.stockQuantity > 0 ? 'badge-success' : 'badge-danger'}`}>
                        {p.stockQuantity} in stock
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.375rem 0.625rem' }}
                          title="Edit Product"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.375rem 0.625rem' }}
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 700 }}>
                <th style={{ padding: '0.875rem 1rem' }}>Order #</th>
                <th style={{ padding: '0.875rem 1rem' }}>Customer</th>
                <th style={{ padding: '0.875rem 1rem' }}>Items</th>
                <th style={{ padding: '0.875rem 1rem' }}>Total Paid</th>
                <th style={{ padding: '0.875rem 1rem' }}>Status</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(orders) ? orders : []).map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{o.orderNumber}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {new Date(o.orderDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{o.userName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{o.userEmail}</div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ fontSize: '0.8125rem', color: '#334155' }}>
                      {(Array.isArray(o?.items) ? o.items : []).map((i) => `${i.productName} (${i.quantity}x)`).join(', ')}
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 800, color: '#4f46e5' }}>
                    ${Number(o.totalAmount).toFixed(2)}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span className={`badge ${
                      o.status === 'DELIVERED' ? 'badge-success' :
                      o.status === 'SHIPPED' ? 'badge-warning' :
                      o.status === 'CANCELLED' ? 'badge-danger' : 'badge-primary'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                      className="select"
                      style={{
                        padding: '0.375rem 0.625rem',
                        fontSize: '0.8125rem',
                        width: 'auto',
                        borderRadius: '6px'
                      }}
                    >
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="modal-overlay" onClick={() => setIsProductModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px', padding: '2rem' }}>
            <button
              onClick={() => setIsProductModalOpen(false)}
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

            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="input"
                  placeholder="e.g. Wireless Noise Cancelling Headphones"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="select"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Office">Home & Office</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="input"
                    placeholder="99.99"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                    Rating (0 - 5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={productForm.rating}
                    onChange={(e) => setProductForm({ ...productForm, rating: parseFloat(e.target.value) })}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                  Image URL
                </label>
                <input
                  type="url"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="input"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                  Description
                </label>
                <textarea
                  rows="3"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="textarea"
                  placeholder="Detailed specifications and product benefits..."
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
                {editingProduct ? 'Save Product Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
