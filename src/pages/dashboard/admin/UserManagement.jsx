import { useState, useEffect } from 'react';
import { getAllUsers, updateUser, deleteUser, getUsersByRole } from '../../../api/adminApi';
import { Modal, Button, Form, Badge, Dropdown } from 'react-bootstrap';
import {
  FaSearch, FaEdit, FaTrash, FaSyncAlt,
  FaUsers, FaUserCheck, FaUserClock, FaFilter,
  FaUser, FaPhone, FaUserShield, FaChevronDown, FaCheckCircle
} from 'react-icons/fa';
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

const STATUS_COLORS = {
  ACTIVE:               { bg: '#d1fae5', color: '#065f46' },
  INACTIVE:             { bg: '#f3f4f6', color: '#6b7280' },
  SUSPENDED:            { bg: '#fef2f2', color: '#991b1b' },
  PENDING_VERIFICATION: { bg: '#fef3c7', color: '#b45309' },
};

const RoleBadge = ({ role }) => {
  const s = ROLE_COLORS[role] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{ ...s, fontSize: '0.75rem', fontWeight: 600, padding: '6px 14px', borderRadius: '50rem', display: 'inline-block' }}>
      {role?.replace(/_/g, ' ')}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const s = STATUS_COLORS[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{ ...s, fontSize: '0.75rem', fontWeight: 600, padding: '6px 14px', borderRadius: '50rem', display: 'inline-block' }}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
};

const SkeletonRow = () => (
  <tr>
    {[...Array(6)].map((_, i) => (
      <td key={i}><div className="skeleton skeleton-text" style={{ width: i === 0 ? '80%' : i === 5 ? '60%' : '90%' }} /></td>
    ))}
  </tr>
);

