import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserShield } from 'react-icons/fa';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login(formData);
      const data = response.data;
      
      // Extremely thorough token and user extraction
      const token = data.token || data.accessToken || (data.data && (data.data.token || data.data.accessToken));
      const user = data.user || (data.data && data.data.user ? data.data.user : (data.data || data));
      
      console.log('Login success. Data:', data);
      console.log('Extracted User:', user);
      console.log('Extracted Token (exists):', !!token);

      if (!token) throw new Error('No authentication token received from server');
      
      localStorage.setItem('token', token);
      authLogin(user);

      // Normalize role: remove ROLE_ prefix, trim, and uppercase
      const rawRole = user.role || '';
      const role = String(rawRole).toUpperCase().replace('ROLE_', '').trim();
      
      console.log('Normalized Role:', role);

      let route = '/dashboard';
      
      if (user.status === 'PENDING_VERIFICATION') {
        route = '/auth/pending';
      } else {
        switch (role) {
          case 'ADMIN': route = '/dashboard/admin/users'; break;
          case 'PROJECT_MANAGER': route = '/dashboard/pm'; break;
          case 'FINANCE_OFFICER': route = '/dashboard/finance'; break;
          case 'SAFETY_OFFICER': route = '/dashboard/safety'; break;
          case 'SITE_ENGINEER': route = '/dashboard/site'; break;
          case 'VENDOR': 
          case 'VENDOR_MANAGER':
            route = '/dashboard/vendor'; break;
          default: 
            console.warn('Unknown role normalized as:', role);
            route = '/dashboard/profile';
        }
      }
      
      console.log('Redirecting to:', route);
      // Small delay to ensure localStorage is settled in all browsers
      setTimeout(() => navigate(route), 100);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>New here?</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: 280 }}>
            Join us today and discover a world of possibilities. Create your account in seconds!
          </p>
          <Link
            to="/auth/register"
            style={{
              padding: '0.75rem 2.5rem', border: '2px solid #fff', borderRadius: '50rem',
              color: '#fff', fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s',
              background: 'transparent'
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; }}
          >
            SIGN UP
          </Link>
        </div>

        {/* Right Side (Login Form) */}
        <div style={{
          flex: '1.2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '3rem', background: '#fff',
          borderTopLeftRadius: '60px', borderBottomLeftRadius: '60px',
          marginLeft: '-30px', zIndex: 2, boxShadow: '-10px 0 30px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#334155', marginBottom: '2rem' }}>Sign in</h2>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#dc2626', fontSize: '0.875rem', width: '100%', maxWidth: 360, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 360 }}>
            {/* Email Field */}
            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
              <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#4f46e5', background: '#e0e7ff', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaEnvelope style={{ fontSize: 10 }} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%', padding: '1rem 1rem 1rem 3.5rem', background: '#f1f5f9', border: 'none',
                  borderRadius: '50rem', fontSize: '1rem', color: '#334155', outline: 'none'
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
              <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#d97706', background: '#fef3c7', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaLock style={{ fontSize: 10 }} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%', padding: '1rem 3rem 1rem 3.5rem', background: '#f1f5f9', border: 'none',
                  borderRadius: '50rem', fontSize: '1rem', color: '#334155', outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center'
                }}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            
            <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '1rem', background: '#4f46e5', color: '#fff', border: 'none',
                borderRadius: '50rem', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', marginBottom: '2rem'
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#4338ca'; }}
              onMouseLeave={e => { if (!loading) e.target.style.background = '#4f46e5'; }}
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>

          {/* Social Logins */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1rem' }}>Or sign in with social platforms</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              {[
                { icon: 'G', color: '#ea4335' },
                { icon: 'f', color: '#1877f2' },
                { icon: 'in', color: '#0a66c2' }
              ].map((social, i) => (
                <button key={i} style={{
                  width: 44, height: 44, borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  color: social.color, fontSize: '1.1rem', transition: 'all 0.2s', fontWeight: 'bold'
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>
          
          <div className="d-md-none mt-4">
             <Link to="/auth/register" style={{ color: '#4f46e5', fontWeight: 600 }}>Create an account</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
