import { useState, useEffect } from 'react';
import { getDeliveries, createDelivery, updateDelivery } from '../../../api/vendorApi';
import { toast } from '../../../utils/toast';
import StatusBadge from '../../../components/common/StatusBadge';
import StatCard from '../../../components/common/StatCard';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaTruck, FaBoxOpen, FaClipboardCheck, FaPlus, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('ALL');
  
  const [form, setForm] = useState({ 
    contractId: '', materialType: '', quantity: '', expectedDate: '', deliveryLocation: '', driverDetails: '' 
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getDeliveries();
      setDeliveries(res.data || []);
    } catch (err) {
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createDelivery(form);
      toast.success('Delivery scheduled successfully');
      setShowCreate(false);
      setForm({ contractId: '', materialType: '', quantity: '', expectedDate: '', deliveryLocation: '', driverDetails: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule delivery');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDelivery(id, { status: newStatus });
      toast.success('Delivery status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filtered = deliveries.filter(d => filter === 'ALL' || d.status === filter);

  const stats = {
    total: deliveries.length,
    delivered: deliveries.filter(d => d.status === 'DELIVERED').length,
    pending: deliveries.filter(d => d.status === 'SCHEDULED' || d.status === 'IN_TRANSIT').length
  };

  return (
    <div>
      <PageHeader title="Material Deliveries" subtitle="Schedule and track material deliveries to sites">
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
          <FaPlus size={12} /> Schedule Delivery
        </button>
      </PageHeader>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <StatCard icon={FaTruck} label="Total Deliveries" value={stats.total} color="#3b82f6" bgColor="#dbeafe" />
        <StatCard icon={FaClipboardCheck} label="Delivered" value={stats.delivered} color="#10b981" bgColor="#d1fae5" />
        <StatCard icon={FaBoxOpen} label="Scheduled / In Transit" value={stats.pending} color="#f59e0b" bgColor="#fef3c7" />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        <div className="p-4" style={{ borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '0.4rem', borderRadius: '50rem' }}>
            {['ALL', 'SCHEDULED', 'IN_TRANSIT', 'DELIVERED', 'DELAYED'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: '50rem', border: 'none',
                  fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
                  background: filter === status ? '#fff' : 'transparent',
                  color: filter === status ? '#4f46e5' : '#64748b',
                  boxShadow: filter === status ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
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
          <EmptyState icon={FaTruck} title="No deliveries found" message="No deliveries match the current filter." actionLabel="Schedule Delivery" onAction={() => setShowCreate(true)} />
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date & Contract</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Material & Quantity</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location & Driver</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.deliveryId || d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem' }}>
                      <div className="d-flex align-items-center gap-2 mb-1" style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                        <FaCalendarAlt size={12} className="text-muted" />
                        {new Date(d.expectedDate).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>Ref: {d.contractId}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>{d.materialType}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Qty: <span style={{ fontWeight: 600 }}>{d.quantity}</span></div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div className="d-flex align-items-start gap-2 mb-1" style={{ fontSize: '0.8rem', color: '#334155' }}>
                        <FaMapMarkerAlt size={10} className="text-muted mt-1" />
                        <span>{d.deliveryLocation}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Driver: {d.driverDetails || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <select
                        value={d.status}
                        onChange={(e) => handleStatusChange(d.deliveryId || d.id, e.target.value)}
                        style={{ padding: '0.3rem 0.5rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.75rem', background: '#f8fafc', fontWeight: 600, color: '#475569' }}
                      >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="IN_TRANSIT">In Transit</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="DELAYED">Delayed</option>
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
          <Modal.Title style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>Schedule Delivery</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleCreate}>
            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Contract Reference ID</Form.Label>
              <Form.Control value={form.contractId} onChange={e => setForm({ ...form, contractId: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} placeholder="e.g. C-12345" />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Material Type</Form.Label>
                <Form.Control value={form.materialType} onChange={e => setForm({ ...form, materialType: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} placeholder="e.g. Steel Rebar" />
              </div>
              <div className="col-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Quantity & Unit</Form.Label>
                <Form.Control value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} placeholder="e.g. 50 Tons" />
              </div>
            </div>
            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Expected Date</Form.Label>
              <Form.Control type="date" value={form.expectedDate} onChange={e => setForm({ ...form, expectedDate: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} />
            </div>
            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Delivery Location</Form.Label>
              <Form.Control value={form.deliveryLocation} onChange={e => setForm({ ...form, deliveryLocation: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} placeholder="Site address or zone" />
            </div>
            <div className="mb-4">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Driver Details / Vehicle No. (Optional)</Form.Label>
              <Form.Control value={form.driverDetails} onChange={e => setForm({ ...form, driverDetails: e.target.value })} style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} />
            </div>
            <div className="d-flex gap-3 justify-content-end pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
              <Button variant="light" onClick={() => setShowCreate(false)} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 1.75rem' }}>Cancel</Button>
              <Button type="submit" disabled={submitting} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 2rem', background: '#4f46e5', border: 'none' }}>{submitting ? 'Scheduling...' : 'Schedule Delivery'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Deliveries;
