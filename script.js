// ===== PORTFOLIO SCRIPT =====
// Clean, single initializeApp — no duplicates

const roles = ['Full Stack Developer', 'AI/ML Engineer'];
let currentTheme = localStorage.getItem('theme') || 'light';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    setTheme(currentTheme);

    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true, offset: 80 });
    }

    initPreloader();
    initNavigation();
    initTyping();
    initScrollEffects();
    initProjectFilter();
    initCounters();
    initContactForm();
    initScrollProgress();
    initBackToTop();
    initTerminal();
    preloadImages();
}

// ===== PRELOADER =====
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const bar = preloader?.querySelector('.progress-bar');
    if (bar) setTimeout(() => { bar.style.width = '100%'; }, 200);
    setTimeout(() => {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.style.overflow = 'visible';
                // Animate hero counters after preloader
                animateHeroCounters();
            }, 400);
        }
    }, 1200);
}

// ===== THEME =====
function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = document.querySelector('#themeToggle i');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

document.getElementById('themeToggle')?.addEventListener('click', () => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
});

// ===== NAVIGATION =====
function initNavigation() {
    const toggle = document.getElementById('mobileNavToggle');
    const sidebar = document.getElementById('sidebarNav');
    const backdrop = document.getElementById('navBackdrop');

    const closeSidebar = () => {
        toggle?.classList.remove('active');
        sidebar?.classList.remove('active');
        backdrop?.classList.remove('active');
    };

    toggle?.addEventListener('click', () => {
        toggle.classList.toggle('active');
        sidebar?.classList.toggle('active');
        backdrop?.classList.toggle('active');
    });

    backdrop?.addEventListener('click', closeSidebar);

    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) window.scrollTo({ top: target.offsetTop - 20, behavior: 'smooth' });
        });
    });

    window.addEventListener('scroll', updateActiveNav, { passive: true });
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.sidebar-link');
    let current = '';

    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) current = section.id;
    });

    links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

// ===== TYPING EFFECT =====
function initTyping() {
    const el = document.getElementById('typingText');
    if (!el) return;

    let roleIndex = 0, charIndex = 0, deleting = false;

    function type() {
        const role = roles[roleIndex];
        el.textContent = role.substring(0, deleting ? charIndex-- : ++charIndex);

        let delay = deleting ? 50 : 100;
        if (!deleting && charIndex === role.length) { delay = 2000; deleting = true; }
        else if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 400; }

        setTimeout(type, delay);
    }

    setTimeout(type, 1600);
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('skill-category')) animateSkillBars(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.project-card, .skill-category, .timeline-item, .about-card').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// ===== SKILL BARS =====
function animateSkillBars(category) {
    category.querySelectorAll('.skill-progress').forEach((bar, i) => {
        setTimeout(() => { bar.style.width = bar.dataset.width; }, i * 150);
    });
}

// ===== COUNTERS =====
function animateHeroCounters() {
    document.querySelectorAll('.hero-stats .stat-item').forEach(item => animateCounter(item));
}

function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) animateCounter(entry.target);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-box').forEach(el => observer.observe(el));
}

function animateCounter(element) {
    const counter = element.querySelector('.stat-number, .stat-num');
    if (!counter || counter.dataset.animated) return;
    counter.dataset.animated = 'true';

    const target = parseFloat(counter.dataset.target || counter.textContent);
    const isDecimal = target % 1 !== 0;
    const duration = 1800;
    const steps = duration / 16;
    const increment = target / steps;
    let current = 0;

    const update = () => {
        current = Math.min(current + increment, target);
        counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
        if (current < target) requestAnimationFrame(update);
        else counter.textContent = isDecimal ? target.toFixed(1) : target;
    };
    requestAnimationFrame(update);
}

// ===== PROJECT FILTER =====
function initProjectFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.dataset.filter;

            cards.forEach(card => {
                const show = filter === 'all' || card.classList.contains(filter);
                card.style.opacity = show ? '1' : '0';
                card.style.transform = show ? 'scale(1)' : 'scale(0.95)';
                card.style.pointerEvents = show ? 'auto' : 'none';
                setTimeout(() => { card.style.display = show ? 'flex' : 'none'; }, show ? 0 : 300);
                if (show) setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
            });
        });
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearError(field));
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;
        this.querySelectorAll('input, textarea, select').forEach(f => { if (!validateField(f)) valid = false; });
        if (!valid) return showNotification('Please fix the errors before submitting.', 'error');

        const d = new FormData(this);
        const subject = encodeURIComponent(`Portfolio Contact: ${d.get('subject')}`);
        const body = encodeURIComponent(`Name: ${d.get('firstName')} ${d.get('lastName')}\nEmail: ${d.get('email')}\n\n${d.get('message')}`);
        const btn = this.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        setTimeout(() => {
            window.location.href = `mailto:chalamchala2005@gmail.com?subject=${subject}&body=${body}`;
            btn.innerHTML = orig;
            showNotification('Email client opened. Send the message from there!', 'success');
            this.reset();
        }, 800);
    });
}

