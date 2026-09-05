import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please fill out all fields.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // 1. Try Backend API first (/api/contact/submit)
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
        return;
      }

      // 2. Fallback to Web3Forms if backend mailer is not configured
      const fallbackRes = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'e366a4e8-fcb1-45ab-b012-d548fa4b317e',
          ...formData
        })
      });

      const fallbackData = await fallbackRes.json();
      if (fallbackData.success) {
        setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(fallbackData.message || 'Failed to deliver message.');
      }
    } catch (err) {
      setStatus({ type: 'error', message: `Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="section-divider"><span>/* CONTACT */</span></div>
      <section className="contact" id="contact">
        <div className="section-header reveal visible">
          <span className="section-tag">get in touch</span>
          <h2 className="section-title">Contact <span>Me</span></h2>
        </div>
        <div className="contact-wrap">
          <div className="contact-info reveal visible">
            <h3>Let's build something <span>epic</span> together</h3>
            <p>Have a project in mind? Drop me a message and let's talk code.</p>
            <div className="contact-detail">
              <div className="contact-icon"><i className="fa fa-envelope"></i></div>
              <div>
                <span className="detail-label">EMAIL</span>
                <a className="detail-value" href="mailto:jamesashish332@gmail.com">
                  jamesashish332@gmail.com
                </a>
              </div>
            </div>
            <div className="contact-detail">
              <div className="contact-icon"><i className="fa fa-phone"></i></div>
              <div>
                <span className="detail-label">PHONE</span>
                <a className="detail-value" href="tel:+918875566521">
                  +91 8875566521
                </a>
              </div>
            </div>
            <div className="contact-detail">
              <div className="contact-icon"><i className="fa fa-location-dot"></i></div>
              <div>
                <span className="detail-label">LOCATION</span>
                <span className="detail-value">India 🇮🇳</span>
              </div>
            </div>
          </div>

          <form className="contact-form reveal visible" id="contactForm" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="cf-name">name</label>
                <input
                  type="text"
                  id="cf-name"
                  name="name"
                  className="form-input"
                  placeholder="Your Name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cf-email">email</label>
                <input
                  type="email"
                  id="cf-email"
                  name="email"
                  className="form-input"
                  placeholder="your@email.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cf-subject">subject</label>
              <input
                type="text"
                id="cf-subject"
                name="subject"
                className="form-input"
                placeholder="Project / Collaboration / Freelance"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cf-message">message</label>
              <textarea
                id="cf-message"
                name="message"
                className="form-input"
                rows="6"
                placeholder="Tell me about your project..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {status.message && (
              <p
                className="form-status"
                style={{
                  color: status.type === 'success' ? 'var(--green)' : '#ff5555',
                  marginTop: '10px',
                  fontWeight: 500
                }}
              >
                {status.message}
              </p>
            )}

            <button type="submit" className="btn-primary send-btn" disabled={loading}>
              <i className="fa fa-paper-plane"></i> {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
