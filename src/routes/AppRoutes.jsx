import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Landing pages
import HomePage from '../pages/landing/HomePage';
import AboutPage from '../pages/landing/AboutPage';
import ServicePage from '../pages/landing/ServicePage';
import ContactPage from '../pages/landing/ContactPage';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import PendingApprovalPage from '../pages/auth/PendingApprovalPage';

// Dashboard
import DashboardLayout from '../components/layout/DashboardLayout';
import UserDashboard from '../pages/dashboard/UserDashboard';
import UserProfile from '../pages/dashboard/UserProfile';
import ChangePassword from '../pages/dashboard/ChangePassword';

// Admin Dashboard
import AdminDashboard from '../pages/dashboard/admin/AdminDashboard';
import UserManagement from '../pages/dashboard/admin/UserManagement';
import PendingApprovals from '../pages/dashboard/admin/PendingApprovals';
import AuditLogs from '../pages/dashboard/admin/AuditLogs';

// Role-specific Dashboards
import FinanceDashboard from '../pages/dashboard/finance/FinanceDashboard';
import BudgetManagement from '../pages/dashboard/finance/BudgetManagement';
import ExpenseTracking from '../pages/dashboard/finance/ExpenseTracking';
import PaymentManagement from '../pages/dashboard/finance/PaymentManagement';
import FinanceTasks from '../pages/dashboard/finance/FinanceTasks';
import ProjectmanagerDashboard from '../pages/dashboard/projectmanager/ProjectmanagerDashboard';
import ProjectList from '../pages/dashboard/projectmanager/ProjectList';
import ProjectDetails from '../pages/dashboard/projectmanager/ProjectDetails';
import TaskManagement from '../pages/dashboard/projectmanager/TaskManagement';
import ApprovalInbox from '../pages/dashboard/projectmanager/ApprovalInbox';
import ResourceOverview from '../pages/dashboard/projectmanager/ResourceOverview';
import Templates from '../pages/dashboard/projectmanager/Templates';
import SafetyDashboard from '../pages/dashboard/safety/SafetyDashboard';
import Inspections from '../pages/dashboard/safety/Inspections';
import Incidents from '../pages/dashboard/safety/Incidents';
import SafetyTasks from '../pages/dashboard/safety/SafetyTasks';
import SiteDashboard from '../pages/dashboard/site/SiteDashboard';
import DailyLogs from '../pages/dashboard/site/DailyLogs';
import IssueManagement from '../pages/dashboard/site/IssueManagement';
import SiteTasks from '../pages/dashboard/site/SiteTasks';
import VendorDashboard from '../pages/dashboard/vendor/VendorDashboard';
import Contracts from '../pages/dashboard/vendor/Contracts';
import Invoices from '../pages/dashboard/vendor/Invoices';
import Deliveries from '../pages/dashboard/vendor/Deliveries';
import Documents from '../pages/dashboard/vendor/Documents';
import VendorTasks from '../pages/dashboard/vendor/VendorTasks';
import ReportDashboard from '../pages/dashboard/reports/ReportDashboard';
import ReportOverview from '../pages/dashboard/reports/ReportOverview';
import ProjectReports from '../pages/dashboard/reports/ProjectReports';
import ResourceAnalytics from '../pages/dashboard/reports/ResourceAnalytics';
import SafetyAnalytics from '../pages/dashboard/reports/SafetyAnalytics';
import FinanceAnalytics from '../pages/dashboard/reports/FinanceAnalytics';
import SiteAnalytics from '../pages/dashboard/reports/SiteAnalytics';
import VendorAnalytics from '../pages/dashboard/reports/VendorAnalytics';
import UserAnalytics from '../pages/dashboard/reports/UserAnalytics';
import ReportManagement from '../pages/dashboard/reports/ReportManagement';

