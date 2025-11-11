import axiosClient from './axiosClient';

export const reportsApi = {
  getRegistrations: async (params = {}) => {
    const response = await axiosClient.get('/reports/registrations', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
