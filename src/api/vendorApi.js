import axiosInstance from './axiosInstance';

// ── Contracts ──
export const createContract = (data) => axiosInstance.post('/api/contracts', data);
export const getContracts = (params) => axiosInstance.get('/api/contracts', { params });
export const getContractById = (id) => axiosInstance.get(`/api/contracts/${id}`);
export const updateContract = (id, data) => axiosInstance.put(`/api/contracts/${id}`, data);
export const deleteContract = (id) => axiosInstance.delete(`/api/contracts/${id}`);

// ── Invoices ──
export const createInvoice = (data) => axiosInstance.post('/api/invoices', data);
export const getInvoices = (params) => axiosInstance.get('/api/invoices', { params });
export const getInvoiceById = (id) => axiosInstance.get(`/api/invoices/${id}`);
export const getInvoicesByContract = (contractId) => axiosInstance.get(`/api/invoices/contract/${contractId}`);
export const getInvoicesByStatus = (status) => axiosInstance.get(`/api/invoices/status/${status}`);
export const updateInvoice = (id, data) => axiosInstance.put(`/api/invoices/${id}`, data);
export const deleteInvoice = (id) => axiosInstance.delete(`/api/invoices/${id}`);
export const submitInvoice = (id) => axiosInstance.post(`/api/invoices/${id}/submit`);
export const getInvoiceStatus = (id) => axiosInstance.get(`/api/invoices/${id}/status`);

// ── Deliveries ──
export const createDelivery = (data) => axiosInstance.post('/api/deliveries', data);
export const getDeliveries = (params) => axiosInstance.get('/api/deliveries', { params });
export const getDeliveryById = (id) => axiosInstance.get(`/api/deliveries/${id}`);
export const updateDelivery = (id, data) => axiosInstance.put(`/api/deliveries/${id}`, data);

// ── Documents ──
export const uploadDocument = (formData) => axiosInstance.post('/api/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getDocuments = (params) => axiosInstance.get('/api/documents', { params });
export const getDocumentById = (id) => axiosInstance.get(`/api/documents/${id}`);
export const deleteDocument = (id) => axiosInstance.delete(`/api/documents/${id}`);

// ── Vendor Tasks ──
export const getVendorTasks = (params) => axiosInstance.get('/api/vendor/tasks', { params });
export const updateVendorTaskStatus = (taskId, data) => axiosInstance.patch(`/api/vendor/tasks/${taskId}/status`, data);
