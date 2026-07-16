import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const axiosInstance = axios.create({
  baseURL,
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Skip the interceptor for the login endpoint so it can handle 401 locally and show the error
    const isLoginEndpoint = error.config && error.config.url && error.config.url.includes('/auth/login');
    
    if (error.response && error.response.status === 401 && !isLoginEndpoint) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('teacherInfo');
      // Redirect to login page only if not already on the login endpoint
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
