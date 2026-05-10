import { useState, useEffect } from 'react';
import { getContracts, createContract, updateContract, getVendorTasks } from '../../../api/vendorApi';
import { getProjects } from '../../../api/projectApi';
import { toast } from '../../../utils/toast';
import StatusBadge from '../../../components/common/StatusBadge';
import StatCard from '../../../components/common/StatCard';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaFileSignature, FaFileContract, FaCheckCircle, FaExclamationCircle, FaPlus, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('ALL');
  
  const [form, setForm] = useState({ 
    projectId: '', taskId: '', value: '', 
    startDate: '', endDate: '', status: 'DRAFT' 
  });
  const [projects, setProjects] = useState([]);
  const [vendorTasks, setVendorTasks] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, pRes, vRes] = await Promise.all([
        getContracts().catch(err => { console.error('Contracts load failed:', err); return { data: [] }; }),
        getProjects().catch(err => { console.error('Projects load failed:', err); return { data: [] }; }),
        getVendorTasks().catch(err => { console.error('Vendor Tasks load failed:', err); return { data: [] }; })
      ]);
      
      const cData = cRes.data?.data || cRes.data?.content || (Array.isArray(cRes.data) ? cRes.data : []);
      setContracts(cData);
      
      let projList = pRes.data?.data || pRes.data?.content || (Array.isArray(pRes.data) ? pRes.data : []);
      const vTasks = vRes.data?.data || vRes.data?.content || (Array.isArray(vRes.data) ? vRes.data : []);
      setVendorTasks(vTasks);

      // Fallback: If projects list is empty/restricted, build from tasks
      if (projList.length === 0 && vTasks.length > 0) {
        const uniqueProjectIds = [...new Set(vTasks.map(t => t.projectId))];
        projList = uniqueProjectIds.map(id => ({ projectId: id, projectName: id }));
      }
      setProjects(projList);
    } catch (err) {
      toast.error('Failed to load contract data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Re-fetch when modal opens to ensure latest tasks are shown
  useEffect(() => {
    if (showCreate) fetchData();
  }, [showCreate]);

  const handleTaskChange = (taskId) => {
    if (!taskId) {
      setForm({ ...form, taskId: '' });
      return;
    }
    const selectedTask = vendorTasks.find(t => (t.assignedTaskId === taskId || t.taskId === taskId || t.id === taskId));
    if (selectedTask) {
      setForm({ ...form, taskId, projectId: selectedTask.projectId });
    } else {
      setForm({ ...form, taskId });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      projectId: form.projectId,
      taskId: form.taskId,
      value: Number(form.value),
      startDate: form.startDate,
      endDate: form.endDate,
      status: 'DRAFT'
    };
    try {
      await createContract(payload);
      toast.success('Contract proposal submitted');
      setShowCreate(false);
      setForm({ projectId: '', taskId: '', value: '', startDate: '', endDate: '', status: 'DRAFT' });
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.details || err.response?.data?.message || 'Failed to create contract';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateContract(id, { status: newStatus });
      toast.success('Status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filtered = contracts.filter(c => filter === 'ALL' || c.status === filter);

  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'ACTIVE').length,
    draft: contracts.filter(c => c.status === 'DRAFT').length,
    value: contracts.reduce((sum, c) => sum + (Number(c.value) || 0), 0)
  };

  return (
    <div>
      <PageHeader title="Contracts" subtitle="Create and manage project-linked vendor contracts">
        <RefreshButton onClick={fetchData} loading={loading} />
        <button
          onClick={() => setShowCreate(true)}
          className="btn btn-primary rounded-pill fw-bold d-flex align-items-center gap-2 px-4 shadow-sm border-0"
          style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', height: 44 }}
        >
          <FaPlus size={12} /> New Contract
        </button>
      </PageHeader>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <StatCard icon={FaFileContract} label="Total Contracts" value={stats.total} color="#6366f1" bgColor="#eef2ff" />
        <StatCard icon={FaCheckCircle} label="Active" value={stats.active} color="#10b981" bgColor="#d1fae5" />
        <StatCard icon={FaFileSignature} label="Drafts" value={stats.draft} color="#94a3b8" bgColor="#f1f5f9" />
        <StatCard icon={FaDollarSign} label="Total Value" value={`₹${stats.value.toLocaleString()}`} color="#f59e0b" bgColor="#fef3c7" />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <div className="p-3 border-bottom" style={{ borderColor: '#f1f5f9' }}>
          <div className="d-flex gap-2 bg-light p-1 rounded-pill w-fit-content">
            {['ALL', 'DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map(s => (
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
          <EmptyState icon={FaFileSignature} title="No contracts found" message="Start by creating a new project contract." actionLabel="New Contract" onAction={() => setShowCreate(true)} />
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contract Info</th>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Linked Project/Task</th>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Value</th>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</th>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.contractId || c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{c.contractId || c.id}</div>
                      <div className="text-muted small">Vendor: {c.vendorId || 'Self'}</div>
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div className="text-dark fw-medium" style={{ fontSize: '0.85rem' }}>{projects.find(p => p.projectId === c.projectId)?.projectName || c.projectId}</div>
                      {c.taskId && <div className="text-primary small fw-bold mt-1"><FaFileContract size={10} className="me-1" /> {c.taskId}</div>}
                    </td>
                    <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: '#10b981' }}>
                      ₹{Number(c.value || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div className="small text-muted"><FaCalendarAlt size={10} className="me-1" /> {new Date(c.startDate).toLocaleDateString()}</div>
                      <div className="small text-muted"><FaCalendarAlt size={10} className="me-1" /> {new Date(c.endDate).toLocaleDateString()}</div>
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.contractId || c.id, e.target.value)}
                        className="form-select form-select-sm border-0 fw-bold rounded-pill"
                        style={{ 
                          width: 'fit-content',
                          background: c.status === 'ACTIVE' ? '#d1fae5' : c.status === 'DRAFT' ? '#f1f5f9' : c.status === 'CANCELLED' ? '#fee2e2' : '#fef3c7',
                          color: c.status === 'ACTIVE' ? '#065f46' : c.status === 'DRAFT' ? '#475569' : c.status === 'CANCELLED' ? '#991b1b' : '#92400e'
                        }}
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
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
          <Modal.Title className="fw-bold h5">New Contract Proposal</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleCreate}>
            <div className="mb-3">
              <Form.Label className="small fw-bold text-uppercase opacity-75">Link to Assigned Task (Auto-fills Project)</Form.Label>
              <Form.Select value={form.taskId} onChange={e => handleTaskChange(e.target.value)} className="form-control border-0 bg-light p-3 rounded-4 shadow-none" style={{ height: 56 }}>
                <option value="">No task link (Manual selection)</option>
                {vendorTasks.map(t => {
                  const tId = t.taskId || t.assignedTaskId || t.id;
                  const tName = t.taskName || t.title || t.description?.split('.')[0] || 'Untitled Task';
                  return (
                    <option key={tId} value={tId}>
                      {tId} — {tName} ({t.projectId})
                    </option>
                  );
                })}
              </Form.Select>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Target Project</Form.Label>
                <Form.Select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4 shadow-none" style={{ height: 56 }}>
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}
                </Form.Select>
              </div>
              <div className="col-md-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Contract Value (₹)</Form.Label>
                <Form.Control type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4" style={{ height: 56 }} placeholder="0.00" />
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Start Date</Form.Label>
                <Form.Control type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4" style={{ height: 56 }} />
              </div>
              <div className="col-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">End Date</Form.Label>
                <Form.Control type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4" style={{ height: 56 }} />
              </div>
            </div>

            <div className="d-flex gap-3 justify-content-end pt-3">
              <Button variant="light" onClick={() => setShowCreate(false)} className="rounded-pill px-4 fw-bold border-0">Cancel</Button>
              <Button type="submit" disabled={submitting} className="rounded-pill px-5 fw-bold border-0 shadow-lg" style={{ background: '#4f46e5' }}>
                {submitting ? 'Creating...' : 'Submit Proposal'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Contracts;
