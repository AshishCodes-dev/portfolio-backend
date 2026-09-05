import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

export default function Hero() {
  const typedRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        'Web Developer.',
        'React Developer.',
        'Frontend Designer.',
        'Full Stack Engineer.',
        'Problem Solver 🚀',
        'Open to Work 💼'
      ],
      typeSpeed: 55,
      backSpeed: 28,
      backDelay: 1600,
      startDelay: 400,
      loop: true,
      cursorChar: '█',
      smartBackspace: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-left">
        <div className="terminal-badge">
          <span className="badge-dot"></span>STATUS: AVAILABLE FOR HIRE
        </div>
        <p className="hero-greeting">// hello, world</p>
        <h1 className="hero-name">
          I'm <span className="name-highlight glitch" data-text="Ashish">Ashish</span>
        </h1>
        <div className="hero-typed-wrap">
          <span className="prompt-arrow">&gt;&nbsp;</span>
          <span ref={typedRef} id="typed-element"></span>
        </div>
        <p className="hero-tagline">
          Turning <span className="highlight-word">ideas</span> into{' '}
          <span className="highlight-word">digital reality</span> — one commit at a time.
        </p>
        <div className="hero-buttons">
          <a href="/Ashish_Resume.pdf" download className="btn-primary">
            <i className="fa fa-download"></i> Download CV
          </a>
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <i className="fa-brands fa-github"></i> GitHub
          </a>
        </div>
        <div className="social-row">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="fa-brands fa-github"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fa-brands fa-linkedin"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fa-brands fa-twitter"></i>
          </a>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-img-glow"></div>
        <div className="code-window">
          <div className="window-bar">
            <div className="dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <span className="window-title">ashish.js</span>
            <span className="window-lang">JavaScript</span>
          </div>
          <div className="code-body">
            <div className="code-line"><span className="ln">01</span><span className="kw">const</span> <span className="fn">developer</span> <span className="op">=</span> {'{'}</div>
            <div className="code-line"><span className="ln">02</span>&nbsp;&nbsp;<span className="prop">name</span><span className="op">:</span> <span className="str">"Ashish"</span><span className="op">,</span></div>
            <div className="code-line"><span className="ln">03</span>&nbsp;&nbsp;<span className="prop">role</span><span className="op">:</span> <span className="str">"Full Stack Dev"</span><span className="op">,</span></div>
            <div className="code-line"><span className="ln">04</span>&nbsp;&nbsp;<span className="prop">location</span><span className="op">:</span> <span className="str">"India 🇮🇳"</span><span className="op">,</span></div>
            <div className="code-line"><span className="ln">05</span>&nbsp;&nbsp;<span className="prop">stack</span><span className="op">:</span> [</div>
            <div className="code-line"><span className="ln">06</span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="str">"React"</span><span className="op">,</span> <span className="str">"Node.js"</span><span className="op">,</span></div>
            <div className="code-line"><span className="ln">07</span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="str">"MongoDB"</span><span className="op">,</span> <span className="str">"Express"</span></div>
            <div className="code-line"><span className="ln">08</span>&nbsp;&nbsp;]<span className="op">,</span></div>
            <div className="code-line"><span className="ln">09</span>&nbsp;&nbsp;<span className="prop">available</span><span className="op">:</span> <span className="kw">true</span><span className="op">,</span></div>
            <div className="code-line"><span className="ln">10</span>&nbsp;&nbsp;<span className="prop">coffee</span><span className="op">:</span> <span className="str">"always ☕"</span></div>
            <div className="code-line"><span className="ln">11</span>{'}'}<span className="op">;</span></div>
            <div className="code-line"><span className="ln">12</span></div>
            <div className="code-line"><span className="ln">13</span><span className="co">// Ready to build something epic?</span></div>
            <div className="code-line"><span className="ln">14</span><span className="fn">console</span><span className="op">.</span><span className="fn">log</span>(<span className="str">"Let's go!"</span>)<span className="op">;</span></div>
          </div>
        </div>
        <div className="float-badge badge-1"><i className="fa-brands fa-react"></i> React</div>
        <div className="float-badge badge-2"><i className="fa-brands fa-node-js"></i> Node.js</div>
        <div className="float-badge badge-3">⚡ Open to work</div>
      </div>
    </section>
  );
}
