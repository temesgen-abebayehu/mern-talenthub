import api from './api';

export interface Company {
  _id: string;
  name: string;
  legalDetails?: string;
  owner?: { name?: string; email?: string };
  status: 'pending' | 'approved' | 'rejected';
  documents?: string[];
}

export const companyAPI = {
  getAllCompanies: async () => api.get('/companies'),
  getMyCompanies: async () => api.get('/companies/my'),
  registerCompany: async (data: FormData) => api.post('/companies', data),
  deleteCompany: async (id: string) => api.delete(`/companies/${id}`),
  reviewCompany: async ({ companyId, status, reason }: { companyId: string; status: string; reason?: string }) => api.put(`/companies/${companyId}/review`, { status, reason }),
};
