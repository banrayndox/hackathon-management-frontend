import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // ইনিশিয়ালি লোকাল স্টোরেজে ইউজার থাকলে তা সেট করে নেওয়া (ফাস্ট লোড)
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // প্রোফাইল ফেচ (টোকেন সহ)
  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      localStorage.removeItem('user');
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      const res = await API.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      return res.data;
    } catch (error) {
      console.error('Error to fetch');
      // টোকেন ইনভ্যালিড বা এক্সপায়ারড হলে ক্লিনআপ করা
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ইনিশিয়ালাইজেশন – অ্যাপ প্রথমবার লোড হলে কল হবে
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


  const loginRedirect = () => {
    window.location.href = `${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/google`;
  };

  const value = {
    user,
    loading,
    logout,
    fetchUserProfile,
    loginRedirect,
  };

  const tokenExists = !!localStorage.getItem('token');
  if (loading && tokenExists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0614] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};