import { useState, useEffect } from 'react';
import { getIncidents, createIncident, updateIncidentStatus } from '../../../api/safetyApi';
import { getProjects } from '../../../api/projectApi';
import { toast } from '../../../utils/toast';
import StatusBadge from '../../../components/common/StatusBadge';
import StatCard from '../../../components/common/StatCard';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaAmbulance, FaExclamationCircle, FaCheckCircle, FaPlus, FaCalendarAlt } from 'react-icons/fa';

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [safetyTasks, setSafetyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('ALL');
  
  const [form, setForm] = useState({ projectId: '', severity: 'LOW', description: '', location: '', assignedTaskId: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [iRes, pRes, sRes] = await Promise.all([
        getIncidents().catch(() => ({ data: [] })),
        getProjects().catch(() => ({ data: [] })),
        getSafetyTasks().catch(() => ({ data: [] }))
      ]);
      setIncidents(iRes.data?.data || iRes.data?.content || (Array.isArray(iRes.data) ? iRes.data : []));
      
      let projList = pRes.data?.data || pRes.data?.content || (Array.isArray(pRes.data) ? pRes.data : []);
      const safetyTasksData = sRes.data?.data || sRes.data?.content || (Array.isArray(sRes.data) ? sRes.data : []);
      setSafetyTasks(safetyTasksData);

      // Fallback projects from tasks if list is empty
      if (projList.length === 0 && safetyTasksData.length > 0) {
        const uniqueProjectIds = [...new Set(safetyTasksData.map(t => t.projectId))];
        projList = uniqueProjectIds.map(id => ({ projectId: id, projectName: id }));
      }
      setProjects(projList);
    } catch (err) {
      toast.error('Failed to load incident data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleTaskChange = (taskId) => {
    if (!taskId) {
      setForm({ ...form, assignedTaskId: '' });
      return;
    }
    const selectedTask = safetyTasks.find(t => (t.assignedTaskId === taskId || t.taskId === taskId || t.id === taskId));
    if (selectedTask) {
      setForm({ ...form, assignedTaskId: taskId, projectId: selectedTask.projectId });
    } else {
      setForm({ ...form, assignedTaskId: taskId });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Payload aligned with Section 3.2
    const payload = {
      projectId: form.projectId,
      description: form.description,
      severity: form.severity,
      location: form.location
    };

    try {
      await createIncident(payload);
      toast.success('Incident reported successfully');
      setShowCreate(false);
      setForm({ projectId: '', severity: 'LOW', description: '', location: '', assignedTaskId: '' });
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.details || err.response?.data?.message || 'Failed to report incident';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateIncidentStatus(id, newStatus);
      toast.success('Status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const safeIncidents = Array.isArray(incidents) ? incidents : [];
  const filtered = safeIncidents.filter(i => filter === 'ALL' || i.status === filter);

  const stats = {
    total: safeIncidents.length,
    open: safeIncidents.filter(i => i.status === 'OPEN' || i.status === 'INVESTIGATING').length,
    critical: safeIncidents.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH').length
  };

  return (
    <div>
      <PageHeader title="Incident Reporting" subtitle="Log and track safety incidents and hazards">
        <RefreshButton onClick={fetchData} loading={loading} />
        <button
          onClick={() => setShowCreate(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0.6rem 1.25rem', borderRadius: '50rem',
            background: '#ef4444', color: '#fff', border: 'none',
            fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
          }}
        >
          <FaPlus size={12} /> Report Incident
        </button>
      </PageHeader>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <StatCard icon={FaAmbulance} label="Total Incidents" value={stats.total} color="#ef4444" bgColor="#fef2f2" />
        <StatCard icon={FaExclamationCircle} label="Open / Investigating" value={stats.open} color="#f59e0b" bgColor="#fef3c7" />
        <StatCard icon={FaCheckCircle} label="High / Critical Severity" value={stats.critical} color="#b91c1c" bgColor="#fef2f2" />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        <div className="p-4" style={{ borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '0.4rem', borderRadius: '50rem' }}>
            {['ALL', 'OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED'].map(status => (
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
          <EmptyState icon={FaCheckCircle} title="No incidents found" message="No incidents match the current filter. Safety first!" actionLabel="Report Incident" onAction={() => setShowCreate(true)} />
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date & Location</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Severity</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(i => (
                  <tr key={i.incidentId || i.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem' }}>
                      <div className="d-flex align-items-center gap-2 mb-1" style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        <FaCalendarAlt size={12} className="text-muted" />
                        {new Date(i.incidentDate || i.createdAt).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>{i.location || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
                      {projects.find(p => p.projectId === i.projectId)?.projectName || i.projectId}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{i.description}</div>
                    </td>
                    <td style={{ padding: '1rem' }}><StatusBadge status={i.severity} label={i.severity} size="sm" /></td>
                    <td style={{ padding: '1rem' }}>
                      <select
                        value={i.status}
                        onChange={(e) => handleStatusChange(i.incidentId || i.id, e.target.value)}
                        style={{ padding: '0.3rem 0.5rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.75rem', background: '#f8fafc', fontWeight: 600, color: '#475569' }}
                      >
                        <option value="OPEN">Open</option>
                        <option value="INVESTIGATING">Investigating</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
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
          <Modal.Title style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>Report Incident</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleCreate}>
            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Link to Assigned Task (Auto-fills Project)</Form.Label>
              <Form.Select value={form.assignedTaskId} onChange={e => handleTaskChange(e.target.value)} style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }}>
                <option value="">No task link (Manual selection)</option>
                {safetyTasks.map(t => (
                  <option key={t.assignedTaskId || t.taskId || t.id} value={t.assignedTaskId || t.taskId || t.id}>
                    {t.assignedTaskId || t.taskId || t.id} — {t.description} ({t.projectId})
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Project</Form.Label>
              <Form.Select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }}>
                <option value="">Select Project</option>
                {projects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}
              </Form.Select>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Severity</Form.Label>
                <Form.Select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </Form.Select>
              </div>
              <div className="col-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Location</Form.Label>
                <Form.Control value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} placeholder="Specific site location" />
              </div>
            </div>

            <div className="mb-4">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required style={{ borderRadius: 16, background: '#f8fafc' }} placeholder="Describe what happened..." />
            </div>
            <div className="d-flex gap-3 justify-content-end pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
              <Button variant="light" onClick={() => setShowCreate(false)} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 1.75rem' }}>Cancel</Button>
              <Button type="submit" disabled={submitting} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 2rem', background: '#ef4444', border: 'none' }}>{submitting ? 'Submitting...' : 'Report Incident'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Incidents;
