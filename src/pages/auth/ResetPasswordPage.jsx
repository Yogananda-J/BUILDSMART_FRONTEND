import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPassword, validateResetToken } from '../../api/authApi';
import { validatePassword, validatePasswordMatch } from '../../utils/validation';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaChevronLeft } from 'react-icons/fa';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) validateToken();
    else { setTokenValid(false); setLoading(false); }
  }, [token]);

  const validateToken = async () => {
    try {
      const res = await validateResetToken(token);
      setTokenValid(res.data.valid !== false);
    } catch { setTokenValid(false); }
    finally { setLoading(false); }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const errs = {};
    const pv = validatePassword(formData.newPassword);
    if (!pv.valid) errs.newPassword = pv.message;
    const mv = validatePasswordMatch(formData.newPassword, formData.confirmPassword);
    if (!mv.valid) errs.confirmPassword = mv.message;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});
    if (!validateForm() || !tokenValid) return;
    setSubmitting(true);
    try {
      await resetPassword({ token, newPassword: formData.newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/auth/login'), 3000);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to reset password. Please try again.' });
    } finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border" style={{ color: '#4f46e5', width: 48, height: 48, marginBottom: 16 }} role="status" />
          <p style={{ color: '#64748b', fontWeight: 500 }}>Validating reset link…</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
        <div style={{
          width: '100%', maxWidth: 500, padding: '3rem',
          background: '#fff', borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <FaCheckCircle size={34} style={{ color: '#166534' }} />
          </div>
          <h2 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>Success!</h2>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your password has been reset successfully. Redirecting you to login...
          </p>
          <Link
            to="/auth/login"
            style={{
              padding: '0.75rem 2rem', background: '#4f46e5', color: '#fff',
              borderRadius: '50rem', fontWeight: 600, textDecoration: 'none', display: 'inline-block'
            }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
        <div style={{
          width: '100%', maxWidth: 500, padding: '3rem',
          background: '#fff', borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <FaTimesCircle size={34} style={{ color: '#dc2626' }} />
          </div>
          <h2 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>Link Expired</h2>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            This password reset link is invalid or has already been used.
          </p>
          <Link
            to="/forgot-password"
            style={{
              padding: '0.75rem 2rem', background: '#4f46e5', color: '#fff',
              borderRadius: '50rem', fontWeight: 600, textDecoration: 'none', display: 'inline-block'
            }}
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
      <div style={{
        width: '100%', maxWidth: 1000, minHeight: 600,
        background: '#fff', borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
        display: 'flex', overflow: 'hidden', position: 'relative'
      }}>
        {/* Left Side (Blue section) */}
        <div className="d-none d-md-flex" style={{
          flex: '0.8', background: '#4f46e5',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#fff', padding: '3rem', textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Secure.</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: 280 }}>
            Choose a strong password to keep your account safe and secure.
          </p>
        </div>

        {/* Right Side (Form) */}
        <div style={{
          flex: '1.2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '3rem', background: '#fff',
          borderTopLeftRadius: '60px', borderBottomLeftRadius: '60px',
          marginLeft: '-30px', zIndex: 2, boxShadow: '-10px 0 30px rgba(0,0,0,0.05)'
        }}>
          <div style={{ width: '100%', maxWidth: 360 }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>New Password</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Create a new password for your account</p>

            {errors.general && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#dc2626', fontSize: '0.875rem', textAlign: 'center' }}>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#d97706', background: '#fef3c7', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaLock style={{ fontSize: 10 }} />
                </div>
                <input
                  type={showNew ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%', padding: '1rem 3rem 1rem 3.5rem', background: '#f1f5f9', border: errors.newPassword ? '1px solid #ef4444' : 'none',
                    borderRadius: '50rem', fontSize: '1rem', color: '#334155', outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{
                    position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center'
                  }}
                >
                  {showNew ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              {errors.newPassword && <small style={{ color: '#ef4444', fontSize: '0.75rem', display: 'block', marginBottom: '1rem', paddingLeft: '1rem' }}>{errors.newPassword}</small>}

              <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#d97706', background: '#fef3c7', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaLock style={{ fontSize: 10 }} />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%', padding: '1rem 3rem 1rem 3.5rem', background: '#f1f5f9', border: errors.confirmPassword ? '1px solid #ef4444' : 'none',
                    borderRadius: '50rem', fontSize: '1rem', color: '#334155', outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center'
                  }}
                >
                  {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <small style={{ color: '#ef4444', fontSize: '0.75rem', display: 'block', marginBottom: '1rem', paddingLeft: '1rem' }}>{errors.confirmPassword}</small>}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%', padding: '1rem', background: '#4f46e5', color: '#fff', border: 'none',
                  borderRadius: '50rem', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em',
                  cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.3s'
                }}
                onMouseEnter={e => { if (!submitting) e.target.style.background = '#4338ca'; }}
                onMouseLeave={e => { if (!submitting) e.target.style.background = '#4f46e5'; }}
              >
                {submitting ? 'RESETTING...' : 'RESET PASSWORD'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
