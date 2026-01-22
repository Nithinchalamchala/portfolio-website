// ===== GLOBAL VARIABLES =====
let isLoading = true;
let currentTheme = localStorage.getItem('theme') || 'light';
let typingIndex = 0;
let typingText = '';
const roles = [
    'Full Stack Developer',
    'AI/ML Engineer'
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize theme
    setTheme(currentTheme);
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
    
    // Initialize components
    initializePreloader();
    initializeNavigation();
    initializeTypingEffect();
    initializeScrollEffects();
    initializeProjectFilter();
    initializeSkillBars();
    initializeContactForm();
    initializeCounters();
    
    // Start preloader
    setTimeout(() => {
        hidePreloader();
    }, 2500);
}

// ===== PRELOADER =====
function initializePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Animate progress bar
        const progressBar = preloader.querySelector('.progress-bar');
        if (progressBar) {
            setTimeout(() => {
                progressBar.style.width = '100%';
            }, 500);
        }
    }
}

function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            isLoading = false;
            document.body.style.overflow = 'visible';
        }, 500);
    }
}

// ===== THEME TOGGLE =====
function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

document.getElementById('themeToggle')?.addEventListener('click', function() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// ===== NAVIGATION =====
function initializeNavigation() {
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const sidebarNav = document.getElementById('sidebarNav');
    const navBackdrop = document.getElementById('navBackdrop');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    // Mobile sidebar toggle
    mobileNavToggle?.addEventListener('click', function() {
        this.classList.toggle('active');
        sidebarNav?.classList.toggle('active');
        navBackdrop?.classList.toggle('active');
    });
    
    // Close sidebar when clicking backdrop
    navBackdrop?.addEventListener('click', function() {
        mobileNavToggle?.classList.remove('active');
        sidebarNav?.classList.remove('active');
        navBackdrop?.classList.remove('active');
    });
    
    // Close mobile sidebar when clicking on links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNavToggle?.classList.remove('active');
            sidebarNav?.classList.remove('active');
            navBackdrop?.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 20;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', updateActiveNavigation);
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}



// ===== TYPING EFFECT =====
function initializeTypingEffect() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeRole() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before next role
        }
        
        setTimeout(typeRole, typeSpeed);
    }
    
    // Start typing effect after preloader
    setTimeout(() => {
        typeRole();
    }, 3000);
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Trigger skill bars animation
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillBars(entry.target);
                }
                
                // Trigger counter animation
                if (entry.target.classList.contains('stat-card') || entry.target.classList.contains('stat-item')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation (excluding hero stats)
    document.querySelectorAll('.project-card, .skill-category, .stat-card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== PROJECT FILTER =====
function initializeProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.classList.contains(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== SKILL BARS =====
function initializeSkillBars() {
    // This will be triggered by intersection observer
}

function animateSkillBars(skillCategory) {
    const skillBars = skillCategory.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        }, index * 200);
    });
}

// ===== COUNTERS =====
function initializeCounters() {
    // Animate hero stats immediately after preloader
    setTimeout(() => {
        const heroStats = document.querySelectorAll('.hero-stats .stat-item');
        heroStats.forEach(stat => {
            animateCounter(stat);
        });
    }, 3500); // After preloader finishes
}

