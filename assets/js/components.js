function initCounters() {
    const defaultYears = getYearsOfExperience('2023-09-01');
    const counters = document.querySelectorAll('.counter');

    document.querySelectorAll('[data-experience-years]').forEach((el) => {
        const since = el.getAttribute('data-experience-since');
        el.textContent = String(
            since ? getYearsOfExperience(since) : defaultYears
        );
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

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormNotification(form, message, type) {
    const host = form.parentElement || form;
    const existing = host.querySelector('.form-notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = `form-notification ${type}`;
    notif.innerHTML = `
        <span class="notif-icon">${type === 'success' ? '✓' : '✕'}</span>
        <span class="notif-message">${message}</span>
    `;

    host.appendChild(notif);
    setTimeout(() => notif.classList.add('visible'), 10);
    setTimeout(() => {
        notif.classList.remove('visible');
        setTimeout(() => notif.remove(), 300);
    }, 5000);
}

async function fetchCSRFTokenForForm(form) {
    const csrfTokenInput = form.querySelector('[name="csrf_token"]');
    if (window.location.protocol === 'file:') return;

    try {
        const response = await fetch('assets/php/contact.php?csrf=1', {
            credentials: 'same-origin'
        });
        if (!response.ok) return;
        const data = await response.json();
        if (csrfTokenInput && data.csrf_token) {
            csrfTokenInput.value = data.csrf_token;
        }
    } catch (error) {
        if (window.location.protocol.startsWith('http')) {
            console.warn('Impossible de récupérer le token CSRF:', error);
        }
    }
}

function bindContactForm(form) {
    const timestampInput = form.querySelector('[name="_timestamp"]');
    const messageInput = form.querySelector('[name="message"]');
    const charCount = form.querySelector('[data-char-count], #charCount');
    const submitBtn = form.querySelector('[type="submit"]');

    fetchCSRFTokenForForm(form);

    if (timestampInput) {
        timestampInput.value = String(Math.floor(Date.now() / 1000));
    }

    if (messageInput && charCount) {
        messageInput.addEventListener('input', () => {
            const count = messageInput.value.length;
            charCount.textContent = String(count);

            const host = charCount.parentElement;
            if (!host) return;
            if (count > 450) {
                host.style.color = count > 490 ? '#ff3366' : '#ffd700';
            } else {
                host.style.color = '';
            }
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = form.querySelector('[name="name"]');
        const emailInput = form.querySelector('[name="email"]');
        const messageField = form.querySelector('[name="message"]');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const message = messageField ? messageField.value.trim() : '';

        if (name.length < 2) {
            showFormNotification(form, 'Le nom doit contenir au moins 2 caractères', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showFormNotification(form, 'Veuillez entrer une adresse email valide', 'error');
            return;
        }

        if (message.length < 10) {
            showFormNotification(form, 'Le message doit contenir au moins 10 caractères', 'error');
            return;
        }

        const consentInput = form.querySelector('[name="privacy_consent"]');
        if (consentInput && !consentInput.checked) {
            showFormNotification(form, 'Veuillez accepter le traitement de vos données pour envoyer le message', 'error');
            return;
        }

        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }

        if (window.location.protocol === 'file:') {
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
            showFormNotification(
                form,
                'Le formulaire nécessite un serveur local (http). Ouvre le site via Live Server ou php -S.',
                'error'
            );
            return;
        }

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

            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');
            }

            if (typeof cyberpunkAudio !== 'undefined') {
                cyberpunkAudio.playSuccess();
            }

            form.reset();
            if (charCount) charCount.textContent = '0';
            fetchCSRFTokenForForm(form);

            if (timestampInput) {
                timestampInput.value = String(Math.floor(Date.now() / 1000));
            }

            showFormNotification(form, result.message, 'success');

            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.classList.remove('success');
                    submitBtn.disabled = false;
                }
            }, 3000);
        } catch (error) {
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }

            const errMessage = error instanceof Error ? error.message : 'Une erreur est survenue';

            if (errMessage.includes('Session') || errMessage.includes('CSRF')) {
                fetchCSRFTokenForForm(form);
            }

            if (typeof cyberpunkAudio !== 'undefined') {
                cyberpunkAudio.playError();
            }

            showFormNotification(form, errMessage, 'error');
        }
    });

    form.querySelectorAll('.form-input, .gate-form-group input, .gate-form-group textarea, .gate-form-group select').forEach((input) => {
        input.addEventListener('focus', () => {
            if (input.parentElement) input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value && input.parentElement) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

function initContactForm() {
    const forms = document.querySelectorAll('form[data-contact-form]');
    if (!forms.length) {
        const legacy = document.getElementById('contactForm');
        if (legacy) bindContactForm(legacy);
        return;
    }
    forms.forEach((form) => bindContactForm(form));
}


