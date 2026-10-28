function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormNotification(form, message, type) {
    const host = form.parentElement || form;
    const existing = host.querySelector('.form-notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = `form-notification ${type}`;
    notif.setAttribute('role', 'alert');
    notif.setAttribute('aria-live', 'polite');
    notif.innerHTML = `
        <span class="notif-icon" aria-hidden="true">${type === 'success' ? '✓' : '✕'}</span>
        <span class="notif-message"></span>
    `;
    const msgEl = notif.querySelector('.notif-message');
    if (msgEl) msgEl.textContent = message;

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
        const response = await fetch('/assets/php/contact.php?csrf=1', {
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
            const response = await fetch('/assets/php/contact.php', {
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

    form.querySelectorAll('.form-input, .gate-form-group input, .gate-form-group textarea, .gate-form-group select, .home-form-group input, .home-form-group textarea, .home-form-group select').forEach((input) => {
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

window.initContactForm = initContactForm;
window.bindContactForm = bindContactForm;
