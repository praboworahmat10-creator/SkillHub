import api from './api';

export const getAvailabilityApi = async () => {
  const res = await api.get('/freelancer/availability');
  return res.data;
};

export const updateAvailabilityApi = async (status) => {
  const res = await api.post('/freelancer/availability', { availability_status: status });
  return res.data;
};
