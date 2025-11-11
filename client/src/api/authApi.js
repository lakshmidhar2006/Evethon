import axiosClient from './axiosClient';

export const authApi = {
  register: async (data) => {
    const response = await axiosClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data) => {
    const response = await axiosClient.post('/auth/login', data);
    return response.data;
  },

  me: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await axiosClient.post('/auth/logout');
    return response.data;
  },
};
