import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUserProfile } = useAuth(); 
  const {user} = useAuth()
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    if (token) {
      localStorage.setItem('token', token);
      
      fetchUserProfile().then(() => {
  if (user) {
    const roleMap = {
      admin: '/admin/dashboard',
      judge: '/judge/dashboard',
      participant: '/participants/dashboard',
    };
    navigate(roleMap[user.role] || '/');
  } else {
    navigate('/');
  }
      });

    } else {

      navigate('/login?error=no_token');
    }
  }, [location, navigate, fetchUserProfile]);

  return  (<div className="min-h-screen flex items-center justify-center bg-[#0B0614] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>);
};

export default Callback;