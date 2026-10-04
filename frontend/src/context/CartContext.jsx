import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    subtotal: 0,
    shippingFee: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalItems: 0, subtotal: 0, shippingFee: 0, total: 0 });
      return;
    }
    try {
      setLoading(true);
      const data = await cartApi.get();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      showToast('Please log in to add items to your cart', 'warning');
      return false;
    }
    try {
      setLoading(true);
      const updatedCart = await cartApi.add(productId, quantity);
      setCart(updatedCart);
      showToast('Item added to cart!');
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to add item', 'danger');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      setLoading(true);
      const updatedCart = await cartApi.update(itemId, quantity);
      setCart(updatedCart);
    } catch (err) {
      showToast(err.message || 'Failed to update quantity', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      const updatedCart = await cartApi.remove(itemId);
      setCart(updatedCart);
      showToast('Item removed from cart');
    } catch (err) {
      showToast(err.message || 'Failed to remove item', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartApi.clear();
      setCart({ items: [], totalItems: 0, subtotal: 0, shippingFee: 0, total: 0 });
    } catch (err) {
      console.error('Failed to clear cart', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        toast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
