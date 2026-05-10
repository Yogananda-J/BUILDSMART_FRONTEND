import { useState, useEffect } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';
import { FaBell, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import { getNotifications, getUnreadCount, markAsRead } from '../../api/notificationApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const [countRes, listRes] = await Promise.all([
        getUnreadCount().catch(() => ({ data: 0 })),
        getNotifications({ size: 5, sort: 'createdAt,desc' }).catch(() => ({ data: { content: [] } }))
      ]);
      setUnreadCount(countRes.data || 0);
      setNotifications(listRes.data?.content || listRes.data || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await markAsRead(id);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  return (
    <Dropdown align="end" show={isOpen} onToggle={(isOpen) => setIsOpen(isOpen)}>
      <Dropdown.Toggle 
        as="div" 
        style={{ cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', background: '#f8fafc', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}
        className="notification-toggle"
      >
        <FaBell size={18} color="#64748b" />
        {unreadCount > 0 && (
          <Badge bg="danger" pill style={{ position: 'absolute', top: -4, right: -4, fontSize: '0.65rem', border: '2px solid #fff' }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ width: 320, borderRadius: 16, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', padding: 0, overflow: 'hidden' }}>
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ background: '#f8fafc' }}>
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>Notifications</span>
          {unreadCount > 0 && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4f46e5', background: '#eef2ff', padding: '2px 8px', borderRadius: 10 }}>{unreadCount} New</span>}
        </div>
        
        <div style={{ maxHeight: 350, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <div className="text-center p-4" style={{ color: '#94a3b8' }}>
              <FaBell size={24} className="mb-2 opacity-50" />
              <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>No notifications</div>
            </div>
          ) : (
            notifications.map((n, index) => (
              <div 
                key={n.id || `notif-${index}-${n.createdAt}`} 
                className="d-flex p-3 border-bottom" 
                style={{ background: n.isRead ? '#fff' : '#f0f9ff', transition: 'background 0.2s', cursor: 'pointer' }}
                onClick={() => {
                  if (!n.isRead) handleMarkAsRead(n.id || n.notificationId, { stopPropagation: () => {} });
                  if (n.referenceId && n.referenceType) {
                    setIsOpen(false);
                  }
                }}
              >
                <div className="me-3 mt-1">
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: n.isRead ? '#f1f5f9' : '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaExclamationCircle size={14} color={n.isRead ? '#94a3b8' : '#3b82f6'} />
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div style={{ fontSize: '0.85rem', fontWeight: n.isRead ? 500 : 700, color: '#1e293b', marginBottom: 2 }}>{n.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.message}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 4 }}>{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {!n.isRead && (
                  <div className="ms-2">
                    <button 
                      onClick={(e) => handleMarkAsRead(n.id, e)}
                      style={{ background: 'none', border: 'none', color: '#4f46e5', padding: 4 }}
                      title="Mark as read"
                    >
                      <FaCheck size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;
