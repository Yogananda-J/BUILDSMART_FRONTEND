import { useState, useEffect } from 'react';
import { getBudgetsByProject, createBudget, submitBudget, approveBudget, updateBudget, getBudgetsByStatus } from '../../../api/financeApi';
import { getProjects } from '../../../api/projectApi';
import { toast } from '../../../utils/toast';
import StatusBadge from '../../../components/common/StatusBadge';
import StatCard from '../../../components/common/StatCard';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaMoneyBillWave, FaChartLine, FaCheckDouble, FaPlus, FaDollarSign } from 'react-icons/fa';

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ projectId: '', category: '', amount: '', description: '', fiscalYear: new Date().getFullYear().toString() });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, pRes] = await Promise.all([
        getBudgetsByStatus('ALL').catch(() => ({ data: [] })),
        getProjects().catch((err) => {
          console.warn('Projects restricted for this role', err);
          return { data: [] };
        })
      ]);
      setBudgets(Array.isArray(bRes.data) ? bRes.data : (bRes.data?.data || bRes.data?.content || []));
      setProjects(Array.isArray(pRes.data) ? pRes.data : (pRes.data?.data || pRes.data?.content || []));
    } catch (err) {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createBudget(form);
      toast.success('Budget created successfully');
      setShowCreate(false);
      setForm({ projectId: '', category: '', amount: '', description: '', fiscalYear: new Date().getFullYear().toString() });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create budget');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAction = async (action, budgetId) => {
    try {
      if (action === 'submit') {
        await submitBudget(budgetId);
        toast.success('Budget submitted for approval');
      } else if (action === 'approve') {
        await approveBudget(budgetId, { status: 'APPROVED', comments: 'Approved by Finance' });
        toast.success('Budget approved');
      }
      fetchData();
    } catch (err) {
      toast.error(`Failed to ${action} budget`);
    }
  };

  const safeBudgets = Array.isArray(budgets) ? budgets : [];
  const filtered = safeBudgets.filter(b => selectedProject === 'ALL' || b.projectId === selectedProject);

  const stats = {
    total: filtered.reduce((sum, b) => sum + (Number(b.amount) || 0), 0),
    approved: filtered.filter(b => b.status === 'APPROVED').reduce((sum, b) => sum + (Number(b.amount) || 0), 0),
    pending: filtered.filter(b => b.status === 'SUBMITTED').length,
  };

  return (
    <div>
      <PageHeader title="Budget Management" subtitle="Manage and track project budgets">
        <RefreshButton onClick={fetchData} loading={loading} />
        <button
          onClick={() => setShowCreate(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0.6rem 1.25rem', borderRadius: '50rem',
            background: '#6366f1', color: '#fff', border: 'none',
            fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
          }}
        >
          <FaPlus size={12} /> New Budget
        </button>
      </PageHeader>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <StatCard icon={FaMoneyBillWave} label="Total Budget" value={`₹${stats.total.toLocaleString()}`} color="#3b82f6" bgColor="#dbeafe" />
        <StatCard icon={FaCheckDouble} label="Approved Budget" value={`₹${stats.approved.toLocaleString()}`} color="#10b981" bgColor="#d1fae5" />
        <StatCard icon={FaChartLine} label="Pending Approval" value={stats.pending} color="#f59e0b" bgColor="#fef3c7" />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        <div className="p-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <Form.Select 
            value={selectedProject} 
            onChange={e => setSelectedProject(e.target.value)}
            style={{ maxWidth: 300, borderRadius: '50rem', background: '#f8fafc' }}
          >
            <option value="ALL">All Projects</option>
            {projects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}
          </Form.Select>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: '#6366f1' }} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={FaMoneyBillWave} title="No budgets found" message="Create a new budget allocation to get started." actionLabel="New Budget" onAction={() => setShowCreate(true)} />
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.budgetId || b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
                      {projects.find(p => p.projectId === b.projectId)?.projectName || b.projectId}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>{b.category}</td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#334155' }}>
                      <FaDollarSign size={10} className="me-1 text-muted" />{Number(b.amount).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem' }}><StatusBadge status={b.status} size="sm" /></td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {b.status === 'DRAFT' && (
                        <button onClick={() => handleAction('submit', b.budgetId || b.id)} className="btn btn-sm btn-light rounded-pill" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Submit</button>
                      )}
                      {b.status === 'SUBMITTED' && (
                        <button onClick={() => handleAction('approve', b.budgetId || b.id)} className="btn btn-sm btn-success rounded-pill" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Approve</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered size="md">
        <Modal.Header closeButton className="border-0 pb-0" style={{ padding: '1.5rem 1.5rem 0.5rem' }}>
          <Modal.Title style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>Create Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleCreate}>
            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Project</Form.Label>
              <Form.Select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }}>
                <option value="">Select Project</option>
                {projects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}
              </Form.Select>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Category</Form.Label>
                <Form.Select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }}>
                  <option value="">Select Category</option>
                  <option value="LABOR">Labor</option>
                  <option value="MATERIALS">Materials</option>
                  <option value="EQUIPMENT">Equipment</option>
                  <option value="SUBCONTRACTOR">Subcontractor</option>
                  <option value="OVERHEAD">Overhead</option>
                </Form.Select>
              </div>
              <div className="col-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Fiscal Year</Form.Label>
                <Form.Control type="number" value={form.fiscalYear} onChange={e => setForm({ ...form, fiscalYear: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} />
              </div>
            </div>
            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Amount</Form.Label>
              <Form.Control type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} placeholder="0.00" />
            </div>
            <div className="mb-4">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Description</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ borderRadius: 16, background: '#f8fafc' }} />
            </div>
            <div className="d-flex gap-3 justify-content-end pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
              <Button variant="light" onClick={() => setShowCreate(false)} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 1.75rem' }}>Cancel</Button>
              <Button type="submit" disabled={submitting} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 2rem', background: '#4f46e5', border: 'none' }}>{submitting ? 'Creating...' : 'Create Budget'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BudgetManagement;
