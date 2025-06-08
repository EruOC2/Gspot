import axios from 'axios';

const BASE_URL = 'http://192.168.0.33:3000'; // Ajusta esto según tu IP/localhost

// Registro de usuario
export const register = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/auth/register`, { email, password });
  return res.data;
};

// Inicio de sesión
export const login = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
  return res.data;
};

// Subir nuevo spot con imagen y token
export const uploadStory = async (formData, token) => {
  const res = await axios.post(`${BASE_URL}/stories`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Obtener todos los spots
export const fetchSpots = async () => {
  const res = await axios.get(`${BASE_URL}/stories`);
  return res.data;
};

// Eliminar un spot (requiere token)
export const deleteSpot = async (spotId, token) => {
  const res = await axios.delete(`${BASE_URL}/stories/${spotId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Dar like a un spot (requiere token)
export const likeSpot = async (spotId, token) => {
  const res = await axios.post(`${BASE_URL}/stories/${spotId}/like`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
