import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaUsers, FaUserClock, FaClipboardList,
  FaUserShield, FaTimes, FaBars, FaTachometerAlt,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  {
    section: 'Administration',
    items: [
      { path: '/dashboard/admin/users',   icon: <FaUsers />,         label: 'User Management' },
      { path: '/dashboard/admin/pending', icon: <FaUserClock />,     label: 'Pending Approvals' },
      { path: '/dashboard/admin/audit',   icon: <FaClipboardList />, label: 'Audit Logs' },
    ],
  },
];

const Sidebar = () => {
  const { user } = useAuth();

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div
          style={{
            width: 36, height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <FaUserShield style={{ color: '#fff', fontSize: 17 }} />
        </div>
        <div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.3px' }}>
            Build<span style={{ color: '#f59e0b' }}>Smart</span>
          </span>
          <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '0.65rem', fontWeight: 500 }}>
            Admin Panel
          </div>
        </div>
      </div>

        {/* Menu */}
        <nav className="sidebar-menu">
          {menuItems.map(group => (
            <div key={group.section}>
              <div className="sidebar-section-label">{group.section}</div>
              {group.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-item ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

      {/* Footer — user info */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 36, height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: '0.75rem',
              flexShrink: 0,
            }}
          >
            {getInitials(user?.name || 'AD')}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Admin'}
            </div>
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '0.7rem' }}>
              {user?.role?.replace(/_/g, ' ') || 'Administrator'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
