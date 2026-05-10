import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../../api/userApi';

const UserProfile = () => {
  const { user, login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      const userData = response.data.data || response.data;
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || ''
      });
    } catch (err) {
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setUpdating(true);

    try {
      const response = await updateUserProfile(formData);
      const updatedUser = response.data.data || response.data;
      authLogin(updatedUser);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="page-enter">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="bi bi-person text-white" style={{ fontSize: '1.5rem' }}></i>
        </div>
        <div>
          <h4 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>Personal Information</h4>
          <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>Manage your profile details and contact info</p>
        </div>
      </div>

      {error && <div className="alert alert-danger" style={{ borderRadius: 12 }}>{error}</div>}
      {success && <div className="alert alert-success" style={{ borderRadius: 12 }}>Profile updated successfully!</div>}

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="row g-4">
          <div className="col-md-6">
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Role</label>
            <input
              type="text"
              className="form-control"
              value={user?.role?.replace(/_/g, ' ') || ''}
              disabled
              style={{ height: 48, borderRadius: 12, background: '#f1f5f9', border: 'none', color: '#64748b', fontWeight: 500 }}
            />
          </div>
          <div className="col-md-6">
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Status</label>
            <div style={{ height: 48, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', paddingLeft: '1rem' }}>
              <span style={{
                fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '50rem',
                background: (user?.status || 'ACTIVE') === 'ACTIVE' ? '#dcfce7' : '#fef3c7',
                color: (user?.status || 'ACTIVE') === 'ACTIVE' ? '#166534' : '#92400e'
              }}>
                {user?.status || 'ACTIVE'}
              </span>
            </div>
          </div>
          <div className="col-md-12">
            <label htmlFor="name" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>Full Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ height: 48, borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '1rem', color: '#1e293b' }}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="email" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              disabled
              style={{ height: 48, borderRadius: 12, background: '#f1f5f9', border: 'none', color: '#64748b' }}
            />
            <small style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>Email cannot be changed</small>
          </div>
          <div className="col-md-6">
            <label htmlFor="phone" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>Phone Number</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{ height: 48, borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '1rem', color: '#1e293b' }}
            />
          </div>
        </div>
        
        <div className="mt-5 pt-3 border-top d-flex justify-content-end">
          <button type="submit" className="btn btn-primary" disabled={updating} style={{ borderRadius: 10, padding: '0.6rem 1.5rem', fontWeight: 600, background: '#4f46e5', border: 'none' }}>
            {updating ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
