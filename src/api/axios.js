// src/api/axios.js
import axios from 'axios';

// Vite-তে এনভায়রনমেন্ট ভেরিয়েবল access করতে import.meta.env ব্যবহার করুন
const API = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8080',
  withCredentials: true,
});

// প্রতিটি রিকোয়েস্টে টোকেন যোগ করবে
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('🔑 Interceptor token:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('⚠️ No token in localStorage');
  }
  return config;
});
export default API;