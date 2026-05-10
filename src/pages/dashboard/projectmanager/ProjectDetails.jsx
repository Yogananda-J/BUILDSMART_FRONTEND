import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectById, getProjectMilestones, updateMilestoneStatus, getProjectTasks, createTask, getAllIAMUsers } from '../../../api/projectApi';
import { toast } from '../../../utils/toast';
import StatusBadge from '../../../components/common/StatusBadge';
import PageHeader from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaChevronLeft, FaFlag, FaTasks, FaCalendarAlt, FaDollarSign, FaUserPlus, FaCheckCircle, FaClock, FaExclamationCircle, FaChevronDown } from 'react-icons/fa';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('milestones');
  const [showAssign, setShowAssign] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ 
    description: '', assignedTo: '', 
    assignedDepartment: 'VENDOR', plannedStart: '', plannedEnd: '',
    actualStart: '', actualEnd: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, mRes, tRes] = await Promise.all([
        getProjectById(projectId),
        getProjectMilestones(projectId).catch(() => ({ data: [] })),
        getProjectTasks(projectId).catch(() => ({ data: [] }))
      ]);
      
      setProject(pRes.data);
      
      // Improved data mapping for milestones
      const mData = mRes.data?.data || mRes.data?.content || mRes.data || [];
      setMilestones(Array.isArray(mData) ? mData : []);
      
      // Improved data mapping for tasks - strictly project-specific
      const tData = tRes.data?.data || tRes.data?.content || tRes.data || [];
      setTasks(Array.isArray(tData) ? tData : []);
      
    } catch (err) { 
      console.error('Fetch error:', err);
      toast.error('Failed to load project details'); 
    } finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const res = await getAllIAMUsers();
      setUsers(res.data?.data || res.data || []);
    } catch (err) { console.error('Failed to load users'); }
  };

  useEffect(() => { 
    if (projectId) {
      fetchData(); 
      fetchUsers();
    }
  }, [projectId]);

  const handleMilestoneStatus = async (milestoneId, newStatus) => {
    try {
      await updateMilestoneStatus(milestoneId, newStatus);
      toast.success('Milestone updated');
      fetchData();
    } catch { toast.error('Failed to update milestone'); }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...form,
      taskName: form.description,
      role: form.assignedDepartment
    };
    try {
      await createTask(projectId, payload);
      toast.success('Task assigned successfully');
      setShowAssign(false);
      setForm({ description: '', assignedTo: '', assignedDepartment: 'VENDOR', plannedStart: '', plannedEnd: '', actualStart: '', actualEnd: '' });
      fetchData();
    } catch (err) {
      toast.error('Failed to assign task');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border" style={{ color: '#6366f1' }} /></div>;
  if (!project) return <EmptyState title="Project not found" />;

  const completed = milestones.filter(m => m.status === 'COMPLETED').length;
  const progressPct = milestones.length ? Math.round((completed / milestones.length) * 100) : 0;

  return (
    <div className="page-enter">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/dashboard/pm/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6366f1', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
          <FaChevronLeft size={10} /> Back to Projects
        </Link>
        <button
          onClick={() => setShowAssign(true)}
          className="btn btn-primary rounded-pill fw-bold d-flex align-items-center gap-2 px-4 shadow-lg border-0"
          style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
        >
          <FaUserPlus size={14} /> Assign Task
        </button>
      </div>

      <div className="p-4 rounded-5 border-0 shadow-sm mb-4" style={{ background: '#fff' }}>
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-3 mb-2">
              <h2 className="fw-bold mb-0" style={{ letterSpacing: '-1px', color: '#0f172a' }}>{project.projectName}</h2>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-muted mb-4 lead" style={{ fontSize: '1rem' }}>{project.projectDescription || 'No description available for this project.'}</p>
            
            <div className="d-flex flex-wrap gap-4" style={{ fontSize: '0.85rem', color: '#64748b' }}>
              <span className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-light fw-bold"><FaCalendarAlt size={12} className="text-primary" /> Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'TBD'}</span>
              <span className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-light fw-bold"><FaCalendarAlt size={12} className="text-danger" /> End: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}</span>
              <span className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-light fw-bold"><FaDollarSign size={12} className="text-success" /> Budget: ₹{Number(project.budget || project.estimatedBudget || 0).toLocaleString()}</span>
            </div>
          </div>
          <div className="col-lg-4 mt-4 mt-lg-0">
             <div className="p-4 rounded-4 text-center" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <div className="h1 fw-bold mb-1" style={{ color: '#4f46e5', letterSpacing: '-2px' }}>{progressPct}%</div>
                <div className="small fw-bold text-muted text-uppercase mb-3">Overall Progress</div>
                <div style={{ background: '#e2e8f0', borderRadius: '50rem', height: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #4f46e5, #7c3aed)', borderRadius: '50rem', transition: 'width 1s ease' }} />
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="d-flex gap-3 mb-4">
        {[{ key: 'milestones', label: 'Timeline & Milestones', icon: FaFlag }, { key: 'tasks', label: 'Project Tasks', icon: FaTasks }].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="border-0 shadow-sm transition-all"
            style={{
              padding: '0.8rem 1.75rem', borderRadius: '50rem',
              fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
              background: activeTab === tab.key ? '#4f46e5' : '#fff',
              color: activeTab === tab.key ? '#fff' : '#64748b',
              display: 'flex', alignItems: 'center', gap: 10
            }}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-5">
        {activeTab === 'milestones' ? (
          milestones.length === 0 ? <EmptyState icon={FaFlag} title="No milestones defined" message="Use a project template to generate milestones automatically." /> : (
            <div className="position-relative ps-5 mt-4">
              <div style={{ position: 'absolute', left: '19px', top: '10px', bottom: '10px', width: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
              <div className="d-flex flex-column gap-5">
                {milestones.map((m, i) => {
                   const isCompleted = m.status === 'COMPLETED';
                   const isInProgress = m.status === 'IN_PROGRESS';
                   return (
                    <div key={m.milestoneId || i} className="position-relative z-1">
                      <div className="position-absolute shadow-sm" style={{ 
                        left: '-40px', top: '0', width: '20px', height: '20px', 
                        borderRadius: '50%', background: isCompleted ? '#10b981' : isInProgress ? '#4f46e5' : '#fff',
                        border: `4px solid ${isCompleted ? '#d1fae5' : isInProgress ? '#eef2ff' : '#e2e8f0'}`,
                        transition: 'all 0.3s'
                      }}></div>
                      <div className={`card border-0 shadow-sm rounded-4 p-4 transition-all ${isInProgress ? 'border-start border-4' : ''}`} 
                           style={{ background: '#fff', borderLeftColor: '#4f46e5' }}>
                        <div className="row align-items-center">
                          <div className="col-md-8">
                             <div className="d-flex align-items-center gap-3 mb-2">
                                <div className="small fw-bold text-muted text-uppercase" style={{ letterSpacing: '1px' }}>Phase {String(i + 1).padStart(2, '0')}</div>
                                <StatusBadge status={m.status} size="sm" />
                             </div>
                             <h5 className="fw-bold text-dark mb-2">{m.milestoneName || m.name}</h5>
                          </div>
                          <div className="col-md-4 text-md-end mt-3 mt-md-0">
                             <div className="mb-3 d-flex flex-column align-items-md-end">
                                <span className="small fw-bold text-muted mb-1">Update Status</span>
                                <div className="d-flex gap-2">
                                   {['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].map(s => (
                                      <button 
                                        key={s}
                                        onClick={() => handleMilestoneStatus(m.milestoneId, s)}
                                        className="btn btn-sm rounded-3 p-0 d-flex align-items-center justify-content-center transition-all"
                                        style={{ 
                                          width: 32, height: 32, 
                                          background: m.status === s ? (s === 'COMPLETED' ? '#10b981' : s === 'IN_PROGRESS' ? '#4f46e5' : '#64748b') : '#f8fafc',
                                          color: m.status === s ? '#fff' : '#cbd5e1',
                                          border: '1px solid #f1f5f9'
                                        }}
                                      >
                                        {s === 'COMPLETED' ? <FaCheckCircle size={14} /> : s === 'IN_PROGRESS' ? <FaClock size={14} /> : <FaExclamationCircle size={14} />}
                                      </button>
                                   ))}
                                </div>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          tasks.length === 0 ? <EmptyState icon={FaTasks} title="No tasks assigned to this project" message="Use the Assign Task button to start tracking site activities." onAction={() => setShowAssign(true)} actionLabel="Assign Now" /> : (
            <div className="card border-0 shadow-sm rounded-5 overflow-hidden" style={{ background: '#fff' }}>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      {['Task Details', 'Assigned Specialist', 'Timeline', 'Priority', 'Status'].map(h => (
                        <th key={h} className="border-0 px-4 py-3 small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t, i) => (
                      <tr key={t.taskId || i} className="align-middle">
                        <td className="px-4 py-3">
                          <div className="fw-bold text-dark">{t.taskName || t.description || 'Unnamed Task'}</div>
                          <div className="small text-muted">{t.description}</div>
                        </td>
                        <td className="px-4 py-3">
                           <div className="d-flex align-items-center gap-2">
                              <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                                   style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', fontSize: 11 }}>
                                {t.assignedTo ? t.assignedTo.substring(0, 2).toUpperCase() : '??'}
                              </div>
                              <div className="d-flex flex-column">
                                <span className="small fw-bold text-dark">{t.assignedTo || 'Unassigned'}</span>
                                <span className="small text-muted" style={{ fontSize: '10px' }}>{t.assignedDepartment}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-4 py-3">
                           <div className="small fw-bold text-dark">{t.plannedStart || '—'}</div>
                           <div className="small text-muted" style={{ fontSize: '10px' }}>to {t.plannedEnd || '—'}</div>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={t.priority || 'MEDIUM'} size="sm" /></td>
                        <td className="px-4 py-3"><StatusBadge status={t.status} size="sm" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>

      <Modal show={showAssign} onHide={() => setShowAssign(false)} centered size="md" className="confirmation-modal">
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <Modal.Title className="fw-bold h5">Assign Project Task</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleAssignTask}>
            <div className="mb-4">
              <Form.Label className="small fw-bold text-uppercase text-primary mb-2" style={{ letterSpacing: '1px' }}>Task Summary</Form.Label>
              <Form.Control 
                value={form.description} 
                onChange={e => setForm({ ...form, description: e.target.value })} 
                required 
                className="border-0 bg-light p-3 rounded-4 shadow-none" 
                style={{ height: 60, fontSize: '1.05rem', fontWeight: 500 }} 
                placeholder="e.g. Review construction plans" 
              />
            </div>
            
            <div className="row g-4 mb-4">
               <div className="col-md-6">
                  <Form.Label className="small fw-bold text-uppercase text-primary mb-2" style={{ letterSpacing: '1px' }}>Department</Form.Label>
                  <div className="position-relative">
                    <div 
                      onClick={() => setShowDeptDropdown(!showDeptDropdown)}
                      className="border-0 bg-light px-3 rounded-4 d-flex align-items-center justify-content-between transition-all"
                      style={{ height: 60, fontSize: '1rem', fontWeight: 500, cursor: 'pointer' }}
                    >
                      <span className={form.assignedDepartment ? 'text-dark' : 'text-muted'}>
                        {form.assignedDepartment ? form.assignedDepartment.replace(/_/g, ' ') : 'Select Department'}
                      </span>
                      <FaChevronDown size={10} className="text-muted" />
                    </div>
                    {showDeptDropdown && (
                      <div 
                        className="position-absolute w-100 mt-2 shadow-lg rounded-4 overflow-hidden border-0"
                        style={{ background: '#fff', zIndex: 1000 }}
                      >
                        {[
                          { val: 'VENDOR', label: 'Vendor / Supplier' },
                          { val: 'SITE_ENGINEER', label: 'Site Operations' },
                          { val: 'FINANCE_OFFICER', label: 'Finance & Budgeting' },
                          { val: 'SAFETY_OFFICER', label: 'Safety & Compliance' }
                        ].map(d => (
                          <div 
                            key={d.val}
                            onClick={() => {
                              setForm({ ...form, assignedDepartment: d.val });
                              setShowDeptDropdown(false);
                            }}
                            className="p-3 border-bottom transition-all fw-bold text-dark"
                            style={{ cursor: 'pointer', borderColor: '#f1f5f9', fontSize: '0.9rem' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                          >
                            {d.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
               </div>
               <div className="col-md-6">
                  <Form.Label className="small fw-bold text-uppercase text-primary mb-2" style={{ letterSpacing: '1px' }}>Search Specialist</Form.Label>
                  <div className="position-relative">
                    <Form.Control 
                      placeholder="Type name or ID..."
                      value={form.assignedTo}
                      onChange={e => {
                        setForm({ ...form, assignedTo: e.target.value });
                        setShowUserDropdown(true);
                      }}
                      onFocus={() => setShowUserDropdown(true)}
                      className="border-0 bg-light px-3 rounded-4 shadow-none"
                      style={{ height: 60, fontSize: '1rem', fontWeight: 500 }}
                    />
                    {showUserDropdown && form.assignedTo && (
                      <div 
                        className="position-absolute w-100 mt-2 shadow-lg rounded-4 overflow-hidden border-0"
                        style={{ background: '#fff', zIndex: 1000, maxHeight: 300, overflowY: 'auto' }}
                      >
                        {users.filter(u => 
                          u.name?.toLowerCase().includes(form.assignedTo.toLowerCase()) || 
                          u.userId?.toLowerCase().includes(form.assignedTo.toLowerCase())
                        ).map(u => (
                          <div 
                            key={u.userId}
                            onClick={() => {
                              setForm({ ...form, assignedTo: u.userId });
                              setShowUserDropdown(false);
                            }}
                            className="p-3 border-bottom d-flex align-items-center justify-content-between transition-all"
                            style={{ cursor: 'pointer', borderColor: '#f1f5f9' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                          >
                            <div>
                              <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{u.name}</div>
                              <div className="text-muted" style={{ fontSize: '0.75rem' }}>{u.userId}</div>
                            </div>
                            <span className="badge rounded-pill bg-light text-primary small fw-bold">
                              {u.role?.replace('ROLE_', '')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
               </div>
            </div>

            <div className="row g-4 mb-4">
               <div className="col-6">
                  <Form.Label className="small fw-bold text-uppercase text-primary mb-2" style={{ letterSpacing: '1px' }}>Planned Start</Form.Label>
                  <Form.Control type="date" value={form.plannedStart} onChange={e => setForm({ ...form, plannedStart: e.target.value })} required className="border-0 bg-light px-3 rounded-4 shadow-none" style={{ height: 60, fontSize: '1rem' }} />
               </div>
               <div className="col-6">
                  <Form.Label className="small fw-bold text-uppercase text-primary mb-2" style={{ letterSpacing: '1px' }}>Planned End</Form.Label>
                  <Form.Control type="date" value={form.plannedEnd} onChange={e => setForm({ ...form, plannedEnd: e.target.value })} required className="border-0 bg-light px-3 rounded-4 shadow-none" style={{ height: 60, fontSize: '1rem' }} />
               </div>
            </div>

            <div className="row g-4 mb-5">
               <div className="col-6">
                  <Form.Label className="small fw-bold text-uppercase text-muted mb-2" style={{ letterSpacing: '1px' }}>Actual Start (Optional)</Form.Label>
                  <Form.Control type="date" value={form.actualStart} onChange={e => setForm({ ...form, actualStart: e.target.value })} className="border-0 bg-light px-3 rounded-4 shadow-none" style={{ height: 52, fontSize: '0.9rem', opacity: 0.8 }} />
               </div>
               <div className="col-6">
                  <Form.Label className="small fw-bold text-uppercase text-muted mb-2" style={{ letterSpacing: '1px' }}>Actual End (Optional)</Form.Label>
                  <Form.Control type="date" value={form.actualEnd} onChange={e => setForm({ ...form, actualEnd: e.target.value })} className="border-0 bg-light px-3 rounded-4 shadow-none" style={{ height: 52, fontSize: '0.9rem', opacity: 0.8 }} />
               </div>
            </div>

            <div className="d-flex gap-3 justify-content-end mt-2">
              <Button variant="light" onClick={() => setShowAssign(false)} className="rounded-pill px-4 fw-bold border-0" style={{ background: '#f1f5f9', color: '#64748b', height: 52 }}>Cancel</Button>
              <Button 
                type="submit" 
                disabled={submitting} 
                className="rounded-pill px-5 fw-bold border-0 shadow-lg transition-all" 
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', height: 52 }}
              >
                {submitting ? 'Processing...' : 'Confirm Assignment'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <style>{`
        .transition-all { transition: all 0.3s ease; }
        .card:hover { transform: translateX(5px); }
      `}</style>
    </div>
  );
};

export default ProjectDetails;
