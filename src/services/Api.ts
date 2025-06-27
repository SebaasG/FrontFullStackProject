import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5105/api', // ajusta si usas otro puerto
});

// Interceptor para añadir el token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // o sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