function animateCounter(element) {
    const counter = element.querySelector('.stat-number');
    if (!counter || counter.classList.contains('animated')) return;
    
    counter.classList.add('animated');
    const target = parseFloat(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current < target) {
            if (target % 1 !== 0) {
                counter.textContent = current.toFixed(1);
            } else {
                counter.textContent = Math.floor(current);
            }
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target % 1 !== 0 ? target.toFixed(1) : target;
        }
    };
    
    updateCounter();
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Create mailto link
        const mailtoSubject = `Portfolio Contact: ${subject}`;
        const mailtoBody = `Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`;
        const mailtoLink = `mailto:chalamchala2005@gmail.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.classList.add('loading');
        
        // Simulate sending delay
        setTimeout(() => {
            // Open email client
            window.location.href = mailtoLink;
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('loading');
            
            // Show success message
            showNotification('Thank you! Your email client should open with the message ready to send.', 'success');
            
            // Reset form
            this.reset();
        }, 1000);
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add animation styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
                opacity: 0.8;
            }
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handler
const debouncedScrollHandler = debounce(() => {
    updateActiveNavigation();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(e) {
    // ESC key to close mobile sidebar
    if (e.key === 'Escape') {
        const mobileNavToggle = document.getElementById('mobileNavToggle');
        const sidebarNav = document.getElementById('sidebarNav');
        const navBackdrop = document.getElementById('navBackdrop');
        if (mobileNavToggle?.classList.contains('active')) {
            mobileNavToggle.classList.remove('active');
            sidebarNav?.classList.remove('active');
            navBackdrop?.classList.remove('active');
        }
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load images when they come into view
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        }
    });
});

// Observe all images with data-src attribute
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

// ===== ANALYTICS (Optional) =====
function trackEvent(eventName, properties = {}) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, properties);
    // You could integrate with Google Analytics, Mixpanel, etc.
}

// Track page load
window.addEventListener('load', () => {
    trackEvent('page_loaded', {
        page: 'portfolio',
        load_time: performance.now()
    });
});

// Track section views
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            trackEvent('section_viewed', {
                section: entry.target.id
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

// ===== SCROLL PROGRESS INDICATOR =====
function initializeScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
    });
}

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop?.classList.add('visible');
        } else {
            backToTop?.classList.remove('visible');
        }
    });
    
    backToTop?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== ENHANCED ANIMATIONS =====
function initializeEnhancedAnimations() {
    // Stagger animations for cards
    const cards = document.querySelectorAll('.project-card, .skill-category, .demo-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        if (heroImage && scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
}

// ===== PERFORMANCE MONITORING =====
function initializePerformanceMonitoring() {
    // Track page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // You could send this to analytics
        trackEvent('page_performance', {
            load_time: loadTime,
            user_agent: navigator.userAgent
        });
    });
}

// ===== ENHANCED CONTACT FORM =====
function initializeEnhancedContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearErrors);
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField.call(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showNotification('Please fix the errors before submitting.', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(this);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Create mailto link
        const mailtoSubject = `Portfolio Contact: ${subject}`;
        const mailtoBody = `Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`;
        const mailtoLink = `mailto:chalamchala2005@gmail.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.classList.add('loading');
        
        // Simulate sending delay
        setTimeout(() => {
            // Open email client
            window.location.href = mailtoLink;
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('loading');
            
            // Show success message
            showNotification('Thank you! Your email client should open with the message ready to send.', 'success');
            
            // Reset form
            this.reset();
            
            // Track form submission
            trackEvent('contact_form_submitted', {
                subject: subject,
                timestamp: new Date().toISOString()
            });
        }, 1000);
    });
}

function validateField() {
    const field = this;
    const value = field.value.trim();
    let isValid = true;
    
    // Remove existing error
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Name validation
    if ((field.name === 'firstName' || field.name === 'lastName') && value) {
        if (value.length < 2) {
            showFieldError(field, 'Name must be at least 2 characters');
            isValid = false;
        }
    }
    
    // Message validation
    if (field.name === 'message' && value) {
        if (value.length < 10) {
            showFieldError(field, 'Message must be at least 10 characters');
            isValid = false;
        }
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearErrors() {
    clearFieldError(this);
}

// ===== KEYBOARD SHORTCUTS =====
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search (if you add search later)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // Focus search input if available
        }
        
        // ESC to close modals/menus
        if (e.key === 'Escape') {
            const mobileNavToggle = document.getElementById('mobileNavToggle');
            const sidebarNav = document.getElementById('sidebarNav');
            const navBackdrop = document.getElementById('navBackdrop');
            if (mobileNavToggle?.classList.contains('active')) {
                mobileNavToggle.classList.remove('active');
                sidebarNav?.classList.remove('active');
                navBackdrop?.classList.remove('active');
            }
        }
    });
}

// ===== LAZY LOADING IMAGES =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== UPDATE INITIALIZATION =====
function initializeApp() {
    // Initialize theme
    setTheme(currentTheme);
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
    
    // Initialize all components
    initializePreloader();
    initializeNavigation();
    initializeTypingEffect();
    initializeScrollEffects();
    initializeProjectFilter();
    initializeSkillBars();
    initializeEnhancedContactForm(); // Updated
    initializeCounters();
    initializeScrollProgress(); // New
    initializeBackToTop(); // New
    initializeEnhancedAnimations(); // New
    initializePerformanceMonitoring(); // New
    initializeKeyboardShortcuts(); // New
    initializeLazyLoading(); // New
    
    // Start preloader
    setTimeout(() => {
        hidePreloader();
    }, 2500);
}

// ===== ENHANCED ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // Track errors for debugging
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack
    });
});

// ===== ENHANCED ANALYTICS =====
function trackEvent(eventName, properties = {}) {
    // Enhanced analytics tracking
    const eventData = {
        event: eventName,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...properties
    };
    
    console.log('Event tracked:', eventData);
    
    // You could integrate with:
    // - Google Analytics 4
    // - Mixpanel
    // - Amplitude
    // - Custom analytics endpoint
}

// ===== PERFORMANCE OPTIMIZATION =====
// Use the existing debounced scroll handler
window.addEventListener('scroll', debouncedScrollHandler, { passive: true });

// Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        './Nithin_prof.jpeg',
        './Nithin_casual.jpeg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadCriticalResources();