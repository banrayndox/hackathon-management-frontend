// src/pages/Callback.jsx
import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // React 18 StrictMode-এ useEffect যেন দুইবার রান করে এপিআই ক্রাশ না করায়, সেজন্য useRef ব্যবহার করা হয়েছে
  const initialRender = useRef(true);

  useEffect(() => {
    // যদি অলরেডি একবার রান হয়ে থাকে, তবে দ্বিতীয়বার রান হওয়া ব্লক করবে
    if (!initialRender.current) return;

    const handleAuthCallback = async () => {
      const token = searchParams.get('token');
      console.log("🔗 Callback URL parsed. Token exists:", !!token);
      
      if (token) {
        initialRender.current = false; // রান হওয়া শুরু হলে ফ্ল্যাগ ফলস করে দিন
        
        try {
          // AuthContext এর নতুন async login ফাংশন কল করছি যা নিজেই API.get('/api/auth/me') হ্যান্ডেল করে
          const loggedInUser = await login(token);

          if (loggedInUser) {
            console.log("✅ Login Successful, User Role:", loggedInUser.role);

            // ইউজারের রোল অনুযায়ী সরাসরি অবজেক্ট থেকে ডেটা নিয়ে নিখুঁতভাবে রিডিরেক্ট
            if (loggedInUser.role === 'admin') {
              navigate('/admin/dashboard');
            } else if (loggedInUser.role === 'judge') {
              navigate('/judge/dashboard');
            } else {
              navigate('/participants/dashboard');
            }
          } else {
            console.error('❌ Login failed: User data could not be fetched.');
            navigate('/');
          }
          
        } catch (error) {
          console.error('❌ Callback logic error:', error);
          navigate('/');
        }
      } else {
        console.error('❌ No token found in URL query parameters');
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0614] text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-purple-300">Processing login, please wait...</p>
      </div>
    </div>
  );
};

export default Callback;