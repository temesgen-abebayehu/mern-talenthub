// src/services/userService.js
import api from './api';

export const userAPI = {
  // Get user profile
  getProfile: (userId: string) => api.get(`/users/${userId}`),

  // Update user profile
  updateProfile: (userId: string, userData: any) => api.put(`/users/${userId}`, userData),

  // Change password
  changePassword: (userId: string, passwordData: any) =>
    api.put(`/users/${userId}/password`, passwordData),

  // Upload profile picture
  uploadAvatar: (userId: string, formData: FormData) =>
    api.post(`/users/${userId}/upload-avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  // Delete user account
  deleteAccount: (userId: string) => api.delete(`/users/${userId}`)
};