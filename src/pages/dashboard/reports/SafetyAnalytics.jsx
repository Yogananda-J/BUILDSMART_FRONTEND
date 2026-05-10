import { useState, useEffect } from 'react';
import { getSafetyTrends, getSafetyInspectionSummary } from '../../../api/reportApi';
import { toast } from '../../../utils/toast';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { FaShieldAlt, FaHardHat, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaClipboardList } from 'react-icons/fa';
import StatCard from '../../../components/common/StatCard';

const SafetyAnalytics = () => {
  const [trends, setTrends] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Safety Trends
    try {
      const trendRes = await getSafetyTrends();
      setTrends(trendRes.data?.data || trendRes.data || []);
    } catch (err) {
      console.warn('Safety trends fetch failed:', err.message);
    }

    // Fetch Safety Inspection Summary
    try {
      const sumRes = await getSafetyInspectionSummary();
      setSummary(sumRes.data?.data || sumRes.data);
    } catch (err) {
      console.warn('Safety summary fetch failed:', err.message);
    }

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const pivotTrends = (data = []) => {
    return data.reduce((acc, item) => {
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

  const chartData = pivotTrends(trends);
  const donutData = summary ? [
    { name: 'Scheduled', value: summary.scheduled || 0, color: '#3b82f6' },
    { name: 'In Progress', value: summary.inProgress || 0, color: '#eab308' },
    { name: 'Completed', value: summary.completed || 0, color: '#22c55e' },
    { name: 'Non-Compliant', value: summary.nonCompliant || 0, color: '#ef4444' },
    { name: 'Closed', value: summary.closed || 0, color: '#6b7280' }
  ] : [];

  return (
    <div>
      <PageHeader title="Safety Performance Analytics" subtitle="Monitor incident trends, severity distributions, and inspection coverage">
        <RefreshButton onClick={fetchData} loading={loading} />
      </PageHeader>

      {/* Section 1: Inspection Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col">
          <StatCard icon={FaClipboardList} label="Scheduled" value={summary?.scheduled || 0} color="#3b82f6" bgColor="#dbeafe" />
        </div>
        <div className="col">
          <StatCard icon={FaExclamationTriangle} label="In Progress" value={summary?.inProgress || 0} color="#f59e0b" bgColor="#fef3c7" />
        </div>
        <div className="col">
          <StatCard icon={FaCheckCircle} label="Completed" value={summary?.completed || 0} color="#10b981" bgColor="#dcfce7" />
        </div>
        <div className="col">
          <StatCard icon={FaTimesCircle} label="Non-Compliant" value={summary?.nonCompliant || 0} color="#ef4444" bgColor="#fee2e2" />
        </div>
        <div className="col">
          <StatCard icon={FaHardHat} label="Closed" value={summary?.closed || 0} color="#64748b" bgColor="#f1f5f9" />
        </div>
      </div>

      <div className="row g-4 mb-5">
        {/* Safety Incident Trends */}
        <div className="col-lg-8">
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', padding: '1.5rem' }}>
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <FaShieldAlt className="text-danger" /> Incident Severity Trends
            </h5>
            <div style={{ height: 400, minHeight: 400, width: '100%' }}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="LOW" stroke="#22c55e" strokeWidth={3} name="Low" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="MEDIUM" stroke="#eab308" strokeWidth={3} name="Medium" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="HIGH" stroke="#f97316" strokeWidth={3} name="High" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="CRITICAL" stroke="#ef4444" strokeWidth={3} name="Critical" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Inspection Donut Chart */}
        <div className="col-lg-4">
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', padding: '1.5rem', height: '100%' }}>
            <h5 className="fw-bold mb-4 text-center">Inspection Coverage</h5>
            <div style={{ height: 300, minHeight: 300, width: '100%', position: 'relative' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%" cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div className="h2 fw-800 mb-0">{summary?.total || 0}</div>
                <div className="small text-muted fw-bold">TOTAL</div>
              </div>
            </div>
            <div className="mt-3">
              {donutData.map(item => (
                <div key={item.name} className="d-flex align-items-center justify-content-between mb-1">
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                    <span className="small text-muted">{item.name}</span>
                  </div>
                  <span className="small fw-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Safety Metrics Table */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', padding: '1.5rem' }}>
        <h5 className="fw-bold mb-4">Key Safety Performance Metrics</h5>
        <div className="row g-4 text-center">
          <div className="col-md-3">
            <div className="p-3 bg-light rounded-4">
              <div className="h4 fw-800 mb-1 text-primary">{summary ? Math.round((summary.completed / summary.total) * 100) : 0}%</div>
              <div className="small text-muted text-uppercase fw-bold">Compliance Rate</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-light rounded-4">
              <div className="h4 fw-800 mb-1 text-danger">{summary ? Math.round((summary.nonCompliant / summary.total) * 100) : 0}%</div>
              <div className="small text-muted text-uppercase fw-bold">Non-Compliance Rate</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-light rounded-4">
              <div className="h4 fw-800 mb-1 text-success">{trends.length}</div>
              <div className="small text-muted text-uppercase fw-bold">Total Incident Days</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-light rounded-4">
              <div className="h4 fw-800 mb-1 text-info">{summary?.completed || 0}</div>
              <div className="small text-muted text-uppercase fw-bold">Success Inspections</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyAnalytics;
