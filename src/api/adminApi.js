import axiosInstance from './axiosInstance';

export const getPendingUsers = () => axiosInstance.get('/admin/pending-users');
export const approveUser = (userId) => axiosInstance.post(`/admin/approve-user/${userId}`);
export const rejectUser = (userId) => axiosInstance.post(`/admin/reject-user/${userId}`);
export const getAllUsers = (params) => axiosInstance.get('/admin/users', { params });
export const getUserById = (userId) => axiosInstance.get(`/admin/users/${userId}`);
export const updateUser = (userId, data) => axiosInstance.put(`/admin/users/${userId}`, data);
export const deleteUser = (userId) => axiosInstance.delete(`/admin/users/${userId}`);
export const getUsersByRole = (role) => axiosInstance.get(`/admin/users/role/${role}`);
export const getAuditLogs = (params) => axiosInstance.get('/admin/audit-logs', { params });
export const getAuditLogsByUser = (userId) => axiosInstance.get(`/admin/audit-logs/user/${userId}`);
