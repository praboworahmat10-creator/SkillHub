import api from './api';

export const getJobsApi = async (params = {}) => {
  const res = await api.get('/freelancer/jobs', { params });
  return res.data;
};

export const getJobDetailApi = async (id) => {
  const res = await api.get(`/freelancer/jobs/${id}`);
  return res.data;
};

export const getPublicJobsApi = async (params = {}) => {
  try {
    const res = await api.get('/jobs', { params });
    return res.data;
  } catch (err) {
    const fallback = await api.get('/freelancer/jobs', { params }).catch(() => ({ data: { data: [] } }));
    return fallback.data;
  }
};

export const getPublicJobDetailApi = async (id) => {
  try {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  } catch (err) {
    const fallback = await api.get(`/freelancer/jobs/${id}`).catch(() => ({ data: null }));
    return fallback.data;
  }
};
