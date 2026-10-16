function initCounters() {
    const years = getYearsOfExperience('2023-09-01');
    const counters = document.querySelectorAll('.counter');

    document.querySelectorAll('[data-experience-years]').forEach((el) => {
        el.textContent = String(years);
    });

    counters.forEach((counter) => {
        if (counter.dataset.start) {
            counter.dataset.target = String(getYearsOfExperience(counter.dataset.start));
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const target = parseInt(counter.dataset.target, 10);
            const suffix = counter.dataset.suffix || '';
            const duration = 2000;
            const startedAt = performance.now();

            function tick(now) {
                const progress = Math.min((now - startedAt) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                counter.textContent = Math.floor(eased * target) + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            }

            requestAnimationFrame(tick);
            observer.unobserve(counter);
        });
    }, { threshold: 0.5 });

    counters.forEach((counter) => observer.observe(counter));
}

function initSkillBars() {}

function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach((card) => {
                const categories = card.dataset.category?.split(' ') || [];
                const match = filter === 'all' || categories.includes(filter);

                if (match) {
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

function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.magnetic');
    if (window.innerWidth < 768) return;
    if (typeof isLowPerf === 'function' ? isLowPerf() : window.PERF_TIER === 'low') {
        return;
    }

    magneticElements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            if (window.PERF_TIER === 'low') return;
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

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const csrfTokenInput = document.getElementById('csrf_token');
    const timestampInput = document.getElementById('_timestamp');
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('charCount');

    fetchCSRFToken();

    if (timestampInput) {
        timestampInput.value = Math.floor(Date.now() / 1000);
    }

    if (messageInput && charCount) {
        messageInput.addEventListener('input', () => {
            const count = messageInput.value.length;
            charCount.textContent = count;

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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.btn-submit');
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

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const response = await fetch('assets/php/contact.php', {
                method: 'POST',
                body: new FormData(form),
                credentials: 'same-origin'
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Une erreur est survenue');
            }

            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');

            if (typeof cyberpunkAudio !== 'undefined') {
                cyberpunkAudio.playSuccess();
            }

            form.reset();
            if (charCount) charCount.textContent = '0';
            fetchCSRFToken();

            if (timestampInput) {
                timestampInput.value = Math.floor(Date.now() / 1000);
            }

            showNotification(result.message, 'success');

            setTimeout(() => {
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
            }, 3000);
        } catch (error) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            if (error.message.includes('Session') || error.message.includes('CSRF')) {
                fetchCSRFToken();
            }

            if (typeof cyberpunkAudio !== 'undefined') {
                cyberpunkAudio.playError();
            }

            showNotification(error.message, 'error');
        }
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showNotification(message, type) {
        const existing = document.querySelector('.form-notification');
        if (existing) existing.remove();

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

    form.querySelectorAll('.form-input').forEach((input) => {
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
