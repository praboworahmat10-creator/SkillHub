import api from './api';

export const getProposalsApi = async (params = {}) => {
  const res = await api.get('/freelancer/proposals', { params });
  return res.data;
};

export const getProposalDetailApi = async (id) => {
  const res = await api.get(`/freelancer/proposals/${id}`);
  return res.data;
};

export const submitProposalApi = async (jobId, payload) => {
  const res = await api.post(`/freelancer/jobs/${jobId}/proposals`, payload);
  return res.data;
};

export const withdrawProposalApi = async (id) => {
  const res = await api.post(`/freelancer/proposals/${id}/withdraw`);
  return res.data;
};
