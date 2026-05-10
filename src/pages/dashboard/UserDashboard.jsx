import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  const tabs = [
    { id: 'profile', label: 'My Profile', path: '/dashboard/profile', icon: 'bi-person' }
  ];

  // Dynamically determine the dashboard path based on role with normalization
  let dashboardPath = '';
  const role = (user?.role || '').toUpperCase().replace('ROLE_', '').trim();
  switch (role) {
    case 'ADMIN': dashboardPath = '/dashboard/admin/users'; break;
    case 'PROJECT_MANAGER': dashboardPath = '/dashboard/pm'; break;
    case 'FINANCE_OFFICER': dashboardPath = '/dashboard/finance'; break;
    case 'SAFETY_OFFICER': dashboardPath = '/dashboard/safety'; break;
    case 'SITE_ENGINEER': dashboardPath = '/dashboard/site'; break;
    case 'VENDOR': dashboardPath = '/dashboard/vendor'; break;
  }

  if (dashboardPath) {
    tabs.push({ id: 'dashboard', label: user?.role === 'ADMIN' ? 'Admin Panel' : 'My Dashboard', path: dashboardPath, icon: 'bi-grid-1x2' });
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="row g-4">
        {/* Sidebar Navigation */}
        <div className="col-lg-3 col-md-4">
          <div className="card shadow-sm" style={{ borderRadius: 16, border: 'none', overflow: 'hidden' }}>
            <div className="card-header bg-white border-0 pt-4 pb-2 px-4">
              <h5 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>
                Settings
              </h5>
            </div>
            <div className="card-body p-3">
              <div className="d-flex flex-column gap-2">
                {tabs.map((tab) => {
                  const isActive = location.pathname === tab.path;
                  return (
                    <Link
                      key={tab.id}
                      to={tab.path}
                      style={{
                        padding: '1rem 1.25rem',
                        borderRadius: 12,
                        color: isActive ? '#4f46e5' : '#64748b',
                        background: isActive ? '#eef2ff' : 'transparent',
                        fontWeight: isActive ? 600 : 500,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = '#f8fafc';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <i className={`bi ${tab.icon}`} style={{ fontSize: '1.1rem' }}></i>
                      {tab.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-lg-9 col-md-8">
          <div className="card shadow-sm" style={{ borderRadius: 16, border: 'none', minHeight: 400 }}>
            <div className="card-body p-lg-5 p-4">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
