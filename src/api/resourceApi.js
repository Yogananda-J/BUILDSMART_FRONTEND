import axiosInstance from './axiosInstance';

// ── Resources ──
export const createResource = (data) => axiosInstance.post('/api/resources', data);
export const getResources = () => axiosInstance.get('/api/resources');
export const getResourcesPaginated = (params) => axiosInstance.get('/api/resources/page', { params });
export const getResourceById = (id) => axiosInstance.get(`/api/resources/${id}`);
export const updateResource = (id, data) => axiosInstance.put(`/api/resources/${id}`, data);
export const deleteResource = (id) => axiosInstance.delete(`/api/resources/${id}`);
export const getResourcesByType = (type) => axiosInstance.get(`/api/resources/type/${type}`);
export const getAvailableResources = () => axiosInstance.get('/api/resources/available');

// ── Allocations ──
export const createAllocation = (data) => axiosInstance.post('/api/allocations', data);
export const getAllocations = () => axiosInstance.get('/api/allocations');
export const getAllocationsByProject = (projectId) => axiosInstance.get(`/api/allocations/project/${projectId}`);
export const getAllocationsByResource = (resourceId) => axiosInstance.get(`/api/allocations/resource/${resourceId}`);
export const updateAllocation = (id, data) => axiosInstance.put(`/api/allocations/${id}`, data);
export const deleteAllocation = (id) => axiosInstance.delete(`/api/allocations/${id}`);
