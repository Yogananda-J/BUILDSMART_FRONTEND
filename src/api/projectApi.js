import axiosInstance from './axiosInstance';

// ── Projects ──
export const getProjects = () => axiosInstance.get('/api/projects');
export const getProjectById = (id) => axiosInstance.get(`/api/projects/${id}`);
export const createProject = (data) => axiosInstance.post('/api/projects', data);
export const getProjectMilestones = (projectId) => axiosInstance.get(`/api/projects/${projectId}/milestones`);
export const updateMilestoneStatus = (milestoneId, status) => axiosInstance.patch(`/api/projects/milestones/${milestoneId}/status?status=${status}`);
export const updateMilestonesFromProgress = (projectId, data) => axiosInstance.post(`/api/projects/${projectId}/milestones/progress`, data);

// ── Tasks ──
export const createTask = (projectId, data) => axiosInstance.post(`/api/projects/${projectId}/tasks`, data);
export const getProjectTasks = (projectId) => axiosInstance.get(`/api/projects/${projectId}/tasks`);
export const updateTaskStatus = (taskId, status) => axiosInstance.patch(`/api/projects/tasks/${taskId}/status?status=${status}`);
export const getMyTasks = (userId) => axiosInstance.get(`/api/projects/tasks/my?userId=${userId}`);
export const getAllTasks = () => axiosInstance.get('/api/projects/tasks');

// ── Approvals ──
export const getApprovals = (params) => axiosInstance.get('/api/approvals', { params });
export const approveApproval = (approvalId, data) => axiosInstance.post(`/api/approvals/${approvalId}/approve`, data);
export const rejectApproval = (approvalId, data) => axiosInstance.post(`/api/approvals/${approvalId}/reject`, data);

// ── Templates ──
export const getTemplates = () => axiosInstance.get('/api/templates');
// ── IAM Users ──
export const getAllIAMUsers = () => axiosInstance.get('/api/users');
