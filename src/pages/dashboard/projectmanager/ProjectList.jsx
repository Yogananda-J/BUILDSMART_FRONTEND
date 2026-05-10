import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject, getTemplates } from '../../../api/projectApi';
import { toast } from '../../../utils/toast';
import StatusBadge from '../../../components/common/StatusBadge';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Form, Button, Dropdown, ProgressBar } from 'react-bootstrap';
import { FaProjectDiagram, FaCheckCircle, FaClock, FaPlus, FaSearch, FaChevronDown, FaCalendarAlt, FaDollarSign, FaUserPlus, FaArrowRight, FaEllipsisV } from 'react-icons/fa';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreate, setShowCreate] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({ templateId: '', name: '', description: '', startDate: '', endDate: '', estimatedBudget: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getProjects();
      setProjects(res.data || []);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally { setLoading(false); }
  };

  const fetchTemplates = async () => {
    try {
      const res = await getTemplates();
      // Improved data extraction for all common backend response patterns
      const rawData = res.data?.data || res.data?.content || res.data;
      const data = Array.isArray(rawData) ? rawData : [];
      setTemplates(data);
      console.log('Templates loaded:', data);
    } catch (err) {
      console.error('Template load error:', err);
    }
  };

  useEffect(() => { fetchProjects(); fetchTemplates(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Validation
    const templatePattern = /^TEMPBS0[1-4]$/;
    if (form.templateId && !templatePattern.test(form.templateId)) {
      return toast.error('Invalid Template ID. Must be TEMPBS01, 02, 03, or 04.');
    }
    if (form.name.length < 3 || form.name.length > 200) {
      return toast.error('Project Name must be between 3 and 200 characters.');
    }
    if (form.description.length > 1000) {
      return toast.error('Description cannot exceed 1000 characters.');
    }
    
    const today = new Date().toISOString().split('T')[0];
    if (form.startDate < today) {
      return toast.error('Start Date must be today or in the future.');
    }
    if (form.endDate <= form.startDate) {
      return toast.error('End Date must be after Start Date.');
    }
    if (Number(form.estimatedBudget) <= 0) {
      return toast.error('Budget must be a positive number.');
    }

    setSubmitting(true);
    const payload = {
      projectName: form.name,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      templateId: form.templateId || null,
      budget: Number(form.estimatedBudget || 0)
    };
    try {
      await createProject(payload);
      toast.success('Project created successfully');
      setShowCreate(false);
      setForm({ templateId: '', name: '', description: '', startDate: '', endDate: '', estimatedBudget: '' });
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally { setSubmitting(false); }
  };

  const filtered = projects.filter(p => {
    const matchSearch = !search || p.projectName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'ACTIVE' || p.status === 'IN_PROGRESS').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    pending: projects.filter(p => p.status === 'PENDING' || p.status === 'DRAFT').length,
  };

  return (
    <div className="page-enter">
      <PageHeader title="Projects" subtitle="Manage and monitor your construction portfolio">
        <div className="d-flex gap-3">
          <RefreshButton onClick={fetchProjects} loading={loading} />
          <button
            onClick={() => setShowCreate(true)}
            className="btn btn-primary rounded-pill fw-bold d-flex align-items-center gap-2 px-4 shadow-lg border-0"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
          >
            <FaPlus size={12} /> New Project
          </button>
        </div>
      </PageHeader>

      {/* Modern Stats Overview */}
      <div className="row g-4 mb-5">
        {[
          { label: 'Total Projects', value: stats.total, color: '#4f46e5', icon: FaProjectDiagram, bg: '#eef2ff' },
          { label: 'Active Sites', value: stats.active, color: '#f59e0b', icon: FaClock, bg: '#fffbeb' },
          { label: 'Completed', value: stats.completed, color: '#10b981', icon: FaCheckCircle, bg: '#ecfdf5' },
          { label: 'Pending', value: stats.pending, color: '#8b5cf6', icon: FaCalendarAlt, bg: '#f5f3ff' },
        ].map((s, i) => (
          <div className="col-12 col-sm-6 col-lg-3" key={i}>
            <div className="p-4 rounded-5 border-0 shadow-sm" style={{ background: '#fff' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="rounded-4 d-flex align-items-center justify-content-center shadow-sm" style={{ width: 48, height: 48, background: s.bg, color: s.color }}>
                  <s.icon size={22} />
                </div>
                <div className="h3 fw-bold mb-0" style={{ color: '#0f172a', letterSpacing: '-1px' }}>{s.value}</div>
              </div>
              <div className="small fw-bold text-muted text-uppercase" style={{ letterSpacing: '1px' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Unified Filters & Grid */}
      <div style={{ background: 'transparent' }}>
        <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
          <div style={{ position: 'relative', flex: 1, minWidth: 300 }}>
            <FaSearch style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 16 }} />
            <input
              placeholder="Search by project name or ID..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="form-control border-0 shadow-sm rounded-pill"
              style={{ height: 52, paddingLeft: '3.5rem', background: '#fff', fontSize: '0.95rem' }}
            />
          </div>
          <Dropdown>
            <Dropdown.Toggle as="div" className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill bg-white shadow-sm border-0 fw-bold" style={{ cursor: 'pointer', height: 52 }}>
              <span className="small text-muted me-1">Status:</span>
              <span style={{ color: '#4f46e5' }}>{statusFilter === 'ALL' ? 'All' : statusFilter.replace('_', ' ')}</span>
              <FaChevronDown size={10} className="ms-1" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="border-0 shadow-lg rounded-4 p-2 mt-2">
              {['ALL', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'DRAFT', 'PENDING'].map(s => (
                <Dropdown.Item key={s} onClick={() => setStatusFilter(s)} className="rounded-3 py-2 px-3 fw-bold small">
                  {s === 'ALL' ? 'All Status' : s.replace('_', ' ')}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: '#4f46e5' }} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={FaProjectDiagram} title="No projects match your filter" onAction={() => { setSearch(''); setStatusFilter('ALL'); }} actionLabel="Clear Filters" />
        ) : (
          <div className="row g-4">
            {filtered.map(project => (
              <div key={project.projectId || project.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card border-0 shadow-sm rounded-5 h-100 overflow-hidden transition-all"
                  style={{ background: '#fff', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  onClick={() => navigate(`/dashboard/pm/projects/${project.projectId || project.id}`)}
                >
                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div className="rounded-4 d-flex align-items-center justify-content-center mb-0 shadow-sm" style={{ width: 44, height: 44, background: '#eef2ff', color: '#4f46e5' }}>
                        <FaProjectDiagram size={20} />
                      </div>
                      <StatusBadge status={project.status} size="sm" />
                    </div>
                    
                    <h5 className="fw-bold mb-2 text-dark" style={{ letterSpacing: '-0.5px' }}>{project.projectName}</h5>
                    <p className="text-muted small mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: 40 }}>
                      {project.projectDescription || 'Central commercial hub construction project.'}
                    </p>

                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-1 small fw-bold">
                        <span className="text-muted">Progress</span>
                        <span style={{ color: '#4f46e5' }}>0%</span>
                      </div>
                      <ProgressBar now={0} style={{ height: 6, borderRadius: 10, background: '#f1f5f9' }} variant="indigo" />
                    </div>

                    <div className="row g-2 mb-4">
                      <div className="col-6">
                        <div className="p-2 rounded-3 bg-light text-center">
                           <div className="small fw-bold text-muted text-uppercase" style={{ fontSize: '10px' }}>Budget</div>
                           <div className="small fw-bold text-dark">₹{Number(project.budget || project.estimatedBudget || 0).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-2 rounded-3 bg-light text-center">
                           <div className="small fw-bold text-muted text-uppercase" style={{ fontSize: '10px' }}>End Date</div>
                           <div className="small fw-bold text-dark">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
                       <span className="small fw-bold text-muted"><FaCalendarAlt size={12} className="me-1" /> {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</span>
                       <div className="btn btn-link p-0 text-decoration-none fw-bold small text-primary d-flex align-items-center gap-1">
                          View Details <FaArrowRight size={10} />
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered size="md" className="confirmation-modal">
        <Modal.Header closeButton className="border-0 pb-0 px-4 pt-4">
          <Modal.Title className="fw-bold h5">Create New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleCreate}>
            <div className="mb-3">
              <Form.Label className="small fw-bold text-uppercase opacity-75">Select Template</Form.Label>
              <Form.Select 
                value={form.templateId} 
                onChange={e => setForm({ ...form, templateId: e.target.value })}
                className="form-control border-0 bg-light p-3 rounded-4 shadow-none" 
                style={{ height: 56, appearance: 'auto' }}
              >
                <option value="">No template selected</option>
                {templates.map((t, idx) => {
                  const id = t.id || t.templateId;
                  const name = t.name || t.templateName;
                  return (
                    <option key={id || idx} value={id}>
                      {name}
                    </option>
                  );
                })}
              </Form.Select>
            </div>
            <div className="mb-3">
              <Form.Label className="small fw-bold text-uppercase opacity-75">Project Name</Form.Label>
              <Form.Control value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="border-0 bg-light p-3 rounded-4" style={{ height: 56 }} placeholder="e.g. Skyline Residency" />
            </div>
            <div className="mb-3">
              <Form.Label className="small fw-bold text-uppercase opacity-75">Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border-0 bg-light p-3 rounded-4" placeholder="Briefly describe the project scope..." />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Start Date</Form.Label>
                <Form.Control type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required className="border-0 bg-light p-3 rounded-4" style={{ height: 56 }} />
              </div>
              <div className="col-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">End Date</Form.Label>
                <Form.Control type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required className="border-0 bg-light p-3 rounded-4" style={{ height: 56 }} />
              </div>
            </div>
            <div className="mb-4">
              <Form.Label className="small fw-bold text-uppercase opacity-75">Estimated Budget (₹)</Form.Label>
              <Form.Control type="number" value={form.estimatedBudget} onChange={e => setForm({ ...form, estimatedBudget: e.target.value })} className="border-0 bg-light p-3 rounded-4" style={{ height: 56 }} placeholder="0.00" />
            </div>
            <div className="d-flex gap-3 justify-content-end pt-3">
              <Button variant="light" onClick={() => setShowCreate(false)} className="rounded-pill px-4 fw-bold border-0">Cancel</Button>
              <Button type="submit" disabled={submitting} className="rounded-pill px-5 fw-bold border-0 shadow-lg" style={{ background: '#4f46e5' }}>{submitting ? 'Creating...' : 'Launch Project'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <style>{`
        .transition-all { transition: all 0.3s ease; }
        .progress-bar.bg-indigo { background-color: #4f46e5; }
      `}</style>
    </div>
  );
};

export default ProjectList;
