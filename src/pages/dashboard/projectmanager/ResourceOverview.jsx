import { useState, useEffect } from 'react';
import { getResources, getAvailableResources, getAllocations, createAllocation } from '../../../api/resourceApi';
import { getProjects } from '../../../api/projectApi';
import { toast } from '../../../utils/toast';
import StatusBadge from '../../../components/common/StatusBadge';
import StatCard from '../../../components/common/StatCard';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaHardHat, FaTractor, FaBox, FaPlus, FaUsers, FaTools, FaCalendarCheck } from 'react-icons/fa';

const ResourceOverview = () => {
  const [resources, setResources] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('LABOR');
  
  const [form, setForm] = useState({ 
    type: 'LABOR', 
    numberOfLabors: 0, 
    skillLevel: 'SKILLED', 
    equipmentName: '', 
    equipmentLevel: 'MEDIUM', 
    costPerHour: 0, 
    totalHours: 0, 
    projectId: '', 
    purpose: '',
    availability: 'AVAILABLE'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rRes, pRes] = await Promise.all([
        getResources().catch(() => ({ data: [] })),
        getProjects().catch(() => ({ data: [] }))
      ]);
      setResources(rRes.data || []);
      setProjects(pRes.data || []);
    } catch (err) {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...form,
      totalCost: form.costPerHour * form.totalHours,
      budgetStatus: 'PENDING'
    };
    try {
      await createResource(payload);
      toast.success('Resource request submitted for budget approval');
      setShowCreate(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create resource');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredResources = resources.filter(r => r.type === activeTab);
  
  const stats = {
    labor: resources.filter(r => r.type === 'LABOR').length,
    equipment: resources.filter(r => r.type === 'EQUIPMENT').length,
    materials: resources.filter(r => r.type === 'MATERIAL').length,
    pendingBudget: resources.filter(r => r.budgetStatus === 'PENDING').length
  };

  return (
    <div>
      <PageHeader title="Resource Management" subtitle="Request and manage project resources with integrated budget approval">
        <RefreshButton onClick={fetchData} loading={loading} />
        <button
          onClick={() => setShowCreate(true)}
          className="btn btn-primary rounded-pill fw-bold d-flex align-items-center gap-2 px-4 shadow-sm border-0"
          style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', height: 44 }}
        >
          <FaPlus size={12} /> Request Resource
        </button>
      </PageHeader>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <StatCard icon={FaUsers} label="Labor Pool" value={stats.labor} color="#3b82f6" bgColor="#dbeafe" />
        <StatCard icon={FaTractor} label="Equipment" value={stats.equipment} color="#f59e0b" bgColor="#fef3c7" />
        <StatCard icon={FaBox} label="Materials" value={stats.materials} color="#10b981" bgColor="#d1fae5" />
        <StatCard icon={FaCalendarCheck} label="Pending Budget" value={stats.pendingBudget} color="#ef4444" bgColor="#fee2e2" />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <div className="d-flex gap-2 p-3 border-bottom" style={{ borderColor: '#f1f5f9' }}>
          {[{ key: 'LABOR', label: 'Labor', icon: FaHardHat }, { key: 'EQUIPMENT', label: 'Equipment', icon: FaTractor }, { key: 'MATERIAL', label: 'Materials', icon: FaBox }].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '0.6rem 1.25rem', borderRadius: '50rem', border: 'none',
                fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                background: activeTab === tab.key ? '#eef2ff' : '#f8fafc',
                color: activeTab === tab.key ? '#4f46e5' : '#64748b',
                display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s'
              }}
            >
              <tab.icon size={13} /> {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: '#6366f1' }} /></div>
        ) : filteredResources.length === 0 ? (
          <EmptyState icon={FaTools} title={`No ${activeTab.toLowerCase()} resources`} message="Request new resources to start allocating them to projects." />
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resource Details</th>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cost Details</th>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Budget Status</th>
                  <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Availability</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.map(r => (
                  <tr key={r.resourceId || r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                        {r.type === 'LABOR' ? `${r.numberOfLabors} ${r.skillLevel} Personnel` : r.equipmentName}
                      </div>
                      <div className="text-muted small">ID: {r.resourceId}</div>
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>₹{r.costPerHour}/hr</div>
                      <div className="text-muted small">Total: ₹{r.totalCost?.toLocaleString()}</div>
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <StatusBadge status={r.budgetStatus || 'PENDING'} size="sm" />
                      {r.budgetRejectionReason && <div className="text-danger x-small mt-1" style={{ fontSize: '0.7rem' }}>{r.budgetRejectionReason}</div>}
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <span className={`badge rounded-pill ${r.availability === 'AVAILABLE' ? 'bg-success' : 'bg-warning'} bg-opacity-10 ${r.availability === 'AVAILABLE' ? 'text-success' : 'text-warning'} border-0`}>
                        {r.availability}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Resource Modal */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold h5">Request New Resource</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleCreate}>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Resource Type</Form.Label>
                <Form.Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="form-control border-0 bg-light p-3 rounded-4 shadow-none" style={{ height: 56 }}>
                  <option value="LABOR">Labor</option>
                  <option value="EQUIPMENT">Equipment</option>
                  <option value="MATERIAL">Material</option>
                </Form.Select>
              </div>
              <div className="col-md-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Project</Form.Label>
                <Form.Select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4 shadow-none" style={{ height: 56 }}>
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}
                </Form.Select>
              </div>
            </div>

            {form.type === 'LABOR' ? (
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <Form.Label className="small fw-bold text-uppercase opacity-75">Number of Labors</Form.Label>
                  <Form.Control type="number" value={form.numberOfLabors} onChange={e => setForm({ ...form, numberOfLabors: e.target.value })} className="form-control border-0 bg-light p-3 rounded-4" style={{ height: 56 }} />
                </div>
                <div className="col-md-6">
                  <Form.Label className="small fw-bold text-uppercase opacity-75">Skill Level</Form.Label>
                  <Form.Select value={form.skillLevel} onChange={e => setForm({ ...form, skillLevel: e.target.value })} className="form-control border-0 bg-light p-3 rounded-4 shadow-none" style={{ height: 56 }}>
                    <option value="SKILLED">Skilled</option>
                    <option value="SEMI_SKILLED">Semi-Skilled</option>
                    <option value="UNSKILLED">Unskilled</option>
                  </Form.Select>
                </div>
              </div>
            ) : (
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <Form.Label className="small fw-bold text-uppercase opacity-75">Equipment Name</Form.Label>
                  <Form.Control value={form.equipmentName} onChange={e => setForm({ ...form, equipmentName: e.target.value })} className="form-control border-0 bg-light p-3 rounded-4" style={{ height: 56 }} />
                </div>
                <div className="col-md-6">
                  <Form.Label className="small fw-bold text-uppercase opacity-75">Equipment Level</Form.Label>
                  <Form.Select value={form.equipmentLevel} onChange={e => setForm({ ...form, equipmentLevel: e.target.value })} className="form-control border-0 bg-light p-3 rounded-4 shadow-none" style={{ height: 56 }}>
                    <option value="HEAVY">Heavy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LIGHT">Light</option>
                  </Form.Select>
                </div>
              </div>
            )}

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Cost Per Hour (₹)</Form.Label>
                <Form.Control type="number" value={form.costPerHour} onChange={e => setForm({ ...form, costPerHour: e.target.value })} className="form-control border-0 bg-light p-3 rounded-4" style={{ height: 56 }} />
              </div>
              <div className="col-md-6">
                <Form.Label className="small fw-bold text-uppercase opacity-75">Total Hours Needed</Form.Label>
                <Form.Control type="number" value={form.totalHours} onChange={e => setForm({ ...form, totalHours: e.target.value })} className="form-control border-0 bg-light p-3 rounded-4" style={{ height: 56 }} />
              </div>
            </div>

            <div className="mb-4">
              <Form.Label className="small fw-bold text-uppercase opacity-75">Purpose / Requirement Details</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} required className="form-control border-0 bg-light p-3 rounded-4" placeholder="Explain why this resource is needed..." />
            </div>

            <div className="d-flex gap-3 justify-content-end pt-3">
              <Button variant="light" onClick={() => setShowCreate(false)} className="rounded-pill px-4 fw-bold border-0">Cancel</Button>
              <Button type="submit" disabled={submitting} className="rounded-pill px-5 fw-bold border-0 shadow-lg" style={{ background: '#4f46e5' }}>
                {submitting ? 'Submitting...' : 'Request Budget Approval'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ResourceOverview;
