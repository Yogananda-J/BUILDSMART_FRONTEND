import DashboardLayout from '../../../components/layout/DashboardLayout';

const navItems = [
  { path: '/dashboard/finance/budgets', label: 'Budgets' },
  { path: '/dashboard/finance/expenses', label: 'Expenses' },
  { path: '/dashboard/finance/payments', label: 'Payments' },
  { path: '/dashboard/finance/tasks', label: 'My Tasks' },
  { path: '/dashboard/reports/overview', label: 'Analytics' },
];

const FinanceDashboard = () => <DashboardLayout navItems={navItems} />;

export default FinanceDashboard;
