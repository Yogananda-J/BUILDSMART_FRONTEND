import { useState, useEffect } from 'react';
import { getIssues, createIssue, updateIssueStatus, assignIssue } from '../../../api/siteApi';
import { getProjects } from '../../../api/projectApi';
import { getAllUsers } from '../../../api/adminApi';
import { toast } from '../../../utils/toast';
import StatusBadge from '../../../components/common/StatusBadge';
import StatCard from '../../../components/common/StatCard';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaExclamationTriangle, FaBug, FaCheckCircle, FaPlus, FaCalendarAlt, FaUser } from 'react-icons/fa';

const IssueManagement = () => {
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('ALL');
  
  const [form, setForm] = useState({ projectId: '', issueType: 'QUALITY', severity: 'MEDIUM', description: '', location: '', assignedToId: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [iRes, pRes, uRes] = await Promise.all([
        getIssues().catch(() => ({ data: [] })),
        getProjects().catch((err) => {
          console.warn('Projects restricted for this role', err);
          return { data: [] };
        }),
        getAllUsers().catch((err) => {
          console.warn('User list restricted for this role', err);
          return { data: [] };
        })
      ]);
      setIssues(Array.isArray(iRes.data) ? iRes.data : (iRes.data?.data || iRes.data?.content || []));
      setProjects(Array.isArray(pRes.data) ? pRes.data : (pRes.data?.data || pRes.data?.content || []));
      
      const usersData = uRes.data?.content || uRes.data?.data || uRes.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      toast.error('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createIssue({
        projectId: form.projectId,
        issueType: form.issueType,
        severity: form.severity,
        description: form.description,
        location: form.location
      });
      
      const issueId = res.data?.issueId || res.data?.id;
      if (issueId && form.assignedToId) {
        await assignIssue(issueId, { assignedToId: form.assignedToId });
      }

      toast.success('Issue reported successfully');
      setShowCreate(false);
      setForm({ projectId: '', issueType: 'QUALITY', severity: 'MEDIUM', description: '', location: '', assignedToId: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to report issue');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateIssueStatus(id, newStatus);
      toast.success('Status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const safeIssues = Array.isArray(issues) ? issues : [];
  const filtered = safeIssues.filter(i => filter === 'ALL' || i.status === filter);

  const stats = {
    total: safeIssues.length,
    open: safeIssues.filter(i => i.status === 'OPEN' || i.status === 'INVESTIGATING').length,
    critical: safeIssues.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH').length
  };

  return (
    <div>
      <PageHeader title="Issue Management" subtitle="Report and track site issues, blockers, and defects">
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
          <FaPlus size={12} /> Report Issue
        </button>
      </PageHeader>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <StatCard icon={FaBug} label="Total Issues" value={stats.total} color="#6366f1" bgColor="#eef2ff" />
        <StatCard icon={FaExclamationTriangle} label="Open Issues" value={stats.open} color="#f59e0b" bgColor="#fef3c7" />
        <StatCard icon={FaCheckCircle} label="High / Critical" value={stats.critical} color="#b91c1c" bgColor="#fef2f2" />
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
          <EmptyState icon={FaCheckCircle} title="No issues found" message="No issues match the current filter. Great job!" actionLabel="Report Issue" onAction={() => setShowCreate(true)} />
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Details</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assignment</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Severity</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(i => (
                  <tr key={i.issueId || i.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem' }}>
                      <div className="d-flex align-items-center gap-2 mb-1" style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        <FaCalendarAlt size={12} className="text-muted" />
                        {new Date(i.createdAt).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>{i.issueType?.replace('_', ' ')}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{i.description}</div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
                      {projects.find(p => p.projectId === i.projectId)?.projectName || i.projectId}
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400 }}>{i.location}</div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                      {i.assignedToId ? (
                        <span className="d-flex align-items-center gap-1"><FaUser size={10} /> {users.find(u => u.userId === i.assignedToId)?.name || i.assignedToId}</span>
                      ) : 'Unassigned'}
                    </td>
                    <td style={{ padding: '1rem' }}><StatusBadge status={i.severity} label={i.severity} size="sm" /></td>
                    <td style={{ padding: '1rem' }}>
                      <select
                        value={i.status}
                        onChange={(e) => handleStatusChange(i.issueId || i.id, e.target.value)}
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
          <Modal.Title style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>Report Site Issue</Modal.Title>
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
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Issue Type</Form.Label>
                <Form.Select value={form.issueType} onChange={e => setForm({ ...form, issueType: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }}>
                  <option value="QUALITY">Quality Defect</option>
                  <option value="MATERIAL_SHORTAGE">Material Shortage</option>
                  <option value="EQUIPMENT_BREAKDOWN">Equipment Breakdown</option>
                  <option value="WEATHER_DELAY">Weather Delay</option>
                  <option value="DESIGN_DISCREPANCY">Design Discrepancy</option>
                </Form.Select>
              </div>
              <div className="col-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Severity</Form.Label>
                <Form.Select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </Form.Select>
              </div>
            </div>
            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Assign To (Optional)</Form.Label>
              <Form.Select value={form.assignedToId} onChange={e => setForm({ ...form, assignedToId: e.target.value })} style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }}>
                <option value="">Unassigned</option>
                {users.map(u => <option key={u.userId} value={u.userId}>{u.name} ({u.role})</option>)}
              </Form.Select>
            </div>
            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Location</Form.Label>
              <Form.Control value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} placeholder="Specific site location" />
            </div>
            <div className="mb-4">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required style={{ borderRadius: 16, background: '#f8fafc' }} placeholder="Describe the issue..." />
            </div>
            <div className="d-flex gap-3 justify-content-end pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
              <Button variant="light" onClick={() => setShowCreate(false)} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 1.75rem' }}>Cancel</Button>
              <Button type="submit" disabled={submitting} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 2rem', background: '#ef4444', border: 'none' }}>{submitting ? 'Submitting...' : 'Report Issue'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default IssueManagement;
