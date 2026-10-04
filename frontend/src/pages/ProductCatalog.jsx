import React, { useState, useEffect } from 'react';
import { productApi } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { HeroBanner } from '../components/HeroBanner';
import {
  SlidersHorizontal,
  Search,
  Sparkles,
  ArrowUpDown,
  FilterX
} from 'lucide-react';

export const ProductCatalog = ({
  searchQuery,
  setSearchQuery,
  onQuickView,
}) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsData, categoriesData] = await Promise.all([
        productApi.getAll({
          category: selectedCategory,
          search: searchQuery,
          sort: sortOption,
        }),
        productApi.getCategories().catch(() => ['Electronics', 'Fashion', 'Home & Office']),
      ]);

      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(['all', ...(Array.isArray(categoriesData) ? categoriesData : ['Electronics', 'Fashion', 'Home & Office'])]);
    } catch (err) {
      setProducts([]);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [selectedCategory, searchQuery, sortOption]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortOption('newest');
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Hero Banner Section */}
      <HeroBanner onShopNow={() => {
        const el = document.getElementById('catalog-products-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* Catalog Header & Filters */}
      <div id="catalog-products-section" style={{ scrollMarginTop: '90px', marginBottom: '1.75rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
              Featured Catalog
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Showing {Array.isArray(products) ? products.length : 0} products available for instant order
            </p>
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={16} style={{ color: '#64748b' }} />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="select"
              style={{
                fontSize: '0.875rem',
                padding: '0.5rem 0.875rem',
                borderRadius: '9999px',
                width: 'auto'
              }}
            >
              <option value="newest">Sort by: Newest Arrival</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Filter Reset */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          scrollbarWidth: 'none',
        }}>
          {(Array.isArray(categories) ? categories : []).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                borderRadius: '9999px',
                textTransform: 'capitalize',
                fontSize: '0.8125rem',
                padding: '0.375rem 0.875rem'
              }}
            >
              {cat === 'all' ? 'All Items' : cat}
            </button>
          ))}

          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={clearFilters}
              className="btn btn-ghost btn-sm"
              style={{ color: '#ef4444', fontSize: '0.8125rem' }}
            >
              <FilterX size={14} />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#64748b' }}>
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
          <p style={{ fontWeight: 600 }}>Loading amazing products...</p>
        </div>
      ) : error ? (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{ fontWeight: 600, marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchCatalog} className="btn btn-secondary btn-sm">
            Retry Connection
          </button>
        </div>
      ) : products.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '5rem 1rem',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            No products matched your search
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Try adjusting your search criteria or resetting filters.
          </p>
          <button onClick={clearFilters} className="btn btn-primary btn-sm" style={{ borderRadius: '9999px' }}>
            Show All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(Array.isArray(products) ? products : []).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </div>
  );
};
