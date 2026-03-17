import axiosClient from './axiosClient';

export const adminApi = {
    getPendingOrganizers: async () => {
        const response = await axiosClient.get('/admin/users/pending-organizers');
        return response.data;
    },
    approveOrganizer: async (id) => {
        const response = await axiosClient.patch(`/admin/users/${id}/approve-organizer`);
        return response.data;
    },
    rejectOrganizer: async (id) => {
        const response = await axiosClient.patch(`/admin/users/${id}/reject-organizer`);
        return response.data;
    }
};
