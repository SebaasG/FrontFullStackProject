import api from '../services/Api';

export const login = async (email: string, password: string) => {
  const response = await api.post('/Auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
};
