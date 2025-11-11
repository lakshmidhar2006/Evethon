import axiosClient from './axiosClient';

export const paymentsApi = {
  checkout: async (data) => {
    const response = await axiosClient.post('/payments/checkout', data);
    return response.data;
  },

  webhook: async (data) => {
    const response = await axiosClient.post('/payments/webhook', data);
    return response.data;
  },

  getPaymentStatus: async (id) => {
    const response = await axiosClient.get(`/payments/${id}/status`);
    return response.data;
  },
};
