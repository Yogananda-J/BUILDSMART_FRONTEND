import { Link } from 'react-router-dom';

const services = [
  {
    icon: 'bi-kanban-fill',
    title: 'Project Management',
    color: '#4f46e5',
    tagline: 'Deliver every project on time, every time.',
    desc: 'Our project management module gives you end-to-end visibility into all your construction projects. Plan tasks, set milestones, assign resources, and track progress on a real-time Gantt dashboard — all in one place.',
    features: [
      'Interactive Gantt charts & milestone tracking',
      'Task assignment with priority levels',
      'Document & drawing management',
      'Progress % reporting per phase',
      'Deadline alerts and delay escalations',
    ],
    roles: ['Project Manager', 'Admin'],
  },
  {
    icon: 'bi-truck',
    title: 'Vendor Management',
    color: '#10b981',
    tagline: 'The right vendor, at the right time, at the right cost.',
    desc: 'Digitalize your entire vendor lifecycle — from onboarding to payment. Evaluate vendor performance, automate purchase orders, and maintain a trusted vendor registry that speeds up procurement on every project.',
    features: [
      'Digital vendor registration & verification',
      'Purchase order creation and approval',
      'Delivery tracking and goods receipt',
      'Vendor rating and blacklist management',
      'Integrated payment milestone tracking',
    ],
    roles: ['Vendor', 'Finance', 'Admin'],
  },
  {
    icon: 'bi-cash-coin',
    title: 'Finance Tracking',
    color: '#3b82f6',
    tagline: 'Every rupee, accounted for in real time.',
    desc: 'Take full control of your construction finances with live budget dashboards, multi-level expense approvals, and automated financial summaries. Reduce budget overruns before they happen.',
    features: [
      'Project-wise budget allocation',
      'Expense submission and approval workflow',
      'Invoice and payment reconciliation',
      'Automated monthly & quarterly reports',
      'Budget variance alerts',
    ],
    roles: ['Finance Officer', 'Project Manager', 'Admin'],
  },
  {
    icon: 'bi-shield-check',
    title: 'Safety Monitoring',
    color: '#ef4444',
    tagline: 'Zero accidents. Full compliance. Always.',
    desc: 'Digital safety management for construction sites — from daily toolbox talks and inspection checklists to incident reporting and regulatory compliance tracking. Protect your workers and your reputation.',
    features: [
      'Digital safety inspection checklists',
      'Real-time incident & near-miss reporting',
      'PPE compliance tracking per worker',
      'Safety score per site per week',
      'Regulatory audit-ready documentation',
    ],
    roles: ['Safety Officer', 'Site Engineer', 'Admin'],
  },
  {
    icon: 'bi-geo-alt-fill',
    title: 'Site Management',
    color: '#8b5cf6',
    tagline: 'Your entire site, visible from anywhere.',
    desc: 'Monitor all active construction sites from a single dashboard. Track workforce attendance, material consumption, equipment availability, and daily progress reports — without leaving your desk.',
    features: [
      'Digital workforce attendance (biometric / QR)',
      'Material inventory and usage tracking',
      'Equipment allocation and maintenance logs',
      'Daily site progress reports with photos',
      'Multi-site comparison dashboards',
    ],
    roles: ['Site Engineer', 'Project Manager', 'Admin'],
  },
  {
    icon: 'bi-person-gear',
    title: 'Admin Control',
    color: '#6366f1',
    tagline: 'Governance, compliance, and total control.',
    desc: 'The admin module gives your leadership team complete oversight — manage users, assign roles, configure permissions, and maintain full system audit logs for every action taken on the platform.',
    features: [
      'User creation, role assignment & deactivation',
      'Role-based access control (RBAC)',
      'Full system audit trail & activity logs',
      'Platform configuration & settings',
      'Data export and backup management',
    ],
    roles: ['Admin', 'Project Manager'],
  },
];

