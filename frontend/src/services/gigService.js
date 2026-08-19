import api from './api';

export const getMyGigsApi = async () => {
  const res = await api.get('/freelancer/services');
  return res.data;
};

export const createGigApi = async (formData) => {
  const res = await api.post('/freelancer/services', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateGigApi = async (id, formData) => {
  const res = await api.post(`/freelancer/services/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteGigApi = async (id) => {
  const res = await api.delete(`/freelancer/services/${id}`);
  return res.data;
};
