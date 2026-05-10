import axiosInstance from './axiosInstance';

export const getUserProfile = () => axiosInstance.get('/users/profile');
export const updateUserProfile = (data) => axiosInstance.put('/users/profile', data);
export const checkUserRole = (role) => axiosInstance.get(`/users/check-role/${role}`);
export const getUserById = (userId) => axiosInstance.get(`/users/${userId}`);
export const getUserByEmail = (email) => axiosInstance.get('/users/by-email', { params: { email } });
export const getAllUsers = () => axiosInstance.get('/users/all');
