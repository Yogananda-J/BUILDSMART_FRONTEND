import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getDashboardSummary, getSafetyTrends, getCashFlow, 
  getVendorCompliance, getSiteProgressSummary, getSafetyInspectionSummary
} from '../../../api/reportApi';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../../utils/toast';
import StatCard from '../../../components/common/StatCard';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, Legend, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { FaChartBar, FaProjectDiagram, FaHardHat, FaMoneyBillWave, FaTruck, FaShieldAlt } from 'react-icons/fa';

const ReportOverview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [safetyTrends, setSafetyTrends] = useState([]);
  const [inspectionSummary, setInspectionSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRole = (user?.role || '').toUpperCase().replace('ROLE_', '').trim();

  const fetchData = async () => {
    setLoading(true);
    const role = userRole;
    
    // 1. If not Admin or PM, redirect to role-specific module immediately
    if (role && role !== 'ADMIN' && role !== 'PROJECT_MANAGER') {
      if (role === 'SAFETY_OFFICER') navigate('/dashboard/reports/safety');
      else if (role === 'FINANCE_OFFICER') navigate('/dashboard/reports/finance');
      else if (role === 'VENDOR') navigate('/dashboard/reports/vendor');
      else if (role === 'SITE_ENGINEER') navigate('/dashboard/reports/site');
      return;
    }

    // Fetch Dashboard Summary (Admin-centric, handle 403 gracefully)
    try {
      const sumRes = await getDashboardSummary();
      setData(sumRes.data?.data || sumRes.data);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('Dashboard summary restricted:', err.response?.data || err.message);
      }
    }

    // Fetch Safety Trends (Admin, PM, Safety)
    try {
      const trendRes = await getSafetyTrends();
      setSafetyTrends(trendRes.data?.data || trendRes.data || []);
    } catch (err) {
      console.warn('Safety trends restricted or failed:', err.message);
    }

    // Fetch Safety Inspection Summary
    try {
      const inspRes = await getSafetyInspectionSummary();
      setInspectionSummary(inspRes.data?.data || inspRes.data);
    } catch (err) {
      console.warn('Inspection summary restricted or failed:', err.message);
    }

    setLoading(false);
  };

  const pivotTrends = (raw = []) => {
    return raw.reduce((acc, item) => {
      const existing = acc.find(d => d.date === item.date);
      if (existing) {
        existing[item.severityCategory] = item.incidentCount;
      } else {
        acc.push({
          date: item.date,
          LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0,
          [item.severityCategory]: item.incidentCount
        });
      }
      return acc;
    }, []);
  };

  const chartTrends = pivotTrends(safetyTrends);

  useEffect(() => { fetchData(); }, []);

  return (
    <div>
      <PageHeader title="Analytics Dashboard" subtitle="System-wide performance metrics and real-time operational insights">
        <RefreshButton onClick={fetchData} loading={loading} />
      </PageHeader>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <StatCard icon={FaProjectDiagram} label="Active Projects" value={data?.activeProjects || 0} color="#6366f1" bgColor="#eef2ff" />
        <StatCard icon={FaMoneyBillWave} label="Avg Budget Variance" value={`${data?.averageBudgetVariance || 0}%`} color="#f59e0b" bgColor="#fef3c7" />
        <StatCard icon={FaHardHat} label="Safety Compliance" value={`${data?.safetyComplianceRate || 0}%`} color="#10b981" bgColor="#dcfce7" />
        <StatCard icon={FaTruck} label="Resource Util Rate" value={`${data?.resourceUtilizationRate || 0}%`} color="#3b82f6" bgColor="#dbeafe" />
      </div>

      <div className="row g-4">
        {/* Project Health Chart */}
        {data?.projectHealth && data.projectHealth.length > 0 && (
          <div className="col-lg-8">
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', padding: '1.5rem' }}>
              <h5 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem' }}><FaChartBar className="me-2 text-primary" /> Project Health Overview</h5>
              <div style={{ height: 350, minHeight: 350, width: '100%' }}>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data?.projectHealth}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="budget" fill="#6366f1" radius={[4, 4, 0, 0]} name="Budget" />
                    <Bar dataKey="spent" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Spent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Inspection Summary Chart */}
        <div className="col-lg-4">
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', padding: '1.5rem', height: '100%', minHeight: 450 }}>
            <h5 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem' }}><FaHardHat className="me-2 text-success" /> Inspection Summary</h5>
            <div style={{ height: 300, minHeight: 300, width: '100%', position: 'relative' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Scheduled', value: inspectionSummary?.scheduled || 0, color: '#3b82f6' },
                      { name: 'In Progress', value: inspectionSummary?.inProgress || 0, color: '#eab308' },
                      { name: 'Completed', value: inspectionSummary?.completed || 0, color: '#22c55e' },
                      { name: 'Non-Compliant', value: inspectionSummary?.nonCompliant || 0, color: '#ef4444' },
                      { name: 'Closed', value: inspectionSummary?.closed || 0, color: '#6b7280' },
                    ]}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { color: '#3b82f6' }, { color: '#eab308' }, { color: '#22c55e' }, { color: '#ef4444' }, { color: '#6b7280' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>{inspectionSummary?.total || 0}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total</div>
              </div>
            </div>
            <div className="mt-3 d-flex flex-wrap gap-2 justify-content-center">
              {['Scheduled', 'In Progress', 'Completed', 'Non-Compliant'].map((label, i) => (
                <div key={label} className="d-flex align-items-center gap-1">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: ['#3b82f6', '#eab308', '#22c55e', '#ef4444'][i] }} />
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Trends Chart */}
        <div className="col-lg-8">
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', padding: '1.5rem' }}>
            <h5 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem' }}><FaShieldAlt className="me-2 text-danger" /> Safety Incident Trends</h5>
            <div style={{ height: 350, minHeight: 350, width: '100%' }}>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="LOW" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} name="Low Severity" />
                  <Line type="monotone" dataKey="MEDIUM" stroke="#eab308" strokeWidth={3} dot={{ r: 4 }} name="Medium Severity" />
                  <Line type="monotone" dataKey="HIGH" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} name="High Severity" />
                  <Line type="monotone" dataKey="CRITICAL" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} name="Critical" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportOverview;
