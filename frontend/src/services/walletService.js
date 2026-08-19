import api from './api';

export const getEarningsApi = async () => {
  const res = await api.get('/freelancer/earnings');
  return res.data;
};

export const requestWithdrawalApi = async (payload) => {
  const res = await api.post('/freelancer/withdrawals', payload);
  return res.data;
};
