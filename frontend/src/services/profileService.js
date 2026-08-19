import api from './api';

export const getProfileApi = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateProfileApi = async (formData) => {
  const response = await api.post('/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const fetchPortfoliosApi = async () => {
  const response = await api.get('/portfolios');
  return response.data;
};

export const createPortfolioApi = async (formData) => {
  const response = await api.post('/portfolios', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePortfolioApi = async (id, formData) => {
  const response = await api.post(`/portfolios/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deletePortfolioApi = async (id) => {
  const response = await api.delete(`/portfolios/${id}`);
  return response.data;
};
