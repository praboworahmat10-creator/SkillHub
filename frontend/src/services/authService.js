import api from './api';

export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerCustomerApi = async (data) => {
  const response = await api.post('/auth/register-customer', data);
  return response.data;
};

export const registerFreelancerApi = async (data) => {
  const response = await api.post('/auth/register-freelancer', data);
  return response.data;
};

export const getProfileApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
