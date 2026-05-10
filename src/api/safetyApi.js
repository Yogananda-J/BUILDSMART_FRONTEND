import axiosInstance from './axiosInstance';

// ── Inspections ──
export const createInspection = (data) => axiosInstance.post('/api/safety/inspections', data);
export const getInspectionById = (id) => axiosInstance.get(`/api/safety/inspections/${id}`);
export const getInspections = (params) => axiosInstance.get('/api/safety/inspections', { params });
export const updateInspectionStatus = (id, status) => axiosInstance.patch(`/api/safety/inspections/${id}/status?status=${status}`);
export const deleteInspection = (id) => axiosInstance.delete(`/api/safety/inspections/${id}`);
export const getInspectionTypes = () => axiosInstance.get('/api/safety/inspections/types');

// ── Incidents ──
export const createIncident = (data) => axiosInstance.post('/api/safety/incidents', data);
export const getIncidentById = (id) => axiosInstance.get(`/api/safety/incidents/${id}`);
export const getIncidents = (params) => axiosInstance.get('/api/safety/incidents', { params });
export const updateIncidentStatus = (id, status) => axiosInstance.patch(`/api/safety/incidents/${id}/status?status=${status}`);
export const updateIncident = (id, data) => axiosInstance.put(`/api/safety/incidents/${id}`, data);

// ── Safety Tasks ──
export const getSafetyTasks = (params) => axiosInstance.get('/api/safety/tasks', { params });
export const syncSafetyTasks = () => axiosInstance.post('/api/safety/tasks/sync');
export const submitSafetyTask = (taskId, data) => axiosInstance.post(`/api/safety/tasks/${taskId}/submit`, data);
export const updateSafetyTaskStatus = (taskId, data) => axiosInstance.patch(`/api/safety/tasks/${taskId}/status`, data);
export const getTasksByProject = (projectId) => axiosInstance.get(`/api/safety/tasks/project/${projectId}`);
