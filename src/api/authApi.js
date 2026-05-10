import axiosInstance from './axiosInstance';

export const login = (data) => axiosInstance.post('/api/auth/login', data);
export const signup = (data) => axiosInstance.post('/api/auth/signup', data);
export const logout = (data) => axiosInstance.post('/api/auth/logout', data);
export const forgotPassword = (data) => axiosInstance.post('/api/auth/forgot-password', data);
export const resetPassword = (data) => axiosInstance.post('/api/auth/reset-password', data);
export const checkUsername = (username) => axiosInstance.get(`/api/auth/check-username?username=${username}`);
export const validateResetToken = (token) => axiosInstance.get(`/api/auth/validate-reset-token/${token}`);
