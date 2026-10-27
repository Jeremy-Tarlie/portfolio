const PORTAL_DURATION_MS = 700;
const PORTAL_DURATION_REDUCED_MS = 200;
const BOOT_DURATION_MS = 1350;
const BOOT_DURATION_REDUCED_MS = 350;
const BOOT_FADE_MS = 550;

const BOOT_LINES = [
    { text: 'JT_OS v2026.1 — cold boot sequence', cls: 'boot-accent' },
    { text: '', cls: '' },
    { text: '[  0.000000] kernel: initializing memory map...', cls: 'boot-dim' },
    { text: '[  0.041201] kernel: CPU cores online', cls: 'boot-ok' },
    { text: '[  0.088412] loading modules...', cls: 'boot-dim' },
    { text: '  → react@19 ............... OK', cls: 'boot-ok' },
    { text: '  → node.js / express ...... OK', cls: 'boot-ok' },
    { text: '  → next.js ................ OK', cls: 'boot-ok' },
    { text: '  → php / python ........... OK', cls: 'boot-ok' },
    { text: '  → docker / aws ........... OK', cls: 'boot-ok' },
    { text: '[  0.214088] mounting filesystem /universe', cls: 'boot-dim' },
    { text: '[  0.301552] scanning portfolio assets', cls: 'boot-dim' },
    { text: '  projects/discelyn ........ linked', cls: 'boot-ok' },
    { text: '  projects/codepass ........ linked', cls: 'boot-ok' },
    { text: '  projects/cotapro ......... linked', cls: 'boot-ok' },
    { text: '[  0.412990] easter_eggs: dormant (awaiting discovery)', cls: 'boot-warn' },
    { text: '[  0.488120] interactive terminal: ready', cls: 'boot-ok' },
    { text: '[  0.550001] contact channel: contact@tarlie.fr', cls: 'boot-accent' },
    { text: '', cls: '' },
    { text: 'status: OPEN_TO_WORK = true  (CDI | freelance)', cls: 'boot-accent' },
    { text: '', cls: '' },
    { text: '>>> SYSTEM READY', cls: 'boot-ok' },
    { text: '>>> launching interface...', cls: 'boot-accent' }
];

let gateKeydownHandler = null;
let returningToGate = false;

function wait(ms) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isLowPerfTier() {
    return typeof isLowPerf === 'function'
        ? isLowPerf()
        : document.documentElement.classList.contains('low-perf');
}

function getPortalDuration() {
    if (prefersReducedMotion() || isLowPerfTier()) {
        return PORTAL_DURATION_REDUCED_MS;
    }
    return PORTAL_DURATION_MS;
}

function getBootDuration() {
    if (prefersReducedMotion() || isLowPerfTier()) {
        return BOOT_DURATION_REDUCED_MS;
    }
    return BOOT_DURATION_MS;
}

