import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup, checkUsername } from '../../api/authApi';
import { validatePassword, validatePhone, validateEmail, validateUsername, validatePasswordMatch } from '../../utils/validation';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaUserShield, FaCheckCircle, FaChevronDown } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'SITE_ENGINEER', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    if (name === 'name' && value.length >= 3) checkUsernameAvailability(value);
    else if (name === 'name') setUsernameAvailable(null);
  };

  const handleRoleChange = (roleValue) => {
    setFormData({ ...formData, role: roleValue });
  };

  const checkUsernameAvailability = async username => {
    try {
      setCheckingUsername(true);
      const res = await checkUsername(username);
      setUsernameAvailable(res.data.available === true || res.data === true);
    } catch { setUsernameAvailable(null); }
    finally { setCheckingUsername(false); }
  };

  const validateForm = () => {
    const errs = {};
    const uv = validateUsername(formData.name);
    if (!uv.valid) errs.name = uv.message;
    else if (usernameAvailable === false) errs.name = 'Username is already taken';
    const ev = validateEmail(formData.email);
    if (!ev.valid) errs.email = ev.message;
    const pv = validatePhone(formData.phone);
    if (!pv.valid) errs.phone = pv.message;
    const passv = validatePassword(formData.password);
    if (!passv.valid) errs.password = passv.message;
    const mv = validatePasswordMatch(formData.password, formData.confirmPassword);
    if (!mv.valid) errs.confirmPassword = mv.message;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;
    setLoading(true);
    try {
      await signup(formData);
      setSuccess(true);
      setTimeout(() => navigate('/auth/login'), 3000);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Registration failed. Please try again.' });
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card text-center" style={{ animation: 'slideUp 0.4s ease' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <FaCheckCircle size={40} style={{ color: '#10b981' }} />
          </div>
          <h4 style={{ fontWeight: 700, color: '#1e293b' }}>Registration Successful!</h4>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Your account is pending admin approval. You'll be able to log in once approved.
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Redirecting to login…</p>
        </div>
      </div>
    );
  }

  const inputGroup = (icon, name, type, placeholder, extra = {}) => (
    <div className="auth-input-group">
      {icon}
      <input
        type={type}
        name={name}
        className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        required
        {...extra}
      />
      {errors[name] && <div className="invalid-feedback" style={{ position: 'absolute', bottom: -18, left: 0, fontSize: '0.75rem' }}>{errors[name]}</div>}
    </div>
  );

  const roleLabels = {
    ADMIN: 'Administrator',
    PROJECT_MANAGER: 'Project Manager',
    SITE_ENGINEER: 'Site Engineer',
    SAFETY_OFFICER: 'Safety Officer',
    FINANCE_OFFICER: 'Finance Officer',
    VENDOR: 'Vendor'
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
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>One of us?</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: 280 }}>
            If you already have an account, just sign in. We've missed you!
          </p>
          <Link
            to="/auth/login"
            style={{
              padding: '0.75rem 2.5rem', border: '2px solid #fff', borderRadius: '50rem',
              color: '#fff', fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s',
              background: 'transparent'
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; }}
          >
            SIGN IN
          </Link>
        </div>

        {/* Right Side (Register Form) */}
        <div style={{
          flex: '1.2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '2rem', background: '#fff',
          borderTopLeftRadius: '60px', borderBottomLeftRadius: '60px',
          marginLeft: '-30px', zIndex: 2, boxShadow: '-10px 0 30px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#334155', marginBottom: '1.5rem' }}>Sign up</h2>

          {errors.general && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#dc2626', fontSize: '0.875rem', width: '100%', maxWidth: 460, textAlign: 'center' }}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 460 }}>
            <div className="row g-3">
              {/* Username */}
              <div className="col-12 col-md-6">
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#4f46e5', background: '#e0e7ff', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaUser style={{ fontSize: 10 }} />
                  </div>
                  <input
                    type="text" name="name" placeholder="Username"
                    value={formData.name} onChange={handleChange} required
                    style={{
                      width: '100%', padding: '1rem 1rem 1rem 3.5rem', background: '#f1f5f9', border: errors.name ? '1px solid #ef4444' : 'none',
                      borderRadius: '50rem', fontSize: '0.95rem', color: '#334155', outline: 'none'
                    }}
                  />
                </div>
                {checkingUsername && <small style={{ color: '#94a3b8', fontSize: '0.7rem', paddingLeft: '1rem', display: 'block', marginTop: 4 }}>Checking availability…</small>}
                {usernameAvailable === true && <small style={{ color: '#10b981', fontSize: '0.7rem', paddingLeft: '1rem', display: 'block', marginTop: 4 }}>✓ Username available</small>}
                {usernameAvailable === false && <small style={{ color: '#ef4444', fontSize: '0.7rem', paddingLeft: '1rem', display: 'block', marginTop: 4 }}>✗ Username taken</small>}
                {errors.name && <small style={{ color: '#ef4444', fontSize: '0.7rem', paddingLeft: '1rem', display: 'block', marginTop: 4 }}>{errors.name}</small>}
              </div>

              {/* Email */}
              <div className="col-12 col-md-6">
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#6366f1', background: '#e0e7ff', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaEnvelope style={{ fontSize: 10 }} />
                  </div>
                  <input
                    type="email" name="email" placeholder="Email"
                    value={formData.email} onChange={handleChange} required
                    style={{
                      width: '100%', padding: '1rem 1rem 1rem 3.5rem', background: '#f1f5f9', border: errors.email ? '1px solid #ef4444' : 'none',
                      borderRadius: '50rem', fontSize: '0.95rem', color: '#334155', outline: 'none'
                    }}
                  />
                </div>
                {errors.email && <small style={{ color: '#ef4444', fontSize: '0.7rem', paddingLeft: '1rem', display: 'block', marginTop: 4 }}>{errors.email}</small>}
              </div>

              {/* Phone */}
              <div className="col-12 col-md-6">
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#6366f1', background: '#e0e7ff', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaPhone style={{ fontSize: 10 }} />
                  </div>
                  <input
                    type="tel" name="phone" placeholder="Phone Number"
                    value={formData.phone} onChange={handleChange} required
                    style={{
                      width: '100%', padding: '1rem 1rem 1rem 3.5rem', background: '#f1f5f9', border: errors.phone ? '1px solid #ef4444' : 'none',
                      borderRadius: '50rem', fontSize: '0.95rem', color: '#334155', outline: 'none'
                    }}
                  />
                </div>
                {errors.phone && <small style={{ color: '#ef4444', fontSize: '0.7rem', paddingLeft: '1rem', display: 'block', marginTop: 4 }}>{errors.phone}</small>}
              </div>

              {/* Role Dropdown */}
              <div className="col-12 col-md-6">
                <Dropdown>
                  <Dropdown.Toggle as="div" style={{ cursor: 'pointer', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#4f46e5', background: '#e0e7ff', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                      <FaUserShield style={{ fontSize: 10 }} />
                    </div>
                    <div style={{
                      width: '100%', padding: '1rem 1rem 1rem 3.5rem', background: '#f1f5f9',
                      borderRadius: '50rem', fontSize: '0.95rem', color: '#334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <span>{roleLabels[formData.role] || 'Select Role'}</span>
                      <FaChevronDown style={{ fontSize: 10, color: '#94a3b8' }} />
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ width: '100%', borderRadius: 16, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,.12)', padding: '0.5rem', marginTop: '0.5rem' }}>
                    {Object.entries(roleLabels).map(([val, label]) => (
                      <Dropdown.Item key={val} onClick={() => handleRoleChange(val)} style={{ borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.95rem', fontWeight: 500, color: formData.role === val ? '#4f46e5' : '#334155', background: formData.role === val ? '#eef2ff' : 'transparent' }}>
                        {label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              {/* Password */}
              <div className="col-12 col-md-6">
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#d97706', background: '#fef3c7', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaLock style={{ fontSize: 10 }} />
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'} name="password" placeholder="Password"
                    value={formData.password} onChange={handleChange} required
                    style={{
                      width: '100%', padding: '1rem 3rem 1rem 3.5rem', background: '#f1f5f9', border: errors.password ? '1px solid #ef4444' : 'none',
                      borderRadius: '50rem', fontSize: '0.95rem', color: '#334155', outline: 'none'
                    }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {showPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.password && <small style={{ color: '#ef4444', fontSize: '0.7rem', paddingLeft: '1rem', display: 'block', marginTop: 4 }}>{errors.password}</small>}
              </div>

              {/* Confirm Password */}
              <div className="col-12 col-md-6">
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#d97706', background: '#fef3c7', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaLock style={{ fontSize: 10 }} />
                  </div>
                  <input
                    type={showConfirm ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password"
                    value={formData.confirmPassword} onChange={handleChange} required
                    style={{
                      width: '100%', padding: '1rem 3rem 1rem 3.5rem', background: '#f1f5f9', border: errors.confirmPassword ? '1px solid #ef4444' : 'none',
                      borderRadius: '50rem', fontSize: '0.95rem', color: '#334155', outline: 'none'
                    }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <small style={{ color: '#ef4444', fontSize: '0.7rem', paddingLeft: '1rem', display: 'block', marginTop: 4 }}>{errors.confirmPassword}</small>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.9rem', background: '#4f46e5', color: '#fff', border: 'none',
                borderRadius: '50rem', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.05em',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', marginTop: '1.5rem', marginBottom: '1.5rem'
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#4338ca'; }}
              onMouseLeave={e => { if (!loading) e.target.style.background = '#4f46e5'; }}
            >
              {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
            </button>
          </form>

          <div className="d-md-none mt-2">
             <Link to="/auth/login" style={{ color: '#4f46e5', fontWeight: 600 }}>Sign in instead</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
