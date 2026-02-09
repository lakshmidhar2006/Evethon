import axiosClient from './axiosClient';

export const eventsApi = {
    // Public
    getEvents: async (params = {}) => {
        const response = await axiosClient.get('/events', { params });
        return response.data;
    },

    getEventById: async (id) => {
        const response = await axiosClient.get(`/events/${id}`);
        return response.data;
    },

    getPopularEvents: async () => {
        const response = await axiosClient.get('/events/popular');
        return response.data;
    },

    // Organizer / Admin
    createEvent: async (data) => {
        const response = await axiosClient.post('/events', data);
        return response.data;
    },

    updateEvent: async (id, data) => {
        const response = await axiosClient.patch(`/events/${id}/update`, data);
        return response.data;
    },

    deleteEvent: async (id) => {
        const response = await axiosClient.delete(`/events/${id}`);
        return response.data;
    },

    getRegistrations: async (eventId) => {
        const response = await axiosClient.get(`/registrations/event/${eventId}`);
        return response.data;
    },

    submitEvent: async (id) => {
        const response = await axiosClient.post(`/events/${id}/submit`);
        return response.data;
    },

    closeEvent: async (id) => {
        const response = await axiosClient.patch(`/events/${id}/close`);
        return response.data;
    },

    // Admin
    adminApproveEvent: async (id) => {
        const response = await axiosClient.patch(`/admin/events/${id}/approve`);
        return response.data;
    },

    adminRejectEvent: async (id, reason) => {
        const response = await axiosClient.patch(`/admin/events/${id}/reject`, { reason });
        return response.data;
    },
};
