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

/* Contact form : voir assets/js/contact-form.js */

