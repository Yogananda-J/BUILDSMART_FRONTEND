import { useState, useEffect, useRef } from 'react';
import { getAuditLogs, getAuditLogsByUser, getUserById } from '../../../api/adminApi';
import { FaSearch, FaSyncAlt, FaClipboardList, FaUser, FaClock, FaFingerprint, FaInfoCircle, FaFilter } from 'react-icons/fa';
import { toast } from '../../../utils/toast';

const ACTION_STYLES = {
  Login:          { bg: '#dbeafe', color: '#1d4ed8', label: 'Login' },
  LOGIN_SUCCESS:  { bg: '#dbeafe', color: '#1d4ed8', label: 'Login' },
  LOGOUT:         { bg: '#f3f4f6', color: '#4b5563', label: 'Logout' },
  USER_APPROVED:  { bg: '#d1fae5', color: '#065f46', label: 'Approved' },
  USER_REJECTED:  { bg: '#fee2e2', color: '#b91c1c', label: 'Rejected' },
  USER_UPDATED:   { bg: '#e0e7ff', color: '#4338ca', label: 'Updated' },
  Updated:        { bg: '#e0e7ff', color: '#4338ca', label: 'Updated' },
  Rejected:       { bg: '#fee2e2', color: '#b91c1c', label: 'Rejected' },
  PASSWORD_RESET: { bg: '#fef3c7', color: '#b45309', label: 'Pwd Reset' },
};

const ActionBadge = ({ action }) => {
  const s = ACTION_STYLES[action] || { bg: '#f3f4f6', color: '#374151', label: action };
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: '0.75rem', fontWeight: 600,
      padding: '6px 14px', borderRadius: '50rem',
      display: 'inline-block', whiteSpace: 'nowrap',
    }}>
      {s.label || action?.replace(/_/g, ' ')}
    </span>
  );
};

