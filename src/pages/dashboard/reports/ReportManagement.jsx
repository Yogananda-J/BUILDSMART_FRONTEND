import { useState, useEffect } from 'react';
import { generateReport, getReportHistory, exportReport } from '../../../api/reportApi';
import { toast } from '../../../utils/toast';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import { FaFileAlt, FaHistory, FaDownload, FaPlusCircle } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';

const ReportManagement = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [scope, setScope] = useState('PROJECT');
  const [targetId, setTargetId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [activeScope, setActiveScope] = useState('PROJECT');

  const fetchHistory = async (sc = activeScope) => {
    setLoading(true);
    try {
      const res = await getReportHistory(sc);
      setHistory(res.data?.data || res.data || []);
    } catch (err) {
      if (err.response?.status !== 403) {
        toast.error(`Failed to load ${sc} report history`);
      }
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [activeScope]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await generateReport({ scope, targetId: targetId || undefined });
      toast.success('Report generation started successfully');
      setShowModal(false);
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async (reportId) => {
    try {
      await exportReport(reportId);
      toast.success('Report export in progress. You will be notified when ready.');
    } catch (err) {
      toast.error('Failed to export report');
    }
  };

  return (
    <div>
      <PageHeader title="Report Generation" subtitle="Generate new analytical reports and access historical archives">
        <div className="d-flex gap-2">
          <Button 
            variant="primary" 
            className="rounded-pill px-4 d-flex align-items-center gap-2"
            onClick={() => setShowModal(true)}
            style={{ background: '#4f46e5', border: 'none' }}
          >
            <FaPlusCircle /> Generate New
          </Button>
          <RefreshButton onClick={() => fetchHistory()} loading={loading} />
        </div>
      </PageHeader>

      {/* Scope Tabs */}
      <div className="d-flex gap-2 mb-4 overflow-auto pb-2" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {['PROJECT', 'VENDOR', 'SAFETY', 'FINANCE', 'RESOURCE', 'SITE_ENGINEER'].map(sc => (
          <button
            key={sc}
            onClick={() => setActiveScope(sc)}
            className={`btn rounded-pill px-4 py-2 text-nowrap transition-all ${activeScope === sc ? 'btn-primary' : 'btn-light'}`}
            style={activeScope === sc ? { background: '#4f46e5', border: 'none' } : { color: '#64748b' }}
          >
            {sc.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 border-0">Report ID</th>
                <th className="py-3 border-0">Scope</th>
                <th className="py-3 border-0">Generated Date</th>
                <th className="px-4 py-3 border-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-5 text-muted">No historical reports found for this scope</td></tr>
              ) : (
                history.map(item => (
                  <tr key={item.reportId}>
                    <td className="px-4 py-3 fw-bold text-primary">{item.reportId}</td>
                    <td className="py-3"><span className="badge rounded-pill bg-light text-dark">{item.scope}</span></td>
                    <td className="py-3 text-muted">{new Date(item.generatedDate).toLocaleString()}</td>
                    <td className="px-4 py-3 text-end">
                      <button 
                        className="btn btn-sm btn-outline-primary rounded-pill px-3"
                        onClick={() => handleExport(item.reportId)}
                      >
                        <FaDownload size={12} className="me-2" /> Export
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="rounded-4">
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <Modal.Title className="fw-bold">Generate New Report</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleGenerate}>
          <Modal.Body className="px-4 pb-4">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small text-muted">Report Scope</Form.Label>
              <Form.Select 
                value={scope} 
                onChange={(e) => setScope(e.target.value)}
                className="rounded-3 py-2"
                required
              >
                <option value="PROJECT">Project</option>
                <option value="VENDOR">Vendor</option>
                <option value="SAFETY">Safety</option>
                <option value="FINANCE">Finance</option>
                <option value="RESOURCE">Resource</option>
                <option value="SITE_ENGINEER">Site Engineer</option>
              </Form.Select>
            </Form.Group>

            {(scope === 'PROJECT' || scope === 'VENDOR' || scope === 'SITE_ENGINEER') && (
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small text-muted">Target ID ({scope})</Form.Label>
                <Form.Control 
                  type="text" 
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  placeholder={`Enter ${scope.toLowerCase()} ID`}
                  className="rounded-3 py-2"
                  required
                />
              </Form.Group>
            )}
            
            <p className="small text-muted mt-2">
              <FaFileAlt className="me-2" />
              Generating a report will process current metrics and archive them for future access.
            </p>
          </Modal.Body>
          <Modal.Footer className="border-0 px-4 pb-4">
            <Button variant="light" onClick={() => setShowModal(false)} className="rounded-pill px-4">
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              className="rounded-pill px-4" 
              disabled={generating}
              style={{ background: '#4f46e5', border: 'none' }}
            >
              {generating ? 'Processing...' : 'Start Generation'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ReportManagement;
