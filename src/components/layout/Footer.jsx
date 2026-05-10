import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#cbd5e1', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container py-5">
        <div className="row g-5 mb-5 pb-5 border-bottom border-secondary border-opacity-10">
          {/* Brand */}
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-4">
              <i className="bi bi-building-fill fs-3" style={{ color: '#4f46e5', filter: 'drop-shadow(0 0 5px rgba(79, 70, 229, 0.3))' }}></i>
              <span className="fw-bold fs-3 text-white">Build<span style={{ color: '#4f46e5' }}>Smart</span></span>
            </div>
            <p className="small pe-lg-5 mb-4 text-white-50" style={{ lineHeight: 1.8 }}>
              The digital operating system for construction. Built to handle the complexity of the modern project site.
            </p>
            <div className="d-flex gap-3">
              {['linkedin', 'twitter-x', 'facebook', 'instagram'].map((s) => (
                <a key={s} href="#" className="text-white-50 fs-5 hover-indigo transition-all" aria-label={s}>
                  <i className={`bi bi-${s}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="col-6 col-md-2">
            <h6 className="text-white fw-bold mb-4 small text-uppercase" style={{ letterSpacing: '1px' }}>Company</h6>
            <ul className="list-unstyled small d-flex flex-column gap-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/services', label: 'Services' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-decoration-none text-white-50 hover-white transition-all">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="col-6 col-md-3">
            <h6 className="text-white fw-bold mb-4 small text-uppercase" style={{ letterSpacing: '1px' }}>Our Services</h6>
            <ul className="list-unstyled small d-flex flex-column gap-3">
              {[
                'Project Management',
                'Vendor Management',
                'Finance Tracking',
                'Safety Monitoring',
                'Site Management',
                'Admin Control',
              ].map((s) => (
                <li key={s} className="text-white-50">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-12 col-md-3">
            <h6 className="text-white fw-bold mb-4 small text-uppercase" style={{ letterSpacing: '1px' }}>Get In Touch</h6>
            <ul className="list-unstyled small d-flex flex-column gap-3">
              <li className="d-flex gap-3 text-white-50">
                <i className="bi bi-geo-alt-fill" style={{ color: '#4f46e5' }}></i>
                123 Builder's Lane, Chennai, India
              </li>
              <li className="d-flex gap-3 text-white-50">
                <i className="bi bi-telephone-fill" style={{ color: '#4f46e5' }}></i>
                +91 98765 43210
              </li>
              <li className="d-flex gap-3 text-white-50">
                <i className="bi bi-envelope-fill" style={{ color: '#4f46e5' }}></i>
                contact@buildsmart.in
              </li>
            </ul>
          </div>
        </div>

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="small mb-0 text-white-50 opacity-50">© 2026 BuildSmart OS. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
             <ul className="list-inline mb-0 small text-white-50 opacity-50">
                <li className="list-inline-item mx-3"><a href="#" className="text-decoration-none text-white-50 hover-white">Privacy</a></li>
                <li className="list-inline-item mx-3"><a href="#" className="text-decoration-none text-white-50 hover-white">Terms</a></li>
                <li className="list-inline-item mx-3"><a href="#" className="text-decoration-none text-white-50 hover-white">Cookies</a></li>
             </ul>
          </div>
        </div>
      </div>

      <style>{`
        .hover-white:hover { color: #fff !important; }
        .hover-indigo:hover { color: #4f46e5 !important; }
        .transition-all { transition: all 0.2s ease; }
      `}</style>
    </footer>
  );
};

export default Footer;
