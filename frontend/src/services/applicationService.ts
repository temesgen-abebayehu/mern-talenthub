import api from './api';

export const applicationAPI = {
    getAll: () => api.get('/applications'),
    getById: (id: string) => api.get(`/applications/${id}`),
    create: (data: any) => api.post('/applications', data),
    update: (id: string, data: any) => api.put(`/applications/${id}`, data),
    delete: (id: string) => api.delete(`/applications/${id}`),
    getUserApplications: (userId: string) => api.get(`/applications/user/${userId}`),
    withdrawApplication: (applicationId: string) => api.post(`/applications/${applicationId}/withdraw`),
};
