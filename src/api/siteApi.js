import axiosInstance from './axiosInstance';

// ── Daily Site Logs ──
export const createSiteLog = (data) => axiosInstance.post('/api/sitelogs', data);
export const uploadSiteLogPhoto = (logId, formData) => axiosInstance.post(`/api/sitelogs/${logId}/photo-upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getSiteLogById = (logId) => axiosInstance.get(`/api/sitelogs/${logId}`);
export const submitSiteLog = (logId) => axiosInstance.post(`/api/sitelogs/${logId}/submit`);
export const getSiteLogs = (params) => axiosInstance.get('/api/sitelogs', { params });
export const getSiteLogsPaginated = (params) => axiosInstance.get('/api/sitelogs/paginated/list', { params });
export const getSiteLogsByDateRange = (params) => axiosInstance.get('/api/sitelogs/paginated/date-range', { params });
export const getSiteLogByDate = (params) => axiosInstance.get('/api/sitelogs/by-date', { params });
export const getLatestSiteLog = (projectId) => axiosInstance.get(`/api/sitelogs/latest/${projectId}`);

// ── Issues ──
export const createIssue = (data) => axiosInstance.post('/api/issues', data);
export const getIssues = (params) => axiosInstance.get('/api/issues', { params });
export const getIssueById = (id) => axiosInstance.get(`/api/issues/${id}`);
export const updateIssue = (id, data) => axiosInstance.put(`/api/issues/${id}`, data);
export const updateIssueStatus = (id, status) => axiosInstance.patch(`/api/issues/${id}/status?status=${status}`);
export const assignIssue = (id, data) => axiosInstance.post(`/api/issues/${id}/assign`, data);

// ── SiteOps Tasks ──
export const getSiteTasks = (params) => axiosInstance.get('/api/siteops/tasks', { params });
export const updateSiteTaskStatus = (taskId, data) => axiosInstance.patch(`/api/siteops/tasks/${taskId}/status`, data);
