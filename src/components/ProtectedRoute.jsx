import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLock } from 'react-icons/fa';

const AccessDenied = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
    <div style={{ textAlign: 'center', maxWidth: 400 }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <FaLock size={32} style={{ color: '#ef4444' }} />
      </div>
      <h2 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>Access Denied</h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>You don't have permission to access this page. Contact your administrator if you believe this is an error.</p>
      <a href="/" style={{ padding: '0.75rem 2rem', background: '#6366f1', color: '#fff', borderRadius: '50rem', fontWeight: 600, textDecoration: 'none' }}>Go Home</a>
    </div>
  </div>
);

const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
  const { user: contextUser, loading } = useAuth();
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  // Use context user, or fallback to localStorage user if context hasn't updated yet
  const user = contextUser || (storedUser ? JSON.parse(storedUser) : null);

  if (loading) return null;

  if (!token || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user.status === 'PENDING_VERIFICATION') {
    return <Navigate to="/auth/pending" replace />;
  }

  // support both single role and array of roles with normalization
  const userRole = (user.role || '').toUpperCase().replace('ROLE_', '').trim();

  if (requiredRole && userRole !== requiredRole.toUpperCase()) {
    return <AccessDenied />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const isAllowed = allowedRoles.some(r => r.toUpperCase() === userRole);
    if (!isAllowed) return <AccessDenied />;
  }

  return children;
};

export default ProtectedRoute;
