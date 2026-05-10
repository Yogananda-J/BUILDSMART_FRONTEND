import { useState, useEffect } from 'react';
import { getInvoices, createInvoice, updateInvoice } from '../../../api/vendorApi';
import { toast } from '../../../utils/toast';
import StatusBadge from '../../../components/common/StatusBadge';
import StatCard from '../../../components/common/StatCard';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaFileInvoiceDollar, FaCheckCircle, FaExclamationCircle, FaPlus, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('ALL');
  
  const [form, setForm] = useState({ 
    contractId: '', invoiceNumber: '', amount: '', dueDate: '', status: 'DRAFT' 
  });
  const [contracts, setContracts] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [iRes, cRes] = await Promise.all([
        getInvoices().catch(() => ({ data: [] })),
        getContracts().catch(() => ({ data: [] }))
      ]);
      const invData = iRes.data?.data || iRes.data?.content || (Array.isArray(iRes.data) ? iRes.data : []);
      setInvoices(invData);
      const conData = cRes.data?.data || cRes.data?.content || (Array.isArray(cRes.data) ? cRes.data : []);
      setContracts(conData);
    } catch (err) {
      toast.error('Failed to load invoice data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...form,
      amount: Number(form.amount)
    };
    try {
      await createInvoice(payload);
      toast.success('Invoice draft created successfully');
      setShowCreate(false);
      setForm({ contractId: '', invoiceNumber: '', amount: '', dueDate: '', status: 'DRAFT' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitApproval = async (id) => {
    try {
      await submitInvoice(id);
      toast.success('Invoice submitted to Finance for approval');
      fetchData();
    } catch (err) {
      toast.error('Failed to submit invoice');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateInvoice(id, { status: newStatus });
      toast.success('Status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filtered = invoices.filter(i => filter === 'ALL' || i.status === filter);

  const stats = {
    total: invoices.reduce((sum, i) => sum + (Number(i.amount) || 0), 0),
    paid: invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + (Number(i.amount) || 0), 0),
    pending: invoices.filter(i => ['PENDING', 'SUBMITTED', 'APPROVED'].includes(i.status)).reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
  };

  return (
    <div>
      <PageHeader title="Invoices" subtitle="Generate and track payment requests for your contracts">
        <RefreshButton onClick={fetchData} loading={loading} />
        <button
          onClick={() => setShowCreate(true)}
          className="btn btn-primary rounded-pill fw-bold d-flex align-items-center gap-2 px-4 shadow-sm border-0"
          style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', height: 44 }}
        >
          <FaPlus size={12} /> Create Invoice
        </button>
      </PageHeader>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <StatCard icon={FaFileInvoiceDollar} label="Total Invoiced" value={`₹${stats.total.toLocaleString()}`} color="#3b82f6" bgColor="#dbeafe" />
        <StatCard icon={FaCheckCircle} label="Total Paid" value={`₹${stats.paid.toLocaleString()}`} color="#10b981" bgColor="#d1fae5" />
        <StatCard icon={FaExclamationCircle} label="Outstanding" value={`₹${stats.pending.toLocaleString()}`} color="#f59e0b" bgColor="#fef3c7" />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <div className="p-3 border-bottom" style={{ borderColor: '#f1f5f9' }}>
          <div className="d-flex gap-2 bg-light p-1 rounded-pill w-fit-content">
            {['ALL', 'DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  padding: '0.4rem 1.25rem', borderRadius: '50rem', border: 'none',
                  fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
                  background: filter === s ? '#fff' : 'transparent',
                  color: filter === s ? '#4f46e5' : '#64748b',
                  boxShadow: filter === s ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {s === 'ALL' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: '#6366f1' }} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={FaFileInvoiceDollar} title="No invoices found" message="Create an invoice to request payment for your work." actionLabel="Create Invoice" onAction={() => setShowCreate(true)} />
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Invoice Details</th>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contract Reference</th>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Date</th>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(i => (
                  <tr key={i.invoiceId || i.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{i.invoiceNumber}</div>
                      <div className="text-muted small">ID: {i.invoiceId || i.id}</div>
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div className="text-dark fw-medium" style={{ fontSize: '0.85rem' }}>{i.contractId}</div>
                    </td>
                    <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: '#334155' }}>
                      ₹{Number(i.amount).toLocaleString()}
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div className={`small ${new Date(i.dueDate) < new Date() && i.status !== 'PAID' ? 'text-danger fw-bold' : 'text-muted'}`}>
                        <FaCalendarAlt size={10} className="me-1" /> {new Date(i.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div className="d-flex align-items-center gap-2">
                        <StatusBadge status={i.status} size="sm" />
                        {i.status === 'DRAFT' && (
                          <button 
                            onClick={() => handleSubmitApproval(i.invoiceId || i.id)}
                            className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 border-2 fw-bold"
                            style={{ fontSize: '0.7rem' }}
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold h5">Create Invoice Draft</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleCreate}>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Contract Reference</Form.Label>
                <Form.Select value={form.contractId} onChange={e => setForm({ ...form, contractId: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4 shadow-none" style={{ height: 56 }}>
                  <option value="">Select Contract</option>
                  {contracts.map(c => <option key={c.contractId || c.id} value={c.contractId || c.id}>{c.contractId || c.id}</option>)}
                </Form.Select>
              </div>
              <div className="col-md-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Invoice Number</Form.Label>
                <Form.Control value={form.invoiceNumber} onChange={e => setForm({ ...form, invoiceNumber: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4" style={{ height: 56 }} placeholder="e.g. INV-2026-001" />
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Amount (₹)</Form.Label>
                <Form.Control type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4" style={{ height: 56 }} placeholder="0.00" />
              </div>
              <div className="col-md-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Due Date</Form.Label>
                <Form.Control type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4" style={{ height: 56 }} />
              </div>
            </div>

            <div className="d-flex gap-3 justify-content-end pt-3">
              <Button variant="light" onClick={() => setShowCreate(false)} className="rounded-pill px-4 fw-bold border-0">Cancel</Button>
              <Button type="submit" disabled={submitting} className="rounded-pill px-5 fw-bold border-0 shadow-lg" style={{ background: '#4f46e5' }}>
                {submitting ? 'Creating...' : 'Create Draft'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Invoices;
