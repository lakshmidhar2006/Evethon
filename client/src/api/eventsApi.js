import axiosClient from './axiosClient';

export const eventsApi = {
  getEvents: async (params = {}) => {
    const response = await axiosClient.get('/events', { params });
    return response.data;
  },

  getEventById: async (id) => {
    const response = await axiosClient.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (data) => {
    const response = await axiosClient.post('/events', data);
    return response.data;
  },

  updateEvent: async (id, data) => {
    const response = await axiosClient.patch(`/events/${id}`, data);
    return response.data;
  },

  submitEvent: async (id) => {
    const response = await axiosClient.post(`/events/${id}/submit`);
    return response.data;
  },
};
