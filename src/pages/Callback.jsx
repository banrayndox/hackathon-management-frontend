import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUser } = useAuth();
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    if (token) {
      localStorage.setItem('token', token);
      console.log('✅ Token saved from callback');
    if (fetchUser) {
        fetchUser(); 
      }
      window.location.replace('/');
      navigate('/');
    } else {
      console.error('❌ No token in callback URL');
      navigate('/');
    }
  }, [location, navigate]);

  return <div className="text-white text-center mt-20">...</div>;
};

export default Callback;