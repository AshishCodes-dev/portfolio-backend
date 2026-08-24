'use strict';

const CONFIG = {
    // Local host par localhost:5000 use karega, live par Vercel URL
    API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : 'https://portfolio-three-mu-atx8a7vsl8.vercel.app/api',
    ANIMATIONS: {
        SCROLL_OFFSET: 80,
        REVEAL_DELAY: 90,
        CLICK_BURST_COUNT: 6
    }
};

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

(function initCursor() {
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

    function animateTrail() {
        tx += (mx - tx) * 0.12;
        ty += (my - ty) * 0.12;
        trail.style.left = (tx - 18) + 'px';
        trail.style.top = (ty - 18) + 'px';
        animationId = requestAnimationFrame(animateTrail);
    }
    animateTrail();

    const hoverElements = document.querySelectorAll('a, button, .skill-row, .project-card, .stat-box, .exp-item');
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

(function initMatrix() {
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

    setInterval(draw, 50);
})();

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

(function initSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');
    if (skillFills.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                setTimeout(() => {
                    entry.target.style.width = width + '%';
                }, 300);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    skillFills.forEach(el => observer.observe(el));
})();

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

(function initHamburger() {
    const hamburgerBtn = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (!hamburgerBtn || !navLinks) return;

    hamburgerBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        hamburgerBtn.classList.toggle('active');
        hamburgerBtn.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', (e) => {
        if (!hamburgerBtn.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('open');
            hamburgerBtn.classList.remove('active');
        }
    });
})();

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

(function initTilt() {
    if (window.innerWidth < 768) return;

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

(function initSkillRowHover() {
    const skillRows = document.querySelectorAll('.skill-row');
    if (skillRows.length === 0) return;

    skillRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            const bar = row.querySelector('.skill-fill');
            if (bar) {
                bar.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.6)';
                bar.style.filter = 'brightness(1.2)';
            }
        });

        row.addEventListener('mouseleave', () => {
            const bar = row.querySelector('.skill-fill');
            if (bar) {
                bar.style.boxShadow = 'none';
                bar.style.filter = 'brightness(1)';
            }
        });
    });
})();

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

(function updateYear() {
    const currentYear = new Date().getFullYear();
    const footerSpans = document.querySelectorAll('.footer-bottom span');

    footerSpans.forEach(span => {
        if (span.textContent.includes('©')) {
            span.innerHTML = span.innerHTML.replace(/\d{4}/, currentYear);
        }
    });
})();

(function initPageLoad() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';

    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
})();

(function initContactForm() {
    const sendBtn = document.querySelector('.send-btn');
    if (!sendBtn) return;

    sendBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const nameInput = document.querySelector('input[placeholder="Your Name"]');
        const emailInput = document.querySelector('input[placeholder="your@email.com"]');
        const subjectInput = document.querySelector('input[placeholder="Project / Collaboration / Freelance"]');
        const messageInput = document.querySelector('textarea[placeholder="Tell me about your project..."]');

        if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
            alert('Please fill all fields');
            return;
        }

        const contactData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            subject: subjectInput.value.trim(),
            message: messageInput.value.trim()
        };

        try {
            sendBtn.textContent = 'Sending...';
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
                alert('Message sent successfully! We will get back to you soon.');

                nameInput.value = '';
                emailInput.value = '';
                subjectInput.value = '';
                messageInput.value = '';

                sendBtn.textContent = 'Message Sent!';
                setTimeout(() => {
                    sendBtn.textContent = 'Send Message';
                    sendBtn.disabled = false;
                }, 2000);
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (error) {
            alert('Error: ' + error.message);
            sendBtn.textContent = 'Send Message';
            sendBtn.disabled = false;
        }
    });
})();

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

window.addEventListener('load', () => {
    fetchProjects();
});