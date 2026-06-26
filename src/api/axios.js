// src/api/axios.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  withCredentials: false, // JWT টোকেন header‑এ পাঠানো হবে
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;