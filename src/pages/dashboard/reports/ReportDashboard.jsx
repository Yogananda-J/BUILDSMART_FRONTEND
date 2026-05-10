import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FaChartLine, FaProjectDiagram, FaUsers, FaShieldAlt, FaMoneyBillWave, FaArrowLeft, FaFileAlt } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
const navItems = [
  { label: 'Dashboard', path: '.', icon: FaChartLine, end: true, roles: ['ADMIN', 'PROJECT_MANAGER'] },
  { label: 'Report Generation', path: 'management', icon: FaFileAlt, roles: ['ADMIN', 'PROJECT_MANAGER'] },
  { label: 'Project Health', path: 'projects', icon: FaProjectDiagram, roles: ['ADMIN', 'PROJECT_MANAGER'] },
  { label: 'Resource Analytics', path: 'resources', icon: FaUsers, roles: ['ADMIN', 'PROJECT_MANAGER'] },
  { label: 'User Analytics', path: 'users', icon: FaUsers, roles: ['ADMIN', 'PROJECT_MANAGER'] },
  { label: 'Safety Analytics', path: 'safety', icon: FaShieldAlt, roles: ['ADMIN', 'SAFETY_OFFICER', 'PROJECT_MANAGER'] },
  { label: 'Financial Analytics', path: 'finance', icon: FaMoneyBillWave, roles: ['ADMIN', 'FINANCE_OFFICER', 'PROJECT_MANAGER'] },
  { label: 'Site Engineer Analytics', path: 'site', icon: FaChartLine, roles: ['ADMIN', 'SITE_ENGINEER', 'PROJECT_MANAGER'] },
  { label: 'Vendor Analytics', path: 'vendor', icon: FaUsers, roles: ['ADMIN', 'VENDOR', 'PROJECT_MANAGER'] },
];

const ReportDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = (user?.role || '').toUpperCase().replace('ROLE_', '').trim();

  const filteredNavItems = navItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  return (
    <div className="d-flex gap-4" style={{ minHeight: '80vh' }}>
      {/* Sidebar for Reports */}
      <div style={{ width: 260, flexShrink: 0 }}>
        <div style={{ position: 'sticky', top: 100 }}>
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-link d-flex align-items-center gap-2 mb-4 p-0 text-decoration-none fw-bold"
            style={{ color: '#6366f1', fontSize: '0.9rem' }}
          >
            <FaArrowLeft size={12} /> Back to Dashboard
          </button>

          <div className="px-3 mb-4">
            <h6 className="fw-bold text-uppercase small letter-spacing-2" style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Analytics Modules</h6>
          </div>
          
          <div className="d-flex flex-column gap-2">
            {filteredNavItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => `d-flex align-items-center gap-3 px-3 py-3 rounded-4 text-decoration-none transition-all ${isActive ? 'bg-white shadow-sm border' : 'hover-bg-light'}`}
                style={({ isActive }) => ({
                  color: isActive ? '#4f46e5' : '#64748b',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 700 : 500,
                  borderColor: isActive ? '#e2e8f0' : 'transparent',
                })}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'currentColor', opacity: 0.1,
                  position: 'absolute'
                }} />
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'inherit', position: 'relative', zIndex: 1
                }}>
                  <item.icon size={20} />
                </div>
                <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <div style={{ minHeight: 600 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;
