// src/services/orders.ts
import api from '../services/Api';
import { Order } from '../types';

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get('/ordenes');
  return response.data;
};
