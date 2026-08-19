import api from './api';

export const getVerificationStatusApi = async () => {
  const response = await api.get('/verification/status');
  return response.data;
};

export const resendEmailVerificationApi = async () => {
  const response = await api.post('/verification/email/resend');
  return response.data;
};

export const verifyEmailApi = async () => {
  const response = await api.post('/verification/email/verify');
  return response.data;
};

export const sendOtpApi = async () => {
  const response = await api.post('/verification/phone/send-otp');
  return response.data;
};

export const verifyOtpApi = async (otp) => {
  const response = await api.post('/verification/phone/verify-otp', { otp });
  return response.data;
};

export const submitOnboardingApi = async (data) => {
  const response = await api.post('/verification/onboarding', data);
  return response.data;
};

export const submitIdentityVerificationApi = async (formData) => {
  const response = await api.post('/verification/identity/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const scanKtpOcrApi = async (file) => {
  const formData = new FormData();
  formData.append('ktp_image', file);
  const response = await api.post('/verification/ktp/ocr', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Admin endpoints
export const adminGetVerificationsApi = async (status = 'ALL', search = '', page = 1) => {
  const response = await api.get(`/admin/verifications?status=${status}&search=${encodeURIComponent(search)}&page=${page}`);
  return response.data;
};

export const adminGetVerificationDetailApi = async (id) => {
  const response = await api.get(`/admin/verifications/${id}`);
  return response.data;
};

export const adminApproveVerificationApi = async (id) => {
  const response = await api.post(`/admin/verifications/${id}/approve`);
  return response.data;
};

export const adminRejectVerificationApi = async (id, reason, notes = '') => {
  const response = await api.post(`/admin/verifications/${id}/reject`, { reason, notes });
  return response.data;
};

export const adminRequestRevisionApi = async (id, reason, notes = '') => {
  const response = await api.post(`/admin/verifications/${id}/request-revision`, { reason, notes });
  return response.data;
};
