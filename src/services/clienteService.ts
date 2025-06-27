import axios from 'axios';
var token1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW5AdGFsbGVyLmNvbSIsImV4cCI6MTc1MTAzMDM2MiwiaXNzIjoiQXBpU2d0YSIsImF1ZCI6IkFwaVNndGFVc2VycyJ9.LWOQsguBTTNd-bryWdHtYfw2xzBp8vKdw6W7TjBmB2Q"

const API_URL = 'http://localhost:5105/api/cliente'; // <-- Cambia el PORT si es necesario

export const getClientes = async (token: string) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token1}`
    }
  });
  return response.data;
};

// Puedes agregar más funciones: createCliente, updateCliente, etc.
