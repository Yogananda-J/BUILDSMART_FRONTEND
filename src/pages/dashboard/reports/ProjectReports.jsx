import { useState, useEffect } from 'react';
import { getProjectHealth, getProjectSummary } from '../../../api/reportApi';
import { getProjects } from '../../../api/projectApi';
import { toast } from '../../../utils/toast';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FaProjectDiagram, FaSearch, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { ProgressBar, Badge } from 'react-bootstrap';

const Gauge = ({ value, label, min = -10, max = 10, unit = '%' }) => {
  const normalizedValue = ((value - min) / (max - min)) * 100;
  const color = value > 0 ? '#10b981' : value < -5 ? '#ef4444' : '#f59e0b';
  
  return (
    <div className="text-center p-3">
      <div style={{ position: 'relative', height: 120, width: 200, margin: '0 auto' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={[
                { value: 100, color: '#f1f5f9' },
                { value: Math.max(0, Math.min(100, normalizedValue)), color }
              ]}
              cx="50%" cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill="#f1f5f9" />
              <Cell fill={color} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div className="h4 fw-800 mb-0">{value}{unit}</div>
        </div>
      </div>
      <div className="small fw-bold text-muted text-uppercase mt-2">{label}</div>
    </div>
  );
};

const ProjectReports = () => {
  const [summary, setSummary] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [healthLoading, setHealthLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [sumRes, pRes] = await Promise.all([
        getProjectSummary(),
        getProjects()
      ]);
      setSummary(sumRes.data?.data || sumRes.data || []);
      const pData = pRes.data?.data || pRes.data || [];
      setProjects(pData);
      if (pData.length > 0) setSelectedProjectId(pData[0].projectId);
    } catch (err) {
      if (err.response?.status !== 403) toast.error('Failed to load project summaries');
    } finally {
      setLoading(false);
    }
  };

  const fetchHealth = async (id) => {
    if (!id) return;
    setHealthLoading(true);
    try {
      const res = await getProjectHealth(id);
      setHealthData(res.data?.data || res.data);
    } catch (err) {
      setHealthData(null);
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => { fetchInitialData(); }, []);
  useEffect(() => { fetchHealth(selectedProjectId); }, [selectedProjectId]);

  const filteredSummary = summary.filter(p => p.projectName.toLowerCase().includes(searchTerm.toLowerCase()));

  const getHealthScore = () => {
    if (!healthData) return 0;
    // (Schedule Variance + CPI) / 2 * 100
    // Simplified for demo:
    return Math.round(((healthData.scheduleVariance / 10) + healthData.costPerformanceIndex) / 2 * 100);
  };

  const score = getHealthScore();

  return (
    <div>
      <PageHeader title="Project Health Analytics" subtitle="Detailed performance metrics and cross-project summaries">
        <RefreshButton onClick={fetchInitialData} loading={loading} />
      </PageHeader>

      {/* Section 1: Detailed Health View */}
      <div className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
            <FaProjectDiagram className="text-primary" /> Project Health Detail
          </h5>
          <select 
            className="form-select rounded-pill px-4" 
            style={{ width: 'auto', minWidth: 250 }}
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">Select Project</option>
            {projects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}
          </select>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', padding: '2rem' }}>
          {healthLoading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          ) : healthData ? (
            <div className="row align-items-center">
              <div className="col-md-4 border-end">
                <Gauge value={healthData.scheduleVariance} label="Schedule Variance" unit="%" min={-20} max={20} />
              </div>
              <div className="col-md-4 border-end">
                <Gauge value={healthData.costPerformanceIndex} label="Cost Performance (CPI)" unit="" min={0} max={2} />
              </div>
              <div className="col-md-4 text-center">
                <div className="small fw-bold text-muted text-uppercase mb-2">Overall Health Score</div>
                <div className="display-4 fw-800 mb-1" style={{ color: score > 90 ? '#10b981' : score > 70 ? '#f59e0b' : '#ef4444' }}>
                  {score}% {score > 90 ? '🚀' : score > 70 ? '✅' : '⚠️'}
                </div>
                <div className={`badge rounded-pill ${score > 90 ? 'bg-success' : score > 70 ? 'bg-warning' : 'bg-danger'}`}>
                  {score > 90 ? 'Excellent' : score > 70 ? 'Good' : 'Needs Attention'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">Select a project to view detailed health metrics</div>
          )}
        </div>
      </div>

      {/* Section 2: Project Summary Table */}
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h5 className="fw-bold mb-0 text-dark">System-wide Project Summary</h5>
          <div className="input-group rounded-pill overflow-hidden border px-3 bg-white" style={{ maxWidth: 300 }}>
            <span className="input-group-text border-0 bg-transparent text-muted"><FaSearch /></span>
            <input 
              type="text" 
              className="form-control border-0 bg-transparent py-2" 
              placeholder="Search project..." 
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
                  <th className="px-4 py-3 border-0">Project Name</th>
                  <th className="py-3 border-0">Status</th>
                  <th className="py-3 border-0 text-end">Budget</th>
                  <th className="py-3 border-0 text-end">Spent</th>
                  <th className="px-4 py-3 border-0">Completion</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
                ) : filteredSummary.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-5 text-muted">No projects found</td></tr>
                ) : (
                  filteredSummary.map(p => {
                    const completion = p.completion ?? (p.totalTasks > 0 ? Math.round((p.completedTasks / p.totalTasks) * 100) : 0);
                    return (
                      <tr key={p.projectId} onClick={() => setSelectedProjectId(p.projectId)} style={{ cursor: 'pointer' }}>
                        <td className="px-4 py-3">
                          <div className="fw-bold" style={{ color: '#1e293b' }}>{p.projectName}</div>
                          <div className="small text-muted">ID: {p.projectId}</div>
                        </td>
                        <td className="py-3">
                          <Badge 
                            bg={p.status === 'ACTIVE' || p.status === 'Planning' ? 'success' : p.status === 'COMPLETED' ? 'primary' : 'warning'}
                            className="rounded-pill px-3"
                          >
                            {p.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-end fw-500">${p.budget?.toLocaleString()}</td>
                        <td className="py-3 text-end fw-500">${(p.spent || 0).toLocaleString()}</td>
                        <td className="px-4 py-3" style={{ width: 250 }}>
                          <div className="d-flex align-items-center gap-2">
                            <ProgressBar 
                              now={completion} 
                              variant={completion > 80 ? 'success' : completion > 50 ? 'warning' : 'danger'}
                              style={{ height: 6, flexGrow: 1, borderRadius: 3 }}
                            />
                            <span className="small fw-bold" style={{ width: 40 }}>{completion}%</span>
                          </div>
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

export default ProjectReports;
