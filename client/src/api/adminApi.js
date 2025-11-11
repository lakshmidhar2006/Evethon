import axiosClient from './axiosClient';

export const adminApi = {
  approveEvent: async (id) => {
    const response = await axiosClient.patch(`/admin/events/${id}/approve`);
    return response.data;
  },

  publishEvent: async (id) => {
    const response = await axiosClient.patch(`/admin/events/${id}/publish`);
    return response.data;
  },

  closeEvent: async (id) => {
    const response = await axiosClient.patch(`/admin/events/${id}/close`);
    return response.data;
  },
};
