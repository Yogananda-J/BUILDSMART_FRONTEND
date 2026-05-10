import { useState, useEffect } from 'react';
import { getPayments, updatePaymentStatus, createPayment } from '../../../api/financeApi';
import { getProjects } from '../../../api/projectApi';
import { toast } from '../../../utils/toast';
import StatusBadge from '../../../components/common/StatusBadge';
import StatCard from '../../../components/common/StatCard';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaHandHoldingUsd, FaMoneyCheckAlt, FaClock, FaPlus, FaDollarSign } from 'react-icons/fa';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ projectId: '', invoiceId: '', amount: '', paymentDate: '', paymentMethod: 'BANK_TRANSFER', referenceNumber: '' });
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, projRes] = await Promise.all([
        getPayments().catch(() => ({ data: [] })),
        getProjects().catch(() => ({ data: [] }))
      ]);
      setPayments(pRes.data || []);
      setProjects(projRes.data || []);
    } catch (err) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createPayment(form);
      toast.success('Payment recorded successfully');
      setShowCreate(false);
      setForm({ projectId: '', invoiceId: '', amount: '', paymentDate: '', paymentMethod: 'BANK_TRANSFER', referenceNumber: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updatePaymentStatus(id, { status: newStatus });
      toast.success('Payment status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filtered = payments.filter(p => statusFilter === 'ALL' || p.status === statusFilter);

  const stats = {
    total: payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    completed: payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    pending: payments.filter(p => p.status === 'PENDING').length,
  };

  return (
    <div>
      <PageHeader title="Payment Management" subtitle="Track outward payments and vendor settlements">
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
          <FaPlus size={12} /> Record Payment
        </button>
      </PageHeader>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <StatCard icon={FaHandHoldingUsd} label="Total Payments" value={`₹${stats.total.toLocaleString()}`} color="#3b82f6" bgColor="#dbeafe" />
        <StatCard icon={FaMoneyCheckAlt} label="Completed Payments" value={`₹${stats.completed.toLocaleString()}`} color="#10b981" bgColor="#d1fae5" />
        <StatCard icon={FaClock} label="Pending Payments" value={stats.pending} color="#f59e0b" bgColor="#fef3c7" />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        <div className="p-4" style={{ borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '0.4rem', borderRadius: '50rem' }}>
            {['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: '50rem', border: 'none',
                  fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
                  background: statusFilter === status ? '#fff' : 'transparent',
                  color: statusFilter === status ? '#4f46e5' : '#64748b',
                  boxShadow: statusFilter === status ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: '#6366f1' }} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={FaMoneyCheckAlt} title="No payments found" message="No payments match the current filter." actionLabel="Record Payment" onAction={() => setShowCreate(true)} />
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project / Invoice</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Method / Ref</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.paymentId || p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>{new Date(p.paymentDate || p.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
                        {projects.find(proj => proj.projectId === p.projectId)?.projectName || p.projectId || 'General'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>Inv: {p.invoiceId || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#334155' }}>
                      <FaDollarSign size={10} className="me-1 text-muted" />{Number(p.amount).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.85rem', color: '#334155' }}>{p.paymentMethod?.replace('_', ' ')}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Ref: {p.referenceNumber || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <select
                        value={p.status || 'PENDING'}
                        onChange={(e) => handleStatusUpdate(p.paymentId || p.id, e.target.value)}
                        style={{ padding: '0.3rem 0.5rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.75rem', background: '#f8fafc', fontWeight: 600, color: '#475569' }}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="FAILED">Failed</option>
                      </select>
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
          <Modal.Title style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>Record Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleCreate}>
            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Project</Form.Label>
              <Form.Select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }}>
                <option value="">Select Project (Optional)</option>
                {projects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}
              </Form.Select>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Invoice ID</Form.Label>
                <Form.Control value={form.invoiceId} onChange={e => setForm({ ...form, invoiceId: e.target.value })} style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} placeholder="INV-..." />
              </div>
              <div className="col-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Amount</Form.Label>
                <Form.Control type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} placeholder="0.00" />
              </div>
            </div>
            <div className="row g-3 mb-4">
              <div className="col-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Method</Form.Label>
                <Form.Select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }}>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="CHECK">Check</option>
                  <option value="CASH">Cash</option>
                </Form.Select>
              </div>
              <div className="col-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Ref Number</Form.Label>
                <Form.Control value={form.referenceNumber} onChange={e => setForm({ ...form, referenceNumber: e.target.value })} style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} placeholder="Transaction ID" />
              </div>
            </div>
            <div className="d-flex gap-3 justify-content-end pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
              <Button variant="light" onClick={() => setShowCreate(false)} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 1.75rem' }}>Cancel</Button>
              <Button type="submit" disabled={submitting} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 2rem', background: '#4f46e5', border: 'none' }}>{submitting ? 'Recording...' : 'Record Payment'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PaymentManagement;