const ReportLayout = () => {
  const { user } = useAuth();
  
  const getNavItems = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { path: '/dashboard/admin/users', label: 'User Management' },
          { path: '/dashboard/admin/pending', label: 'Pending Approvals' },
          { path: '/dashboard/admin/audit', label: 'Audit Logs' },
          { path: '/dashboard/reports/overview', label: 'Reports & Analytics' },
        ];
      case 'PROJECT_MANAGER':
        return [
          { path: '/dashboard/pm/projects', label: 'Projects' },
          { path: '/dashboard/pm/tasks', label: 'Tasks' },
          { path: '/dashboard/pm/approvals', label: 'Approvals' },
          { path: '/dashboard/pm/resources', label: 'Resources' },
          { path: '/dashboard/pm/templates', label: 'Templates' },
          { path: '/dashboard/reports/overview', label: 'Reports & Analytics' },
        ];
      case 'SAFETY_OFFICER':
        return [
          { path: '/dashboard/safety/inspections', label: 'Inspections' },
          { path: '/dashboard/safety/incidents', label: 'Incidents' },
          { path: '/dashboard/safety/tasks', label: 'My Tasks' },
          { path: '/dashboard/reports/overview', label: 'Reports & Analytics' },
        ];
      case 'FINANCE_OFFICER':
        return [
          { path: '/dashboard/finance/budgets', label: 'Budgets' },
          { path: '/dashboard/finance/expenses', label: 'Expenses' },
          { path: '/dashboard/finance/payments', label: 'Payments' },
          { path: '/dashboard/finance/tasks', label: 'My Tasks' },
          { path: '/dashboard/reports/overview', label: 'Reports & Analytics' },
        ];
      case 'VENDOR':
        return [
          { path: '/dashboard/vendor/contracts', label: 'Contracts' },
          { path: '/dashboard/vendor/invoices', label: 'Invoices' },
          { path: '/dashboard/vendor/deliveries', label: 'Deliveries' },
          { path: '/dashboard/vendor/documents', label: 'Documents' },
          { path: '/dashboard/vendor/tasks', label: 'My Tasks' },
          { path: '/dashboard/reports/overview', label: 'Reports & Analytics' },
        ];
      case 'SITE_ENGINEER':
        return [
          { path: '/dashboard/site/logs', label: 'Daily Logs' },
          { path: '/dashboard/site/issues', label: 'Issue Management' },
          { path: '/dashboard/site/tasks', label: 'Site Tasks' },
          { path: '/dashboard/reports/overview', label: 'Reports & Analytics' },
        ];
      default:
        return [{ path: '/dashboard/profile', label: 'Profile' }];
    }
  };

  return <DashboardLayout navItems={getNavItems()} />;
};

const LandingLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

