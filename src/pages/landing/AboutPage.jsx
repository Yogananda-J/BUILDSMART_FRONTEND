import { Link } from 'react-router-dom';

const clients = [
  { name: 'InfraBuild Corp', icon: 'bi-buildings' },
  { name: 'SkyLine Constructions', icon: 'bi-building' },
  { name: 'GreenBuild Ltd', icon: 'bi-tree' },
  { name: 'MetroWorks', icon: 'bi-train-front' },
  { name: 'UrbanEdge Developers', icon: 'bi-buildings-fill' },
  { name: 'PrimeCon Industries', icon: 'bi-gear-fill' },
];

const team = [
  {
    name: 'Karthik Subramanian',
    role: 'Chief Executive Officer',
    exp: '20 years in construction technology',
    initials: 'KS',
    color: '#4f46e5',
  },
  {
    name: 'Meera Krishnan',
    role: 'Chief Technology Officer',
    exp: '15 years in enterprise software',
    initials: 'MK',
    color: '#10b981',
  },
  {
    name: 'Arjun Balasubramaniam',
    role: 'Head of Project Delivery',
    exp: '12 years managing large-scale builds',
    initials: 'AB',
    color: '#3b82f6',
  },
  {
    name: 'Divya Ramesh',
    role: 'Head of Client Success',
    exp: '10 years in construction advisory',
    initials: 'DR',
    color: '#ef4444',
  },
  {
    name: 'Suresh Patel',
    role: 'Safety & Compliance Director',
    exp: '18 years in site safety management',
    initials: 'SP',
    color: '#8b5cf6',
  },
  {
    name: 'Nithya Srinivasan',
    role: 'Finance & Operations Lead',
    exp: '14 years in construction finance',
    initials: 'NS',
    color: '#6366f1',
  },
];

const values = [
  { title: 'Integrity First', desc: 'We build trust through transparency in every line of code and every site log.', icon: 'bi-shield-check' },
  { title: 'Innovation', desc: 'We push the boundaries of what is possible in construction technology.', icon: 'bi-lightbulb' },
  { title: 'Site-Centric', desc: 'We design for the site engineer first, not the boardroom.', icon: 'bi-geo-alt' },
  { title: 'Safety Always', desc: 'Our tools are built to protect the most valuable asset: your people.', icon: 'bi-safe' },
];

const approach = [
  {
    step: '01',
    title: 'Discover & Plan',
    desc: 'Deep discovery workshops to understand your unique site workflows.',
    icon: 'bi-search',
  },
  {
    step: '02',
    title: 'Configure',
    desc: 'Tailoring the platform to your specific organizational roles and hierarchy.',
    icon: 'bi-sliders',
  },
  {
    step: '03',
    title: 'Train',
    desc: 'Hands-on training for site engineers and managers to ensure adoption.',
    icon: 'bi-mortarboard',
  },
  {
    step: '04',
    title: 'Support',
    desc: 'Dedicated success managers to help you scale and optimize.',
    icon: 'bi-rocket-takeoff',
  },
];

