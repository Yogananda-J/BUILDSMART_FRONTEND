import { useState, useEffect } from 'react';
import { getDocuments, uploadDocument } from '../../../api/vendorApi';
import { toast } from '../../../utils/toast';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaFileAlt, FaPlus, FaCloudUploadAlt, FaDownload } from 'react-icons/fa';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState({ documentName: '', documentType: 'INSURANCE', contractId: '' });
  const [file, setFile] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getDocuments();
      setDocuments(res.data || []);
    } catch (err) {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentName', form.documentName);
      formData.append('documentType', form.documentType);
      if (form.contractId) {
        formData.append('contractId', form.contractId);
      }

      await uploadDocument(formData);
      toast.success('Document uploaded successfully');
      setShowUpload(false);
      setForm({ documentName: '', documentType: 'INSURANCE', contractId: '' });
      setFile(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Compliance Documents" subtitle="Manage licenses, insurance, and compliance certifications">
        <RefreshButton onClick={fetchData} loading={loading} />
        <button
          onClick={() => setShowUpload(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0.6rem 1.25rem', borderRadius: '50rem',
            background: '#6366f1', color: '#fff', border: 'none',
            fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
          }}
        >
          <FaPlus size={12} /> Upload Document
        </button>
      </PageHeader>

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: '#6366f1' }} /></div>
        ) : documents.length === 0 ? (
          <EmptyState icon={FaFileAlt} title="No documents found" message="Upload your compliance documents." actionLabel="Upload Now" onAction={() => setShowUpload(true)} />
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Document Name</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ref Contract</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upload Date</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(d => (
                  <tr key={d.documentId || d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>{d.documentName}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>{d.documentType?.replace('_', ' ')}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace' }}>{d.contractId || '—'}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>{new Date(d.uploadedAt || d.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => window.open(d.documentUrl || d.url, '_blank')}
                        style={{ padding: '0.35rem 0.75rem', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '50rem', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <FaDownload size={10} /> View / Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal show={showUpload} onHide={() => setShowUpload(false)} centered size="md">
        <Modal.Header closeButton className="border-0 pb-0" style={{ padding: '1.5rem 1.5rem 0.5rem' }}>
          <Modal.Title style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>Upload Compliance Document</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleUpload}>
            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Document Name</Form.Label>
              <Form.Control value={form.documentName} onChange={e => setForm({ ...form, documentName: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} placeholder="e.g. 2026 Liability Insurance" />
            </div>
            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Document Type</Form.Label>
              <Form.Select value={form.documentType} onChange={e => setForm({ ...form, documentType: e.target.value })} required style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }}>
                <option value="INSURANCE">Insurance Certificate</option>
                <option value="LICENSE">Business License</option>
                <option value="CERTIFICATION">Safety Certification</option>
                <option value="TAX_FORM">Tax Form (e.g., W-9)</option>
                <option value="OTHER">Other Compliance Doc</option>
              </Form.Select>
            </div>
            <div className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Contract Reference ID (Optional)</Form.Label>
              <Form.Control value={form.contractId} onChange={e => setForm({ ...form, contractId: e.target.value })} style={{ borderRadius: '50rem', height: 48, background: '#f8fafc' }} placeholder="e.g. C-12345" />
            </div>
            <div className="mb-4">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Select File</Form.Label>
              <input 
                type="file" 
                onChange={e => setFile(e.target.files[0])}
                className="form-control"
                style={{ borderRadius: '50rem', height: 48, background: '#f8fafc', padding: '0.6rem 1rem' }} 
                required
              />
            </div>
            <div className="d-flex gap-3 justify-content-end pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
              <Button variant="light" onClick={() => setShowUpload(false)} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 1.75rem' }}>Cancel</Button>
              <Button type="submit" disabled={submitting} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 2rem', background: '#4f46e5', border: 'none' }} className="d-flex align-items-center gap-2">
                <FaCloudUploadAlt /> {submitting ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Documents;
