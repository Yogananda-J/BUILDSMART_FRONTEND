import { useState, useEffect } from 'react';
import { getInspections, createInspection, updateInspectionStatus, getInspectionTypes, getSafetyTasks } from '../../../api/safetyApi';
import { getProjects } from '../../../api/projectApi';
import { toast } from '../../../utils/toast';
import StatusBadge from '../../../components/common/StatusBadge';
import StatCard from '../../../components/common/StatCard';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaClipboardCheck, FaExclamationTriangle, FaCalendarCheck, FaPlus, FaCalendarAlt } from 'react-icons/fa';

const Inspections = () => {
  const [inspections, setInspections] = useState([]);
  const [projects, setProjects] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('ALL');
  
  const [form, setForm] = useState({ projectId: '', inspectionType: 'FIRE_SAFETY', assignedTaskId: '', findings: '' });
  const [safetyTasksList, setSafetyTasksList] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [iRes, pRes, sRes] = await Promise.all([
        getInspections().catch(() => ({ data: [] })),
        getProjects().catch(() => ({ data: [] })),
        getSafetyTasks().catch(() => ({ data: [] }))
      ]);
      
      const inspList = iRes.data?.data || iRes.data?.content || (Array.isArray(iRes.data) ? iRes.data : []);
      setInspections(inspList);
      
      let projList = pRes.data?.data || pRes.data?.content || (Array.isArray(pRes.data) ? pRes.data : []);
      const safetyTasks = sRes.data?.data || sRes.data?.content || (Array.isArray(sRes.data) ? sRes.data : []);
      setSafetyTasksList(safetyTasks);

      // If official projects list is empty (e.g. role restricted), build it from tasks
      if (projList.length === 0 && safetyTasks.length > 0) {
        const uniqueProjectIds = [...new Set(safetyTasks.map(t => t.projectId))];
        projList = uniqueProjectIds.map(id => ({ projectId: id, projectName: id }));
      }
      setProjects(projList);
      
      setTypes([
        'FIRE_SAFETY', 'SCAFFOLDING_SAFETY', 'ELECTRICAL_SAFETY', 
        'EQUIPMENT_INSPECTION', 'HOUSEKEEPING', 'HAZARDOUS_MATERIALS', 
        'FIRST_AID_READINESS', 'EXCAVATION_SAFETY', 'EMERGENCY_EXIT_CHECK', 'PPE_COMPLIANCE'
      ]);
    } catch (err) {
      toast.error('Failed to load inspections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Sync Project ID when Task is selected
  const handleTaskChange = (taskId) => {
    if (!taskId) {
      setForm({ ...form, assignedTaskId: '' });
      return;
    }
    const selectedTask = safetyTasksList.find(t => (t.assignedTaskId === taskId || t.taskId === taskId || t.id === taskId));
    if (selectedTask) {
      setForm({ ...form, assignedTaskId: taskId, projectId: selectedTask.projectId });
    } else {
      setForm({ ...form, assignedTaskId: taskId });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (form.findings.length < 20 || form.findings.length > 200) {
      return toast.error('Findings must be between 20 and 200 characters.');
    }
    setSubmitting(true);
    
    const payload = {
      projectId: form.projectId,
      inspectionType: form.inspectionType,
      findings: form.findings,
      assignedTaskId: form.assignedTaskId || null
    };

    try {
      await createInspection(payload);
      
      // Update linked task status if applicable
      if (form.assignedTaskId) {
        await updateSafetyTaskStatus(form.assignedTaskId, { status: 'IN_PROGRESS' }).catch(() => {});
      }

      toast.success('Inspection created successfully');
      setShowCreate(false);
      setForm({ projectId: '', inspectionType: 'ROUTINE', assignedTaskId: '', findings: '' });
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.details || err.response?.data?.message || 'Failed to create inspection';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateInspectionStatus(id, newStatus);
      toast.success('Status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filtered = inspections.filter(i => filter === 'ALL' || i.status === filter);

  const stats = {
    total: inspections.length,
    completed: inspections.filter(i => i.status === 'COMPLETED').length,
    pending: inspections.filter(i => i.status === 'SCHEDULED' || i.status === 'IN_PROGRESS').length
  };

  return (
    <div>
      <PageHeader title="Safety Inspections" subtitle="Schedule inspections and link them to project tasks">
        <RefreshButton onClick={fetchData} loading={loading} />
        <button
          onClick={() => setShowCreate(true)}
          className="btn btn-primary rounded-pill fw-bold d-flex align-items-center gap-2 px-4 shadow-sm border-0"
          style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', height: 44 }}
        >
          <FaPlus size={12} /> New Inspection
        </button>
      </PageHeader>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <StatCard icon={FaClipboardCheck} label="Total Inspections" value={stats.total} color="#3b82f6" bgColor="#dbeafe" />
        <StatCard icon={FaCalendarCheck} label="Completed" value={stats.completed} color="#10b981" bgColor="#d1fae5" />
        <StatCard icon={FaExclamationTriangle} label="Pending / Scheduled" value={stats.pending} color="#f59e0b" bgColor="#fef3c7" />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        <div className="p-3 border-bottom" style={{ borderColor: '#f1f5f9' }}>
          <div className="d-flex gap-2 bg-light p-1 rounded-pill w-fit-content">
            {['ALL', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: '0.4rem 1.25rem', borderRadius: '50rem', border: 'none',
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
          <EmptyState icon={FaClipboardCheck} title="No inspections found" message="No inspections match the current filter." actionLabel="New Inspection" onAction={() => setShowCreate(true)} />
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inspection Details</th>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Linked Project</th>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Linked Task</th>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(i => (
                  <tr key={i.inspectionId || i.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{i.inspectionType?.replace('_', ' ')}</div>
                      <div className="text-muted small">
                        <FaCalendarAlt size={11} className="me-1" />
                        {new Date(i.date || i.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div className="text-dark fw-medium" style={{ fontSize: '0.85rem' }}>{projects.find(p => p.projectId === i.projectId)?.projectName || i.projectId}</div>
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      {i.assignedTaskId ? (
                        <div className="badge bg-light text-primary border-0 rounded-pill px-3 py-2">
                          <FaCalendarCheck size={11} className="me-1" /> {i.assignedTaskId}
                        </div>
                      ) : <span className="text-muted small">—</span>}
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <select
                        value={i.status}
                        onChange={(e) => handleStatusChange(i.inspectionId || i.id, e.target.value)}
                        className="form-select form-select-sm border-0 fw-bold rounded-pill"
                        style={{ 
                          width: 'fit-content',
                          background: i.status === 'COMPLETED' ? '#d1fae5' : i.status === 'CANCELLED' ? '#fee2e2' : i.status === 'SCHEDULED' ? '#dbeafe' : '#fef3c7',
                          color: i.status === 'COMPLETED' ? '#065f46' : i.status === 'CANCELLED' ? '#991b1b' : i.status === 'SCHEDULED' ? '#1e40af' : '#92400e'
                        }}
                      >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="IN_PROGRESS">In Progress</option>
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
          <Modal.Title className="fw-bold h5">New Safety Inspection</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleCreate}>
            <div className="mb-3">
              <Form.Label className="small fw-bold text-uppercase opacity-75">Link to Assigned Task (Auto-fills Project)</Form.Label>
              <Form.Select value={form.assignedTaskId} onChange={e => handleTaskChange(e.target.value)} className="form-control border-0 bg-light p-3 rounded-4 shadow-none" style={{ height: 56 }}>
                <option value="">No task link (Manual project selection)</option>
                {safetyTasksList.map(t => (
                  <option key={t.assignedTaskId || t.taskId || t.id} value={t.assignedTaskId || t.taskId || t.id}>
                    {t.assignedTaskId || t.taskId || t.id} — {t.description} ({t.projectId})
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Project</Form.Label>
                <Form.Select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4 shadow-none" style={{ height: 56 }}>
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}
                </Form.Select>
              </div>
              <div className="col-md-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Inspection Type</Form.Label>
                <Form.Select value={form.inspectionType} onChange={e => setForm({ ...form, inspectionType: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4 shadow-none" style={{ height: 56 }}>
                  {types.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </Form.Select>
              </div>
            </div>

            <div className="mb-4">
              <Form.Label className="small fw-bold text-uppercase opacity-75">Findings (20-200 characters)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={form.findings} 
                onChange={e => setForm({ ...form, findings: e.target.value })} 
                required 
                className="form-control border-0 bg-light p-3 rounded-4" 
                placeholder="Detail your safety findings here..."
              />
              <div className="d-flex justify-content-between text-muted small mt-1 px-2">
                <span>{form.findings.length < 20 ? 'Min 20 characters required' : ''}</span>
                <span>{form.findings.length}/200</span>
              </div>
            </div>

            <div className="d-flex gap-3 justify-content-end pt-3">
              <Button variant="light" onClick={() => setShowCreate(false)} className="rounded-pill px-4 fw-bold border-0">Cancel</Button>
              <Button type="submit" disabled={submitting} className="rounded-pill px-5 fw-bold border-0 shadow-lg" style={{ background: '#4f46e5' }}>
                {submitting ? 'Creating...' : 'Create Inspection'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Inspections;
