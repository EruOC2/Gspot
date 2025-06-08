import axios from 'axios';

const BASE_URL = 'https://gspot-backend.onrender.com'; 


export const register = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/auth/register`, { email, password });
  return res.data;
};


export const login = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
  return res.data;
};


export const uploadStory = async (formData, token) => {
  const res = await axios.post(`${BASE_URL}/stories`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


export const fetchSpots = async () => {
  const res = await axios.get(`${BASE_URL}/stories`);
  return res.data;
};


export const deleteSpot = async (spotId, token) => {
  const res = await axios.delete(`${BASE_URL}/stories/${spotId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


export const likeSpot = async (spotId, token) => {
  const res = await axios.post(`${BASE_URL}/stories/${spotId}/like`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
