const rawBase = (import.meta.env.VITE_API_BASE_URL || '/api').trim();
// Strip any trailing slash so /api and /api/ are treated identically
export const API_BASE_URL = rawBase.replace(/\/+$/, '');

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
    throw new Error(`Unable to connect to the backend server. Please verify your connection or check that the backend is awake.`);
  }

  // Handle 401 Unauthorized
  if (response.status === 401) {
    clearAuthSession();
    window.dispatchEvent(new CustomEvent('auth:expired'));
  }

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
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
  checkout: (checkoutData) =>
    request('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    }),

  getMyOrders: (type = 'all') =>
    request(`/orders/my-orders?type=${type}`),

  getById: (id) => request(`/orders/${id}`),

  getAllAdmin: () => request('/orders'),

  updateStatus: (id, status) =>
    request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};
