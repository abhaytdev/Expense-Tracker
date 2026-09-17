import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// If the session has expired, bounce back to login - except for the
// current-user check itself, which is *expected* to 401 when nobody is
// logged in yet and must not trigger a redirect loop.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCheck = error.config?.url?.includes('/auth/current-user');
    if (error.response?.status === 401 && !isAuthCheck && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
