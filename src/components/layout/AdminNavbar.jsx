import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import {
  FaBars, FaUser, FaKey, FaSignOutAlt,
  FaChevronDown, FaUserShield,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { logout as logoutApi } from '../../api/authApi';
import { toast } from '../../utils/toast';
import ConfirmationModal from '../ConfirmationModal';

const roleBadgeStyle = {
  ADMIN:          { bg: '#fef3c7', color: '#b45309' },
  PROJECT_MANAGER:{ bg: '#e0e7ff', color: '#4338ca' },
  SITE_ENGINEER:  { bg: '#d1fae5', color: '#065f46' },
  SAFETY_OFFICER: { bg: '#dcfce7', color: '#15803d' },
  FINANCE_OFFICER: { bg: '#ede9fe', color: '#6d28d9' },
  VENDOR:          { bg: '#f3f4f6', color: '#374151' },
};

const AdminNavbar = ({ onToggleSidebar }) => {
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogout = async () => {
    try {
      setIsProcessing(true);
      await logoutApi();
    } catch (_) { /* ignore api error */ }
    authLogout();
    toast.success('Logged out successfully');
    setShowLogoutModal(false);
    setIsProcessing(false);
    navigate('/auth/login');
  };

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const roleStyle = roleBadgeStyle[user?.role] || { bg: '#f3f4f6', color: '#374151' };

  return (
    <>
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 999, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <header
          className="admin-navbar d-flex align-items-center px-4 gap-4 mx-auto w-100"
          style={{
            height: 72, maxWidth: 1600
          }}
        >
        <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1e293b', letterSpacing: '-0.5px' }}>
          Build<span style={{ color: '#4f46e5' }}>Smart</span>
        </div>

        <div className="d-flex align-items-center gap-2 ms-4" style={{ overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: 2, flex: 1, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <style>{`
            .admin-navbar .d-flex::-webkit-scrollbar { display: none; }
            .nav-pill {
              padding: 0.6rem 1.25rem;
              border-radius: 50rem;
              font-size: 0.95rem;
              font-weight: 600;
              color: #64748b;
              text-decoration: none;
              transition: all 0.2s ease;
            }
            .nav-pill:hover {
              background: #f1f5f9;
              color: #1e293b;
            }
            .nav-pill.active {
              background: #eef2ff;
              color: #4f46e5;
            }
            .admin-navbar .dropdown-toggle::after {
              display: none !important;
            }
          `}</style>
          <NavLink to="/dashboard/admin/users" className={({isActive}) => `nav-pill ${isActive ? 'active' : ''}`}>
            User Management
          </NavLink>
          <NavLink to="/dashboard/admin/pending" className={({isActive}) => `nav-pill ${isActive ? 'active' : ''}`}>
            Pending Approvals
          </NavLink>
          <NavLink to="/dashboard/admin/audit" className={({isActive}) => `nav-pill ${isActive ? 'active' : ''}`}>
            Audit Logs
          </NavLink>
          <NavLink to="/dashboard/reports" className={({isActive}) => `nav-pill ${isActive ? 'active' : ''}`}>
            Reports & Analytics
          </NavLink>
        </div>

        {/* Spacer to push dropdown to the right */}
        <div className="flex-grow-1" />

        {/* User Dropdown */}
        <Dropdown align="end">
          <Dropdown.Toggle
            as="div"
            style={{ cursor: 'pointer', background: '#f8fafc', padding: '0.4rem 1rem 0.4rem 0.4rem', borderRadius: '50rem', border: '1px solid #f1f5f9' }}
            className="d-flex align-items-center gap-3"
          >
            <div
              style={{
                width: 40, height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.9rem',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(79,70,229,0.3)'
              }}
            >
              {getInitials(user?.name || 'AD')}
            </div>
            <div className="d-none d-sm-block text-start" style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                {user?.name || 'Admin'}
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 20,
                  background: roleStyle.bg,
                  color: roleStyle.color,
                  display: 'inline-block',
                  marginTop: 2
                }}
              >
                {user?.role?.replace(/_/g, ' ') || 'ADMIN'}
              </span>
            </div>
            <FaChevronDown style={{ color: '#94a3b8', fontSize: 12, marginLeft: 4 }} />
          </Dropdown.Toggle>

          <Dropdown.Menu
            style={{
              minWidth: 220,
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 10px 40px rgba(0,0,0,.12)',
              padding: '0.5rem',
              marginTop: '0.75rem'
            }}
          >
            <div style={{ padding: '0.5rem 0.75rem 0.75rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{user?.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{user?.email}</div>
            </div>
            <Dropdown.Divider style={{ margin: '0.25rem 0', borderColor: '#f1f5f9' }} />
            <Dropdown.Item
              as={NavLink}
              to="/dashboard/profile"
              style={{ borderRadius: 10, fontSize: '0.95rem', padding: '0.6rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500, color: '#334155' }}
            >
              <FaUser style={{ color: '#64748b', fontSize: '1.1rem' }} /> My Profile
            </Dropdown.Item>
            <Dropdown.Divider style={{ margin: '0.25rem 0', borderColor: '#f1f5f9' }} />
            <Dropdown.Item
              onClick={() => setShowLogoutModal(true)}
              style={{ borderRadius: 10, fontSize: '0.95rem', padding: '0.6rem 0.75rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}
            >
              <FaSignOutAlt style={{ fontSize: '1.1rem' }} /> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </header>
      </div>

      <ConfirmationModal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to logout from BuildSmart Admin?"
        confirmText="Logout"
        cancelText="Stay"
        variant="logout"
        isLoading={isProcessing}
      />
    </>
  );
};

export default AdminNavbar;
