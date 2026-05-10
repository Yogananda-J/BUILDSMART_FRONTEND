import { useState, useEffect } from 'react';
import { getApprovals, approveApproval, rejectApproval } from '../../../api/projectApi';
import { toast } from '../../../utils/toast';
import StatusBadge from '../../../components/common/StatusBadge';
import PageHeader, { RefreshButton } from '../../../components/common/PageHeader';
import EmptyState from '../../../components/common/EmptyState';
import { Modal, Form, Button } from 'react-bootstrap';
import { FaInbox, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';

const ApprovalInbox = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [actionModal, setActionModal] = useState({ show: false, type: '', id: '', comments: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getApprovals({ status: statusFilter === 'ALL' ? undefined : statusFilter });
      setApprovals(res.data || []);
    } catch (err) {
      toast.error('Failed to load approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [statusFilter]);

  const handleAction = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (actionModal.type === 'APPROVE') {
        await approveApproval(actionModal.id, { comments: actionModal.comments });
        toast.success('Approved successfully');
      } else {
        await rejectApproval(actionModal.id, { comments: actionModal.comments });
        toast.success('Rejected successfully');
      }
      setActionModal({ show: false, type: '', id: '', comments: '' });
      fetchData();
    } catch (err) {
      toast.error(`Failed to ${actionModal.type.toLowerCase()}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = approvals.filter(a => 
    !search || 
    a.referenceType?.toLowerCase().includes(search.toLowerCase()) || 
    a.referenceId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Approval Inbox" subtitle="Manage cross-module requests requiring your approval">
        <RefreshButton onClick={fetchData} loading={loading} />
      </PageHeader>

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        <div className="p-4" style={{ borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 15, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <FaSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }} />
            <input
              placeholder="Search reference ID or type..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '50rem', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f8fafc', padding: '0.4rem', borderRadius: '50rem' }}>
            {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: '50rem', border: 'none',
                  fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
                  background: statusFilter === status ? '#fff' : 'transparent',
                  color: statusFilter === status ? '#4f46e5' : '#64748b',
                  boxShadow: statusFilter === status ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
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
          <EmptyState icon={FaInbox} title="Inbox Zero" message="You have no pending approvals in this queue." />
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Module / Ref ID</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requested By</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app.approvalId || app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem' }}>{app.referenceType}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace', marginTop: 4, background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: 4, display: 'inline-block' }}>{app.referenceId}</div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>{app.requestedById || 'System'}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>{new Date(app.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}><StatusBadge status={app.status} size="sm" /></td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {app.status === 'PENDING' && (
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            onClick={() => setActionModal({ show: true, type: 'APPROVE', id: app.approvalId || app.id, comments: '' })}
                            style={{ padding: '0.35rem 0.75rem', background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '50rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <FaCheck size={10} /> Approve
                          </button>
                          <button
                            onClick={() => setActionModal({ show: true, type: 'REJECT', id: app.approvalId || app.id, comments: '' })}
                            style={{ padding: '0.35rem 0.75rem', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '50rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <FaTimes size={10} /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal show={actionModal.show} onHide={() => setActionModal({ show: false, type: '', id: '', comments: '' })} centered>
        <Modal.Header closeButton className="border-0 pb-0" style={{ padding: '1.5rem 1.5rem 0.5rem' }}>
          <Modal.Title style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>
            {actionModal.type === 'APPROVE' ? 'Approve Request' : 'Reject Request'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleAction}>
            <div className="mb-4">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Comments (Optional)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                value={actionModal.comments} 
                onChange={e => setActionModal({ ...actionModal, comments: e.target.value })} 
                style={{ borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0' }} 
                placeholder="Add any context for this decision..." 
              />
            </div>
            <div className="d-flex gap-3 justify-content-end pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
              <Button variant="light" onClick={() => setActionModal({ show: false, type: '', id: '', comments: '' })} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 1.75rem' }}>Cancel</Button>
              <Button 
                type="submit" 
                disabled={submitting} 
                style={{ 
                  borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 2rem', border: 'none',
                  background: actionModal.type === 'APPROVE' ? '#10b981' : '#ef4444', 
                }}
              >
                {submitting ? 'Processing...' : `Confirm ${actionModal.type === 'APPROVE' ? 'Approval' : 'Rejection'}`}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ApprovalInbox;