function getGateFocusables(gate) {
    return Array.from(
        gate.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
    ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
}

function trapFocusInGate(gate, event) {
    if (event.key !== 'Tab' || !document.body.classList.contains('gate-locked')) {
        return;
    }

    const focusables = getGateFocusables(gate);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

function unlockPortfolioApp(portfolioApp) {
    if (!portfolioApp) return;
    portfolioApp.removeAttribute('inert');
    portfolioApp.setAttribute('aria-hidden', 'false');
}

function lockPortfolioApp(portfolioApp) {
    if (!portfolioApp) return;
    portfolioApp.setAttribute('inert', '');
    portfolioApp.setAttribute('aria-hidden', 'true');
}

function hideGateHard(gate) {
    if (!gate) return;
    gate.setAttribute('aria-hidden', 'true');
    gate.classList.add('is-removed');
}

function showGate(gate) {
    if (!gate) return;
    gate.classList.remove('is-removed');
    gate.removeAttribute('aria-hidden');
    gate.style.removeProperty('display');
}

function clearBootLog() {
    const log = document.getElementById('boot-log');
    if (log) log.textContent = '';
}

async function playBootLog() {
    const log = document.getElementById('boot-log');
    const scroller = log ? log.parentElement : null;
    if (!log) return;

    log.textContent = '';
    const fast = prefersReducedMotion() || isLowPerfTier();
    const lines = fast
        ? BOOT_LINES.filter((entry, i) => i % 2 === 0 || entry.text.includes('READY') || entry.text.includes('launching'))
        : BOOT_LINES;

    for (let i = 0; i < lines.length; i += 1) {
        const entry = lines[i];
        const line = document.createElement('div');
        if (entry.cls) line.className = entry.cls;
        line.textContent = entry.text || '\u00a0';
        log.appendChild(line);

        if (scroller) {
            scroller.scrollTop = scroller.scrollHeight;
        }

        const delay = fast
            ? 16
            : entry.text === ''
                ? 35
                : entry.text.includes('>>>')
                    ? 85
                    : 26 + Math.floor(Math.random() * 34);

        await wait(delay);
    }

    await wait(fast ? 100 : 260);
}

function setGateNavActive(sectionId) {
    const links = document.querySelectorAll('.gate-nav-link');
    links.forEach((link) => {
        const href = link.getAttribute('href') || '';
        link.classList.toggle('is-active', href === `#${sectionId}`);
    });
}

function initGateNav(gate) {
    const links = gate.querySelectorAll('[data-gate-nav]');
    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            const target = gate.querySelector(href);
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
            setGateNavActive(href.slice(1));
        });
    });
}

function revealUniverse({ animateHero = true } = {}) {
    const body = document.body;
    const gate = document.getElementById('recruiter-gate');
    const portfolioApp = document.getElementById('portfolio-app');
    const boot = document.getElementById('universe-boot');

    body.classList.remove(
        'gate-locked',
        'portal-active',
        'portal-void',
        'boot-logging',
        'boot-active',
        'boot-fade'
    );
    body.classList.add('universe-entered', 'loaded');
    unlockPortfolioApp(portfolioApp);
    hideGateHard(gate);
    clearBootLog();

    if (boot) {
        boot.setAttribute('aria-hidden', 'true');
    }

    if (animateHero && typeof animateHeroElements === 'function') {
        window.setTimeout(() => {
            animateHeroElements();
        }, 200);
    }

    const home = document.getElementById('home');
    if (home) {
        home.setAttribute('tabindex', '-1');
        home.focus({ preventScroll: true });
    }

    window.dispatchEvent(new CustomEvent('portfolio:universe-entered'));
}

async function runPortalTransition(enterBtn) {
    const body = document.body;
    const gate = document.getElementById('recruiter-gate');
    const portfolioApp = document.getElementById('portfolio-app');
    const boot = document.getElementById('universe-boot');

    if (body.classList.contains('portal-active') || body.classList.contains('universe-entered')) {
        return;
    }

    if (gateKeydownHandler) {
        document.removeEventListener('keydown', gateKeydownHandler);
        gateKeydownHandler = null;
    }

    body.classList.add('portal-active');
    if (enterBtn) {
        enterBtn.setAttribute('disabled', 'true');
        enterBtn.setAttribute('aria-busy', 'true');
    }

    await wait(getPortalDuration());

    body.classList.add('portal-void');
    body.classList.remove('portal-active');
    hideGateHard(gate);

    await wait(160);

    if (boot) {
        boot.setAttribute('aria-hidden', 'false');
    }
    body.classList.add('boot-logging');
    body.classList.remove('portal-void');

    await playBootLog();

    body.classList.remove('gate-locked', 'boot-logging');
    body.classList.add('universe-entered', 'loaded', 'boot-active');
    unlockPortfolioApp(portfolioApp);

    await wait(getBootDuration());

    body.classList.add('boot-fade');
    body.classList.remove('boot-active');
    clearBootLog();

    if (typeof animateHeroElements === 'function') {
        animateHeroElements();
    }

    const home = document.getElementById('home');
    if (home) {
        home.setAttribute('tabindex', '-1');
        home.focus({ preventScroll: true });
    }

    window.dispatchEvent(new CustomEvent('portfolio:universe-entered'));

    await wait(BOOT_FADE_MS);

    body.classList.remove('boot-fade');
    if (boot) {
        boot.setAttribute('aria-hidden', 'true');
    }
}

