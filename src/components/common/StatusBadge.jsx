import { FaCheckCircle, FaClock, FaTimesCircle, FaPaperPlane, FaFileAlt, FaExclamationTriangle, FaBan } from 'react-icons/fa';

const STATUS_MAP = {
  // Universal workflow
  DRAFT:                { bg: '#f1f5f9', color: '#64748b', icon: FaFileAlt, label: 'Draft' },
  SUBMITTED:            { bg: '#eef2ff', color: '#4f46e5', icon: FaPaperPlane, label: 'Submitted' },
  PENDING:              { bg: '#fef3c7', color: '#b45309', icon: FaClock, label: 'Pending' },
  PENDING_VERIFICATION: { bg: '#fef3c7', color: '#b45309', icon: FaClock, label: 'Pending' },
  APPROVED:             { bg: '#d1fae5', color: '#065f46', icon: FaCheckCircle, label: 'Approved' },
  REJECTED:             { bg: '#fef2f2', color: '#dc2626', icon: FaTimesCircle, label: 'Rejected' },
  // Status
  ACTIVE:               { bg: '#d1fae5', color: '#065f46', icon: FaCheckCircle, label: 'Active' },
  INACTIVE:             { bg: '#f1f5f9', color: '#64748b', icon: FaBan, label: 'Inactive' },
  // Task/Progress
  NOT_STARTED:          { bg: '#f1f5f9', color: '#64748b', icon: FaClock, label: 'Not Started' },
  IN_PROGRESS:          { bg: '#dbeafe', color: '#1d4ed8', icon: FaClock, label: 'In Progress' },
  COMPLETED:            { bg: '#d1fae5', color: '#065f46', icon: FaCheckCircle, label: 'Completed' },
  CANCELLED:            { bg: '#fef2f2', color: '#dc2626', icon: FaBan, label: 'Cancelled' },
  // Issue/Incident
  OPEN:                 { bg: '#fef3c7', color: '#b45309', icon: FaExclamationTriangle, label: 'Open' },
  INVESTIGATING:        { bg: '#dbeafe', color: '#1d4ed8', icon: FaClock, label: 'Investigating' },
  RESOLVED:             { bg: '#d1fae5', color: '#065f46', icon: FaCheckCircle, label: 'Resolved' },
  CLOSED:               { bg: '#f1f5f9', color: '#64748b', icon: FaBan, label: 'Closed' },
  // Contract
  EXPIRED:              { bg: '#fef2f2', color: '#dc2626', icon: FaTimesCircle, label: 'Expired' },
  TERMINATED:           { bg: '#fef2f2', color: '#dc2626', icon: FaBan, label: 'Terminated' },
  // Safety
  SCHEDULED:            { bg: '#eef2ff', color: '#4f46e5', icon: FaClock, label: 'Scheduled' },
};

const StatusBadge = ({ status, label, size = 'md' }) => {
  const s = STATUS_MAP[status] || { bg: '#f1f5f9', color: '#64748b', icon: FaClock, label: status };
  const Icon = s.icon;
  const pad = size === 'sm' ? '0.2rem 0.6rem' : '0.35rem 0.85rem';
  const font = size === 'sm' ? '0.7rem' : '0.78rem';

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: pad, borderRadius: '50rem',
      background: s.bg, color: s.color,
      fontSize: font, fontWeight: 600, whiteSpace: 'nowrap',
      lineHeight: 1
    }}>
      <Icon size={size === 'sm' ? 9 : 11} />
      {label || s.label}
    </span>
  );
};

export default StatusBadge;
