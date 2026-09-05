import React, { useEffect, useRef, useState } from 'react';

function StatCounter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof target !== 'number') return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let current = 0;
          const step = Math.ceil(target / 12);
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            setCount(current);
            if (current >= target) clearInterval(timer);
          }, 80);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div className="stat-box" ref={ref}>
      <span className="stat-num">{typeof target === 'number' ? count : target}</span>
      {suffix && <span className="stat-plus">{suffix}</span>}
    </div>
  );
}

export default function About() {
  return (
    <>
      <div className="section-divider"><span>/* ABOUT */</span></div>
      <section className="about" id="about">
        <div className="section-header reveal visible">
          <span className="section-tag">who am i</span>
          <h2 className="section-title">About <span>Me</span></h2>
        </div>
        <div className="about-grid">
          <div className="about-text reveal visible">
            <p>
              I'm Ashish, a full stack web developer focused on building fast, responsive, and user-friendly
              applications — from pixel-accurate frontends to reliable backend APIs.
            </p>
            <p>
              I work across the MERN stack (MongoDB, Express, React, Node.js), styling with Tailwind CSS, and
              I'm comfortable with Python and C/C++ for problem-solving and backend logic.
            </p>
            <p>
              I care about clean code and real functionality over shortcuts — every project I ship is something
              I'd be comfortable handing off to a team or a client.
            </p>
            <a
              href="/Ashish_Resume.pdf"
              download
              className="btn-primary"
              style={{ marginTop: '24px', display: 'inline-flex' }}
            >
              <i className="fa fa-file-code"></i> View Resume
            </a>
          </div>
          <div className="about-stats reveal visible">
            <div className="stat-box">
              <StatCounter target={3} suffix="+" />
              <span className="stat-label">YEARS CODING</span>
            </div>
            <div className="stat-box">
              <StatCounter target={10} suffix="+" />
              <span className="stat-label">PROJECTS BUILT</span>
            </div>
            <div className="stat-box">
              <StatCounter target={8} suffix="+" />
              <span className="stat-label">TECHNOLOGIES</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">∞</span>
              <span className="stat-label">CUPS OF COFFEE</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
