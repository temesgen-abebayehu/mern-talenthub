import api from './api';

export const loginUser = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    return data.user;
};

export const registerUser = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    return data.user;
};

export const getUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const { data } = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data.user;
};

export const logoutUser = async () => {
    localStorage.removeItem('token');
};

export const resetPassword = async (email) => {
    return api.post('/auth/forgot-password', { email });
};

export const updatePassword = async (token, password) => {
    return api.post(`/auth/reset-password/${token}`, { password });
};