const AppRoutes = () => (
  <Routes>
    {/* ── Landing ── */}
    <Route path="/" element={<LandingLayout><HomePage /></LandingLayout>} />
    <Route path="/about" element={<LandingLayout><AboutPage /></LandingLayout>} />
    <Route path="/services" element={<LandingLayout><ServicePage /></LandingLayout>} />
    <Route path="/contact" element={<LandingLayout><ContactPage /></LandingLayout>} />

    {/* ── Auth ── */}
    <Route path="/auth/login" element={<LoginPage />} />
    <Route path="/auth/register" element={<RegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/auth/pending" element={<PendingApprovalPage />} />

    {/* ── User Dashboard ── */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardLayout navItems={[]} />
        </ProtectedRoute>
      }
    >
      <Route element={<UserDashboard />}>
      <Route path="profile" element={<UserProfile />} />
      <Route path="change-password" element={<ChangePassword />} />
        <Route index element={<Navigate to="profile" replace />} />
      </Route>
    </Route>

    {/* ── Admin Dashboard ── */}
    <Route
      path="/dashboard/admin"
      element={
        <ProtectedRoute requiredRole="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      }
    >
      <Route path="users" element={<UserManagement />} />
      <Route path="pending" element={<PendingApprovals />} />
      <Route path="audit" element={<AuditLogs />} />
      <Route index element={<Navigate to="users" replace />} />
    </Route>

    {/* ── Finance Dashboard ── */}
    <Route
      path="/dashboard/finance"
      element={
        <ProtectedRoute allowedRoles={['FINANCE_OFFICER', 'PROJECT_MANAGER', 'ADMIN']}>
          <FinanceDashboard />
        </ProtectedRoute>
      }
    >
      <Route path="budgets" element={<BudgetManagement />} />
      <Route path="expenses" element={<ExpenseTracking />} />
      <Route path="payments" element={<PaymentManagement />} />
      <Route path="tasks" element={<FinanceTasks />} />
      <Route index element={<Navigate to="budgets" replace />} />
    </Route>

    {/* ── Project Manager Dashboard ── */}
    <Route
      path="/dashboard/pm"
      element={
        <ProtectedRoute allowedRoles={['PROJECT_MANAGER', 'ADMIN']}>
          <ProjectmanagerDashboard />
        </ProtectedRoute>
      }
    >
      <Route path="projects" element={<ProjectList />} />
      <Route path="projects/:projectId" element={<ProjectDetails />} />
      <Route path="tasks" element={<TaskManagement />} />
      <Route path="approvals" element={<ApprovalInbox />} />
      <Route path="resources" element={<ResourceOverview />} />
      <Route path="templates" element={<Templates />} />
      <Route index element={<Navigate to="projects" replace />} />
    </Route>

    {/* ── Safety Dashboard ── */}
    <Route
      path="/dashboard/safety"
      element={
        <ProtectedRoute allowedRoles={['SAFETY_OFFICER', 'PROJECT_MANAGER', 'ADMIN']}>
          <SafetyDashboard />
        </ProtectedRoute>
      }
    >
      <Route path="inspections" element={<Inspections />} />
      <Route path="incidents" element={<Incidents />} />
      <Route path="tasks" element={<SafetyTasks />} />
      <Route index element={<Navigate to="inspections" replace />} />
    </Route>

    {/* ── Site Dashboard ── */}
    <Route
      path="/dashboard/site"
      element={
        <ProtectedRoute allowedRoles={['SITE_ENGINEER', 'ADMIN']}>
          <SiteDashboard />
        </ProtectedRoute>
      }
    >
      <Route path="logs" element={<DailyLogs />} />
      <Route path="issues" element={<IssueManagement />} />
      <Route path="tasks" element={<SiteTasks />} />
      <Route index element={<Navigate to="logs" replace />} />
    </Route>

    {/* ── Vendor Dashboard ── */}
    <Route
      path="/dashboard/vendor"
      element={
        <ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']}>
          <VendorDashboard />
        </ProtectedRoute>
      }
    >
      <Route path="contracts" element={<Contracts />} />
      <Route path="invoices" element={<Invoices />} />
      <Route path="deliveries" element={<Deliveries />} />
      <Route path="documents" element={<Documents />} />
      <Route path="tasks" element={<VendorTasks />} />
      <Route index element={<Navigate to="contracts" replace />} />
    </Route>

    {/* ── Reports & Analytics Dashboard ── */}
    <Route
      path="/dashboard/reports"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'PROJECT_MANAGER', 'FINANCE_OFFICER', 'SAFETY_OFFICER', 'VENDOR', 'SITE_ENGINEER']}>
          <ReportLayout />
        </ProtectedRoute>
      }
    >
      <Route element={<ReportDashboard />}>
        <Route path="overview" element={<ReportOverview />} />
        <Route path="management" element={<ReportManagement />} />
        <Route path="projects" element={<ProjectReports />} />
        <Route path="resources" element={<ResourceAnalytics />} />
        <Route path="users" element={<UserAnalytics />} />
        <Route path="safety" element={<SafetyAnalytics />} />
        <Route path="finance" element={<FinanceAnalytics />} />
        <Route path="site" element={<SiteAnalytics />} />
        <Route path="vendor" element={<VendorAnalytics />} />
        <Route index element={<ReportOverview />} />
      </Route>
    </Route>

    {/* ── Default redirect ── */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
