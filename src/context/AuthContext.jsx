// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // প্রোফাইল ফেচ (টোকেন সহ)
  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return null;
    }

    try {
      const res = await API.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('📥 fetchUserProfile success:', res.data);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      return res.data;
    } catch (error) {
      console.error('❌ fetchUserProfile error:', error);
      logout();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ইনিশিয়ালাইজেশন – প্রতি রিফ্রেশে/মাউন্টে কল হবে
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // লগআউট
  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await API.post('/api/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Logout API called');
      }
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
        window.location.href = '/';
    }
  };

  // লগইন রিডাইরেক্ট
  const loginRedirect = () => {
    window.location.href = `${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/google`;
  };

  // লগইন (টোকেন দিয়ে) – যদি প্রয়োজন হয়
  const login = async (token) => {
    // ... আপনার কোড (যদি প্রয়োজন)
  };

  const value = {
    user,
    loading,
    login,
    logout,
    fetchUserProfile,
    loginRedirect,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0614] text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};