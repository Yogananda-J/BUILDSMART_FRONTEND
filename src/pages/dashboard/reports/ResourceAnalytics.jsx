import { useState, useEffect } from 'react';
import { getResourceUtilization, getLaborAllocation } from '../../../api/reportApi';
import { toast } from '../../../utils/toast';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { FaUsers, FaClock, FaHourglassHalf, FaChartPie, FaMapMarkerAlt } from 'react-icons/fa';
import { ProgressBar, Badge } from 'react-bootstrap';
import StatCard from '../../../components/common/StatCard';

const ResourceAnalytics = () => {
  const [utilization, setUtilization] = useState(null);
  const [allocation, setAllocation] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Resource Utilization
    try {
      const utilRes = await getResourceUtilization();
      setUtilization(utilRes.data?.data || utilRes.data);
    } catch (err) {
      console.warn('Utilization fetch failed:', err.message);
    }

    // Fetch Labor Allocation
    try {
      const allocRes = await getLaborAllocation();
      setAllocation(allocRes.data?.data || allocRes.data || []);
    } catch (err) {
      console.warn('Allocation fetch failed:', err.message);
    }

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const donutData = utilization ? [
    { name: 'Used Hours', value: utilization.usedHours, color: '#22c55e' },
    { name: 'Idle Hours', value: utilization.idleHours, color: '#eab308' }
  ] : [];

  return (
    <div>
      <PageHeader title="Resource Analytics" subtitle="Track labor utilization, workforce efficiency, and allocation across project sites">
        <RefreshButton onClick={fetchData} loading={loading} />
      </PageHeader>

      {/* Section 1: Overall Utilization */}
      <div className="mb-5">
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <StatCard icon={FaUsers} label="Total Workforce" value={utilization?.totalLabors || 0} color="#3b82f6" bgColor="#dbeafe" />
          </div>
          <div className="col-md-3">
            <StatCard icon={FaClock} label="Hours Used" value={`${utilization?.usedHours?.toLocaleString() || 0} hrs`} color="#10b981" bgColor="#dcfce7" />
          </div>
          <div className="col-md-3">
            <StatCard icon={FaHourglassHalf} label="Idle Hours" value={`${utilization?.idleHours?.toLocaleString() || 0} hrs`} color="#f59e0b" bgColor="#fef3c7" />
          </div>
          <div className="col-md-3">
            <StatCard 
              icon={FaChartPie} 
              label="Utilization Rate" 
              value={`${utilization?.utilizationRate || 0}%`} 
              color={utilization?.utilizationRate > 85 ? '#10b981' : utilization?.utilizationRate > 70 ? '#f59e0b' : '#ef4444'} 
              bgColor={utilization?.utilizationRate > 85 ? '#dcfce7' : utilization?.utilizationRate > 70 ? '#fef3c7' : '#fee2e2'} 
            />
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-6">
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', padding: '1.5rem', height: '100%' }}>
              <h5 className="fw-bold mb-4">Utilization Distribution</h5>
              <div style={{ height: 300, minHeight: 300, width: '100%', position: 'relative' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%" cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div className="display-6 fw-800">{utilization?.utilizationRate}%</div>
                  <div className="small text-muted text-uppercase fw-bold">Overall</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', padding: '1.5rem', height: '100%' }}>
              <h5 className="fw-bold mb-4">Site-wise Labor Allocation</h5>
            <div style={{ height: 300, minHeight: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={allocation}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="site" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Bar dataKey="allocatedHours" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Allocated" />
                  <Bar dataKey="availableHours" fill="#22c55e" radius={[4, 4, 0, 0]} name="Available" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Allocation Table */}
      <div>
        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
          <FaMapMarkerAlt className="text-primary" /> Detailed Site Workforce Allocation
        </h5>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0">Site Name</th>
                  <th className="py-3 border-0 text-end">Allocated Hrs</th>
                  <th className="py-3 border-0 text-end">Available Hrs</th>
                  <th className="py-3 border-0 text-center">Labors</th>
                  <th className="py-3 border-0">Utilization</th>
                  <th className="px-4 py-3 border-0">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
                ) : allocation.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">No allocation data found</td></tr>
                ) : (
                  allocation.map((item, idx) => {
                    const rate = Math.round((item.allocatedHours / item.availableHours) * 100);
                    return (
                      <tr key={idx}>
                        <td className="px-4 py-3 fw-bold">{item.site}</td>
                        <td className="py-3 text-end">{item.allocatedHours?.toLocaleString()}</td>
                        <td className="py-3 text-end">{item.availableHours?.toLocaleString()}</td>
                        <td className="py-3 text-center"><span className="badge bg-light text-dark rounded-pill px-3">{item.numberOfLabors}</span></td>
                        <td className="py-3" style={{ width: 200 }}>
                          <div className="d-flex align-items-center gap-2">
                            <ProgressBar now={rate} variant={rate > 85 ? 'success' : rate > 70 ? 'warning' : 'danger'} style={{ height: 6, flexGrow: 1 }} />
                            <span className="small fw-bold">{rate}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge bg={rate > 85 ? 'success' : rate > 70 ? 'warning' : 'danger'} className="rounded-pill px-3">
                            {rate > 85 ? 'Optimal' : rate > 70 ? 'Acceptable' : 'Underutilized'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceAnalytics;
