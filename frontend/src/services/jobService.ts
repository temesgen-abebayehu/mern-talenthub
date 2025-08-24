import api from './api';

export const jobAPI = {
    getAll: (params?: any) => api.get('/jobs', params ? { params } : undefined),
    getById: (id: string) => api.get(`/jobs/${id}`),
    create: (data: any) => api.post('/jobs', data),
    update: (id: string, data: any) => api.put(`/jobs/${id}`, data),
    delete: (id: string) => api.delete(`/jobs/${id}`),
    getByCompany: (companyId: string) => api.get(`/jobs/company/${companyId}`),
    getMyJobs: () => api.get('/jobs/my'),
};