const SkeletonRow = () => (
  <tr>
    {[...Array(5)].map((_, i) => (
      <td key={i} style={{ padding: '0.85rem 1rem' }}>
        <div className="skeleton skeleton-text" style={{ width: i === 3 ? '80%' : '60%' }} />
      </td>
    ))}
  </tr>
);

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [userIdFilter, setUserIdFilter] = useState('');
  const [usernameFilter, setUsernameFilter] = useState('');
  const [usernames, setUsernames] = useState({});
  const usernameCache = useRef({});

  useEffect(() => { fetchAuditLogs(); }, [page, userIdFilter]);

  useEffect(() => {
    const fetchUsernames = async () => {
      const uniqueIds = [...new Set(logs.map(l => l.userId).filter(Boolean))];
      const missing = uniqueIds.filter(id => !usernameCache.current[id]);
      await Promise.all(
        missing.map(async id => {
          try {
            const res = await getUserById(id);
            usernameCache.current[id] = res.data.data?.name || res.data.name || 'Unknown';
          } catch {
            usernameCache.current[id] = 'Unknown';
          }
        })
      );
      setUsernames({ ...usernameCache.current });
    };
    if (logs.length > 0) fetchUsernames();
  }, [logs]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      let response;
      if (userIdFilter) {
        response = await getAuditLogsByUser(userIdFilter);
        setLogs(response.data.data || []);
        setTotalPages(1);
      } else {
        response = await getAuditLogs({ page, size });
        setLogs(response.data.data?.content || response.data.data || response.data || []);
        setTotalPages(response.data.data?.totalPages || 1);
      }
    } catch {
      toast.error('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchId = !userIdFilter || log.userId?.includes(userIdFilter);
    const matchName = !usernameFilter ||
      (usernames[log.userId] || '').toLowerCase().includes(usernameFilter.toLowerCase());
    return matchId && matchName;
  });

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="mb-0" style={{ fontWeight: 700, color: '#1e293b' }}>Audit Logs</h4>
          <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
            {filteredLogs.length} log entr{filteredLogs.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" onClick={fetchAuditLogs}>
          <FaSyncAlt /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4" style={{ borderRadius: 12 }}>
        <div className="card-body py-3">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="position-relative">
                <FaUser style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 12 }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by User ID…"
                  value={userIdFilter}
                  onChange={e => { setUserIdFilter(e.target.value); setPage(0); }}
                  style={{ paddingLeft: '2.2rem', height: 40 }}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="position-relative">
                <FaSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 12 }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by Username…"
                  value={usernameFilter}
                  onChange={e => setUsernameFilter(e.target.value)}
                  style={{ paddingLeft: '2.2rem', height: 40 }}
                />
              </div>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-primary w-100"
                onClick={() => { setPage(0); fetchAuditLogs(); }}
                style={{ height: 40, borderRadius: 8, fontWeight: 600, fontSize: '0.875rem' }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ borderRadius: 12, overflow: 'hidden' }}>
        <div
          className="table-responsive"
          style={{ maxHeight: 560, overflowY: 'auto' }}
        >
          <table className="table table-hover align-middle mb-0">
            <thead style={{ background: '#f8fafc', position: 'sticky', top: 0, zIndex: 1 }}>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                {['User ID', 'Username', 'Action', 'Details', 'Timestamp'].map(h => (
                  <th key={h} style={{ padding: '0.9rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5">
                    <FaClipboardList size={40} style={{ color: '#cbd5e1', marginBottom: 12 }} />
                    <div style={{ color: '#94a3b8', fontWeight: 500 }}>No audit logs found</div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Try adjusting your filters</div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => (
                  <tr key={log.logId || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.25rem 0.75rem', background: '#f1f5f9', color: '#64748b', borderRadius: '50rem', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'monospace', border: '1px solid #e2e8f0' }}>
                        <FaFingerprint size={10} style={{ opacity: 0.7 }} />
                        {log.userId || '—'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500, color: '#1e293b' }}>
                      <div className="d-flex align-items-center gap-2">
                        {usernames[log.userId] ? (
                          <>
                            <div style={{
                              width: 32, height: 32, borderRadius: '50%',
                              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                              color: '#fff', fontWeight: 700, fontSize: '0.75rem',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0, boxShadow: '0 2px 4px rgba(99,102,241,0.2)'
                            }}>
                              {usernames[log.userId].slice(0, 2).toUpperCase()}
                            </div>
                            <span>{usernames[log.userId]}</span>
                          </>
                        ) : (
                          <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.8rem' }}>Loading…</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <ActionBadge action={log.action} />
                    </td>
                    <td style={{ padding: '1rem', maxWidth: 300 }} title={log.details}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '0.5rem 0.85rem', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                        <FaInfoCircle size={12} style={{ color: '#94a3b8', marginTop: 3 }} />
                        <span style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.4 }}>{log.details || '—'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.35rem 0.75rem', background: '#eef2ff', color: '#6366f1', borderRadius: '50rem', fontSize: '0.78rem', fontWeight: 600 }}>
                        <FaClock size={11} />
                        {new Date(log.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && !userIdFilter && (
          <div className="d-flex align-items-center justify-content-between px-4 py-3" style={{ borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Page {page + 1} of {totalPages}</span>
            <div className="d-flex gap-1">
              <button className="btn btn-sm btn-light" disabled={page === 0} onClick={() => setPage(0)} style={{ borderRadius: 8 }}>«</button>
              <button className="btn btn-sm btn-light" disabled={page === 0} onClick={() => setPage(p => p - 1)} style={{ borderRadius: 8 }}>‹</button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                <button key={i} className={`btn btn-sm ${page === i ? 'btn-primary' : 'btn-light'}`} onClick={() => setPage(i)} style={{ borderRadius: 8, minWidth: 34 }}>{i + 1}</button>
              ))}
              <button className="btn btn-sm btn-light" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} style={{ borderRadius: 8 }}>›</button>
              <button className="btn btn-sm btn-light" disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)} style={{ borderRadius: 8 }}>»</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
