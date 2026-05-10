import DashboardLayout from '../../../components/layout/DashboardLayout';

const navItems = [
  { path: '/dashboard/vendor/contracts', label: 'Contracts' },
  { path: '/dashboard/vendor/invoices', label: 'Invoices' },
  { path: '/dashboard/vendor/deliveries', label: 'Deliveries' },
  { path: '/dashboard/vendor/documents', label: 'Documents' },
  { path: '/dashboard/vendor/tasks', label: 'My Tasks' },
  { path: '/dashboard/reports/overview', label: 'Analytics' },
];

const VendorDashboard = () => <DashboardLayout navItems={navItems} />;

export default VendorDashboard;
