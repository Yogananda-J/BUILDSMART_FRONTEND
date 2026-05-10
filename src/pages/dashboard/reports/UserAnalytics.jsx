import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserAnalytics } from '../../../api/reportApi';
import { getAllIAMUsers } from '../../../api/projectApi';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../../utils/toast';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell, PieChart, Pie } from 'recharts';
import { FaUsers, FaUserCheck, FaUserMinus, FaUserTimes, FaIdCard, FaSearch, FaUserShield } from 'react-icons/fa';
import { Badge } from 'react-bootstrap';
import StatCard from '../../../components/common/StatCard';

const UserAnalytics = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userRole = (currentUser?.role || '').toUpperCase().replace('ROLE_', '').trim();
      
      if (userRole === 'PROJECT_MANAGER') {
        const iamRes = await getAllIAMUsers();
        const users = iamRes.data?.data || iamRes.data || [];
        
        setData({
          totalUsers: users.length,
          activeUsers: users.filter(u => u.status === 'ACTIVE').length,
          inactiveUsers: users.filter(u => u.status === 'INACTIVE' || u.status === 'PENDING' || u.status === 'PENDING_VERIFICATION').length,
          suspendedUsers: users.filter(u => u.status === 'SUSPENDED').length,
          usersByRole: users.reduce((acc, u) => {
            const r = (u.role || 'OTHER').toUpperCase().replace('ROLE_', '').trim();
            acc[r] = (acc[r] || 0) + 1;
            return acc;
          }, {}),
          statusByRole: users.reduce((acc, u) => {
            const r = (u.role || 'OTHER').toUpperCase().replace('ROLE_', '').trim();
            let s = u.status || 'INACTIVE';
            if (s === 'PENDING_VERIFICATION') s = 'INACTIVE';
            if (!acc[r]) acc[r] = { ACTIVE: 0, INACTIVE: 0, SUSPENDED: 0 };
            acc[r][s] = (acc[r][s] || 0) + 1;
            return acc;
          }, {}),
          users: users.map(u => ({
            ...u,
            id: u.userId || u.id,
            role: (u.role || '').toUpperCase().replace('ROLE_', '').trim()
          }))
        });
      } else {
        const res = await getUserAnalytics();
        setData(res.data?.data || res.data);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError('ADMIN_ONLY');
      } else {
        toast.error('Failed to load user analytics');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const COLORS = {
    ADMIN: '#8b5cf6',
    PROJECT_MANAGER: '#3b82f6',
    SAFETY_OFFICER: '#10b981',
    SITE_ENGINEER: '#f97316',
    VENDOR: '#eab308',
    FINANCE_OFFICER: '#06b6d4'
  };

  const roleData = data?.usersByRole ? Object.entries(data.usersByRole).map(([name, value]) => ({ 
    name, 
    value,
    color: COLORS[name] || '#64748b'
  })) : [];

  const statusByRoleData = data?.statusByRole ? Object.entries(data.statusByRole).map(([role, status]) => ({
    role,
    ACTIVE: status.ACTIVE || 0,
    INACTIVE: status.INACTIVE || 0,
    SUSPENDED: status.SUSPENDED || 0
  })) : [];

  const filteredUsers = (data?.users || []).filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error === 'ADMIN_ONLY') {
    return (
      <div className="text-center py-5" style={{ background: '#fff', borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginTop: '2rem' }}>
        <div style={{ width: 80, height: 80, background: '#fee2e2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <FaUserShield size={40} />
        </div>
        <h3 className="fw-bold text-dark mb-2">Restricted Access</h3>
        <p className="text-muted mb-4 mx-auto" style={{ maxWidth: 400 }}>
          User analytics are restricted to system administrators and project managers only. Please contact your administrator if you believe this is an error.
        </p>
        <button className="btn btn-primary rounded-pill px-5 py-2 fw-bold" onClick={() => navigate('/dashboard/reports')}>
          Back to Reports
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="User Analytics" subtitle="Monitor platform adoption, user activity, and role-based distributions">
        <RefreshButton onClick={fetchData} loading={loading} />
      </PageHeader>

      {/* Section 1: Statistics Overview */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <StatCard icon={FaUsers} label="Total Users" value={data?.totalUsers || 0} color="#6366f1" bgColor="#eef2ff" />
        </div>
        <div className="col-md-3">
          <StatCard icon={FaUserCheck} label="Active" value={data?.activeUsers || 0} color="#10b981" bgColor="#dcfce7" />
        </div>
        <div className="col-md-3">
          <StatCard icon={FaUserMinus} label="Inactive" value={data?.inactiveUsers || 0} color="#64748b" bgColor="#f1f5f9" />
        </div>
        <div className="col-md-3">
          <StatCard icon={FaUserTimes} label="Suspended" value={data?.suspendedUsers || 0} color="#ef4444" bgColor="#fee2e2" />
        </div>
      </div>

      <div className="row g-4 mb-5">
        {/* Users by Role Bar Chart */}
        <div className="col-lg-8">
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', padding: '1.5rem' }}>
            <h5 className="fw-bold mb-4">Role Distribution</h5>
            <div style={{ height: 350, minHeight: 350, width: '100%' }}>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={roleData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={120} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Users">
                    {roleData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* User Distribution Donut */}
        <div className="col-lg-4">
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', padding: '1.5rem', height: '100%' }}>
            <h5 className="fw-bold mb-4 text-center">User Share</h5>
            <div style={{ height: 300, minHeight: 300, width: '100%', position: 'relative' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roleData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div className="h4 fw-800 mb-0">{data?.totalUsers || 0}</div>
                <div className="small text-muted fw-bold">TOTAL</div>
              </div>
            </div>
            <div className="mt-3">
              {roleData.slice(0, 4).map(item => (
                <div key={item.name} className="d-flex align-items-center justify-content-between mb-1">
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                    <span className="small text-muted">{item.name.replace('_', ' ')}</span>
                  </div>
                  <span className="small fw-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Distribution Stacked Bar Chart */}
        <div className="col-12">
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', padding: '1.5rem' }}>
            <h5 className="fw-bold mb-4">User Status by Role</h5>
            <div style={{ height: 350, minHeight: 350, width: '100%' }}>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={statusByRoleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="role" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Bar dataKey="ACTIVE" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Active" />
                  <Bar dataKey="INACTIVE" stackId="a" fill="#64748b" radius={[0, 0, 0, 0]} name="Inactive" />
                  <Bar dataKey="SUSPENDED" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="Suspended" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: User List */}
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
            <FaIdCard className="text-primary" /> Comprehensive User Directory
          </h5>
          <div className="input-group rounded-pill overflow-hidden border px-3 bg-white" style={{ maxWidth: 350 }}>
            <span className="input-group-text border-0 bg-transparent text-muted"><FaSearch /></span>
            <input 
              type="text" 
              className="form-control border-0 bg-transparent py-2" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0">User Details</th>
                  <th className="py-3 border-0">Email</th>
                  <th className="py-3 border-0">Role</th>
                  <th className="py-3 border-0 text-center">Status</th>
                  <th className="px-4 py-3 border-0 text-end">ID</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-5 text-muted">No users matching your search</td></tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.userId}>
                      <td className="px-4 py-3 fw-bold" style={{ color: '#1e293b' }}>{u.name}</td>
                      <td className="py-3 text-muted">{u.email}</td>
                      <td className="py-3">
                        <Badge style={{ background: COLORS[u.role] || '#64748b' }} className="rounded-pill px-3 fw-500">
                          {u.role.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 text-center">
                        <Badge bg={u.status === 'ACTIVE' ? 'success' : u.status === 'INACTIVE' ? 'secondary' : 'danger'} className="rounded-pill px-3">
                          {u.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-end font-monospace text-muted small">{u.userId}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
