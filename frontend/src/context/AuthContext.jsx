import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setUser({ token });
    } else {
      setUser(null);
    }
  }, [token]);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser({ token: res.data.token });
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err?.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (email, password) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, { email, password });
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err?.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}; 