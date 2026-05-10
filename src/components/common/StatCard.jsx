const StatCard = ({ icon: Icon, label, value, color = '#6366f1', bgColor = '#eef2ff', trend, trendLabel }) => (
  <div style={{
    background: '#fff', borderRadius: 16, padding: '1.25rem 1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
    display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 200
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 14,
      background: bgColor, color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0
    }}>
      <Icon size={22} />
    </div>
    <div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500, marginTop: 2 }}>{label}</div>
      {trend !== undefined && (
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: trend >= 0 ? '#10b981' : '#ef4444', marginTop: 4 }}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel || ''}
        </div>
      )}
    </div>
  </div>
);

export default StatCard;
