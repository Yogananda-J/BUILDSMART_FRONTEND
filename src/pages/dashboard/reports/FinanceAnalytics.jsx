import { useState, useEffect } from 'react';
import { getCashFlow, getBudgetVariance } from '../../../api/reportApi';
import { getProjects } from '../../../api/projectApi';
import { toast } from '../../../utils/toast';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FaMoneyBillWave, FaExclamationTriangle, FaChartLine, FaProjectDiagram } from 'react-icons/fa';
import { ProgressBar } from 'react-bootstrap';

const FinanceAnalytics = () => {
  const [cashFlow, setCashFlow] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [budgetLoading, setBudgetLoading] = useState(false);

  const fetchInitialData = async () => {
    setLoading(true);
    
    // Fetch Cash Flow
    try {
      const cfRes = await getCashFlow();
      setCashFlow(cfRes.data?.data || cfRes.data || []);
    } catch (err) {
      console.warn('Cash flow fetch failed:', err.message);
    }

    // Fetch Projects
    try {
      const pRes = await getProjects();
      const pData = pRes.data?.data || pRes.data || [];
      setProjects(pData);
      if (pData.length > 0) setSelectedProjectId(pData[0].projectId);
    } catch (err) {
      console.warn('Projects fetch failed:', err.message);
    }

    setLoading(false);
  };

  const fetchBudgetVariance = async (projectId) => {
    if (!projectId) return;
    setBudgetLoading(true);
    try {
      const res = await getBudgetVariance(projectId);
      setBudgetData(res.data?.data || res.data);
    } catch (err) {
      setBudgetData(null);
    } finally {
      setBudgetLoading(false);
    }
  };

  useEffect(() => { fetchInitialData(); }, []);
  useEffect(() => { fetchBudgetVariance(selectedProjectId); }, [selectedProjectId]);

  const totalInvoices = cashFlow.reduce((sum, item) => sum + (item.invoices || 0), 0);
  const totalPayments = cashFlow.reduce((sum, item) => sum + (item.payments || 0), 0);
  const netCashFlow = totalPayments - totalInvoices;

  const getVarianceColor = (v) => {
    if (v < 5) return '#22c55e';
    if (v < 10) return '#eab308';
    return '#ef4444';
  };

  return (
    <div>
      <PageHeader title="Financial Analytics" subtitle="Monitor budget variance, project health, and overall cash flow trends">
        <RefreshButton onClick={fetchInitialData} loading={loading} />
      </PageHeader>

      {/* Section 1: Budget Variance Analysis */}
      <div className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
            <FaProjectDiagram className="text-primary" /> Budget Variance Analysis
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

        {budgetLoading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : budgetData ? (
          <div className="row g-4">
            <div className="col-12">
              {budgetData.thresholdExceeded && (
                <div className="alert alert-danger border-0 shadow-sm rounded-4 d-flex align-items-center gap-3 mb-4" style={{ background: '#fef2f2', color: '#991b1b' }}>
                  <FaExclamationTriangle size={24} />
                  <div>
                    <strong className="d-block">Budget Threshold Exceeded!</strong>
                    <span className="small opacity-75">The actual spending for this project has surpassed the defined critical variance threshold.</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ background: '#fff' }}>
                <div className="small text-muted fw-bold text-uppercase mb-1">Planned Budget</div>
                <div className="h3 fw-800 mb-0" style={{ color: '#1e293b' }}>${budgetData.plannedAmount?.toLocaleString()}</div>
                <div className="mt-3 small" style={{ color: '#64748b' }}>Total authorized allocation</div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ background: '#fff' }}>
                <div className="small text-muted fw-bold text-uppercase mb-1">Actual Spent</div>
                <div className={`h3 fw-800 mb-0 ${budgetData.actualAmount > budgetData.plannedAmount ? 'text-danger' : 'text-success'}`}>
                  ${budgetData.actualAmount?.toLocaleString()}
                </div>
                <div className="mt-3 small" style={{ color: '#64748b' }}>Current project expenditure</div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ background: '#fff' }}>
                <div className="small text-muted fw-bold text-uppercase mb-1">Variance</div>
                <div className="h3 fw-800 mb-0" style={{ color: getVarianceColor(budgetData.variance) }}>
                  {budgetData.variance}%
                </div>
                <div className="mt-3 small" style={{ color: '#64748b' }}>Deviation from planned budget</div>
              </div>
            </div>

            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4 p-4" style={{ background: '#fff' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="small text-muted fw-bold text-uppercase">Budget Utilization</div>
                  <div className="fw-bold" style={{ color: '#1e293b' }}>
                    {Math.round((budgetData.actualAmount / budgetData.plannedAmount) * 100)}% Used
                  </div>
                </div>
                <ProgressBar 
                  now={Math.min(100, (budgetData.actualAmount / budgetData.plannedAmount) * 100)} 
                  variant={budgetData.actualAmount > budgetData.plannedAmount ? 'danger' : 'success'}
                  style={{ height: 12, borderRadius: 6 }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5 bg-light rounded-4 border">No budget data available for this project</div>
        )}
      </div>

      {/* Section 2: Cash Flow Analysis */}
      <div>
        <h5 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
          <FaChartLine className="text-primary" /> Cash Flow Trends
        </h5>
        
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="p-4 rounded-4 text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              <div className="small opacity-80 fw-bold text-uppercase mb-1">Total Invoices</div>
              <div className="h4 fw-800 mb-0">${totalInvoices.toLocaleString()}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded-4 text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <div className="small opacity-80 fw-bold text-uppercase mb-1">Total Payments</div>
              <div className="h4 fw-800 mb-0">${totalPayments.toLocaleString()}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded-4 text-white shadow-sm" style={{ background: netCashFlow >= 0 ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              <div className="small opacity-80 fw-bold text-uppercase mb-1">Net Cash Flow</div>
              <div className="h4 fw-800 mb-0">${netCashFlow.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', padding: '1.5rem' }}>
          <div style={{ height: 400, minHeight: 400, width: '100%' }}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={cashFlow}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="invoices" stroke="#3b82f6" strokeWidth={3} name="Invoices" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="payments" stroke="#22c55e" strokeWidth={3} name="Payments" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="netOutflow" stroke="#f97316" strokeWidth={3} name="Net Outflow" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceAnalytics;
