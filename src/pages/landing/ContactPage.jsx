import { useState } from 'react';
import { Link } from 'react-router-dom';

const contactInfo = [
  { icon: 'bi-geo-alt-fill', label: 'Address', value: '123 Builder\'s Lane, Anna Nagar, Chennai – 600 040, Tamil Nadu, India', color: '#4f46e5' },
  { icon: 'bi-telephone-fill', label: 'Phone', value: '+91 98765 43210', color: '#10b981' },
  { icon: 'bi-envelope-fill', label: 'Email', value: 'contact@buildsmart.in', color: '#3b82f6' },
  { icon: 'bi-clock-fill', label: 'Working Hours', value: 'Monday – Saturday, 9:00 AM – 6:00 PM IST', color: '#8b5cf6' },
];

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.trim()) {
      e.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address.';
    }
    if (!form.subject.trim()) e.subject = 'Subject is required.';
    if (!form.message.trim()) e.message = 'Message is required.';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div style={{ background: '#fff', color: '#1e293b' }}>
      {/* ── HERO ── */}
      <section
        className="py-5"
        style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #fff 100%)', minHeight: 350 }}
      >
        <div className="container d-flex flex-column align-items-center justify-content-center text-center py-5">
          <span className="badge mb-3 px-3 py-2 rounded-pill shadow-sm" style={{ backgroundColor: '#eef2ff', color: '#4f46e5', fontWeight: 700 }}>
            SUPPORT
          </span>
          <h1 className="fw-bold display-3 mb-4" style={{ color: '#0f172a', letterSpacing: '-2px' }}>
            Let's Start a <span style={{ color: '#4f46e5' }}>Conversation</span>
          </h1>
          <p className="text-muted mx-auto lead" style={{ maxWidth: 600 }}>
            Ready to digitalize your construction site? Our implementation experts are here to help you find the right setup.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT (HIGH CONTRAST) ── */}
      <section className="py-5" style={{ background: '#f8fafc', position: 'relative' }}>
        <div className="container py-5">
          <div className="row g-5 align-items-stretch">

            {/* Contact Info (Dark Card) */}
            <div className="col-12 col-lg-5">
              <div className="card border-0 shadow-2xl rounded-5 p-5 h-100 overflow-hidden" style={{ background: '#0f172a', color: '#fff', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '200px', height: '200px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '50%' }}></div>
                
                <h3 className="fw-bold mb-4">Contact Information</h3>
                <p className="text-white-50 mb-5" style={{ opacity: 0.8 }}>Prefer a direct call or email? Reach out to our Chennai headquarters anytime.</p>
                
                <div className="d-flex flex-column gap-4">
                  {contactInfo.map((c, i) => (
                    <div key={i} className="d-flex align-items-start gap-3">
                      <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                           style={{ width: 44, height: 44, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <i className={`bi ${c.icon} fs-5`} style={{ color: c.color }}></i>
                      </div>
                      <div>
                        <div className="small fw-bold text-white-50 text-uppercase" style={{ letterSpacing: '1px', opacity: 0.7 }}>{c.label}</div>
                        <div className="fw-medium" style={{ fontSize: '1rem' }}>{c.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-5">
                   <h6 className="fw-bold mb-3 opacity-70">Follow Our Updates</h6>
                   <div className="d-flex gap-3">
                      {['linkedin', 'twitter-x', 'instagram'].map(s => (
                         <a key={s} href="#" className="btn btn-outline-light rounded-circle p-0 d-flex align-items-center justify-content-center shadow-none border-opacity-25" style={{ width: 40, height: 40 }}>
                            <i className={`bi bi-${s}`}></i>
                         </a>
                      ))}
                   </div>
                </div>
              </div>
            </div>

            {/* Contact Form (Light Card) */}
            <div className="col-12 col-lg-7">
              <div className="card border-0 shadow-sm rounded-5 p-2 h-100" style={{ background: '#fff' }}>
                <div className="card-body p-5">
                  {submitted ? (
                    <div className="text-center py-5">
                      <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-lg"
                        style={{ width: 84, height: 84, backgroundColor: '#d1fae5', color: '#10b981' }}>
                        <i className="bi bi-send-check display-6"></i>
                      </div>
                      <h2 className="fw-bold mb-2">Message Sent!</h2>
                      <p className="text-muted mb-5 lead">
                        We've received your request, {form.name.split(' ')[0]}. An implementation consultant will reach out to <strong>{form.email}</strong> shortly.
                      </p>
                      <button className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow-lg" style={{ background: '#4f46e5', border: 'none' }}
                        onClick={() => { setForm({ name: '', email: '', phone: '', company: '', subject: '', message: '' }); setSubmitted(false); }}>
                        New Message
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="fw-bold mb-2" style={{ color: '#0f172a' }}>Send us a message</h3>
                      <p className="text-muted mb-5">Fill out the form below and we'll get back to you within one business day.</p>
                      <form onSubmit={handleSubmit} noValidate>
                        <div className="row g-4">
                          <div className="col-sm-6">
                            <label className="form-label small fw-bold text-uppercase opacity-75">Full Name</label>
                            <input type="text" name="name" value={form.name} onChange={handleChange} className={`form-control border-0 bg-light p-3 rounded-4 ${errors.name ? 'is-invalid' : ''}`} placeholder="Arjun Mehta" />
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label small fw-bold text-uppercase opacity-75">Work Email</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} className={`form-control border-0 bg-light p-3 rounded-4 ${errors.email ? 'is-invalid' : ''}`} placeholder="arjun@company.in" />
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label small fw-bold text-uppercase opacity-75">Company</label>
                            <input type="text" name="company" value={form.company} onChange={handleChange} className="form-control border-0 bg-light p-3 rounded-4" placeholder="SkyLine Constructions" />
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label small fw-bold text-uppercase opacity-75">Interest</label>
                            <select name="subject" value={form.subject} onChange={handleChange} className={`form-select border-0 bg-light p-3 rounded-4 ${errors.subject ? 'is-invalid' : ''}`} style={{ height: 56 }}>
                              <option value="">Select a topic...</option>
                              <option>Request a Demo</option>
                              <option>Pricing Inquiry</option>
                              <option>Partnership</option>
                            </select>
                          </div>
                          <div className="col-12">
                            <label className="form-label small fw-bold text-uppercase opacity-75">How can we help?</label>
                            <textarea name="message" value={form.message} onChange={handleChange} rows={5} className={`form-control border-0 bg-light p-3 rounded-4 ${errors.message ? 'is-invalid' : ''}`} placeholder="Tell us about your project or specific requirements..." />
                          </div>
                          <div className="col-12 pt-2">
                            <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill py-3 fw-bold shadow-lg" style={{ background: '#4f46e5', border: 'none' }} disabled={loading}>
                              {loading ? 'Sending Request...' : 'Send Inquiry'}
                            </button>
                          </div>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-5" style={{ background: '#fff' }}>
        <div className="container py-5">
           <div className="row g-5">
              <div className="col-lg-4">
                 <h2 className="fw-bold display-5 mb-4">Common Questions</h2>
                 <p className="text-muted mb-4">Quick answers to help you get started with the platform.</p>
                 <Link to="/services" className="fw-bold text-decoration-none text-indigo-600">View detailed docs <i className="bi bi-arrow-right"></i></Link>
              </div>
              <div className="col-lg-8">
                 <div className="row g-4">
                   {[
                     { q: 'Is there a free trial?', a: 'Yes, we offer a 14-day fully-featured pilot for site teams to test the workflow.' },
                     { q: 'How is data secured?', a: 'BuildSmart uses enterprise-grade AES-256 encryption and is SOC2 compliant.' },
                     { q: 'Can we import old data?', a: 'Absolutely. Our team helps you migrate your existing project logs and vendor lists.' },
                     { q: 'Do you offer custom roles?', a: 'Yes, the Admin module allows you to define granular permissions per role.' },
                   ].map((faq, i) => (
                     <div className="col-md-6" key={i}>
                       <div className="h-100 p-4 rounded-4" style={{ border: '1px solid #f1f5f9', background: '#f8fafc' }}>
                         <div className="fw-bold mb-2" style={{ color: '#0f172a' }}>{faq.q}</div>
                         <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>{faq.a}</p>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
