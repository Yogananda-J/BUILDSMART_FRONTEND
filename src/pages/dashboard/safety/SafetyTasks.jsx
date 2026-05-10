import { useState, useEffect } from 'react';
import { getSafetyTasks, updateSafetyTaskStatus, submitSafetyTask, createIncident, createInspection } from '../../../api/safetyApi';
import { toast } from '../../../utils/toast';
import StatusBadge from '../../../components/common/StatusBadge';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaTasks, FaCalendarAlt, FaCheckSquare } from 'react-icons/fa';

const SafetyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [showSubmit, setShowSubmit] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ description: '', status: 'COMPLETED' });
  const [showIncident, setShowIncident] = useState(false);
  const [showInspection, setShowInspection] = useState(false);
  const [incidentForm, setIncidentForm] = useState({ description: '', severity: 'LOW' });
  const [inspectionForm, setInspectionForm] = useState({ inspectionType: 'FIRE_SAFETY', findings: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getSafetyTasks();
      const data = res.data;
      setTasks(Array.isArray(data) ? data : (data?.data || data?.content || []));
    } catch (err) {
      console.error('Failed to load safety tasks', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateSafetyTaskStatus(taskId, { status: newStatus });
      toast.success('Task status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleIncidentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createIncident({
        projectId: selectedTask.projectId,
        ...incidentForm
      });
      toast.success('Incident reported successfully');
      setShowIncident(false);
      setIncidentForm({ description: '', severity: 'LOW' });
    } catch (err) {
      toast.error('Failed to report incident');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInspectionSubmit = async (e) => {
    e.preventDefault();
    if (inspectionForm.findings.length < 20 || inspectionForm.findings.length > 200) {
      return toast.error('Findings must be between 20 and 200 characters.');
    }
    setSubmitting(true);
    const taskId = selectedTask.taskId || selectedTask.assignedTaskId || selectedTask.id;
    try {
      await createInspection({
        projectId: selectedTask.projectId,
        assignedTaskId: taskId,
        ...inspectionForm
      });
      
      // Update task status to COMPLETED after successful inspection
      await updateSafetyTaskStatus(taskId, { status: 'COMPLETED' }).catch(err => console.warn('Failed to update task status', err));
      
      toast.success('Inspection recorded and task updated');
      setShowInspection(false);
      setInspectionForm({ inspectionType: 'ROUTINE', findings: '' });
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.details || err.response?.data?.message || 'Failed to record inspection';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitSafetyTask(selectedTask.taskId || selectedTask.id, form);
      toast.success('Task submitted successfully');
      setShowSubmit(false);
      setSelectedTask(null);
      setForm({ description: '', status: 'COMPLETED' });
      fetchData();
    } catch (err) {
      toast.error('Failed to submit task');
    } finally {
      setSubmitting(false);
    }
  };

  const openSubmitModal = (task) => {
    setSelectedTask(task);
    setForm({ description: '', status: 'COMPLETED' });
    setShowSubmit(true);
  };

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const filteredTasks = safeTasks.filter(t => filter === 'ALL' || t.status === filter);

  return (
    <div>
      <PageHeader title="My Safety Tasks" subtitle="Safety action items and compliance tasks assigned to you">
        <RefreshButton onClick={fetchData} loading={loading} />
      </PageHeader>

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        <div className="p-4" style={{ borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '0.4rem', borderRadius: '50rem' }}>
            {['ALL', 'PENDING', 'SUBMITTED', 'COMPLETED', 'REJECTED'].map(status => (
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
        ) : filteredTasks.length === 0 ? (
          <EmptyState icon={FaTasks} title="No tasks found" message="You don't have any safety tasks matching this filter." />
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Task Details</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Related Ref</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Date</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => (
                  <tr key={task.taskId || task.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>{task.taskName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>{task.description}</div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                      <div style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: 4, display: 'inline-block' }}>{task.referenceId || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                      <div className="d-flex align-items-center gap-2">
                        <FaCalendarAlt size={12} className="text-muted" />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.taskId || task.id, e.target.value)}
                        style={{ 
                          padding: '0.3rem 0.5rem', borderRadius: 8, border: 'none', fontSize: '0.75rem', 
                          fontWeight: 700,
                          background: task.status === 'COMPLETED' ? '#d1fae5' : task.status === 'REJECTED' ? '#fee2e2' : task.status === 'SUBMITTED' ? '#fef3c7' : '#dbeafe',
                          color: task.status === 'COMPLETED' ? '#065f46' : task.status === 'REJECTED' ? '#991b1b' : task.status === 'SUBMITTED' ? '#92400e' : '#1e40af'
                        }}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          onClick={() => { setSelectedTask(task); setShowInspection(true); }}
                          className="btn btn-sm"
                          style={{ padding: '0.35rem 0.75rem', background: '#ecfdf5', color: '#059669', border: 'none', borderRadius: '50rem', fontSize: '0.75rem', fontWeight: 600 }}
                        >
                          Inspection
                        </button>
                        <button
                          onClick={() => { setSelectedTask(task); setShowIncident(true); }}
                          className="btn btn-sm"
                          style={{ padding: '0.35rem 0.75rem', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '50rem', fontSize: '0.75rem', fontWeight: 600 }}
                        >
                          Incident
                        </button>
                        {task.status !== 'COMPLETED' && (
                          <button
                            onClick={() => openSubmitModal(task)}
                            style={{ padding: '0.35rem 0.75rem', background: '#eef2ff', color: '#4f46e5', border: 'none', borderRadius: '50rem', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          >
                            <FaCheckSquare size={10} /> Submit
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

      <Modal show={showSubmit} onHide={() => setShowSubmit(false)} centered size="md">
        <Modal.Header closeButton className="border-0 pb-0" style={{ padding: '1.5rem 1.5rem 0.5rem' }}>
          <Modal.Title style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>Submit Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem', marginBottom: 4 }}>{selectedTask?.taskName}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Project ID: <span className="fw-bold">{selectedTask?.projectId || 'N/A'}</span></div>
          </div>
          <Form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Description of Work</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required style={{ borderRadius: 16, background: '#f8fafc' }} placeholder="Provide details on how this task was resolved..." />
            </div>
            <div className="d-flex gap-3 justify-content-end pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
              <Button variant="light" onClick={() => setShowSubmit(false)} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 1.75rem' }}>Cancel</Button>
              <Button type="submit" disabled={submitting} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 2rem', background: '#4f46e5', border: 'none' }}>{submitting ? 'Submitting...' : 'Submit & Complete'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Incident Modal */}
      <Modal show={showIncident} onHide={() => setShowIncident(false)} centered size="md">
        <Modal.Header closeButton className="border-0 pb-0" style={{ padding: '1.5rem 1.5rem 0.5rem' }}>
          <Modal.Title style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ef4444' }}>Report Incident</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="alert alert-danger py-2 px-3 small border-0 rounded-4 mb-4">
            Reporting for Project: <strong>{selectedTask?.projectId}</strong>
          </div>
          <Form onSubmit={handleIncidentSubmit}>
            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Severity</Form.Label>
              <Form.Select value={incidentForm.severity} onChange={e => setIncidentForm({ ...incidentForm, severity: e.target.value })} style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </Form.Select>
            </div>
            <div className="mb-4">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={incidentForm.description} onChange={e => setIncidentForm({ ...incidentForm, description: e.target.value })} required style={{ borderRadius: 16, background: '#f8fafc' }} placeholder="Describe the incident..." />
            </div>
            <div className="d-flex gap-3 justify-content-end pt-3 border-top">
              <Button variant="light" onClick={() => setShowIncident(false)} style={{ borderRadius: '50rem', fontWeight: 600 }}>Cancel</Button>
              <Button type="submit" disabled={submitting} style={{ borderRadius: '50rem', fontWeight: 600, background: '#ef4444', border: 'none' }}>{submitting ? 'Reporting...' : 'Report Incident'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Inspection Modal */}
      <Modal show={showInspection} onHide={() => setShowInspection(false)} centered size="md">
        <Modal.Header closeButton className="border-0 pb-0" style={{ padding: '1.5rem 1.5rem 0.5rem' }}>
          <Modal.Title style={{ fontSize: '1.15rem', fontWeight: 700, color: '#10b981' }}>New Safety Inspection</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="alert alert-success py-2 px-3 small border-0 rounded-4 mb-4">
            Inspecting Project: <strong>{selectedTask?.projectId}</strong><br/>
            Linked Task: <strong>{selectedTask?.assignedTaskId || selectedTask?.id}</strong>
          </div>
          <Form onSubmit={handleInspectionSubmit}>
            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Inspection Type</Form.Label>
              <Form.Select 
                value={inspectionForm.inspectionType} 
                onChange={e => setInspectionForm({ ...inspectionForm, inspectionType: e.target.value })} 
                style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }}
              >
                {[
                  'FIRE_SAFETY', 'SCAFFOLDING_SAFETY', 'ELECTRICAL_SAFETY', 
                  'EQUIPMENT_INSPECTION', 'HOUSEKEEPING', 'HAZARDOUS_MATERIALS', 
                  'FIRST_AID_READINESS', 'EXCAVATION_SAFETY', 'EMERGENCY_EXIT_CHECK', 'PPE_COMPLIANCE'
                ].map(type => (
                  <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                ))}
              </Form.Select>
            </div>
            <div className="mb-4">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Findings (20-200 chars)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={inspectionForm.findings} 
                onChange={e => setInspectionForm({ ...inspectionForm, findings: e.target.value })} 
                required 
                minLength={20}
                maxLength={200}
                style={{ borderRadius: 16, background: '#f8fafc' }} 
                placeholder="Enter detailed safety findings..." 
              />
              <div className="text-muted small mt-1">{inspectionForm.findings.length}/200</div>
            </div>
            <div className="d-flex gap-3 justify-content-end pt-3 border-top">
              <Button variant="light" onClick={() => setShowInspection(false)} style={{ borderRadius: '50rem', fontWeight: 600 }}>Cancel</Button>
              <Button type="submit" disabled={submitting} style={{ borderRadius: '50rem', fontWeight: 600, background: '#10b981', border: 'none' }}>{submitting ? 'Submitting...' : 'Submit Inspection'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SafetyTasks;
