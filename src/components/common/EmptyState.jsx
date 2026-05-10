import { FaInbox } from 'react-icons/fa';

const EmptyState = ({ icon: Icon = FaInbox, title = 'No data found', message = 'Try adjusting your filters', actionLabel, onAction }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', textAlign: 'center' }}>
    <div style={{
      width: 72, height: 72, borderRadius: '50%', background: '#f1f5f9',
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
    }}>
      <Icon size={28} style={{ color: '#cbd5e1' }} />
    </div>
    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#475569', marginBottom: 4 }}>{title}</div>
    <div style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: 320, marginBottom: actionLabel ? '1.25rem' : 0 }}>{message}</div>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        style={{
          padding: '0.6rem 1.5rem', background: '#6366f1', color: '#fff',
          borderRadius: '50rem', border: 'none', fontWeight: 600, fontSize: '0.85rem',
          cursor: 'pointer', transition: 'background 0.2s'
        }}
        onMouseEnter={e => e.target.style.background = '#4f46e5'}
        onMouseLeave={e => e.target.style.background = '#6366f1'}
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