const ITEMS_PER_PAGE = 10;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => { fetchUsers(); }, [roleFilter]);
  useEffect(() => { filterUsers(); }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = roleFilter ? await getUsersByRole(roleFilter) : await getAllUsers();
      setUsers(response.data.data || response.data || []);
    } catch {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    const q = searchTerm.toLowerCase();
    setFilteredUsers(
      users.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(q)
      )
    );
    setCurrentPage(1);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      await updateUser(editingUser.userId, {
        name: editingUser.name,
        phone: editingUser.phone,
        role: editingUser.role,
        status: editingUser.status,
      });
      setShowEditModal(false);
      await fetchUsers();
      toast.success('User updated successfully');
    } catch {
      toast.error('Failed to update user');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsProcessing(true);
      await deleteUser(userToDelete.userId);
      setShowDeleteModal(false);
      setUserToDelete(null);
      await fetchUsers();
      toast.success('User deleted successfully');
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setIsProcessing(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const pageItems = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Stats
  const active = users.filter(u => u.status === 'ACTIVE').length;
  const pending = users.filter(u => u.status === 'PENDING_VERIFICATION').length;

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="mb-0 fw-700" style={{ color: '#1e293b', fontWeight: 700 }}>User Management</h4>
          <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>Manage all system users, roles and access</p>
        </div>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" onClick={fetchUsers} disabled={loading}>
          <FaSyncAlt className={loading ? 'fa-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {[
          { icon: <FaUsers />, label: 'Total Users',   value: users.length,  color: '#4f46e5', bg: '#eef2ff' },
          { icon: <FaUserCheck />, label: 'Active',    value: active,        color: '#10b981', bg: '#d1fae5' },
          { icon: <FaUserClock />, label: 'Pending',   value: pending,       color: '#f59e0b', bg: '#fef3c7' },
          { icon: <FaFilter />,    label: 'Roles',     value: [...new Set(users.map(u => u.role))].length, color: '#8b5cf6', bg: '#ede9fe' },
        ].map(s => (
          <div key={s.label} className="col-6 col-md-3">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card mb-4" style={{ borderRadius: 12 }}>
        <div className="card-body py-3">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="position-relative">
                <FaSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 13 }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email or phone…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '2.25rem', height: 40 }}
                />
              </div>
            </div>
            <div className="col-md-4">
              <Dropdown className="w-100">
                <Dropdown.Toggle as="div" style={{ cursor: 'pointer', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4f46e5', fontSize: 13, zIndex: 5 }}>
                    <FaFilter />
                  </div>
                  <div className="form-control d-flex justify-content-between align-items-center" style={{ paddingLeft: '2.5rem', height: 40, borderRadius: 8, fontSize: '0.9rem', cursor: 'pointer' }}>
                    <span>{roleFilter ? roleFilter.replace('_', ' ') : 'All Roles'}</span>
                    <FaChevronDown style={{ fontSize: 10, color: '#94a3b8' }} />
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ width: '100%', borderRadius: 12, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,.1)', padding: '0.5rem', marginTop: '4px' }}>
                  <Dropdown.Item onClick={() => setRoleFilter('')} style={{ borderRadius: 8, fontSize: '0.85rem' }}>All Roles</Dropdown.Item>
                  <Dropdown.Divider />
                  {['ADMIN', 'PROJECT_MANAGER', 'SITE_ENGINEER', 'SAFETY_OFFICER', 'FINANCE_OFFICER', 'VENDOR'].map(role => (
                    <Dropdown.Item 
                      key={role} 
                      onClick={() => setRoleFilter(role)}
                      style={{ borderRadius: 8, fontSize: '0.85rem', color: roleFilter === role ? '#4f46e5' : '#334155', background: roleFilter === role ? '#eef2ff' : 'transparent' }}
                    >
                      {role.replace('_', ' ')}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-md-3 d-flex align-items-center gap-2">
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ borderRadius: 12, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '0.9rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                <th style={{ padding: '0.9rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</th>
                <th style={{ padding: '0.9rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</th>
                <th style={{ padding: '0.9rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
                <th style={{ padding: '0.9rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '0.9rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
              ) : pageItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <FaUsers size={40} style={{ color: '#cbd5e1', marginBottom: 12 }} />
                    <div style={{ color: '#94a3b8', fontWeight: 500 }}>No users found</div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Try adjusting your filters</div>
                  </td>
                </tr>
              ) : (
                pageItems.map(user => (
                  <tr key={user.userId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                          color: '#fff', fontWeight: 700, fontSize: '0.75rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {(user.name || '?').slice(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#475569' }}>{user.email}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#475569' }}>{user.phone}</td>
                    <td style={{ padding: '0.85rem 1rem' }}><RoleBadge role={user.role} /></td>
                    <td style={{ padding: '0.85rem 1rem' }}><StatusBadge status={user.status} /></td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button
                        className="btn btn-sm me-1"
                        title="Edit User"
                        onClick={() => { setEditingUser(user); setShowEditModal(true); }}
                        style={{ background: '#eef2ff', color: '#4f46e5', border: 'none', borderRadius: 8, width: 32, height: 32, padding: 0 }}
                        disabled={isProcessing}
                      >
                        <FaEdit size={13} />
                      </button>
                      <button
                        className="btn btn-sm"
                        title="Delete User"
                        onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }}
                        style={{ background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 8, width: 32, height: 32, padding: 0 }}
                        disabled={isProcessing}
                      >
                        <FaTrash size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex align-items-center justify-content-between px-4 py-3" style={{ borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Page {currentPage} of {totalPages}
            </span>
            <div className="d-flex gap-1">
              <button className="btn btn-sm btn-light" disabled={currentPage === 1} onClick={() => setCurrentPage(1)} style={{ borderRadius: 8 }}>«</button>
              <button className="btn btn-sm btn-light" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={{ borderRadius: 8 }}>‹</button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-light'}`}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{ borderRadius: 8, minWidth: 34 }}
                >
                  {i + 1}
                </button>
              ))}
              <button className="btn btn-sm btn-light" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} style={{ borderRadius: 8 }}>›</button>
              <button className="btn btn-sm btn-light" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} style={{ borderRadius: 8 }}>»</button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => !isProcessing && setShowEditModal(false)} centered size="md" className="confirmation-modal" backdrop={isProcessing ? 'static' : true} keyboard={!isProcessing}>
        <Modal.Header closeButton={!isProcessing} className="border-0 pb-0" style={{ padding: '1.5rem 1.5rem 0.5rem' }}>
          <Modal.Title style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>Edit User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4" style={{ background: '#fff' }}>
          <Form onSubmit={handleUpdate}>
            <div className="mb-4">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: 10, display: 'block' }}>Full Name</Form.Label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6366f1', background: '#e0e7ff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                  <FaUser style={{ fontSize: 9 }} />
                </div>
                <Form.Control
                  value={editingUser?.name || ''}
                  onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                  required 
                  style={{ height: 48, paddingLeft: '3rem', borderRadius: '50rem', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: 500 }}
                />
              </div>
            </div>

            <div className="mb-4">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: 10, display: 'block' }}>Phone Number</Form.Label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6366f1', background: '#e0e7ff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                  <FaPhone style={{ fontSize: 9 }} />
                </div>
                <Form.Control
                  type="tel"
                  value={editingUser?.phone || ''}
                  onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                  required 
                  style={{ height: 48, paddingLeft: '3rem', borderRadius: '50rem', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: 500 }}
                />
              </div>
            </div>

            <div className="row g-3 mb-5">
              <div className="col-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: 10, display: 'block' }}>Role</Form.Label>
                <Dropdown className="w-100">
                  <Dropdown.Toggle as="div" style={{ cursor: 'pointer', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6366f1', background: '#e0e7ff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                      <FaUserShield style={{ fontSize: 9 }} />
                    </div>
                    <div style={{
                      width: '100%', height: 48, padding: '0 1rem 0 3rem', background: '#f8fafc', border: '1px solid #e2e8f0',
                      borderRadius: '50rem', fontSize: '0.9rem', color: '#334155', fontWeight: 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <span>{editingUser?.role?.replace('_', ' ') || 'Select Role'}</span>
                      <FaChevronDown style={{ fontSize: 10, color: '#94a3b8' }} />
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ width: '100%', borderRadius: 16, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,.12)', padding: '0.5rem', marginTop: '0.5rem', zIndex: 1050 }}>
                    {['ADMIN', 'PROJECT_MANAGER', 'SITE_ENGINEER', 'SAFETY_OFFICER', 'FINANCE_OFFICER', 'VENDOR'].map(role => (
                      <Dropdown.Item 
                        key={role} 
                        onClick={() => setEditingUser({ ...editingUser, role })} 
                        style={{ borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.9rem', fontWeight: 500, color: editingUser?.role === role ? '#4f46e5' : '#334155', background: editingUser?.role === role ? '#eef2ff' : 'transparent' }}
                      >
                        {role.replace('_', ' ')}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="col-6">
                <Form.Label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: 10, display: 'block' }}>Status</Form.Label>
                <Dropdown className="w-100">
                  <Dropdown.Toggle as="div" style={{ cursor: 'pointer', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#10b981', background: '#d1fae5', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                      <FaCheckCircle style={{ fontSize: 9 }} />
                    </div>
                    <div style={{
                      width: '100%', height: 48, padding: '0 1rem 0 3rem', background: '#f8fafc', border: '1px solid #e2e8f0',
                      borderRadius: '50rem', fontSize: '0.9rem', color: '#334155', fontWeight: 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <span>{editingUser?.status?.replace('_', ' ') || 'Select Status'}</span>
                      <FaChevronDown style={{ fontSize: 10, color: '#94a3b8' }} />
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ width: '100%', borderRadius: 16, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,.12)', padding: '0.5rem', marginTop: '0.5rem', zIndex: 1050 }}>
                    {['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'].map(status => (
                      <Dropdown.Item 
                        key={status} 
                        onClick={() => setEditingUser({ ...editingUser, status })} 
                        style={{ 
                          borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.9rem', fontWeight: 500, 
                          color: editingUser?.status === status ? (STATUS_COLORS[status]?.color || '#4f46e5') : '#334155', 
                          background: editingUser?.status === status ? (STATUS_COLORS[status]?.bg || '#eef2ff') : 'transparent' 
                        }}
                      >
                        {status.replace(/_/g, ' ')}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className="d-flex gap-3 justify-content-end pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
              <Button variant="light" onClick={() => setShowEditModal(false)} disabled={isProcessing} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 1.75rem', background: '#f1f5f9', border: 'none' }}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isProcessing} style={{ borderRadius: '50rem', fontWeight: 600, padding: '0.75rem 2rem', background: '#4f46e5', border: 'none', boxShadow: '0 4px 12px rgba(79,70,229,0.2)' }}>
                {isProcessing ? (
                  <div className="d-flex align-items-center gap-2">
                    <span className="spinner-border spinner-border-sm" />
                    Saving...
                  </div>
                ) : 'Save Changes'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => { setShowDeleteModal(false); setUserToDelete(null); }}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to permanently delete "${userToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default UserManagement;
