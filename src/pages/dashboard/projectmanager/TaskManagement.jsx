import { useState, useEffect } from 'react';
import { getProjectTasks, getMyTasks, getAllTasks, updateTaskStatus, createTask, getProjects } from '../../../api/projectApi';
import { getAllUsers } from '../../../api/userApi';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../../utils/toast';
import StatusBadge from '../../../components/common/StatusBadge';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaTasks, FaPlus, FaCalendarAlt, FaUserAlt, FaBuilding, FaProjectDiagram } from 'react-icons/fa';

const TaskManagement = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState({ 
    projectId: '', taskName: '', description: '', assignedTo: '', 
    assignedDepartment: 'ADMIN', plannedStart: '', plannedEnd: '', priority: 'MEDIUM' 
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const isPM = user?.role === 'PROJECT_MANAGER' || user?.role === 'ADMIN';
      const [tRes, pRes, uRes] = await Promise.all([
        isPM ? getAllTasks().catch(() => ({ data: [] })) : getMyTasks(user.userId).catch(() => ({ data: [] })),
        getProjects().catch(() => ({ data: [] })),
        getAllUsers().catch(() => ({ data: [] }))
      ]);
      
      const tasksData = tRes.data?.data || tRes.data?.content || tRes.data || [];
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      
      const projectsData = pRes.data?.data || pRes.data?.content || pRes.data || [];
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      
      const usersData = uRes.data?.data || uRes.data?.content || uRes.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      toast.error('Failed to load task data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user.userId]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      toast.success('Task status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.projectId) { toast.error('Please select a project'); return; }
    setSubmitting(true);
    
    const payload = {
      ...form,
      actualStart: form.plannedStart,
      actualEnd: form.plannedEnd
    };

    try {
      await createTask(form.projectId, payload);
      toast.success('Task assigned successfully');
      setShowCreate(false);
      setForm({ 
        projectId: '', taskName: '', description: '', assignedTo: '', 
        assignedDepartment: 'ADMIN', plannedStart: '', plannedEnd: '', priority: 'MEDIUM' 
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTasks = tasks.filter(t => filter === 'ALL' || t.status === filter);

  return (
    <div className="page-enter">
      <PageHeader title="Global Tasks Portfolio" subtitle="Comprehensive view of all activities across active construction sites">
        <div className="d-flex gap-2">
           <RefreshButton onClick={fetchData} loading={loading} />
           <button
             onClick={() => setShowCreate(true)}
             className="btn btn-primary rounded-pill fw-bold d-flex align-items-center gap-2 px-4 shadow-lg border-0"
             style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
           >
             <FaPlus size={12} /> Assign New Task
           </button>
        </div>
      </PageHeader>

      <div className="card border-0 shadow-sm rounded-5 overflow-hidden" style={{ background: '#fff' }}>
        <div className="p-4 bg-light border-bottom d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2 bg-white p-1 rounded-pill shadow-sm border">
            {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className="border-0 px-3 py-1 rounded-pill small fw-bold transition-all"
                style={{
                  background: filter === status ? '#4f46e5' : 'transparent',
                  color: filter === status ? '#fff' : '#64748b',
                }}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="text-muted small fw-bold">{filteredTasks.length} total tasks identified</div>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: '#4f46e5' }} /></div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState icon={FaTasks} title="No tasks found" message="Tasks will appear here once projects are initialized and specialists assigned." />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr className="bg-light">
                  {['Task Info', 'Associated Project', 'Assigned Specialist', 'Timeline', 'Priority', 'Current Status'].map(h => (
                    <th key={h} className="border-0 px-4 py-3 small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => (
                  <tr key={task.taskId || task.id} className="align-middle">
                    <td className="px-4 py-3">
                      <div className="fw-bold text-dark">{task.taskName || task.description || 'Unnamed Task'}</div>
                      <div className="small text-muted">{task.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded bg-light p-2 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, color: '#4f46e5' }}>
                           <FaProjectDiagram size={14} />
                        </div>
                        <div className="d-flex flex-column">
                           <span className="small fw-bold text-dark">{projects.find(p => p.projectId === task.projectId)?.projectName || task.projectId}</span>
                           <span className="small text-muted" style={{ fontSize: '10px' }}>ID: {task.projectId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                       <div className="d-flex flex-column">
                          <span className="small fw-bold text-dark"><FaUserAlt size={10} className="me-1 opacity-50" /> {task.assignedTo || 'Unassigned'}</span>
                          <span className="small text-muted text-uppercase" style={{ fontSize: '10px' }}><FaBuilding size={10} className="me-1" /> {task.assignedDepartment || 'General'}</span>
                       </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="small fw-bold text-dark">{task.plannedStart || '—'}</div>
                      <div className="small text-muted" style={{ fontSize: '10px' }}>to {task.plannedEnd || '—'}</div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={task.priority || 'MEDIUM'} size="sm" /></td>
                    <td className="px-4 py-3">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.taskId || task.id, e.target.value)}
                        className="form-select form-select-sm rounded-3 border-light shadow-sm fw-bold small"
                        style={{ width: '120px' }}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered size="lg" className="confirmation-modal">
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <Modal.Title className="fw-bold h5">Assign New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleCreate}>
            <div className="row g-4">
              <div className="col-md-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Target Project</Form.Label>
                <Form.Select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4 shadow-none" style={{ height: 56 }}>
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}
                </Form.Select>
              </div>
              <div className="col-md-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Task Title</Form.Label>
                <Form.Control value={form.taskName} onChange={e => setForm({ ...form, taskName: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4 shadow-none" style={{ height: 56 }} placeholder="e.g. Plan Review" />
              </div>
              <div className="col-12">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Scope Description</Form.Label>
                <Form.Control as="textarea" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4 shadow-none" placeholder="Detail the task requirements..." />
              </div>
              <div className="col-md-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Assigned Specialist (ID)</Form.Label>
                <Form.Control value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4 shadow-none" style={{ height: 56 }} placeholder="e.g. BSVM001" />
              </div>
              <div className="col-md-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Department</Form.Label>
                <Form.Select value={form.assignedDepartment} onChange={e => setForm({ ...form, assignedDepartment: e.target.value })} className="form-control border-0 bg-light p-3 rounded-4 shadow-none" style={{ height: 56 }}>
                  {['ADMIN', 'PROJECT_MANAGER', 'SITE_ENGINEER', 'VENDOR', 'SAFETY_OFFICER', 'FINANCE_OFFICER'].map(d => (
                    <option key={d} value={d}>{d.replace('_', ' ')}</option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-md-4">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Planned Start</Form.Label>
                <Form.Control type="date" value={form.plannedStart} onChange={e => setForm({ ...form, plannedStart: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4 shadow-none" style={{ height: 56 }} />
              </div>
              <div className="col-md-4">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Planned End</Form.Label>
                <Form.Control type="date" value={form.plannedEnd} onChange={e => setForm({ ...form, plannedEnd: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4 shadow-none" style={{ height: 56 }} />
              </div>
              <div className="col-md-4">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Priority</Form.Label>
                <Form.Select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="form-control border-0 bg-light p-3 rounded-4 shadow-none" style={{ height: 56 }}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </Form.Select>
              </div>
            </div>
            <div className="d-flex gap-3 justify-content-end pt-5">
              <Button variant="light" onClick={() => setShowCreate(false)} className="rounded-pill px-4 fw-bold border-0">Cancel</Button>
              <Button type="submit" disabled={submitting} className="rounded-pill px-5 fw-bold border-0 shadow-lg" style={{ background: '#4f46e5' }}>{submitting ? 'Processing...' : 'Confirm Assignment'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <style>{`
        .transition-all { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
};

export default TaskManagement;
