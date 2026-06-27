import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    if (token) {
      localStorage.setItem('token', token);
      console.log('✅ Token saved from callback');
      navigate('/');
      window.location.href = '/';
    } else {
      console.error('❌ No token in callback URL');
      navigate('/');
    }
  }, [location, navigate]);

  return <div className="text-white text-center mt-20">...</div>;
};

export default Callback;