function closeUniverseMenus() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }
    if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-label', 'Ouvrir le menu de navigation');
    }
    document.body.classList.remove('no-scroll');
}

function clearLegacyUniverseStorage() {
    try {
        sessionStorage.removeItem('portfolioUniverseEntered');
    } catch (e) {
        /* ignore */
    }
}

function returnToGate() {
    if (returningToGate) return;

    const body = document.body;
    const gate = document.getElementById('recruiter-gate');
    if (!gate || !body.classList.contains('universe-entered')) return;

    returningToGate = true;
    clearLegacyUniverseStorage();

    const portfolioApp = document.getElementById('portfolio-app');
    const boot = document.getElementById('universe-boot');
    const enterBtn = document.getElementById('enter-universe');

    closeUniverseMenus();

    body.classList.remove(
        'universe-entered',
        'loaded',
        'portal-active',
        'portal-void',
        'boot-logging',
        'boot-active',
        'boot-fade'
    );
    body.classList.add('gate-locked');

    if (boot) {
        boot.setAttribute('aria-hidden', 'true');
    }
    clearBootLog();
    lockPortfolioApp(portfolioApp);
    showGate(gate);

    if (enterBtn) {
        enterBtn.removeAttribute('disabled');
        enterBtn.removeAttribute('aria-busy');
    }

    if (gate) {
        gate.scrollTop = 0;
        setGateNavActive('gate-home');
    }

    window.scrollTo(0, 0);

    if (gateKeydownHandler) {
        document.removeEventListener('keydown', gateKeydownHandler);
    }
    gateKeydownHandler = (event) => trapFocusInGate(gate, event);
    document.addEventListener('keydown', gateKeydownHandler);

    window.setTimeout(() => {
        if (enterBtn) enterBtn.focus();
        returningToGate = false;
    }, 80);

    window.dispatchEvent(new CustomEvent('portfolio:gate-returned'));
}

function bindReturnToGateControls() {
    const controls = [
        document.getElementById('return-to-gate-link'),
        document.getElementById('return-to-gate-mobile')
    ];

    controls.forEach((el) => {
        if (!el) return;
        el.addEventListener('click', (event) => {
            event.preventDefault();
            returnToGate();
        });
    });
}

function initRecruiterGate() {
    const gate = document.getElementById('recruiter-gate');
    const portfolioApp = document.getElementById('portfolio-app');
    const enterBtn = document.getElementById('enter-universe');

    clearLegacyUniverseStorage();
    document.documentElement.classList.remove('skip-gate');
    bindReturnToGateControls();

    if (!gate) {
        document.body.classList.remove('gate-locked');
        document.body.classList.add('universe-entered', 'loaded');
        if (typeof animateHeroElements === 'function') {
            animateHeroElements();
        }
        return;
    }

    lockPortfolioApp(portfolioApp);
    document.body.classList.add('gate-locked');
    document.body.classList.remove('universe-entered', 'loaded');
    showGate(gate);
    initGateNav(gate);

    const yearsEls = gate.querySelectorAll('[data-experience-years]');
    if (typeof getYearsOfExperience === 'function' && yearsEls.length) {
        yearsEls.forEach((el) => {
            const since = el.getAttribute('data-experience-since') || '2021-05-01';
            el.textContent = String(getYearsOfExperience(since));
        });
    }

    gateKeydownHandler = (event) => trapFocusInGate(gate, event);
    document.addEventListener('keydown', gateKeydownHandler);

    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            // Unlock AudioContext pendant le geste utilisateur (avant les awaits portail).
            if (typeof cyberpunkAudio !== 'undefined' && cyberpunkAudio.prepareUniverseAudio) {
                cyberpunkAudio.prepareUniverseAudio();
            }
            runPortalTransition(enterBtn);
        });
    }
}

window.initRecruiterGate = initRecruiterGate;
window.revealUniverse = revealUniverse;
window.returnToGate = returnToGate;
