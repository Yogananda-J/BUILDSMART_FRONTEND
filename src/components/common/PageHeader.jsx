import { FaSync } from 'react-icons/fa';

const PageHeader = ({ title, subtitle, children }) => (
  <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', marginBottom: 2 }}>{title}</h1>
      {subtitle && <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>{subtitle}</p>}
    </div>
    {children && <div className="d-flex align-items-center gap-2 flex-wrap">{children}</div>}
  </div>
);

export const RefreshButton = ({ onClick, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '0.6rem 1.25rem', borderRadius: '50rem',
      background: '#eef2ff', color: '#4f46e5', border: 'none',
      fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
      transition: 'all 0.2s'
    }}
    onMouseEnter={e => { e.currentTarget.style.background = '#e0e7ff'; }}
    onMouseLeave={e => { e.currentTarget.style.background = '#eef2ff'; }}
  >
    <FaSync size={13} className={loading ? 'spin' : ''} /> Refresh
  </button>
);

export default PageHeader;
