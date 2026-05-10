import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaEnvelope, FaShieldAlt } from 'react-icons/fa';

const PendingApprovalPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#f8fafc',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 550,
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
        padding: '3rem',
        textAlign: 'center'
      }}>
        <div style={{
          width: 80,
          height: 80,
          background: '#fef3c7',
          color: '#d97706',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          fontSize: '2rem'
        }}>
          <FaClock />
        </div>

        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 700, 
          color: '#1e293b',
          marginBottom: '1rem'
        }}>
          Account Pending Approval
        </h1>

        <p style={{ 
          color: '#64748b', 
          lineHeight: 1.6,
          marginBottom: '2.5rem'
        }}>
          Thank you for joining <strong>BuildSmart</strong>. Your account registration has been received and is currently being reviewed by our administrators.
          <br /><br />
          You will receive an email notification once your access has been granted. This typically takes 24-48 hours.
        </p>

        <div style={{ 
          background: '#f1f5f9',
          borderRadius: 16,
          padding: '1.5rem',
          marginBottom: '2.5rem',
          textAlign: 'left'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaShieldAlt size={16} color="#6366f1" /> Next Steps
          </h3>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#64748b', marginBottom: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>Our team will verify your credentials and role assignment.</li>
            <li style={{ marginBottom: '0.5rem' }}>Check your email periodically for the approval notification.</li>
            <li>If you have questions, contact us at <span style={{ color: '#6366f1', fontWeight: 600 }}>support@buildsmart.com</span></li>
          </ul>
        </div>

        <Link 
          to="/auth/login" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#6366f1',
            color: '#fff',
            padding: '0.75rem 2rem',
            borderRadius: '50rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.3s'
          }}
          onMouseEnter={e => e.target.style.background = '#4f46e5'}
          onMouseLeave={e => e.target.style.background = '#6366f1'}
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