const AboutPage = () => {
  return (
    <div style={{ background: '#fff', color: '#1e293b' }}>
      {/* ── HERO ── */}
      <section
        className="py-5"
        style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #fff 100%)', minHeight: 400 }}
      >
        <div className="container text-center py-5">
          <span className="badge mb-4 px-3 py-2 rounded-pill shadow-sm" style={{ backgroundColor: '#eef2ff', color: '#4f46e5', fontWeight: 700 }}>
            OUR STORY
          </span>
          <h1 className="fw-bold display-3 mb-4" style={{ color: '#0f172a', letterSpacing: '-2px' }}>
            We're Rebuilding How <br />
            <span style={{ color: '#4f46e5' }}>Construction Gets Done</span>
          </h1>
          <p className="text-muted mx-auto lead" style={{ maxWidth: 700, fontSize: '1.2rem', lineHeight: 1.7 }}>
            Founded by industry veterans and tech innovators, BuildSmart bridges the gap between 
            on-site reality and digital management.
          </p>
        </div>
      </section>

      {/* ── VALUES (HIGH CONTRAST DARK) ── */}
      <section className="py-5" style={{ background: '#0f172a', borderRadius: '4rem 4rem 0 0' }}>
         <div className="container py-5">
            <div className="row g-4">
               <div className="col-lg-4 text-white pe-lg-5">
                  <h2 className="fw-bold display-5 mb-4">The Values that Drive Us</h2>
                  <p className="opacity-70 lead mb-5">Our philosophy is simple: technology should serve the worker, not the other way around.</p>
                  <Link to="/contact" className="btn btn-outline-light btn-lg rounded-pill px-4 fw-bold">Join Our Journey</Link>
               </div>
                <div className="col-lg-8">
                   <div className="row g-4">
                      {values.map((v, i) => (
                         <div className="col-sm-6" key={i}>
                             <div className="p-4 rounded-4 h-100" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s ease' }}>
                                <div className="mb-3" style={{ color: '#818cf8' }}><i className={`bi ${v.icon} fs-3`}></i></div>
                                <h5 className="fw-bold text-white mb-3">{v.title}</h5>
                                <p className="small text-white-50 mb-0" style={{ lineHeight: 1.6 }}>{v.desc}</p>
                             </div>
                         </div>
                      ))}
                   </div>
                </div>
            </div>
         </div>
      </section>

      {/* ── PARTNERS (LOGO SECTION) ── */}
      <section className="py-5" style={{ background: '#fff' }}>
        <div className="container py-5">
           <div className="text-center mb-5">
             <p className="small fw-bold text-muted text-uppercase mb-4" style={{ letterSpacing: '2px', opacity: 0.6 }}>Trusted by Industry Giants</p>
           </div>
           <div className="row g-4 align-items-center justify-content-center text-center">
              {clients.map((c, i) => (
                <div className="col-6 col-md-4 col-lg-2" key={i}>
                   <div className="d-flex flex-column align-items-center gap-3 p-3 rounded-4 transition-all" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                      <div className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center" style={{ width: 60, height: 60 }}>
                        <i className={`bi ${c.icon} fs-3`} style={{ color: '#4f46e5' }}></i>
                      </div>
                      <span className="small fw-bold text-dark opacity-75">{c.name}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* ── APPROACH ── */}
      <section className="py-5" style={{ background: '#f8fafc' }}>
        <div className="container py-5">
           <div className="text-center mb-5 pb-3">
              <span className="badge px-3 py-2 mb-3 rounded-pill" style={{ backgroundColor: '#eef2ff', color: '#4f46e5', fontWeight: 700 }}>
                METHODOLOGY
              </span>
              <h2 className="fw-bold display-5 mb-3" style={{ letterSpacing: '-1.5px' }}>Our Approach to Excellence</h2>
              <p className="text-muted mx-auto" style={{ maxWidth: 600 }}>A structured, data-driven implementation process to ensure your site is digital-ready from day one.</p>
           </div>
           <div className="row g-4">
              {approach.map((a, i) => (
                <div className="col-12 col-md-6 col-lg-3" key={i}>
                   <div className="p-4 rounded-5 h-100 shadow-sm border-0 bg-white transition-all">
                      <div className="d-flex justify-content-between align-items-start mb-4">
                         <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: 'rgba(79, 70, 229, 0.05)', color: '#4f46e5' }}>
                            <i className={`bi ${a.icon} fs-4`}></i>
                         </div>
                         <span className="fw-bold display-6 opacity-10" style={{ color: '#4f46e5' }}>{a.step}</span>
                      </div>
                      <h5 className="fw-bold mb-3" style={{ color: '#0f172a' }}>{a.title}</h5>
                      <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>{a.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="py-5" style={{ background: '#fff' }}>
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-12 col-md-6">
              <div className="h-100 p-5 rounded-5 shadow-sm" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  <div className="d-inline-flex align-items-center justify-content-center rounded-4 mb-4"
                       style={{ width: 64, height: 64, backgroundColor: '#eef2ff', color: '#4f46e5' }}>
                    <i className="bi bi-bullseye fs-3"></i>
                  </div>
                  <h3 className="fw-bold mb-3" style={{ color: '#0f172a' }}>Our Mission</h3>
                  <p className="text-muted mb-0 lead" style={{ fontSize: '1rem' }}>
                    To empower every construction company—from local contractors to global giants—with the digital tools 
                    they need to deliver projects efficiently, safely, and profitably.
                  </p>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="h-100 p-5 rounded-5 shadow-sm" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  <div className="d-inline-flex align-items-center justify-content-center rounded-4 mb-4"
                       style={{ width: 64, height: 64, backgroundColor: '#f0f9ff', color: '#0ea5e9' }}>
                    <i className="bi bi-eye fs-3"></i>
                  </div>
                  <h3 className="fw-bold mb-3" style={{ color: '#0f172a' }}>Our Vision</h3>
                  <p className="text-muted mb-0 lead" style={{ fontSize: '1rem' }}>
                    To become the global standard for construction OS by 2030—connecting every project site, 
                    every stakeholder, and every budget in real time.
                  </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-5" style={{ background: '#f8fafc' }}>
        <div className="container py-5">
          <div className="text-center mb-5 pb-3">
            <span className="badge px-3 py-2 mb-3 rounded-pill" style={{ backgroundColor: '#eef2ff', color: '#4f46e5', fontWeight: 700 }}>
              LEADERSHIP
            </span>
            <h2 className="fw-bold display-5 mb-3" style={{ letterSpacing: '-1.5px' }}>The Experts Behind BuildSmart</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: 600 }}>
              Industry veterans and technology innovators working together to transform construction.
            </p>
          </div>
          <div className="row g-4">
            {team.map((m, i) => (
              <div className="col-12 col-sm-6 col-lg-4" key={i}>
                <div className="card border-0 shadow-sm rounded-5 p-4 h-100 transition-all" style={{ background: '#fff' }}>
                  <div className="card-body text-center p-0">
                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white mx-auto mb-4 shadow-lg"
                         style={{ width: 90, height: 90, background: `linear-gradient(135deg, ${m.color}, #00000033)`, fontSize: 26 }}>
                      {m.initials}
                    </div>
                    <h5 className="fw-bold mb-2" style={{ color: '#0f172a' }}>{m.name}</h5>
                    <div className="small fw-bold mb-3 text-uppercase" style={{ color: m.color, letterSpacing: '1px' }}>{m.role}</div>
                    <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>{m.exp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-5" style={{ background: '#fff' }}>
        <div className="container text-center py-5">
          <div className="p-5 rounded-5 shadow-2xl" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#fff' }}>
            <h2 className="fw-bold display-5 mb-3">Want to shape the future?</h2>
            <p className="mb-5 opacity-75 lead">We're always looking for passionate people to join our construction revolution.</p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
               <Link to="/contact" className="btn btn-light btn-lg rounded-pill px-5 fw-bold shadow-lg" style={{ color: '#4f46e5' }}>
                 Talk to Our Team
               </Link>
               <a href="#" className="btn btn-outline-light btn-lg rounded-pill px-5 fw-bold">View Openings</a>
            </div>
          </div>
        </div>
      </section>
      
      <style>{`
        .transition-all { transition: all 0.3s ease; }
        .transition-all:hover { transform: translateY(-10px); }
      `}</style>
    </div>
  );
};

export default AboutPage;
