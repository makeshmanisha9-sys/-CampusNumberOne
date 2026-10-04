import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('c1_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('c1_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify session
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('c1_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('c1_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification failed, clearing auth cache.');
          localStorage.removeItem('c1_token');
          localStorage.removeItem('c1_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('c1_token', res.token);
      localStorage.setItem('c1_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('c1_token', res.token);
      localStorage.setItem('c1_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
    localStorage.removeItem('c1_token');
    localStorage.removeItem('c1_user');
  };

  const updateProfile = async (profileData) => {
    const res = await authService.updateProfile(profileData);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('c1_user', JSON.stringify(res.user));
    }
    return res;
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('c1_user', JSON.stringify(res.user));
      }
    } catch (e) {
      // Ignore
    }
  };

  const quickDemoLogin = async (roleType = 'student') => {
    let email = 'student@campus.edu';
    if (roleType === 'faculty') email = 'faculty@campus.edu';
    if (roleType === 'admin') email = 'admin@campus.edu';

    return await login(email, 'password123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
        quickDemoLogin,
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
