import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor to add Bearer token to requests if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillhub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global API errors (e.g. 401 unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const token = localStorage.getItem('skillhub_token');
      // Only clear storage if token is NOT a demo token
      if (token && !token.startsWith('demo_')) {
        localStorage.removeItem('skillhub_token');
        localStorage.removeItem('skillhub_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
