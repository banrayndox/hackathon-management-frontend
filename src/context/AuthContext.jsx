// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ১. প্রথমবার অ্যাপ লোড হলে localStorage থেকে সেশন রিকভার করা
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          console.log('✅ AuthProvider: User recovered from localStorage:', parsedUser);
          
          // Background fetch to ensure role/profile is fresh
          API.get('/api/auth/me')
            .then((res) => {
              console.log('🔄 AuthProvider: Background profile refresh success:', res.data);
              setUser(res.data);
              localStorage.setItem('user', JSON.stringify(res.data));
            })
            .catch((err) => {
              console.error('❌ AuthProvider: Background profile refresh failed:', err);
              // Do not log out immediately on background network error, only if 401 (handled by interceptor)
            });
        } catch (e) {
          console.error('❌ AuthProvider: Failed to parse savedUser', e);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false); // ইনিশিয়ালি সেশন চেক শেষ
    };

    initializeAuth();
  }, []);

  // ২. লগইন ফাংশন (টোকেন দিয়ে প্রোফাইল তুলে আনা)
  const login = async (token) => {
    if (!token) {
      console.error('❌ login called without a token');
      return null;
    }

    try {
      setLoading(true);
      // টোকেনটি সাথে সাথে সেট করি যেন এক্সিওস ইন্টারসেপ্টর হেডার পাঠাতে পারে
      localStorage.setItem('token', token);

      console.log('🔄 Fetching latest user profile (Get Me) from backend...');
      
      const res = await API.get('/api/auth/me'); // axios interceptor automatically handles header now
      const latestUserData = res.data;
  
      // লোকাল স্টোরেজ ও স্টেট সিঙ্ক
      localStorage.setItem('user', JSON.stringify(latestUserData));
      setUser(latestUserData);
      
      console.log('✅ login: user profile fetched and state updated:', latestUserData);
      return latestUserData; // গুরুত্বপূর্ণ: ডেটা রিটার্ন করা হচ্ছে
    } catch (error) {
      console.error('❌ login: failed to fetch user profile during authentication', error);
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ৩. লগআউট ফাংশন
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setLoading(false);
    console.log('🚪 logout: user session cleared');
  };

  // ৪. প্রোফাইল রি-ফেচ ফাংশন (token এরর ফিক্সড)
  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token'); // 👈 এই লাইনটি মিসিং ছিল!
    if (!token) return null;

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
    }
  };

  const loginRedirect = () => {
    window.location.href = `${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/google`;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUserProfile, loginRedirect }}>
      {/* লোডিং অবস্থায় পুরো অ্যাপ রেন্ডার না করে একটু হোল্ড করা ভালো যাতে রাউটার ট্র্যাপে না পড়ে */}
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