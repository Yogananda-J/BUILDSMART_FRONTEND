import axiosInstance from './axiosInstance';

export const getUnreadCount = () => axiosInstance.get('/api/notifications/unread-count');
export const getNotifications = (params) => axiosInstance.get('/api/notifications', { params });
export const markAsRead = (id) => axiosInstance.put(`/api/notifications/${id}/read`);
