import api from './api';

export const getContractsApi = async (params = {}) => {
  const res = await api.get('/freelancer/contracts', { params });
  return res.data;
};

export const getContractDetailApi = async (id) => {
  const res = await api.get(`/freelancer/contracts/${id}`);
  return res.data;
};
