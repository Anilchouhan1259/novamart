// Derive API base URL with smart fallbacks
let rawBase = (import.meta.env.VITE_API_BASE_URL || '').trim();

// Smart Vercel production fallback:
// If deployed on Vercel and no environment variable was provided,
// automatically connect to the live Render backend
if (!rawBase && typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
  rawBase = 'https://novamart-backend-xy90.onrender.com/api';
}

if (!rawBase) {
  rawBase = '/api';
}

// Clean trailing slashes
rawBase = rawBase.replace(/\/+$/, '');

// Ensure http/https URLs include the /api prefix
if (rawBase.startsWith('http') && !rawBase.endsWith('/api')) {
  rawBase = `${rawBase}/api`;
}

export const API_BASE_URL = rawBase;

/**
 * Helper to get the saved JWT token from localStorage
 */
export const getToken = () => localStorage.getItem('token');

/**
 * Helper to save user authentication session
 */
export const saveAuthSession = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Helper to clear authentication session
 */
export const clearAuthSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Core fetch wrapper with JWT attachment and unified error handling
 */
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const targetUrl = `${API_BASE_URL}${cleanEndpoint}`;

  let response;
  try {
    response = await fetch(targetUrl, {
      ...options,
      headers,
    });
  } catch (networkError) {
    console.error(`[API Network Error] Failed to connect to ${targetUrl}:`, networkError);
    throw new Error('Unable to connect to the backend server. Please verify your connection or check that the backend is awake.');
  }

  // Handle 401 Unauthorized
  if (response.status === 401) {
    clearAuthSession();
    window.dispatchEvent(new CustomEvent('auth:expired'));
  }

  let data;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  // Check if response is HTML (often returned when a frontend rewrite intercepts a bad API route)
  if (typeof data === 'string' && (data.trim().startsWith('<!doctype') || data.trim().startsWith('<html'))) {
    throw new Error('Server returned HTML instead of API data. Please verify backend connection.');
  }

  if (!response.ok) {
    const errorMessage = data?.message || data?.error || (typeof data === 'string' ? data : 'Request failed');
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ==================== AUTH API ====================
export const authApi = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  me: () => request('/auth/me'),
};

// ==================== PRODUCTS API ====================
export const productApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.sort) query.append('sort', params.sort);
    const qs = query.toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },

  getById: (id) => request(`/products/${id}`),

  getCategories: () => request('/products/categories'),

  create: (productData) =>
    request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  update: (id, productData) =>
    request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),

  delete: (id) =>
    request(`/products/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== CART API ====================
export const cartApi = {
  get: () => request('/cart'),

  add: (productId, quantity = 1) =>
    request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),

  update: (itemId, quantity) =>
    request(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  remove: (itemId) =>
    request(`/cart/${itemId}`, {
      method: 'DELETE',
    }),

  clear: () =>
    request('/cart', {
      method: 'DELETE',
    }),
};

// ==================== ORDERS API ====================
export const orderApi = {
  getMyOrders: (type = 'all') => request(`/orders/my-orders${type && type !== 'all' ? `?type=${type}` : ''}`),

  getById: (id) => request(`/orders/${id}`),

  checkout: (checkoutData = {}) =>
    request('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    }),

  // Admin Only
  getAllOrders: () => request('/orders'),
  getAllAdmin: () => request('/orders'),

  updateStatus: (id, status) =>
    request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};
