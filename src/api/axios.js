
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8080',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('⚠️ No token in localStorage');
  }
  return config;
});
export default API;