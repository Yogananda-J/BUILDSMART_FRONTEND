import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const stats = [
  { icon: 'bi-buildings', value: '350+', label: 'Projects Completed' },
  { icon: 'bi-building-up', value: '120+', label: 'Partner Companies' },
  { icon: 'bi-people-fill', value: '5000+', label: 'Happy Clients' },
  { icon: 'bi-calendar-check', value: '15+', label: 'Years of Experience' },
];

const services = [
  {
    icon: 'bi-kanban-fill',
    title: 'Project Management',
    desc: 'End-to-end project lifecycle tracking with real-time progress dashboards, task assignments, and milestone alerts.',
    color: '#4f46e5',
  },
  {
    icon: 'bi-truck',
    title: 'Vendor Management',
    desc: 'Onboard, evaluate, and manage vendors digitally. Automate purchase orders and track delivery schedules.',
    color: '#10b981',
  },
  {
    icon: 'bi-cash-coin',
    title: 'Finance Tracking',
    desc: 'Real-time budget monitoring, expense approval workflows, and automated financial reports for every project.',
    color: '#3b82f6',
  },
  {
    icon: 'bi-shield-check',
    title: 'Safety Monitoring',
    desc: 'Digital incident reporting, compliance checklists, and safety audits to keep your workforce protected.',
    color: '#ef4444',
  },
  {
    icon: 'bi-geo-alt-fill',
    title: 'Site Management',
    desc: 'Monitor attendance, material inventory, and equipment usage across all active construction sites.',
    color: '#8b5cf6',
  },
  {
    icon: 'bi-person-gear',
    title: 'Admin Control',
    desc: 'Centralized user management, role-based access, and full system audit logs for governance.',
    color: '#6366f1',
  },
];

const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'Project Manager, InfraBuild Corp',
    quote:
      'BuildSmart transformed how we handle multi-site projects. The real-time dashboards saved us weeks every quarter.',
    avatar: 'AM',
  },
  {
    name: 'Priya Nair',
    role: 'Finance Head, SkyLine Constructions',
    quote:
      'Finance approvals that used to take 3 days now happen in hours. The budget tracking is incredibly accurate.',
    avatar: 'PN',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Safety Officer, GreenBuild Ltd',
    quote:
      'Incident reporting is now seamless. Our compliance scores jumped 40% within six months of adopting BuildSmart.',
    avatar: 'RK',
  },
];

const HomePage = () => {
  const counterRefs = useRef([]);
  const { user } = useAuth();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            let count = 0;
            const step = Math.ceil(target / 60);
            const timer = setInterval(() => {
              count = Math.min(count + step, target);
              el.textContent = count + el.dataset.suffix;
              if (count >= target) clearInterval(timer);
            }, 30);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counterRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const getDashboardPath = () => {
    if (!user) return '/auth/register';
    switch (user.role) {
      case 'ADMIN': return '/dashboard/admin/users';
      case 'PROJECT_MANAGER': return '/dashboard/pm';
      case 'FINANCE_OFFICER': return '/dashboard/finance';
      case 'SAFETY_OFFICER': return '/dashboard/safety';
      case 'SITE_ENGINEER': return '/dashboard/site';
      case 'VENDOR': return '/dashboard/vendor';
      default: return '/dashboard/profile';
    }
  };

  return (
    <div className="home-page" style={{ color: '#1e293b', background: '#fff', overflowX: 'hidden' }}>
      {/* ── Hero Section ── */}
      <section
        className="hero-section py-5 d-flex align-items-center"
        style={{
          minHeight: '90vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
          position: 'relative',
        }}
      >
        {/* Animated background circles for visual depth */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.05) 0%, transparent 70%)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '30vw', height: '30vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.03) 0%, transparent 70%)', zIndex: 0 }}></div>

        <div className="container position-relative z-1">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="hero-content">
                <div
                  className="d-inline-flex align-items-center gap-2 mb-4 px-3 py-2 rounded-pill shadow-sm"
                  style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
                >
                  <span className="badge rounded-pill px-2 py-1" style={{ background: '#4f46e5', color: '#fff', fontSize: '0.7rem' }}>NEW</span>
                  <span className="small fw-bold text-muted">Version 2.0 is now live — See what's new <i className="bi bi-arrow-right ms-1"></i></span>
                </div>
                <h1 className="display-2 fw-bold lh-sm mb-4" style={{ color: '#0f172a', letterSpacing: '-2px' }}>
                  Build Smarter,<br />
                  <span style={{ 
                    background: 'linear-gradient(90deg, #4f46e5, #06b6d4)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent' 
                  }}>Deliver Faster</span>
                </h1>
                <p className="lead mb-5" style={{ color: '#475569', fontSize: '1.25rem', lineHeight: 1.6, maxWidth: '90%' }}>
                  The all-in-one digital operating system for construction. Unify your site, staff, and finance on one intelligent platform.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link to={getDashboardPath()} className="btn btn-primary btn-lg fw-bold px-5 rounded-pill shadow-lg transition-all" 
                    style={{ background: '#4f46e5', border: 'none', padding: '1.1rem 2.5rem', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {user ? 'Go to Dashboard' : 'Get Started Free'}
                  </Link>
                  <Link to="/services" className="btn btn-white btn-lg px-5 rounded-pill fw-bold shadow-sm" style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#1e293b', padding: '1rem 2.5rem' }}>
                    View Services
                  </Link>
                </div>
                <div className="mt-5 d-flex align-items-center gap-4">
                  <div className="d-flex -space-x-3">
                    {[
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop',
                      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=100&auto=format&fit=crop'
                    ].map((url, i) => (
                      <div key={i} className="rounded-circle border border-3 border-white shadow-sm overflow-hidden bg-light" style={{ width: 42, height: 42, marginLeft: i > 0 ? '-12px' : 0, zIndex: 5 - i }}>
                        <img src={url} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                    <div className="rounded-circle border border-3 border-white shadow-sm bg-primary d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: 42, height: 42, marginLeft: '-12px', zIndex: 0, fontSize: '0.7rem' }}>
                      +1k
                    </div>
                  </div>
                  <span className="small fw-bold text-muted border-start ps-4" style={{ borderColor: '#e2e8f0' }}>Trusted by 1,200+ site engineers</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
               <div
                 className="hero-image-wrapper p-2 rounded-5 overflow-hidden"
                 style={{ 
                   background: 'rgba(255, 255, 255, 0.4)', 
                   backdropFilter: 'blur(10px)',
                   boxShadow: '0 40px 80px -20px rgba(79, 70, 229, 0.15)',
                   border: '1px solid rgba(255, 255, 255, 0.5)',
                   transform: 'perspective(1000px) rotateY(-5deg)',
                 }}
               >
                 <img 
                   src="/assets/hero-dashboard.png" 
                   alt="BuildSmart Dashboard" 
                   className="img-fluid rounded-4 shadow-sm"
                   style={{ width: '100%', height: 'auto', display: 'block' }}
                 />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="py-5" style={{ background: '#fff' }}>
        <div className="container py-4">
          <div className="row g-4 text-center justify-content-center">
            {stats.map((s, i) => (
              <div className="col-6 col-lg-3" key={i}>
                <div className="p-4 rounded-5 transition-all h-100" 
                  style={{ border: '1px solid #f1f5f9', background: 'linear-gradient(180deg, #fff 0%, #f8fafc 100%)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#4f46e5';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(79, 70, 229, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#f1f5f9';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: 54, height: 54, background: 'rgba(79, 70, 229, 0.05)', color: '#4f46e5' }}>
                    <i className={`bi ${s.icon} fs-4`}></i>
                  </div>
                  <div
                    className="fw-bold display-5 mb-1"
                    style={{ color: '#0f172a', letterSpacing: '-2.5px' }}
                    ref={(el) => (counterRefs.current[i] = el)}
                    data-target={parseInt(s.value)}
                    data-suffix="+"
                  >
                    0+
                  </div>
                  <div className="small fw-bold text-uppercase text-indigo-600 opacity-75" style={{ letterSpacing: '1.5px', fontSize: '0.7rem' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY BUILDSMART (HIGH CONTRAST) ── */}
      <section className="py-5" style={{ background: '#0f172a', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%)', zIndex: 0 }}></div>
        
        <div className="container py-5 position-relative z-1">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-5 text-white">
              <span className="badge px-3 py-2 mb-4 rounded-pill" style={{ backgroundColor: 'rgba(79, 70, 229, 0.2)', color: '#a5b4fc', fontWeight: 700 }}>
                THE EDGE
              </span>
              <h2 className="fw-bold display-4 mb-4" style={{ letterSpacing: '-1.5px' }}>
                Engineered for <span className="text-indigo-400">Complexity</span>
              </h2>
              <p className="lead mb-5 opacity-75" style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                Construction projects have a million moving parts. Generic tools fail because they don't understand 
                material logs, vendor dependencies, or safety compliance. BuildSmart was built specifically for the site.
              </p>
              <div className="d-flex flex-column gap-3">
                {[
                  'Live site visibility from anywhere',
                  'Automated budget overrun alerts',
                  'Seamless vendor communication'
                ].map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 24, height: 24, background: '#10b981' }}>
                      <i className="bi bi-check-lg text-white small"></i>
                    </div>
                    <span className="fw-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-12 col-lg-7">
              <div className="row g-3">
                {[
                  { icon: 'bi-lightning-charge', title: 'Real-Time Visibility', desc: 'Live dashboards across all sites and projects.', color: '#4f46e5' },
                  { icon: 'bi-shield-check', title: 'Safety First', desc: 'Digital incident reporting and compliance checklists.', color: '#10b981' },
                  { icon: 'bi-cloud-check', title: 'Cloud-Native', desc: 'Access from any device, anywhere, zero infrastructure.', color: '#3b82f6' },
                  { icon: 'bi-bar-chart-line', title: 'Smart Reports', desc: 'Auto-generated insights for leadership and stakeholders.', color: '#8b5cf6' },
                ].map((f, i) => (
                  <div className="col-12 col-sm-6" key={i}>
                    <div className="p-4 rounded-4 transition-all h-100" 
                      style={{ border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.borderColor = f.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      }}
                    >
                      <div className="mb-3" style={{ color: f.color }}><i className={`bi ${f.icon} fs-3`}></i></div>
                      <h5 className="fw-bold text-white mb-2">{f.title}</h5>
                      <p className="small text-white-50 mb-0">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR SERVICES (CLEAN LIGHT) ── */}
      <section className="py-5" style={{ background: '#f8fafc' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 mb-3 rounded-pill" style={{ backgroundColor: '#eef2ff', color: '#4f46e5', fontWeight: 700 }}>
              SOLUTIONS
            </span>
            <h2 className="fw-bold display-5 mb-3" style={{ color: '#0f172a' }}>Platform Modules</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: 600, fontSize: '1.1rem' }}>
              Specialized tools for every role in your construction team.
            </p>
          </div>
          <div className="row g-4">
            {services.map((svc, i) => (
              <div className="col-12 col-md-6 col-lg-4" key={i}>
                <div
                  className="card h-100 border-0 shadow-sm p-4 rounded-4 transition-all"
                  style={{ background: '#fff' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0,0,0,0.01)';
                  }}
                >
                  <div className="card-body p-0">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-4 mb-4"
                      style={{ width: 60, height: 60, backgroundColor: svc.color + '10', color: svc.color }}
                    >
                      <i className={`bi ${svc.icon} fs-4`}></i>
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#1e293b' }}>{svc.title}</h4>
                    <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{svc.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
                    <Link to="/services" className="fw-bold text-decoration-none d-flex align-items-center gap-2" style={{ color: svc.color }}>
                      Explore Features <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (ACCENTED) ── */}
      <section className="py-5" style={{ background: '#fff' }}>
        <div className="container py-5">
          <div className="row g-5">
             <div className="col-lg-4">
                <h2 className="fw-bold display-5 mb-4">Trusted by the best builders</h2>
                <p className="text-muted mb-5">Hear from the site managers and finance heads who use BuildSmart every single day to deliver landmarks.</p>
                <div className="d-flex align-items-center gap-3">
                   <div className="h2 fw-bold mb-0">4.9/5</div>
                   <div className="text-warning">
                      {[...Array(5)].map((_, i) => <i key={i} className="bi bi-star-fill me-1"></i>)}
                   </div>
                </div>
                <div className="small text-muted mt-1">Average user rating across 200+ companies</div>
             </div>
             <div className="col-lg-8">
                <div className="row g-4">
                  {testimonials.map((t, i) => (
                    <div className="col-12 col-md-6" key={i}>
                      <div className="p-4 rounded-4 h-100 shadow-sm" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                        <i className="bi bi-quote fs-1 opacity-10" style={{ color: '#4f46e5', display: 'block', marginBottom: '-1rem' }}></i>
                        <p className="mb-4 fw-medium" style={{ color: '#334155', fontSize: '1rem', fontStyle: 'italic' }}>"{t.quote}"</p>
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                               style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', fontSize: 13 }}>
                            {t.avatar}
                          </div>
                          <div>
                            <div className="fw-bold small text-dark">{t.name}</div>
                            <div className="text-muted small" style={{ fontSize: '11px' }}>{t.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="py-5">
        <div className="container">
          <div className="p-5 rounded-5 text-center text-white shadow-2xl position-relative overflow-hidden" 
               style={{ background: '#4f46e5' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', transform: 'translate(30%, -30%)' }}></div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '200px', height: '200px', background: 'rgba(0,0,0,0.1)', borderRadius: '50%', transform: 'translate(-30%, 30%)' }}></div>
            
            <h2 className="fw-bold display-5 mb-3 position-relative">Ready to Modernize Your Site?</h2>
            <p className="mb-5 opacity-80 mx-auto position-relative" style={{ maxWidth: 600, fontSize: '1.2rem' }}>
              Join over 1,200 site engineers who have ditched paper for the BuildSmart operating system.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap position-relative">
              <Link to="/contact" className="btn btn-white btn-lg rounded-pill px-5 fw-bold shadow-lg" style={{ background: '#fff', color: '#4f46e5', border: 'none' }}>
                Request Demo
              </Link>
              <Link to="/auth/register" className="btn btn-outline-light btn-lg px-5 rounded-pill fw-bold">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      
      <style>{`
        .hover-white:hover { color: #fff !important; }
        .hover-indigo:hover { color: #4f46e5 !important; }
        .transition-all { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
};

export default HomePage;
