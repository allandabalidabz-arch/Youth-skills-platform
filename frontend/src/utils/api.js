import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach token to every request — check both storages
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — only redirect if not already on a public page
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      // Only redirect if currently on a protected page
      const publicPaths = ['/', '/login', '/register', '/admin/login', '/about', '/forgot-password', '/reset-password'];
      const isPublic = publicPaths.some(p => window.location.pathname === p) ||
                       window.location.pathname.startsWith('/verify/');
      if (!isPublic) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
