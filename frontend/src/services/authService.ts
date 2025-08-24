import api from './api';

export const verifyEmail = async (token: string): Promise<any> => {
    const { data } = await api.get(`/auth/verify-email?token=${token}`);
    return data;
};


export const loginUser = async (credentials: { email: string; password: string }): Promise<any> => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    return data.user;
};

export const registerUser = async (userData: Record<string, any>): Promise<any> => {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    return data.user;
};

export const getUser = async (): Promise<any> => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const { data } = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.user;
};

export const logoutUser = async (): Promise<void> => {
    localStorage.removeItem('token');
};

export const resetPassword = async (email: string): Promise<any> => {
    return api.post('/auth/forgot-password', { email });
};

export const updatePassword = async (token: string, password: string): Promise<any> => {
    return api.post(`/auth/reset-password/${token}`, { password });
};
