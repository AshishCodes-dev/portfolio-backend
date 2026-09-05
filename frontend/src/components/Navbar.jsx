import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const sections = ['home', 'about', 'skills', 'projects', 'contact'];
        const scrollPos = window.scrollY + 100;

        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
              setActiveSection(id);
              break;
            }
          }
        }
      }, 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { num: '01.', label: 'home', href: '#home' },
    { num: '02.', label: 'about', href: '#about' },
    { num: '03.', label: 'skills', href: '#skills' },
    { num: '04.', label: 'projects', href: '#projects' },
    { num: '05.', label: 'contact', href: '#contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <header>
      <nav>
        <div className="nav-logo">
          <span className="bracket">&lt;</span>
          <span className="logo-name">Ashish</span>
          <span className="bracket">/&gt;</span>
          <span className="blink-cursor">_</span>
        </div>

        <ul className={`nav-links ${isOpen ? 'open' : ''}`} id="navLinks">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={activeSection === item.label ? 'active' : ''}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                <span className="nav-num">{item.num}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className={`hamburger ${isOpen ? 'active' : ''}`}
          id="hamburger"
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  );
}
