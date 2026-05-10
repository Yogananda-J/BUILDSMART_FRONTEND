import { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { FaSignOutAlt, FaUser, FaBell } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { logout as logoutApi } from '../../api/authApi';
import { toast } from '../../utils/toast';
import ConfirmationModal from '../ConfirmationModal';
import NotificationDropdown from './NotificationDropdown';

const roleBadgeStyle = {
  ADMIN:           { bg: '#fef3c7', color: '#b45309' },
  PROJECT_MANAGER: { bg: '#e0e7ff', color: '#4338ca' },
  SITE_ENGINEER:   { bg: '#d1fae5', color: '#065f46' },
  SAFETY_OFFICER:  { bg: '#dcfce7', color: '#15803d' },
  FINANCE_OFFICER: { bg: '#ede9fe', color: '#6d28d9' },
  VENDOR:          { bg: '#f3f4f6', color: '#374151' },
};

const DashboardLayout = ({ navItems = [] }) => {
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try { await logoutApi(); } catch (_) {}
    authLogout();
    toast.success('Logged out successfully');
    setShowLogoutModal(false);
    navigate('/auth/login');
  };

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const roleStyle = roleBadgeStyle[user?.role] || { bg: '#f3f4f6', color: '#374151' };

  return (
    <>
      <div className="admin-wrapper" style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* ── Navbar ── */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 999, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <header className="d-flex align-items-center px-4 gap-4 mx-auto w-100" style={{ height: 72, maxWidth: 1600 }}>
            {/* Logo */}
            <div
              style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1e293b', letterSpacing: '-0.5px', cursor: 'pointer', flexShrink: 0 }}
              onClick={() => navigate('/')}
            >
              Build<span style={{ color: '#4f46e5' }}>Smart</span>
            </div>

            {/* Pill Nav */}
            <div className="d-flex align-items-center gap-2 ms-4" style={{ overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: 2, flex: 1, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              <style>{`
                .dash-nav::-webkit-scrollbar { display: none; }
                .nav-pill {
                  padding: 0.6rem 1.25rem;
                  border-radius: 50rem;
                  font-size: 0.95rem;
                  font-weight: 600;
                  color: #64748b;
                  text-decoration: none;
                  transition: all 0.2s ease;
                  white-space: nowrap;
                }
                .nav-pill:hover { background: #f1f5f9; color: #1e293b; }
                .nav-pill.active { background: #eef2ff; color: #4f46e5; }
              `}</style>
              {navItems.map(item => (
                <NavLink key={item.path} to={item.path} end={item.end} className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}>
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="flex-grow-1" />

            <div className="d-flex align-items-center gap-3">
              <NotificationDropdown />

              {/* User Dropdown */}
              <Dropdown align="end">
              <Dropdown.Toggle
                as="div"
                style={{ cursor: 'pointer', background: '#f8fafc', padding: '0.4rem 1rem 0.4rem 0.4rem', borderRadius: '50rem', border: '1px solid #f1f5f9' }}
                className="d-flex align-items-center gap-3"
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(79,70,229,0.3)'
                }}>
                  {getInitials(user?.name || 'U')}
                </div>
                <div className="d-none d-sm-block text-start" style={{ lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{user?.name || 'User'}</div>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, padding: '1px 8px', borderRadius: '50rem',
                    background: roleStyle.bg, color: roleStyle.color, letterSpacing: '0.03em'
                  }}>
                    {user?.role?.replace('_', ' ') || 'USER'}
                  </span>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', padding: '0.5rem', minWidth: 200 }}>
                <Dropdown.Item onClick={() => navigate('/dashboard/profile')} style={{ borderRadius: 10, padding: '0.7rem 1rem', fontWeight: 500 }}>
                  <FaUser size={13} className="me-2" style={{ color: '#6366f1' }} /> My Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setShowLogoutModal(true)} style={{ borderRadius: 10, padding: '0.7rem 1rem', fontWeight: 500, color: '#ef4444' }}>
                  <FaSignOutAlt size={13} className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            </div>
          </header>
        </div>

        {/* ── Main Content ── */}
        <main className="page-enter container-fluid" style={{ flex: 1, padding: '1.5rem', maxWidth: 1600, margin: '0 auto', width: '100%' }}>
          <Outlet />
        </main>
      </div>

      <ConfirmationModal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        confirmVariant="danger"
      />
    </>
  );
};

export default DashboardLayout;
