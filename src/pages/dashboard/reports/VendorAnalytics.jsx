import { useState, useEffect } from 'react';
import { getVendorCompliance, getVendorPerformance } from '../../../api/reportApi';
import { toast } from '../../../utils/toast';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { FaBuilding, FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle, FaStar } from 'react-icons/fa';
import { ProgressBar, Badge } from 'react-bootstrap';
import StatCard from '../../../components/common/StatCard';

const StarRating = ({ value }) => {
  return (
    <div className="d-flex gap-1 text-warning">
      {[1, 2, 3, 4, 5].map(s => (
        <FaStar key={s} opacity={s <= value ? 1 : 0.2} />
      ))}
    </div>
  );
};

const VendorAnalytics = () => {
  const [compliance, setCompliance] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Compliance
    try {
      const compRes = await getVendorCompliance();
      setCompliance(compRes.data?.data || compRes.data);
    } catch (err) {
      console.warn('Vendor compliance restricted or failed:', err.message);
    }

    // Fetch Performance
    try {
      const perfRes = await getVendorPerformance();
      setPerformance(perfRes.data?.data || perfRes.data || []);
    } catch (err) {
      console.warn('Vendor performance restricted or failed:', err.message);
    }

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getRatingColor = (rating) => {
    switch(rating) {
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
      <PageHeader title="Vendor Analytics" subtitle="Analyze vendor compliance, delivery performance, and service quality ratings">
        <RefreshButton onClick={fetchData} loading={loading} />
      </PageHeader>

      {/* Section 1: Compliance Summary */}
      <div className="mb-5">
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <StatCard icon={FaBuilding} label="Total Vendors" value={compliance?.totalVendors || 0} color="#3b82f6" bgColor="#dbeafe" />
          </div>
          <div className="col-md-3">
            <StatCard icon={FaCheckCircle} label="Compliant" value={compliance?.compliantVendors || 0} color="#10b981" bgColor="#dcfce7" />
          </div>
          <div className="col-md-3">
            <StatCard icon={FaTimesCircle} label="Non-Compliant" value={compliance?.nonCompliantVendors || 0} color="#ef4444" bgColor="#fee2e2" />
          </div>
          <div className="col-md-3">
            <StatCard icon={FaClock} label="Pending Review" value={compliance?.pendingReview || 0} color="#f59e0b" bgColor="#fef3c7" />
          </div>
        </div>

        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', padding: '1.5rem' }}>
              <h5 className="fw-bold mb-4 text-center">Global Compliance Rate</h5>
              <div style={{ height: 250, minHeight: 250, width: '100%', position: 'relative' }}>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { value: 100 - (compliance?.complianceRate || 0), color: '#f1f5f9' },
                        { value: compliance?.complianceRate || 0, color: '#10b981' }
                      ]}
                      cx="50%" cy="100%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={100}
                      outerRadius={140}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill="#f1f5f9" />
                      <Cell fill="#10b981" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                  <div className="display-4 fw-800" style={{ color: '#10b981' }}>{compliance?.complianceRate}%</div>
                  <div className="small text-muted fw-bold text-uppercase">Compliant</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            {compliance?.contractsExpiringSoon > 0 && (
              <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center gap-4" style={{ background: '#fffbeb', borderLeft: '6px solid #f59e0b !important' }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaExclamationTriangle size={32} />
                </div>
                <div>
                  <h4 className="fw-800 mb-1" style={{ color: '#92400e' }}>{compliance.contractsExpiringSoon} Contracts Expiring</h4>
                  <p className="mb-0 text-muted">There are contracts reaching their renewal threshold within the next 30 days. Immediate review is recommended.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Performance Table */}
      <div>
        <h5 className="fw-bold mb-4">Vendor Performance Matrix</h5>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0">Vendor Details</th>
                  <th className="py-3 border-0">On-Time Delivery</th>
                  <th className="py-3 border-0">Quality</th>
                  <th className="py-3 border-0 text-end">Variance</th>
                  <th className="py-3 border-0 text-center">Contracts</th>
                  <th className="px-4 py-3 border-0">Rating</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
                ) : performance.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">No performance data found</td></tr>
                ) : (
                  performance.map((v) => (
                    <tr key={v.vendorId}>
                      <td className="px-4 py-3">
                        <div className="fw-bold" style={{ color: '#1e293b' }}>{v.vendorName}</div>
                        <div className="small text-muted">ID: {v.vendorId}</div>
                      </td>
                      <td className="py-3" style={{ width: 180 }}>
                        <div className="d-flex align-items-center gap-2">
                          <ProgressBar now={v.onTimeDeliveryRate} variant={v.onTimeDeliveryRate > 90 ? 'success' : v.onTimeDeliveryRate > 80 ? 'warning' : 'danger'} style={{ height: 6, flexGrow: 1 }} />
                          <span className="small fw-bold">{v.onTimeDeliveryRate}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <StarRating value={v.qualityScore} />
                      </td>
                      <td className={`py-3 text-end fw-bold ${v.costVariance > 0 ? 'text-danger' : 'text-success'}`}>
                        {v.costVariance > 0 ? '+' : ''}{v.costVariance}%
                      </td>
                      <td className="py-3 text-center">
                        <span className="badge bg-light text-dark rounded-pill px-3">{v.activeContracts}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge bg={getRatingColor(v.overallRating)} className="rounded-pill px-3 py-2">
                          Grade {v.overallRating}
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
    </div>
  );
};

export default VendorAnalytics;
