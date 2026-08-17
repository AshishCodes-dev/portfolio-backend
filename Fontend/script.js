/* ============================================================
   ASHISH PORTFOLIO — script.js (Professional Version)
   Optimized: Cursor | Matrix | Typed | Scroll Effects
   Skill Bars | Counters | Hamburger | API Integration
   ============================================================ */

'use strict';

// ============================================================
// CONFIGURATION
// ============================================================
const CONFIG = {
    // Uses localhost only when the site itself is running locally.
    // TODO: replace 'your-api-domain.com' with your deployed backend's real domain.
    API_URL: (['localhost', '127.0.0.1'].includes(window.location.hostname))
        ? 'http://localhost:5000/api'
        : 'https://portfolio-backend-l17o.onrender.com/api',
    ANIMATIONS: {
        SCROLL_OFFSET: 80,
        REVEAL_DELAY: 90,
        CLICK_BURST_COUNT: 6
    },
    PREFERS_REDUCED_MOTION: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

// ============================================================
// 1. TYPED.JS — Hero typing animation
// ============================================================
if (document.getElementById('typed-element')) {
    new Typed('#typed-element', {
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
}

// ============================================================
// 2. CUSTOM CURSOR — dot + trailing ring
// ============================================================
(function initCursor() {
    if (CONFIG.PREFERS_REDUCED_MOTION) return;
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursor-trail');
    if (!cursor || !trail) return;

    let mx = 0, my = 0, tx = 0, ty = 0;
    let isVisible = false;
    let animationId = null;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.left = (mx - 6) + 'px';
        cursor.style.top = (my - 6) + 'px';

        if (!isVisible) {
            cursor.style.opacity = '1';
            trail.style.opacity = '1';
            isVisible = true;
        }
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        trail.style.opacity = '0';
        isVisible = false;
    });

    // Smooth trail animation
    function animateTrail() {
        tx += (mx - tx) * 0.12;
        ty += (my - ty) * 0.12;
        trail.style.left = (tx - 18) + 'px';
        trail.style.top = (ty - 18) + 'px';
        animationId = requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Cursor scale on hover
    const hoverElements = document.querySelectorAll('a, button, .skill-chip, .project-card, .stat-box');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2.5)';
            cursor.style.background = 'var(--cyan)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'var(--purple)';
        });
    });

    // Click burst effect
    document.addEventListener('click', (e) => {
        createClickBurst(e.clientX, e.clientY);
    });
})();

function createClickBurst(x, y) {
    for (let i = 0; i < CONFIG.ANIMATIONS.CLICK_BURST_COUNT; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
      position: fixed;
      width: 6px;
      height: 6px;
      background: hsl(${270 + Math.random() * 60}, 80%, 70%);
      border-radius: 50%;
      pointer-events: none;
      left: ${x}px;
      top: ${y}px;
      z-index: 99997;
      transform: translate(-50%, -50%);
    `;
        document.body.appendChild(particle);

        const angle = (i / CONFIG.ANIMATIONS.CLICK_BURST_COUNT) * Math.PI * 2;
        const distance = 30 + Math.random() * 30;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        particle.animate(
            [
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`, opacity: 0 }
            ],
            { duration: 500, easing: 'ease-out' }
        ).onfinish = () => particle.remove();
    }
}

// ============================================================
// 3. MATRIX RAIN — Purple/cyan characters
// ============================================================
(function initMatrix() {
    if (CONFIG.PREFERS_REDUCED_MOTION) return;
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const CHARS = 'アイウエオカキクケコサシスセソタチツテ01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ</>{}[]=>.!#$%^&*()functionconst letvar';
    const SIZE = 13;
    let drops = [];
    let cols = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cols = Math.floor(canvas.width / SIZE);
        drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -50));
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
        ctx.fillStyle = 'rgba(2, 2, 27, 0.055)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < drops.length; i++) {
            const char = CHARS[Math.floor(Math.random() * CHARS.length)];
            const alpha = Math.random() > 0.6 ? 0.9 : 0.3;
            const color = Math.random() > 0.85
                ? `rgba(0, 212, 255, ${alpha})`
                : `rgba(129, 52, 202, ${alpha})`;

            ctx.fillStyle = color;
            ctx.font = `${SIZE}px JetBrains Mono`;
            ctx.fillText(char, i * SIZE, drops[i] * SIZE);

            if (drops[i] * SIZE > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    let matrixInterval = setInterval(draw, 50);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(matrixInterval);
        } else {
            matrixInterval = setInterval(draw, 50);
        }
    });
})();

// ============================================================
// 4. SCROLL REVEAL — Intersection Observer
// ============================================================
(function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (items.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * CONFIG.ANIMATIONS.REVEAL_DELAY);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    items.forEach(el => observer.observe(el));
})();

// ============================================================
// 6. COUNTER ANIMATION — Stats count up
// ============================================================
(function initCounters() {
    const counterElements = document.querySelectorAll('.stat-num[data-target]');
    if (counterElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const targetValue = parseInt(element.getAttribute('data-target'));
                let currentValue = 0;
                const step = Math.ceil(targetValue / 12);

                const timer = setInterval(() => {
                    currentValue = Math.min(currentValue + step, targetValue);
                    element.textContent = currentValue;
                    if (currentValue >= targetValue) clearInterval(timer);
                }, 80);

                observer.unobserve(element);
            }
        });
    }, { threshold: 0.6 });

    counterElements.forEach(el => observer.observe(el));
})();

// ============================================================
// 7. HAMBURGER MENU
// ============================================================
(function initHamburger() {
    const hamburgerBtn = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (!hamburgerBtn || !navLinks) return;

    hamburgerBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        hamburgerBtn.classList.toggle('active');
        hamburgerBtn.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!hamburgerBtn.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('open');
            hamburgerBtn.classList.remove('active');
        }
    });
})();

// ============================================================
// 8. ACTIVE NAV ON SCROLL (Debounced)
// ============================================================
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links li a');

    if (sections.length === 0 || navLinks.length === 0) return;

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            let currentSection = '';

            sections.forEach(section => {
                if (window.scrollY >= section.offsetTop - CONFIG.ANIMATIONS.SCROLL_OFFSET) {
                    currentSection = section.id;
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentSection) {
                    link.classList.add('active');
                }
            });
        }, 50);
    }, { passive: true });
})();

// ============================================================
// 9. RIPPLE EFFECT — Buttons
// ============================================================
(function initRipple() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline');
    if (buttons.length === 0) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const ripple = document.createElement('span');

            ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        width: 10px;
        height: 10px;
        background: rgba(255, 255, 255, 0.35);
        left: ${x}px;
        top: ${y}px;
        transform: translate(-50%, -50%) scale(0);
        pointer-events: none;
      `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            ripple.animate(
                [
                    { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
                    { transform: `translate(-50%, -50%) scale(${Math.max(rect.width, rect.height) / 5})`, opacity: 0 }
                ],
                { duration: 500, easing: 'ease-out' }
            ).onfinish = () => ripple.remove();
        });
    });
})();

// ============================================================
// 10. CARD TILT EFFECT — Project cards (desktop only)
// ============================================================
(function initTilt() {
    if (window.innerWidth < 768 || CONFIG.PREFERS_REDUCED_MOTION) return;

    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length === 0) return;

    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            card.style.transform = `
        translateY(-10px)
        rotateX(${(-y * 8).toFixed(1)}deg)
        rotateY(${(x * 8).toFixed(1)}deg)
      `;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
            card.style.transition = 'transform 0.4s ease';
        });
    });
})();

// ============================================================
// 11. SMOOTH SCROLL NAV
// ============================================================
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetSelector = link.getAttribute('href');
            const target = document.querySelector(targetSelector);

            if (target) {
                e.preventDefault();
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - CONFIG.ANIMATIONS.SCROLL_OFFSET;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
})();

// ============================================================
// 13. SCROLL PROGRESS BAR
// ============================================================
(function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, #8134ca, #00d4ff);
    z-index: 99999;
    transition: width 0.1s ease;
    pointer-events: none;
  `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercentage = (window.scrollY / scrollHeight) * 100;
        progressBar.style.width = Math.min(scrollPercentage, 100) + '%';
    }, { passive: true });
})();

// ============================================================
// 14. AUTO UPDATE FOOTER YEAR
// ============================================================
(function updateYear() {
    const currentYear = new Date().getFullYear();
    const footerSpans = document.querySelectorAll('.footer-bottom span');

    footerSpans.forEach(span => {
        if (span.textContent.includes('©')) {
            span.innerHTML = span.innerHTML.replace(/\d{4}/, currentYear);
        }
    });
})();

// ============================================================
// 15. PAGE LOAD FADE-IN ANIMATION
// ============================================================
(function initPageLoad() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';

    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
})();

// ============================================================
// 16. CONTACT FORM API INTEGRATION
// ============================================================
(function initContactForm() {
    const form = document.getElementById('contactForm');
    const sendBtn = document.querySelector('.send-btn');
    const statusEl = document.getElementById('formStatus');
    if (!form || !sendBtn) return;

    function setStatus(message, type) {
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.classList.remove('success', 'error');
        if (type) statusEl.classList.add(type);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('cf-name');
        const emailInput = document.getElementById('cf-email');
        const subjectInput = document.getElementById('cf-subject');
        const messageInput = document.getElementById('cf-message');

        // Validate inputs
        if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
            setStatus('Please fill in all fields.', 'error');
            return;
        }

        const contactData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            subject: subjectInput.value.trim(),
            message: messageInput.value.trim()
        };

        try {
            setStatus('Sending...', null);
            sendBtn.disabled = true;

            const response = await fetch(`${CONFIG.API_URL}/contact/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactData)
            });

            const result = await response.json();

            if (response.ok) {
                setStatus('Message sent successfully! We will get back to you soon.', 'success');
                form.reset();
                sendBtn.disabled = false;
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (error) {
            setStatus('Error: ' + error.message, 'error');
            sendBtn.disabled = false;
        }
    });
})();

// ============================================================
// 17. PROJECTS API INTEGRATION
// ============================================================
function displayProjects(projects) {
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    if (projects.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--grey); grid-column: 1 / -1;">No projects yet. Coming soon...</p>';
        return;
    }

    const projectsHTML = projects.map(project => `
    <div class="project-card reveal">
      <div class="project-header">
        <h3 class="project-title">${escapeHtml(project.title)}</h3>
        <span class="project-badge">${escapeHtml(project.category)}</span>
      </div>
      <p class="project-desc">${escapeHtml(project.description)}</p>
      
      <div class="project-tech">
        ${project.technologies.map(tech => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('')}
      </div>
      
      <div class="project-links">
        ${project.liveLink ? `<a href="${escapeHtml(project.liveLink)}" target="_blank" rel="noopener noreferrer" class="btn-outline">
          <i class="fa fa-external-link"></i> Live Demo
        </a>` : ''}
        ${project.githubLink ? `<a href="${escapeHtml(project.githubLink)}" target="_blank" rel="noopener noreferrer" class="btn-outline">
          <i class="fa-brands fa-github"></i> GitHub
        </a>` : ''}
      </div>
    </div>
  `).join('');

    container.innerHTML = projectsHTML;

    // Re-initialize reveal for dynamically added elements
    const newItems = container.querySelectorAll('.reveal:not(.visible)');
    if (newItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * CONFIG.ANIMATIONS.REVEAL_DELAY);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        newItems.forEach(el => observer.observe(el));
    }
}

async function fetchProjects() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/projects/all`);
        if (!response.ok) throw new Error('Failed to fetch projects');

        const data = await response.json();
        displayProjects(data.data || []);
    } catch (error) {
        const container = document.getElementById('projectsContainer');
        if (container) {
            container.innerHTML = '<p style="color: #999; text-align: center; grid-column: 1 / -1;">Projects unavailable</p>';
        }
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Load projects on page load
window.addEventListener('load', () => {
    fetchProjects();
});
