import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 👈 ইউজ অথ ইম্পোর্ট করুন

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUserProfile } = useAuth(); // 👈 ফাংশনটি বের করে নিন

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    if (token) {
      localStorage.setItem('token', token);
      console.log('✅ Token saved from callback');
      
      // ১. টোকেন সেভ করার সাথে সাথে ব্যাকএন্ড থেকে ইউজার প্রোফাইল ফেচ করুন
      fetchUserProfile().then(() => {
        // ২. ফেচ সফল হওয়ার পর স্মুথলি হোম পেজে চলে যান (কোনো রিফ্রেশ লাগবে না)
        navigate('/');
      });

    } else {
      console.error('❌ No token in callback URL');
      navigate('/login?error=no_token');
    }
  }, [location, navigate, fetchUserProfile]);

  return <div className="text-white text-center mt-20">Logging in...</div>;
};

export default Callback;