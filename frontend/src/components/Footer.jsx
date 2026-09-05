import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>
            <span className="bracket">&lt;</span>
            <span className="logo-name">Ashish</span>
            <span className="bracket">/&gt;</span>
          </h3>
          <p>Building modern, responsive, high-performance web apps — one line at a time.</p>
          <div className="footer-social">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-github"></i></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram"></i></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>NAVIGATE</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>SOCIALS</h4>
          <ul>
            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>CONTACT</h4>
          <ul>
            <li><a href="mailto:jamesashish332@gmail.com">jamesashish332@gmail.com</a></li>
            <li><a href="tel:+918875566521">+91 8875566521</a></li>
            <li><a href="#contact">India 🇮🇳</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span><span className="co">// </span>© {currentYear} Ashish — All Rights Reserved</span>
        <span>Built with ❤️ & ☕ in India</span>
      </div>
    </footer>
  );
}
