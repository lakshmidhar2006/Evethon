import axiosClient from './axiosClient';

export const registrationsApi = {
  register: async (data) => {
    const response = await axiosClient.post('/registrations', data);
    return response.data;
  },

  getMyRegistrations: async () => {
    const response = await axiosClient.get('/registrations/me');
    return response.data;
  },
};
