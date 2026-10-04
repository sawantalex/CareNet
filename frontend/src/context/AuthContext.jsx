import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('carenet_token');
      if (token) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch (error) {
          console.error("Session restoration failed:", error);
          localStorage.removeItem('carenet_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    localStorage.setItem('carenet_token', data.access_token);
    const userData = await authApi.getMe();
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    await authApi.register(userData);
    return await login({ email: userData.email, password: userData.password });
  };

  const logout = () => {
    localStorage.removeItem('carenet_token');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
