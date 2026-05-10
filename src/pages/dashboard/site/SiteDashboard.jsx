import DashboardLayout from '../../../components/layout/DashboardLayout';

const navItems = [
  { path: '/dashboard/site/logs', label: 'Daily Logs' },
  { path: '/dashboard/site/issues', label: 'Issues' },
  { path: '/dashboard/site/tasks', label: 'My Tasks' },
  { path: '/dashboard/reports/overview', label: 'Analytics' },
];

const SiteDashboard = () => <DashboardLayout navItems={navItems} />;

export default SiteDashboard;
