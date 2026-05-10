import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../api/authApi';

const Navbar = () => {
  const { user, logout: authLogout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      authLogout();
      window.location.href = '/';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top shadow-sm" style={{ backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9' }}>
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <i className="bi bi-building-fill fs-4" style={{ color: '#4f46e5' }}></i>
          <span className="fw-bold fs-4" style={{ color: '#1e293b' }}>Build</span>
          <span className="fw-bold fs-4" style={{ color: '#4f46e5' }}>Smart</span>
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-3 text-dark"></i>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav mx-auto gap-lg-2">
            {[
              { path: '/', label: 'Home' },
              { path: '/about', label: 'About' },
              { path: '/services', label: 'Services' },
              { path: '/contact', label: 'Contact' },
            ].map(({ path, label }) => (
              <li className="nav-item" key={path}>
                <NavLink
                  to={path}
                  end
                  className={({ isActive }) =>
                    `nav-link fw-semibold px-3 py-2 rounded-pill transition-all ${isActive ? 'text-white' : 'text-secondary'}`
                  }
                  style={({ isActive }) => ({
                    background: isActive ? '#4f46e5' : 'transparent',
                    fontSize: '0.95rem'
                  })}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Auth buttons */}
          <div className="d-flex gap-2 mt-3 mt-lg-0 align-items-center">
            {user ? (
              <>
                <span className="text-dark fw-bold small me-2 d-none d-xl-inline">
                  <i className="bi bi-person-circle me-1 text-primary"></i>
                  {user.name}
                </span>
                {(() => {
                  let path = '/dashboard/profile';
                  const role = (user.role || '').toUpperCase().replace('ROLE_', '').trim();
                  switch (role) {
                    case 'ADMIN': path = '/dashboard/admin/users'; break;
                    case 'PROJECT_MANAGER': path = '/dashboard/pm'; break;
                    case 'FINANCE_OFFICER': path = '/dashboard/finance'; break;
                    case 'SAFETY_OFFICER': path = '/dashboard/safety'; break;
                    case 'SITE_ENGINEER': path = '/dashboard/site'; break;
                    case 'VENDOR': path = '/dashboard/vendor'; break;
                  }
                  return (
                    <Link to={path} className="btn btn-primary btn-sm px-4 rounded-pill shadow-sm fw-bold">
                      Dashboard
                    </Link>
                  );
                })()}
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm px-3 rounded-pill border-0 fw-bold">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="btn btn-link text-decoration-none text-dark fw-bold px-3">
                  Login
                </Link>
                <Link to="/auth/register" className="btn btn-primary btn-sm px-4 rounded-pill shadow-sm fw-bold" style={{ background: '#4f46e5', border: 'none' }}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
