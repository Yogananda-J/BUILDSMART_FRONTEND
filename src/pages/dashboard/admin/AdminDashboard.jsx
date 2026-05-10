import { Outlet } from 'react-router-dom';
import AdminNavbar from '../../../components/layout/AdminNavbar';

const AdminDashboard = () => {
  return (
    <div className="admin-wrapper" style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminNavbar />
      <main className="admin-main page-enter container-fluid" style={{ flex: 1, padding: '1.5rem', maxWidth: 1600, margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
