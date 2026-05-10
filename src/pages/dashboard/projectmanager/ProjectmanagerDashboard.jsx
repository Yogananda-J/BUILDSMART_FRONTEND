import DashboardLayout from '../../../components/layout/DashboardLayout';

const navItems = [
  { path: '/dashboard/pm/projects', label: 'Projects' },
  { path: '/dashboard/pm/approvals', label: 'Approvals' },
  { path: '/dashboard/pm/resources', label: 'Resources' },
  { path: '/dashboard/pm/templates', label: 'Templates' },
  { path: '/dashboard/reports/overview', label: 'Reports & Analytics' },
];

const ProjectmanagerDashboard = () => <DashboardLayout navItems={navItems} />;

export default ProjectmanagerDashboard;
