import { useState, useEffect } from 'react';
import { getSiteProgressSummary, getSiteEngineerPerformance, getSiteEngineerDailyLogs } from '../../../api/reportApi';
import { toast } from '../../../utils/toast';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import { FaMapPin, FaPlay, FaCheckCircle, FaChartLine, FaUsers, FaClipboardCheck, FaStar, FaCalendarAlt } from 'react-icons/fa';
import { ProgressBar, Badge } from 'react-bootstrap';
import StatCard from '../../../components/common/StatCard';

const StarRating = ({ value }) => (
  <div className="d-flex gap-1 text-warning">
    {[1, 2, 3, 4, 5].map(s => <FaStar key={s} opacity={s <= value ? 1 : 0.2} size={12} />)}
  </div>
);

const SiteAnalytics = () => {
  const [summary, setSummary] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Summary
    try {
      const sumRes = await getSiteProgressSummary();
      setSummary(sumRes.data?.data || sumRes.data);
    } catch (err) {
      console.warn('Site summary restricted or failed:', err.message);
    }

    // Fetch Engineer Performance
    try {
      const perfRes = await getSiteEngineerPerformance();
      setPerformance(perfRes.data?.data || perfRes.data || []);
    } catch (err) {
      console.warn('Engineer performance restricted or failed:', err.message);
    }

    // Fetch Daily Logs
    try {
      const logsRes = await getSiteEngineerDailyLogs();
      setLogs(logsRes.data?.data || logsRes.data || []);
    } catch (err) {
      console.warn('Daily logs restricted or failed:', err.message);
    }

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A': return 'success';
      case 'B': return 'info';
      case 'C': return 'warning';
      case 'D': return 'orange';
      case 'F': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <PageHeader title="Site & Engineer Analytics" subtitle="Monitor site progress, engineer efficiency, and daily operational logs">
        <RefreshButton onClick={fetchData} loading={loading} />
      </PageHeader>

      {/* Section 1: Site Progress Summary */}
      <div className="row g-3 mb-5">
        <div className="col-md-4 col-lg-2">
          <StatCard icon={FaMapPin} label="Total Sites" value={summary?.totalSites || 0} color="#3b82f6" bgColor="#dbeafe" />
        </div>
        <div className="col-md-4 col-lg-2">
          <StatCard icon={FaPlay} label="Active" value={summary?.activeSites || 0} color="#10b981" bgColor="#dcfce7" />
        </div>
        <div className="col-md-4 col-lg-2">
          <StatCard icon={FaCheckCircle} label="Completed" value={summary?.completedSites || 0} color="#8b5cf6" bgColor="#f5f3ff" />
        </div>
        <div className="col-md-4 col-lg-2">
          <StatCard icon={FaChartLine} label="Avg Comp" value={`${summary?.averageCompletionRate || 0}%`} color="#22c55e" bgColor="#f0fdf4" />
        </div>
        <div className="col-md-4 col-lg-2">
          <StatCard icon={FaUsers} label="Engineers" value={summary?.totalEngineers || 0} color="#f97316" bgColor="#fff7ed" />
        </div>
        <div className="col-md-4 col-lg-2">
          <StatCard icon={FaClipboardCheck} label="Task Comp" value={`${summary?.averageTaskCompletionRate || 0}%`} color="#06b6d4" bgColor="#ecfeff" />
        </div>
      </div>

      {/* Section 2: Engineer Performance Table */}
      <div className="mb-5">
        <h5 className="fw-bold mb-4">Engineer Performance Ranking</h5>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0">Engineer</th>
                  <th className="py-3 border-0">Project</th>
                  <th className="py-3 border-0">Task Completion</th>
                  <th className="py-3 border-0 text-center">Avg Hrs</th>
                  <th className="py-3 border-0 text-center">Inspections</th>
                  <th className="py-3 border-0">Quality</th>
                  <th className="px-4 py-3 border-0">Grade</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
                ) : performance.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-5 text-muted">No engineer performance data found</td></tr>
                ) : (
                  performance.map((e) => (
                    <tr key={e.engineerId}>
                      <td className="px-4 py-3 fw-bold">{e.engineerName}</td>
                      <td className="py-3 text-muted small">{e.assignedProject}</td>
                      <td className="py-3" style={{ width: 150 }}>
                        <div className="d-flex align-items-center gap-2">
                          <ProgressBar now={e.taskCompletionRate} variant={e.taskCompletionRate > 85 ? 'success' : 'warning'} style={{ height: 6, flexGrow: 1 }} />
                          <span className="small fw-bold">{e.taskCompletionRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-center fw-500">{e.avgHoursOnSite}h</td>
                      <td className="py-3 text-center fw-500">{e.totalInspections}</td>
                      <td className="py-3"><StarRating value={e.qualityScore} /></td>
                      <td className="px-4 py-3">
                        <Badge bg={getGradeColor(e.performanceGrade)} className="rounded-pill px-3">
                          {e.performanceGrade}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 3: Daily Logs Table */}
      <div>
        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
          <FaCalendarAlt className="text-primary" /> Site Operational Logs
        </h5>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0">Date</th>
                  <th className="py-3 border-0">Engineer</th>
                  <th className="py-3 border-0">Project ID</th>
                  <th className="py-3 border-0 text-center">Hours</th>
                  <th className="py-3 border-0 text-center">Tasks</th>
                  <th className="py-3 border-0 text-center">Inspections</th>
                  <th className="px-4 py-3 border-0 text-center">Issues</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-5 text-muted">No operational logs found</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.logId}>
                      <td className="px-4 py-3 text-muted fw-500">{log.date}</td>
                      <td className="py-3 fw-bold">{log.engineerName}</td>
                      <td className="py-3 text-muted small">{log.projectId}</td>
                      <td className="py-3 text-center">{log.hoursOnSite}h</td>
                      <td className="py-3 text-center"><span className="badge bg-primary-soft text-primary px-2">{log.tasksCompleted}</span></td>
                      <td className="py-3 text-center"><span className="badge bg-success-soft text-success px-2">{log.inspectionsConducted}</span></td>
                      <td className="px-4 py-3 text-center">
                        {log.issuesReported > 0 ? (
                          <span className="badge bg-danger rounded-pill px-3">{log.issuesReported} reported</span>
                        ) : (
                          <span className="text-muted small">None</span>
                        )}
                      </td>
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

export default SiteAnalytics;
