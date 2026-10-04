import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getToken, saveAuthSession, clearAuthSession } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    const storedToken = getToken();
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Verify with /me
        authApi.me()
          .then((profile) => {
            setUser((prev) => ({ ...prev, ...profile }));
            localStorage.setItem('user', JSON.stringify({ ...JSON.parse(storedUser), ...profile }));
          })
          .catch(() => {
            // Token may be invalid or expired
            logout();
          })
          .finally(() => setLoading(false));
      } catch (err) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    const handleAuthExpired = () => {
      logout();
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login(email, password);
    const userData = {
      id: response.id,
      email: response.email,
      fullName: response.fullName,
      role: response.role,
      address: response.address,
      phone: response.phone,
    };
    setToken(response.token);
    setUser(userData);
    saveAuthSession(response.token, userData);
    return response;
  };

  const register = async (registerData) => {
    const response = await authApi.register(registerData);
    const userData = {
      id: response.id,
      email: response.email,
      fullName: response.fullName,
      role: response.role,
      address: response.address,
      phone: response.phone,
    };
    setToken(response.token);
    setUser(userData);
    saveAuthSession(response.token, userData);
    return response;
  };

  const logout = () => {
    clearAuthSession();
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
