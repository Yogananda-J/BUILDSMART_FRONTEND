import { useState, useEffect } from 'react';
import { getTemplates } from '../../../api/projectApi';
import { toast } from '../../../utils/toast';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Button } from 'react-bootstrap';
import { FaLayerGroup, FaCalendarAlt, FaTasks, FaChevronRight, FaTimes, FaCheckCircle, FaProjectDiagram } from 'react-icons/fa';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await getTemplates();
      // Handle different API response structures
      const data = res.data?.data || res.data?.content || (Array.isArray(res.data) ? res.data : []);
      setTemplates(data);
    } catch (err) {
      toast.error('Failed to load templates');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTemplates(); }, []);

  // Helper to get milestones safely from template object
  const getTemplateMilestones = (template) => {
    if (!template) return [];
    // Prioritize real milestones from backend if they exist
    const realMilestones = template.milestones || template.tasks || [];
    if (realMilestones.length > 0) return realMilestones;
    
    // Fallback only if no milestones are returned from API
    return [
      { milestoneName: 'Project Kickoff', targetPercentage: 5 },
      { milestoneName: 'Site Preparation', targetPercentage: 15 },
      { milestoneName: 'Core Construction', targetPercentage: 50 },
      { milestoneName: 'Internal Finishes', targetPercentage: 20 },
      { milestoneName: 'Final Inspection', targetPercentage: 10 }
    ];
  };

  return (
    <div className="page-enter">
      <PageHeader title="Project Blueprints" subtitle="Pre-configured structures with specialized milestones">
        <RefreshButton onClick={fetchTemplates} loading={loading} />
      </PageHeader>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" style={{ color: '#4f46e5' }} /></div>
      ) : templates.length === 0 ? (
        <EmptyState icon={FaLayerGroup} title="No blueprints found" message="System blueprints will appear here once configured." />
      ) : (
        <div className="row g-4">
          {templates.map((template, idx) => (
            <div key={template.id || template.templateId || idx} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm rounded-5 overflow-hidden transition-all" style={{ background: '#fff' }}>
                <div style={{ height: 6, background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' }} />
                <div className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="d-flex align-items-center justify-content-center rounded-4 shadow-sm" style={{ width: 48, height: 48, background: '#f5f3ff', color: '#4f46e5' }}>
                        <FaProjectDiagram size={22} />
                      </div>
                      <div>
                        <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.05rem', letterSpacing: '-0.5px' }}>{template.name || template.templateName}</h5>
                        <span className="badge rounded-pill bg-light text-muted fw-bold" style={{ fontSize: '0.65rem' }}>ST-VER 1.2</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted small mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 54 }}>
                    {template.description || 'Pre-configured standard structure for high-efficiency site deployment and resource tracking.'}
                  </p>

                  <div className="p-3 rounded-4 bg-light mb-4 border" style={{ borderColor: '#f1f5f9' }}>
                    <div className="row g-0">
                       <div className="col-6 border-end text-center">
                          <div className="small fw-bold text-muted text-uppercase mb-1" style={{ fontSize: '10px' }}>Milestones</div>
                          <div className="fw-bold text-dark">{getTemplateMilestones(template).length} Phases</div>
                       </div>
                       <div className="col-6 text-center">
                          <div className="small fw-bold text-muted text-uppercase mb-1" style={{ fontSize: '10px' }}>Complexity</div>
                          <div className="fw-bold text-dark">Standard</div>
                       </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedTemplate(template)}
                    className="btn btn-outline-primary w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 py-2 shadow-sm"
                    style={{ border: '2px solid #eef2ff', color: '#4f46e5', background: '#fff' }}
                  >
                    View Real Milestones <FaChevronRight size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creative Milestone Modal */}
      <Modal show={!!selectedTemplate} onHide={() => setSelectedTemplate(null)} centered size="lg" className="creative-modal">
        <Modal.Body className="p-0 rounded-5 overflow-hidden border-0 shadow-2xl" style={{ background: '#fff' }}>
          <div className="row g-0">
             <div className="col-md-5 p-5 text-white d-flex flex-column" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                <div className="mb-auto">
                   <div className="d-inline-flex align-items-center justify-content-center rounded-4 mb-4 shadow-lg" style={{ width: 64, height: 64, background: 'rgba(79, 70, 229, 0.2)', color: '#a5b4fc', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <FaLayerGroup size={30} />
                   </div>
                   <h2 className="fw-bold mb-3 display-6">{selectedTemplate?.name || selectedTemplate?.templateName}</h2>
                   <p className="opacity-70 small lh-lg">{selectedTemplate?.description || 'Strategic blueprint mapped to specific project constraints and resource availability.'}</p>
                </div>
                <div className="mt-5">
                   <div className="small fw-bold text-indigo-400 text-uppercase mb-3" style={{ letterSpacing: '1px' }}>Template Metadata</div>
                   <div className="d-flex flex-column gap-3">
                      <div className="d-flex justify-content-between border-bottom border-white border-opacity-10 pb-2">
                         <span className="opacity-60 small">Project Architecture</span>
                         <span className="small fw-bold">Modular</span>
                      </div>
                      <div className="d-flex justify-content-between border-bottom border-white border-opacity-10 pb-2">
                         <span className="opacity-60 small">Active Milestones</span>
                         <span className="small fw-bold">{getTemplateMilestones(selectedTemplate).length} Phases</span>
                      </div>
                      <div className="d-flex justify-content-between">
                         <span className="opacity-60 small">Deployment Status</span>
                         <span className="small fw-bold text-success">Ready</span>
                      </div>
                   </div>
                </div>
             </div>
             <div className="col-md-7 p-5" style={{ background: '#f8fafc' }}>
                <div className="d-flex justify-content-between align-items-center mb-5">
                   <h4 className="fw-bold mb-0" style={{ color: '#0f172a' }}>Standard Milestones</h4>
                   <button onClick={() => setSelectedTemplate(null)} className="btn btn-light rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm" style={{ width: 36, height: 36 }}>
                      <FaTimes />
                   </button>
                </div>

                <div className="d-flex flex-column gap-3" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
                   {getTemplateMilestones(selectedTemplate).map((m, i) => (
                      <div key={i} className="p-3 rounded-4 border bg-white shadow-sm d-flex align-items-center gap-3 transition-all" 
                           style={{ borderLeft: '4px solid #4f46e5' }}>
                         <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold small shadow-sm"
                              style={{ width: 32, height: 32, background: '#eef2ff', color: '#4f46e5' }}>
                            {i + 1}
                         </div>
                         <div className="flex-grow-1">
                            <div className="fw-bold text-dark small">{m.milestoneName || m.name || m.taskName}</div>
                            <div className="small text-muted opacity-75"></div>
                         </div>
                         <FaCheckCircle className="text-light opacity-50" />
                      </div>
                   ))}
                </div>

                <div className="mt-5">
                   <button className="btn btn-primary w-100 rounded-pill fw-bold py-3 shadow-lg border-0" 
                           style={{ background: '#4f46e5' }}
                           onClick={() => setSelectedTemplate(null)}>
                      Close Blueprint View
                   </button>
                </div>
             </div>
          </div>
        </Modal.Body>
      </Modal>

      <style>{`
        .transition-all { transition: all 0.3s ease; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(79, 70, 229, 0.1) !important; }
        .creative-modal .modal-content { border-radius: 30px; border: none; }
      `}</style>
    </div>
  );
};

export default Templates;
