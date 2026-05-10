import { useState, useEffect } from 'react';
import { getPendingUsers, approveUser, rejectUser } from '../../../api/adminApi';
import { FaUserClock, FaCheck, FaTimes, FaSyncAlt, FaEnvelope, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import { toast } from '../../../utils/toast';
import ConfirmationModal from '../../../components/ConfirmationModal';

const ROLE_COLORS = {
  ADMIN:           { bg: '#fef3c7', color: '#b45309' },
  PROJECT_MANAGER: { bg: '#e0e7ff', color: '#4338ca' },
  SITE_ENGINEER:   { bg: '#d1fae5', color: '#065f46' },
  SAFETY_OFFICER:  { bg: '#dcfce7', color: '#15803d' },
  FINANCE_OFFICER: { bg: '#ede9fe', color: '#6d28d9' },
  VENDOR:          { bg: '#f3f4f6', color: '#374151' },
};

const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

const GRADIENT_COLORS = [
  'linear-gradient(135deg,#4f46e5,#7c3aed)',
  'linear-gradient(135deg,#0ea5e9,#2563eb)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#f59e0b,#d97706)',
  'linear-gradient(135deg,#ec4899,#be185d)',
];

const SkeletonCard = () => (
  <div className="col-sm-6 col-lg-4">
    <div className="card h-100 p-3">
      <div className="d-flex align-items-center gap-3 mb-3">
        <div className="skeleton" style={{ width: 52, height: 52, borderRadius: '50%' }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton-text" style={{ width: '70%' }} />
          <div className="skeleton skeleton-text" style={{ width: '40%' }} />
        </div>
      </div>
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" style={{ width: '80%' }} />
      <div className="d-flex gap-2 mt-3">
        <div className="skeleton" style={{ height: 36, flex: 1, borderRadius: 8 }} />
        <div className="skeleton" style={{ height: 36, flex: 1, borderRadius: 8 }} />
      </div>
    </div>
  </div>
);

const PendingApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => { fetchPendingUsers(); }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await getPendingUsers();
      setPendingUsers(response.data.data || response.data || []);
    } catch {
      toast.error('Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      await approveUser(selectedUser.userId);
      setShowApproveModal(false);
      setSelectedUser(null);
      await fetchPendingUsers();
      toast.success('User approved successfully');
    } catch {
      toast.error('Failed to approve user');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsProcessing(true);
      await rejectUser(selectedUser.userId);
      setShowRejectModal(false);
      setSelectedUser(null);
      await fetchPendingUsers();
      toast.success('User rejected successfully');
    } catch {
      toast.error('Failed to reject user');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="mb-0" style={{ fontWeight: 700, color: '#1e293b' }}>Pending Approvals</h4>
          <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
            {pendingUsers.length} user{pendingUsers.length !== 1 ? 's' : ''} waiting for approval
          </p>
        </div>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" onClick={fetchPendingUsers} disabled={loading}>
          <FaSyncAlt className={loading ? 'fa-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="row g-3">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : pendingUsers.length === 0 ? (
        /* Empty State */
        <div
          className="d-flex flex-column align-items-center justify-content-center text-center"
          style={{ minHeight: 400, background: '#fff', borderRadius: 16, border: '2px dashed #e2e8f0' }}
        >
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            background: '#f0fdf4', display: 'flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: '1.25rem',
          }}>
            <FaUserClock size={42} style={{ color: '#10b981' }} />
          </div>
          <h5 style={{ fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>All Clear!</h5>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: 300, margin: 0 }}>
            No pending approvals at the moment. All users have been reviewed.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {pendingUsers.map((user, idx) => {
            const roleStyle = ROLE_COLORS[user.role] || { bg: '#f3f4f6', color: '#374151' };
            const gradient = GRADIENT_COLORS[idx % GRADIENT_COLORS.length];
            return (
              <div key={user.userId} className="col-sm-6 col-lg-4">
                <div className="pending-card h-100 p-0" style={{ overflow: 'hidden' }}>
                  {/* Color accent bar */}
                  <div style={{ height: 4, background: gradient }} />
                  <div className="p-4">
                    {/* Avatar + Name */}
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="avatar-circle" style={{ background: gradient }}>
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{user.name}</div>
                        <span style={{ ...roleStyle, fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: 20, display: 'inline-block' }}>
                          {user.role?.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mb-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div className="d-flex align-items-center gap-2">
                        <FaEnvelope style={{ color: '#94a3b8', fontSize: 12, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.8rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.email}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <FaPhone style={{ color: '#94a3b8', fontSize: 12, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.8rem', color: '#475569' }}>{user.phone}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <FaCalendarAlt style={{ color: '#94a3b8', fontSize: 12, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                          Registered {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1 fw-semibold"
                        style={{ background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: 8, height: 38, transition: 'all 0.2s' }}
                        onClick={() => { setSelectedUser(user); setShowApproveModal(true); }}
                        onMouseEnter={e => e.currentTarget.style.background = '#a7f3d0'}
                        onMouseLeave={e => e.currentTarget.style.background = '#d1fae5'}
                        disabled={isProcessing}
                      >
                        <FaCheck size={12} /> Approve
                      </button>
                      <button
                        className="btn btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1 fw-semibold"
                        style={{ background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 8, height: 38, transition: 'all 0.2s' }}
                        onClick={() => { setSelectedUser(user); setShowRejectModal(true); }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}
                        disabled={isProcessing}
                      >
                        <FaTimes size={12} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <ConfirmationModal
        show={showApproveModal}
        onHide={() => { setShowApproveModal(false); setSelectedUser(null); }}
        onConfirm={handleApprove}
        title="Approve User"
        message={`Approve "${selectedUser?.name}" and grant them access to the system?`}
        confirmText="Approve"
        cancelText="Cancel"
        variant="success"
        isLoading={isProcessing}
      />
      <ConfirmationModal
        show={showRejectModal}
        onHide={() => { setShowRejectModal(false); setSelectedUser(null); }}
        onConfirm={handleReject}
        title="Reject User"
        message={`Reject "${selectedUser?.name}"? They will not be granted access.`}
        confirmText="Reject"
        cancelText="Cancel"
        variant="danger"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default PendingApprovals;
