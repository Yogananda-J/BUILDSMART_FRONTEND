import axiosInstance from './axiosInstance';

export const changePassword = (data) => axiosInstance.post('/users/change-password', data);
