import axios from 'axios';

// Use production backend URL or fallback to localhost for development
const baseURL = import.meta.env.VITE_PRODUCTION_BACKEND_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api; 