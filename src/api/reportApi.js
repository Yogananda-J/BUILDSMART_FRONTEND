import axiosInstance from './axiosInstance';

// ── Project Reports ──
export const getProjectHealth = (projectId) => axiosInstance.get(`/api/reports/project/${projectId}/health`);
export const getProjectSummary = () => axiosInstance.get('/api/reports/project/summary');

// ── User Analytics ──
export const getUserAnalytics = () => axiosInstance.get('/api/reports/users/analytics');
export const getAllReportUsers = () => axiosInstance.get('/api/reports/users/all');
export const getProjectUserAnalytics = (projectId) => axiosInstance.get(`/api/reports/users/project/${projectId}`);

// ── Site Engineer Analytics ──
export const getSiteEngineerPerformance = (engineerId) => engineerId ? axiosInstance.get(`/api/reports/site-engineer/performance/${engineerId}`) : axiosInstance.get('/api/reports/site-engineer/performance');
export const getSiteProgressSummary = () => axiosInstance.get('/api/reports/site-engineer/summary');
export const getSiteEngineerDailyLogs = (engineerId) => engineerId ? axiosInstance.get(`/api/reports/site-engineer/daily-logs/${engineerId}`) : axiosInstance.get('/api/reports/site-engineer/daily-logs');

// ── Resource Analytics ──
export const getResourceUtilization = () => axiosInstance.get('/api/reports/resources/utilization');
export const getLaborAllocation = () => axiosInstance.get('/api/reports/resources/labor-allocation');

// ── Safety Analytics ──
export const getSafetyTrends = () => axiosInstance.get('/api/reports/safety/trends');
export const getSafetyInspectionSummary = () => axiosInstance.get('/api/reports/safety/inspections-summary');

// ── Vendor Analytics ──
export const getVendorPerformance = (vendorId) => vendorId ? axiosInstance.get(`/api/reports/vendor/performance/${vendorId}`) : axiosInstance.get('/api/reports/vendor/performance');
export const getVendorCompliance = () => axiosInstance.get('/api/reports/vendor/compliance');

// ── Finance Analytics ──
export const getBudgetVariance = (projectId) => axiosInstance.get(`/api/reports/finance/budget-variance/${projectId}`);
export const getCashFlow = () => axiosInstance.get('/api/reports/finance/cash-flow');

// ── Report Management ──
export const generateReport = (data) => axiosInstance.post('/api/reports/generate', data);
export const getReportById = (id) => axiosInstance.get(`/api/reports/${id}`);
export const getDashboardSummary = () => axiosInstance.get('/api/reports/dashboard-summary');
export const getReportHistory = (scope) => axiosInstance.get(`/api/reports/history/${scope}`);
export const exportReport = (reportId) => axiosInstance.post(`/api/reports/export/${reportId}`);
