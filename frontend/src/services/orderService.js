import api from './api';

export const getOrdersApi = async (params = {}) => {
  const res = await api.get('/freelancer/orders', { params });
  return res.data;
};

export const getOrderDetailApi = async (id) => {
  const res = await api.get(`/freelancer/orders/${id}`);
  return res.data;
};

export const updateOrderStatusApi = async (id, status, notes = '') => {
  const res = await api.post(`/freelancer/orders/${id}/status`, { status, notes });
  return res.data;
};
