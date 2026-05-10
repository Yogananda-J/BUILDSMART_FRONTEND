import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi';
import { FaEnvelope, FaPaperPlane, FaChevronLeft } from 'react-icons/fa';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
        <div style={{
          width: '100%', maxWidth: 500, padding: '3rem',
          background: '#fff', borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <FaPaperPlane size={34} style={{ color: '#4f46e5' }} />
          </div>
          <h2 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>Check Your Email</h2>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            We've sent a password reset link to <br/><strong>{email}</strong>. Please check your inbox.
          </p>
          <Link
            to="/auth/login"
            style={{
              padding: '0.75rem 2rem', background: '#4f46e5', color: '#fff',
              borderRadius: '50rem', fontWeight: 600, textDecoration: 'none', display: 'inline-block'
            }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
      <div style={{
        width: '100%', maxWidth: 1000, minHeight: 500,
        background: '#fff', borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
        display: 'flex', overflow: 'hidden', position: 'relative'
      }}>
        {/* Left Side (Blue section) */}
        <div className="d-none d-md-flex" style={{
          flex: '0.8', background: '#4f46e5',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#fff', padding: '3rem', textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Forgot?</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: 280 }}>
            Don't worry! It happens to the best of us. Just enter your email to get back on track.
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
            <Link to="/auth/login" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4f46e5', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <FaChevronLeft size={10} /> Back to Login
            </Link>
            
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Reset Password</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Enter your email to receive a reset link</p>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#dc2626', fontSize: '0.875rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#4f46e5', background: '#e0e7ff', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaEnvelope style={{ fontSize: 10 }} />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '1rem 1rem 1rem 3.5rem', background: '#f1f5f9', border: 'none',
                    borderRadius: '50rem', fontSize: '1rem', color: '#334155', outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '1rem', background: '#4f46e5', color: '#fff', border: 'none',
                  borderRadius: '50rem', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em',
                  cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s'
                }}
                onMouseEnter={e => { if (!loading) e.target.style.background = '#4338ca'; }}
                onMouseLeave={e => { if (!loading) e.target.style.background = '#4f46e5'; }}
              >
                {loading ? 'SENDING LINK...' : 'SEND RESET LINK'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
