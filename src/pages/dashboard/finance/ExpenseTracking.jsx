import { useState, useEffect } from 'react';
import { getExpenses, createExpense } from '../../../api/financeApi';
import { getProjects } from '../../../api/projectApi';
import { toast } from '../../../utils/toast';
import StatusBadge from '../../../components/common/StatusBadge';
import StatCard from '../../../components/common/StatCard';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaFileInvoiceDollar, FaChartPie, FaPlus, FaDollarSign, FaCreditCard } from 'react-icons/fa';

const ExpenseTracking = () => {
  const [expenses, setExpenses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ projectId: '', category: '', amount: '', description: '', expenseDate: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eRes, pRes] = await Promise.all([
        getExpenses().catch(() => ({ data: [] })),
        getProjects().catch(() => ({ data: [] }))
      ]);
      setExpenses(eRes.data || []);
      setProjects(pRes.data || []);
    } catch (err) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createExpense(form);
      toast.success('Expense recorded successfully');
      setShowCreate(false);
      setForm({ projectId: '', category: '', amount: '', description: '', expenseDate: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record expense');
    } finally {
      setSubmitting(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const thisMonthExpenses = expenses.filter(e => new Date(e.expenseDate).getMonth() === new Date().getMonth()).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  return (
    <div>
      <PageHeader title="Expense Tracking" subtitle="Record and monitor project expenses">
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
          <FaPlus size={12} /> Record Expense
        </button>
      </PageHeader>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <StatCard icon={FaFileInvoiceDollar} label="Total Expenses" value={`₹${totalExpenses.toLocaleString()}`} color="#ef4444" bgColor="#fef2f2" />
        <StatCard icon={FaChartPie} label="This Month" value={`₹${thisMonthExpenses.toLocaleString()}`} color="#f59e0b" bgColor="#fef3c7" />
        <StatCard icon={FaCreditCard} label="Recorded Entries" value={expenses.length} color="#8b5cf6" bgColor="#ede9fe" />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: '#6366f1' }} /></div>
        ) : expenses.length === 0 ? (
          <EmptyState icon={FaFileInvoiceDollar} title="No expenses recorded" message="Record your first project expense." actionLabel="Record Expense" onAction={() => setShowCreate(true)} />
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category / Description</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(e => (
                  <tr key={e.expenseId || e.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>{new Date(e.expenseDate).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
                      {projects.find(p => p.projectId === e.projectId)?.projectName || e.projectId}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{e.category}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{e.description}</div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#ef4444' }}>
                      <FaDollarSign size={10} className="me-1" />{Number(e.amount).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem' }}><StatusBadge status={e.status || 'APPROVED'} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered size="md">
        <Modal.Header closeButton className="border-0 pb-0" style={{ padding: '1.5rem 1.5rem 0.5rem' }}>
          <Modal.Title style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>Record Expense</Modal.Title>
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
                  <option value="TRAVEL">Travel</option>
                  <option value="MISC">Miscellaneous</option>
                </Form.Select>
              </div>
              <div className="col-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Date</Form.Label>
                <Form.Control type="date" value={form.expenseDate} onChange={e => setForm({ ...form, expenseDate: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} />
              </div>
            </div>
            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Amount</Form.Label>
              <Form.Control type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} placeholder="0.00" />
            </div>
            <div className="mb-4">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Description</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required style={{ borderRadius: 16, background: '#f8fafc' }} />
            </div>
            <div className="d-flex gap-3 justify-content-end pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
              <Button variant="light" onClick={() => setShowCreate(false)} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 1.75rem' }}>Cancel</Button>
              <Button type="submit" disabled={submitting} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 2rem', background: '#4f46e5', border: 'none' }}>{submitting ? 'Recording...' : 'Record Expense'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ExpenseTracking;
