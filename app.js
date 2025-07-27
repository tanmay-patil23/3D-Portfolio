// Portfolio Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all animations and interactions
    initTypingAnimation();
    initBlobTracking();
    initSmoothScrolling();
    initProjectFiltering();
    initSkillBars();
    initScrollAnimations();
    initContactForm();
    initParticleBackground();
    initRevealAnimations();
    
    // Typing Animation for Hero Section
    function initTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        const text = 'Tanmay Patil';
        const cursor = document.querySelector('.cursor');
        
        if (!typingElement) return;
        
        // Clear existing content and start typing animation
        typingElement.textContent = '';
        let index = 0;
        
        function typeChar() {
            if (index < text.length) {
                typingElement.textContent += text.charAt(index);
                index++;
                setTimeout(typeChar, 100);
            } else {
                // Ensure cursor continues blinking after typing is complete
                if (cursor) {
                    cursor.style.animation = 'blink 1s infinite';
                }
            }
        }
        
        // Start typing animation immediately
        setTimeout(typeChar, 500);
    }
    
    // 3D Blob Mouse Tracking
    function initBlobTracking() {
        const blob = document.querySelector('.blob-3d');
        const container = document.querySelector('.blob-container');
        
        if (!blob || !container) return;
        
        let mouseX = 0;
        let mouseY = 0;
        let blobX = 0;
        let blobY = 0;
        
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            mouseX = (e.clientX - rect.left - rect.width / 2) * 0.1;
            mouseY = (e.clientY - rect.top - rect.height / 2) * 0.1;
        });
        
        // Animate blob following mouse with easing
        function animateBlob() {
            blobX += (mouseX - blobX) * 0.1;
            blobY += (mouseY - blobY) * 0.1;
            
            blob.style.transform = `translate(${blobX}px, ${blobY}px) scale(${1 + Math.abs(blobX + blobY) * 0.001})`;
            
            requestAnimationFrame(animateBlob);
        }
        
        animateBlob();
        
        // Add hover effects
        container.addEventListener('mouseenter', () => {
            blob.style.filter = 'blur(1px) hue-rotate(90deg)';
        });
        
        container.addEventListener('mouseleave', () => {
            blob.style.filter = 'blur(1px)';
            mouseX = 0;
            mouseY = 0;
        });
    }
    
    // Smooth Scrolling Navigation - FIXED
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Calculate offset considering fixed navbar height
                    const navHeight = document.querySelector('.nav-glass').offsetHeight;
                    const offsetTop = targetSection.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active state immediately
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
        
        // Update active nav link on scroll
        window.addEventListener('scroll', throttle(() => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 120; // Account for navbar
            
            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');
                
                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`a[href="#${id}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, 100));
    }
    
    // Project Filtering System
    function initProjectFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active filter button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter project cards with animation
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px)';
                        
                        // Animate in
                        setTimeout(() => {
                            card.style.transition = 'all 0.6s ease-out';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.transition = 'all 0.4s ease-in';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(-30px)';
                        
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 400);
                    }
                });
            });
        });
    }
    
    // Animated Skill Bars
    function initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        const skillsSection = document.querySelector('.skills-section');
        
        if (!skillsSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillBars.forEach((bar, index) => {
                        const level = bar.getAttribute('data-level');
                        
                        // Animate with staggered delay
                        setTimeout(() => {
                            bar.style.width = level + '%';
                            bar.style.transition = 'width 1.5s cubic-bezier(0.33, 1, 0.68, 1)';
                            
                            // Add glow effect after animation
                            setTimeout(() => {
                                bar.style.boxShadow = `0 0 20px rgba(0, 212, 255, 0.8)`;
                            }, 1000);
                        }, index * 200);
                    });
                    observer.unobserve(skillsSection);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(skillsSection);
    }
    
    // Scroll-triggered Animations
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.glass, .project-card, .timeline-item, .certificate-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.transition = 'all 0.8s cubic-bezier(0.33, 1, 0.68, 1)';
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            observer.observe(element);
        });
    }
    
    // Contact Form Handling
    function initContactForm() {
        const form = document.querySelector('.contact-form');
        const submitButton = form?.querySelector('.btn-neon');
        
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const nameInput = form.querySelector('input[type="text"]');
            const emailInput = form.querySelector('input[type="email"]');
            const messageInput = form.querySelector('textarea');
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            
            // Validate form
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Animate submit button
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.style.opacity = '0.7';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual endpoint)
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Success animation
                submitButton.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
                submitButton.textContent = 'Message Sent!';
                
                // Reset form
                form.reset();
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.style.background = '';
                    submitButton.style.opacity = '1';
                    submitButton.disabled = false;
                }, 3000);
                
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
                submitButton.textContent = originalText;
                submitButton.style.opacity = '1';
                submitButton.disabled = false;
            }
        });
    }
    
    // Particle Background Animation
    function initParticleBackground() {
        const particleContainer = document.querySelector('.particles-bg');
        if (!particleContainer) return;
        
        // Create floating particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const colors = ['#00D4FF', '#FF1493', '#9D4EDD', '#FFFF00'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: ${randomColor};
                border-radius: 50%;
                opacity: ${Math.random() * 0.4 + 0.2};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 15 + 15}s linear infinite;
                box-shadow: 0 0 6px currentColor;
                pointer-events: none;
            `;
            particleContainer.appendChild(particle);
        }
    }
    
    // Reveal Animations for Cards
    function initRevealAnimations() {
        const cards = document.querySelectorAll('.glass');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.background = 'rgba(255, 255, 255, 0.15)';
                card.style.transform = 'translateY(-5px) scale(1.02)';
                card.style.boxShadow = '0 15px 35px rgba(0, 212, 255, 0.3)';
                card.style.transition = 'all 0.3s cubic-bezier(0.33, 1, 0.68, 1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.background = 'rgba(255, 255, 255, 0.1)';
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
            });
        });
    }
    
    // Notification System
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#00ff00',
            error: '#ff4444',
            info: '#00D4FF'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            background: rgba(0, 0, 0, 0.9);
            color: ${colors[type]};
            border: 2px solid ${colors[type]};
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 0 20px ${colors[type]}50;
            animation: slideInRight 0.5s ease-out;
            backdrop-filter: blur(10px);
            max-width: 300px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-in';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
    
    // Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Add custom animations to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
        
        .nav-link.active {
            color: var(--neon-blue) !important;
            text-shadow: 0 0 10px var(--neon-blue);
        }
        
        .nav-link.active::after {
            width: 100% !important;
        }
        
        /* Enhanced button animations */
        .btn-neon:active {
            transform: translateY(-1px) scale(0.98);
        }
        
        .project-card:active {
            transform: translateY(-8px) rotateX(5deg) scale(0.98);
        }
        
        /* Loading states */
        .btn-neon:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
            .particle {
                display: none;
            }
            
            .notification {
                right: 10px !important;
                max-width: calc(100vw - 20px) !important;
            }
        }
        
        /* Enhanced hover effects for touch devices */
        @media (hover: none) {
            .project-card:hover {
                transform: none;
            }
            
            .glass:hover {
                transform: none;
            }
            
            .nav-link:hover {
                color: var(--neon-blue);
            }
        }
        
        /* Smooth transitions for all interactive elements */
        .nav-link, .btn-neon, .project-card, .glass, .filter-btn {
            transition: all 0.3s cubic-bezier(0.33, 1, 0.68, 1);
        }
    `;
    document.head.appendChild(style);
    
    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00D4FF, #FF1493);
        z-index: 10000;
        transition: width 0.1s ease-out;
        box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
        progressBar.style.width = scrollPercent + '%';
    }, 50));
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case '2':
                    e.preventDefault();
                    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case '3':
                    e.preventDefault();
                    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case '4':
                    e.preventDefault();
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                    break;
            }
        }
    });
    
    // Initialize page load animation
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.8s ease-in-out';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
        
        // Show welcome message
        setTimeout(() => {
            showNotification('Welcome to my portfolio! 🚀', 'info');
        }, 2000);
    });
    
    console.log('🚀 Portfolio loaded successfully! All animations and interactions are ready.');
});