const ServicePage = () => {
  return (
    <div style={{ background: '#fff', color: '#1e293b' }}>
      {/* ── HERO ── */}
      <section
        className="py-5"
        style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)', minHeight: 400 }}
      >
        <div className="container d-flex flex-column align-items-center justify-content-center text-center py-5">
          <span className="badge mb-3 px-3 py-2 rounded-pill shadow-sm" style={{ backgroundColor: '#fff', color: '#4f46e5', fontWeight: 700, border: '1px solid #e2e8f0' }}>
            CAPABILITIES
          </span>
          <h1 className="fw-bold display-3 mb-4" style={{ color: '#0f172a', letterSpacing: '-2px' }}>
            Transforming Every <span style={{ color: '#4f46e5' }}>Corner</span> of Construction
          </h1>
          <p className="text-muted mx-auto lead" style={{ maxWidth: 700, fontSize: '1.2rem' }}>
            BuildSmart replaces paper-based chaos with a connected digital operating system 
            purpose-built for modern project management.
          </p>
        </div>
      </section>

      {/* ── WHY DIGITAL (HIGH CONTRAST) ── */}
      <section className="py-5" style={{ background: '#0f172a', position: 'relative' }}>
         <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.05, backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="container py-5 position-relative z-1">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6 text-white">
              <span className="badge px-3 py-2 mb-4 rounded-pill" style={{ backgroundColor: 'rgba(79, 70, 229, 0.2)', color: '#a5b4fc', fontWeight: 700 }}>
                THE CHALLENGE
              </span>
              <h2 className="fw-bold display-5 mb-4">Construction Still Runs on <span className="text-danger">Paper</span></h2>
              <p className="text-white-50 mb-5 lead" style={{ lineHeight: 1.8, opacity: 0.8 }}>
                Spreadsheets lost in email threads and safety forms filed in physical folders lead to 
                stale data and reactive decision making. BuildSmart brings real-time visibility to every stakeholder.
              </p>
              <div className="d-flex flex-column gap-3 mb-5">
                 {['Ditch manual logbooks', 'Eliminate budget lag', 'Real-time incident tracking'].map((item, i) => (
                    <div key={i} className="d-flex align-items-center gap-3">
                       <i className="bi bi-check2-circle text-indigo-400 fs-4"></i>
                       <span className="fw-bold opacity-90">{item}</span>
                    </div>
                 ))}
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="row g-4">
                {[
                  { label: 'Project delay reduction', value: '23%', color: '#4f46e5' },
                  { label: 'Budget accuracy improvement', value: '18%', color: '#10b981' },
                  { label: 'Safety compliance jump', value: '40%', color: '#f59e0b' },
                  { label: 'Overall cost savings', value: '30%', color: '#3b82f6' },
                ].map((s, i) => (
                  <div className="col-6" key={i}>
                    <div className="card border-0 rounded-5 p-4 text-center shadow-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="fw-bold mb-1 display-5" style={{ color: s.color }}>
                        {s.value}
                      </div>
                      <div className="small fw-bold text-white-50 text-uppercase" style={{ letterSpacing: '1px', opacity: 0.7 }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE CARDS ── */}
      <section className="py-5" style={{ background: '#fff' }}>
        <div className="container py-5">
          <div className="text-center mb-5 pb-5">
            <span className="badge px-3 py-2 mb-3 rounded-pill" style={{ backgroundColor: '#eef2ff', color: '#4f46e5', fontWeight: 700 }}>
              THE SOLUTIONS
            </span>
            <h2 className="fw-bold display-4 mb-3" style={{ letterSpacing: '-1.5px' }}>Six Core Modules</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: 600 }}>
              Each module is purpose-built for a specific role and integrates into a single source of truth.
            </p>
          </div>

          <div className="d-flex flex-column gap-5">
            {services.map((svc, i) => (
              <div
                key={i}
                className={`row align-items-center g-5 py-5 ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}
                style={{ borderBottom: i < services.length - 1 ? '1px solid #f1f5f9' : 'none' }}
              >
                <div className="col-12 col-lg-6">
                  <div
                    className="rounded-5 d-flex align-items-center justify-content-center shadow-sm p-5"
                    style={{
                      height: 360,
                      backgroundColor: svc.color + '05',
                      border: `1px solid ${svc.color}10`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '100%', height: '100%', background: `radial-gradient(circle, ${svc.color}15 0%, transparent 70%)` }}></div>
                    <i className={`bi ${svc.icon} position-relative z-1`} style={{ fontSize: 140, color: svc.color, opacity: 0.9, filter: `drop-shadow(0 10px 20px ${svc.color}40)` }}></i>
                  </div>
                </div>
                <div className="col-12 col-lg-6">
                  <div
                    className="badge mb-3 px-3 py-2 rounded-pill fw-bold"
                    style={{ backgroundColor: svc.color + '15', color: svc.color }}
                  >
                    MODULE {String(i + 1).padStart(2, '0')}
                  </div>
                  <h2 className="fw-bold display-6 mb-3" style={{ color: '#0f172a' }}>{svc.title}</h2>
                  <p className="fw-bold mb-4 h5" style={{ color: svc.color }}>{svc.tagline}</p>
                  <p className="text-muted mb-5 lead" style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>{svc.desc}</p>
                  
                  <div className="row g-4 mb-5">
                    {svc.features.map((f, j) => (
                      <div key={j} className="col-12 col-md-6 small d-flex align-items-start gap-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 20, height: 20, background: svc.color + '20', marginTop: '2px' }}>
                           <i className="bi bi-check-lg" style={{ color: svc.color, fontSize: '12px' }}></i>
                        </div>
                        <span className="text-dark fw-bold opacity-80">{f}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="d-flex flex-wrap gap-2 pt-4 border-top" style={{ borderColor: '#f1f5f9' }}>
                    <span className="small text-muted fw-bold me-2 align-self-center text-uppercase" style={{ letterSpacing: '1px' }}>Built for:</span>
                    {svc.roles.map((r) => (
                      <span
                        key={r}
                        className="badge px-3 py-2 rounded-pill fw-bold"
                        style={{ backgroundColor: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}
                      >
                        <i className="bi bi-person-fill me-1"></i>{r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-5" style={{ background: '#f8fafc' }}>
        <div className="container text-center py-5">
           <div className="p-5 rounded-5 shadow-2xl" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff' }}>
            <h2 className="fw-bold display-5 mb-3 text-white">Experience the Platform First-Hand</h2>
            <p className="mb-5 opacity-75 lead mx-auto" style={{ maxWidth: 600 }}>
              Join hundreds of construction firms already operating with modern efficiency.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
               <Link to="/contact" className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow-lg" style={{ background: '#4f46e5', border: 'none' }}>
                 Schedule a Demo
               </Link>
               <Link to="/auth/register" className="btn btn-outline-light btn-lg rounded-pill px-5 fw-bold">
                 Try Free Pilot
               </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
