import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5105/api', // Cambia según tu entorno
});

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW5AdGFsbGVyLmNvbSIsImV4cCI6MTc1MDk5OTEzMCwiaXNzIjoiQXBpU2d0YSIsImF1ZCI6IkFwaVNndGFVc2VycyJ9.YhtPk5tP8YXpJFa2rqxfmwKp6hgZh0DH8QTwTTIPTxQ"
// Interceptor: agrega el token JWT automáticamente en cada petición
api.interceptors.request.use((config) => {
  
    config.headers.Authorization = `Bearer ${token}`;
 
  return config;
});

export default api;
