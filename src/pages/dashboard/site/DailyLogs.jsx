import { useState, useEffect } from 'react';
import { getSiteLogs, createSiteLog, submitSiteLog, uploadSiteLogPhoto } from '../../../api/siteApi';
import { getProjects } from '../../../api/projectApi';
import { toast } from '../../../utils/toast';
import StatusBadge from '../../../components/common/StatusBadge';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaBook, FaPlus, FaCamera, FaCalendarAlt, FaCloudUploadAlt } from 'react-icons/fa';

const DailyLogs = () => {
  const [logs, setLogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('ALL');
  
  const [form, setForm] = useState({ 
    projectId: '', logDate: new Date().toISOString().split('T')[0], 
    weatherCondition: 'SUNNY', temperature: '', 
    activitiesPerformed: '', issuesEncountered: '' 
  });
  const [photo, setPhoto] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lRes, pRes] = await Promise.all([
        getSiteLogs().catch(() => ({ data: [] })),
        getProjects().catch((err) => {
          console.warn('Projects restricted for this role', err);
          return { data: [] };
        })
      ]);
      setLogs(Array.isArray(lRes.data) ? lRes.data : (lRes.data?.data || lRes.data?.content || []));
      setProjects(Array.isArray(pRes.data) ? pRes.data : (pRes.data?.data || pRes.data?.content || []));
    } catch (err) {
      toast.error('Failed to load daily logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createSiteLog(form);
      const logId = res.data?.logId || res.data?.id;

      if (photo && logId) {
        const formData = new FormData();
        formData.append('file', photo);
        await uploadSiteLogPhoto(logId, formData);
      }

      toast.success('Daily log saved as draft');
      setShowCreate(false);
      setForm({ 
        projectId: '', logDate: new Date().toISOString().split('T')[0], 
        weatherCondition: 'SUNNY', temperature: '', 
        activitiesPerformed: '', issuesEncountered: '' 
      });
      setPhoto(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create log');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitLog = async (id) => {
    try {
      await submitSiteLog(id);
      toast.success('Log submitted for approval');
      fetchData();
    } catch (err) {
      toast.error('Failed to submit log');
    }
  };

  const safeLogs = Array.isArray(logs) ? logs : [];
  const filtered = safeLogs.filter(l => filter === 'ALL' || l.status === filter);

  return (
    <div>
      <PageHeader title="Daily Site Logs" subtitle="Record daily activities, weather, and site conditions">
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
          <FaPlus size={12} /> New Log Entry
        </button>
      </PageHeader>

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        <div className="p-4" style={{ borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '0.4rem', borderRadius: '50rem' }}>
            {['ALL', 'DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'].map(status => (
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
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: '#6366f1' }} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={FaBook} title="No logs found" message="Start recording your daily site activities." actionLabel="New Log Entry" onAction={() => setShowCreate(true)} />
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weather</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Activities summary</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.logId || l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                      <div className="d-flex align-items-center gap-2">
                        <FaCalendarAlt size={12} className="text-muted" />
                        {new Date(l.logDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
                      {projects.find(p => p.projectId === l.projectId)?.projectName || l.projectId}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#334155' }}>
                      {l.weatherCondition?.replace('_', ' ')} <span className="text-muted">({l.temperature}°C)</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.85rem', color: '#334155', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{l.activitiesPerformed}</div>
                    </td>
                    <td style={{ padding: '1rem' }}><StatusBadge status={l.status || 'DRAFT'} size="sm" /></td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {(!l.status || l.status === 'DRAFT') && (
                        <button
                          onClick={() => handleSubmitLog(l.logId || l.id)}
                          style={{ padding: '0.35rem 0.75rem', background: '#eef2ff', color: '#4f46e5', border: 'none', borderRadius: '50rem', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        >
                          <FaCloudUploadAlt size={12} /> Submit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0" style={{ padding: '1.5rem 1.5rem 0.5rem' }}>
          <Modal.Title style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>New Daily Log</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleCreate}>
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Project</Form.Label>
                <Form.Select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }}>
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}
                </Form.Select>
              </div>
              <div className="col-12 col-md-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Date</Form.Label>
                <Form.Control type="date" value={form.logDate} onChange={e => setForm({ ...form, logDate: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} />
              </div>
            </div>
            
            <div className="row g-3 mb-4">
              <div className="col-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Weather Condition</Form.Label>
                <Form.Select value={form.weatherCondition} onChange={e => setForm({ ...form, weatherCondition: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }}>
                  <option value="SUNNY">Sunny</option>
                  <option value="CLOUDY">Cloudy</option>
                  <option value="RAINY">Rainy</option>
                  <option value="SNOWY">Snowy</option>
                  <option value="WINDY">Windy</option>
                  <option value="EXTREME">Extreme Conditions</option>
                </Form.Select>
              </div>
              <div className="col-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Temperature (°C)</Form.Label>
                <Form.Control type="number" step="0.1" value={form.temperature} onChange={e => setForm({ ...form, temperature: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} placeholder="e.g. 25.5" />
              </div>
            </div>

            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Activities Performed</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.activitiesPerformed} onChange={e => setForm({ ...form, activitiesPerformed: e.target.value })} required style={{ borderRadius: 16, background: '#f8fafc' }} placeholder="Detail the work completed today..." />
            </div>
            
            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Issues Encountered</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.issuesEncountered} onChange={e => setForm({ ...form, issuesEncountered: e.target.value })} style={{ borderRadius: 16, background: '#f8fafc' }} placeholder="Any delays, material shortages, or incidents..." />
            </div>

            <div className="mb-4">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Attach Photo</Form.Label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setPhoto(e.target.files[0])}
                  className="form-control"
                  style={{ borderRadius: '50rem', height: 48, background: '#f8fafc', padding: '0.6rem 1rem' }} 
                />
              </div>
            </div>

            <div className="d-flex gap-3 justify-content-end pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
              <Button variant="light" onClick={() => setShowCreate(false)} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 1.75rem' }}>Cancel</Button>
              <Button type="submit" disabled={submitting} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 2rem', background: '#4f46e5', border: 'none' }}>{submitting ? 'Saving...' : 'Save Draft'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DailyLogs;
