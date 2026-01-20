// Counters
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const suffix = counter.dataset.suffix || '';
                const duration = 2000;
                const startTime = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const current = Math.floor(easeOutQuart * target);
                    
                    counter.textContent = current + suffix;
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                }
                
                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// Skills
function initSkillBars() {}

// Project filters
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Filter projects
            projectCards.forEach(card => {
                const categories = card.dataset.category?.split(' ') || [];
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = '';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
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

// Magnetic buttons
function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    if (window.innerWidth < 768) return;
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const intensity = 0.1;
            const maxMove = 8;
            
            const moveX = Math.max(-maxMove, Math.min(maxMove, x * intensity));
            const moveY = Math.max(-maxMove, Math.min(maxMove, y * intensity));
            
            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });
}

// Contact form
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const csrfTokenInput = document.getElementById('csrf_token');
    const timestampInput = document.getElementById('_timestamp');
    
    // Fetch CSRF token
    fetchCSRFToken();
    
    // Set timestamp
    if (timestampInput) {
        timestampInput.value = Math.floor(Date.now() / 1000);
    }
    
    // Character counter
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (messageInput && charCount) {
        messageInput.addEventListener('input', () => {
            const count = messageInput.value.length;
            charCount.textContent = count;
            
            // Change color if near the limit
            if (count > 450) {
                charCount.parentElement.style.color = count > 490 ? '#ff3366' : '#ffd700';
            } else {
                charCount.parentElement.style.color = '';
            }
        });
    }
    
    async function fetchCSRFToken() {
        try {
            const response = await fetch('assets/php/contact.php?csrf=1');
            const data = await response.json();
            if (csrfTokenInput && data.csrf_token) {
                csrfTokenInput.value = data.csrf_token;
            }
        } catch (error) {
            console.warn('Impossible de récupérer le token CSRF:', error);
        }
    }
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.btn-submit');
        
        // Client-side validation
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const message = form.querySelector('#message').value.trim();
        
        if (name.length < 2) {
            showNotification('Le nom doit contenir au moins 2 caractères', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Veuillez entrer une adresse email valide', 'error');
            return;
        }
        
        if (message.length < 10) {
            showNotification('Le message doit contenir au moins 10 caractères', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Prepare form data
            const formData = new FormData(form);
            
            // Send to PHP handler
            const response = await fetch('assets/php/contact.php', {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            });
            
            const result = await response.json();
            
            if (result.success) {
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');
                
                // Play success sound if available
                if (typeof cyberpunkAudio !== 'undefined') {
                    cyberpunkAudio.playSuccess();
                }
                
                // Reset form
                form.reset();
                if (charCount) charCount.textContent = '0';
                
                // Fetch new CSRF token
                fetchCSRFToken();
                
                // Update timestamp
                if (timestampInput) {
                    timestampInput.value = Math.floor(Date.now() / 1000);
                }
                
                showNotification(result.message, 'success');
                
                // Reset button
                setTimeout(() => {
                    submitBtn.classList.remove('success');
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                throw new Error(result.message || 'Une erreur est survenue');
            }
        } catch (error) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Fetch new CSRF token in case of session error
            if (error.message.includes('Session') || error.message.includes('CSRF')) {
                fetchCSRFToken();
            }
            
            // Play error sound
            if (typeof cyberpunkAudio !== 'undefined') {
                cyberpunkAudio.playError();
            }
            
            showNotification(error.message, 'error');
        }
    });
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Notification
    function showNotification(message, type) {
        // Remove existing notification
        const existingNotif = document.querySelector('.form-notification');
        if (existingNotif) existingNotif.remove();
        
        const notif = document.createElement('div');
        notif.className = `form-notification ${type}`;
        notif.innerHTML = `
            <span class="notif-icon">${type === 'success' ? '✓' : '✕'}</span>
            <span class="notif-message">${message}</span>
        `;
        
        form.parentElement.appendChild(notif);
        
        setTimeout(() => notif.classList.add('visible'), 10);
        
        setTimeout(() => {
            notif.classList.remove('visible');
            setTimeout(() => notif.remove(), 300);
        }, 5000);
    }
    
    // Input animations
    const inputs = form.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}