function validateField(field) {
    const val = field.value.trim();
    clearError(field);
    if (field.required && !val) return setError(field, 'This field is required'), false;
    if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return setError(field, 'Enter a valid email'), false;
    if ((field.name === 'firstName' || field.name === 'lastName') && val && val.length < 2) return setError(field, 'At least 2 characters'), false;
    if (field.name === 'message' && val && val.length < 10) return setError(field, 'At least 10 characters'), false;
    return true;
}

function setError(field, msg) {
    field.classList.add('error');
    let err = field.parentNode.querySelector('.field-error');
    if (!err) { err = document.createElement('div'); err.className = 'field-error'; field.parentNode.appendChild(err); }
    err.textContent = msg;
}

function clearError(field) {
    field.classList.remove('error');
    field.parentNode.querySelector('.field-error')?.remove();
}

// ===== SCROLL PROGRESS =====
function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (bar) bar.style.width = pct + '%';
    }, { passive: true });
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => btn?.classList.toggle('visible', window.scrollY > 400), { passive: true });
    btn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== KEYBOARD =====
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.getElementById('mobileNavToggle')?.classList.remove('active');
        document.getElementById('sidebarNav')?.classList.remove('active');
        document.getElementById('navBackdrop')?.classList.remove('active');
    }
});

// ===== NOTIFICATION =====
function showNotification(message, type = 'info') {
    document.querySelector('.notification')?.remove();
    const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };
    const n = document.createElement('div');
    n.className = 'notification';
    n.innerHTML = `<span>${message}</span><button onclick="this.parentNode.remove()">&times;</button>`;
    Object.assign(n.style, {
        position: 'fixed', top: '20px', right: '20px', background: colors[type],
        color: '#fff', padding: '1rem 1.5rem', borderRadius: '10px', zIndex: '10000',
        display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        animation: 'slideInRight 0.3s ease', maxWidth: '380px', fontSize: '0.9rem'
    });
    n.querySelector('button').style.cssText = 'background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer;padding:0;opacity:0.8;';
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 5000);
}

// ===== TERMINAL ANIMATION =====
function initTerminal() {
    const body = document.getElementById('terminalBody');
    if (!body) return;

    const lines = [
        { type: 'cmd',    prompt: '❯', cmd: 'whoami' },
        { type: 'out',    text: '<span class="t-string">anjaninithin_chalamchala</span>' },
        { type: 'cmd',    prompt: '❯', cmd: 'cat profile.json' },
        { type: 'out',    text: '{' },
        { type: 'out',    text: '&nbsp;&nbsp;<span class="t-key">"role"</span>: <span class="t-val">"AI/ML Engineer & Full Stack Dev"</span>,' },
        { type: 'out',    text: '&nbsp;&nbsp;<span class="t-key">"college"</span>: <span class="t-val">"IIITDM Kancheepuram"</span>,' },
        { type: 'out',    text: '&nbsp;&nbsp;<span class="t-key">"cgpa"</span>: <span class="t-string">9.1</span>,' },
        { type: 'out',    text: '&nbsp;&nbsp;<span class="t-key">"leetcode"</span>: <span class="t-string">"500+ solved"</span>' },
        { type: 'out',    text: '}' },
        { type: 'cmd',    prompt: '❯', cmd: 'ls skills/' },
        { type: 'out',    text: '<span class="t-string">python</span>&nbsp;&nbsp;<span class="t-string">react</span>&nbsp;&nbsp;<span class="t-string">tensorflow</span>&nbsp;&nbsp;<span class="t-string">c++</span>&nbsp;&nbsp;<span class="t-string">fpga</span>' },
        { type: 'cmd',    prompt: '❯', cmd: 'git log --oneline -3' },
        { type: 'out',    text: '<span class="t-comment">a1b2c3 Bone Age Prediction — 0.86 QWK</span>' },
        { type: 'out',    text: '<span class="t-comment">d4e5f6 LANConf — offline WebRTC conferencing</span>' },
        { type: 'out',    text: '<span class="t-comment">g7h8i9 XV6 OS — MLFQ scheduler + security</span>' },
        { type: 'cursor', prompt: '❯', cmd: '' },
    ];

    let i = 0;
    function renderNext() {
        if (i >= lines.length) return;
        const l = lines[i++];
        const div = document.createElement('div');
        div.className = 't-line';

        if (l.type === 'cmd') {
            div.innerHTML = `<span class="t-prompt">${l.prompt}</span><span class="t-cmd">${l.cmd}</span>`;
        } else if (l.type === 'out') {
            div.innerHTML = `<span class="t-output">${l.text}</span>`;
        } else if (l.type === 'cursor') {
            div.innerHTML = `<span class="t-prompt">${l.prompt}</span><span class="t-cursor"></span>`;
        }

        body.appendChild(div);
        requestAnimationFrame(() => div.classList.add('show'));
        body.scrollTop = body.scrollHeight;

        const delay = l.type === 'cmd' ? 600 : 120;
        setTimeout(renderNext, delay);
    }

    // Start after preloader
    setTimeout(renderNext, 1400);
}

function preloadImages() {
    ['./Nithin_prof.jpeg', './Nithin_casual.jpeg'].forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload'; link.as = 'image'; link.href = src;
        document.head.appendChild(link);
    });
}

// ===== SLIDE IN ANIMATION =====
const style = document.createElement('style');
style.textContent = '@keyframes slideInRight{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}';
document.head.appendChild(style);
