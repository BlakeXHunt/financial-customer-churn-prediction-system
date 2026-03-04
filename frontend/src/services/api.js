import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:2005/api',   
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const register = (userData) => API.post('/auth/register', userData);
export const login = (userData) => API.post('/auth/login', userData);
export const getProfile = () => API.get('/auth/profile');
export const getAllUsers = () => API.get('/auth/users');
export const getChurnDistribution = () => API.get('/predictions/churn-distribution');
// Admin: approve a user (admin only)
export const approveUser = (userId) => API.patch(`/admin/approve/${userId}`);
export const predictSingleChurn = (customerData) => API.post('/predictions/single', customerData);