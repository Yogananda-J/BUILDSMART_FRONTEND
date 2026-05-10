import axiosInstance from './axiosInstance';

// ── Budgets ──
export const createBudget = (data) => axiosInstance.post('/api/budgets', data);
export const getBudgetById = (budgetId) => axiosInstance.get(`/api/budgets/${budgetId}`);
export const getBudgetsByProject = (projectId, params) => axiosInstance.get(`/api/budgets/projects/${projectId}`, { params });
export const submitBudget = (budgetId) => axiosInstance.post(`/api/budgets/${budgetId}/submit`);
export const approveBudget = (budgetId, data) => axiosInstance.post(`/api/budgets/${budgetId}/approval`, data);
export const updateBudget = (budgetId, data) => axiosInstance.patch(`/api/budgets/${budgetId}`, data);
export const deleteBudget = (budgetId) => axiosInstance.delete(`/api/budgets/${budgetId}`);
export const getBudgetsByStatus = (status, params) => axiosInstance.get(`/api/budgets/status/${status}`, { params });
export const getBudgetsByUser = (createdBy, params) => axiosInstance.get(`/api/budgets/users/${createdBy}`, { params });

// ── Expenses ──
export const createExpense = (data) => axiosInstance.post('/api/expenses', data);
export const getExpenses = (params) => axiosInstance.get('/api/expenses', { params });
export const getExpenseById = (id) => axiosInstance.get(`/api/expenses/${id}`);
export const updateExpense = (id, data) => axiosInstance.put(`/api/expenses/${id}`, data);
export const deleteExpense = (id) => axiosInstance.delete(`/api/expenses/${id}`);

// ── Payments ──
export const createPayment = (data) => axiosInstance.post('/api/payments', data);
export const getPayments = (params) => axiosInstance.get('/api/payments', { params });
export const getPaymentById = (id) => axiosInstance.get(`/api/payments/${id}`);
export const updatePaymentStatus = (id, data) => axiosInstance.put(`/api/payments/${id}/status`, data);

// ── Finance Tasks ──
export const getFinanceTasks = (params) => axiosInstance.get('/api/finance/tasks', { params });
export const updateFinanceTaskStatus = (taskId, data) => axiosInstance.patch(`/api/finance/tasks/${taskId}/status`, data);
