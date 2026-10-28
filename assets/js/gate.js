const PORTAL_DURATION_MS = 700;
const PORTAL_DURATION_REDUCED_MS = 200;
const BOOT_DURATION_MS = 1350;
const BOOT_DURATION_REDUCED_MS = 350;
const BOOT_FADE_MS = 550;

const BOOT_SECTIONS = [
    'accueil',
    'à propos',
    'projets',
    'compétences',
    'contact',
    'terminal',
    'audio ambiance',
    'easter eggs'
];

const BOOT_PROJECTS = [
    'portfolio cyberpunk',
    'discelyn',
    'codepass',
    'cotapro',
    'myreklam'
];

const BOOT_MODULES = [
    'react@19',
    'next.js',
    'node.js / express',
    'php / python',
    'docker / aws'
];

function buildBootLines() {
    const lines = [
        { text: 'JT_OS v2026.1 — cold boot sequence', cls: 'boot-title' },
        { text: '', cls: '' },
        { text: '[init] kernel: mémoire OK', cls: 'boot-ok' },
        { text: '[init] montage du système de fichiers /universe', cls: 'boot-dim' },
        { text: '', cls: '' },
        { text: '[modules] chargement des briques...', cls: 'boot-accent' }
    ];

    BOOT_MODULES.forEach((mod) => {
        lines.push({ text: `  → ${mod} ............... OK`, cls: 'boot-ok' });
    });

    lines.push({ text: '', cls: '' });
    lines.push({ text: '[ui] construction des sections...', cls: 'boot-accent' });

    BOOT_SECTIONS.forEach((section) => {
        lines.push({ text: `> ${section} en cours de création...`, cls: 'boot-dim' });
        lines.push({ text: `> ${section} créé`, cls: 'boot-ok' });
    });

    lines.push({ text: '', cls: '' });
    lines.push({ text: '[projects] liaison des projets...', cls: 'boot-accent' });

    BOOT_PROJECTS.forEach((project) => {
        lines.push({ text: `> projet « ${project} » en cours de création...`, cls: 'boot-dim' });
        lines.push({ text: `> projet « ${project} » créé`, cls: 'boot-ok' });
        lines.push({ text: `  projects/${project.replace(/\s+/g, '-')} ........ linked`, cls: 'boot-ok' });
    });

    lines.push({ text: '', cls: '' });
    lines.push({ text: 'status: OPEN_TO_WORK = true  (CDI | freelance)', cls: 'boot-accent' });
    lines.push({ text: '', cls: '' });
    lines.push({ text: '>>> SYSTEM READY', cls: 'boot-ok' });
    lines.push({ text: '>>> interface en attente', cls: 'boot-accent' });

    return lines;
}

const BOOT_LINES = buildBootLines();

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

function unlockPortfolioApp(portfolioApp) {
    if (!portfolioApp) return;
    portfolioApp.removeAttribute('inert');
    portfolioApp.setAttribute('aria-hidden', 'false');
}

function clearBootLog() {
    const log = document.getElementById('boot-log');
    if (log) log.textContent = '';
}

function appendBootLine(log, scroller, text, cls) {
    const line = document.createElement('div');
    if (cls) line.className = cls;
    line.textContent = text || '\u00a0';
    log.appendChild(line);
    if (scroller) {
        scroller.scrollTop = scroller.scrollHeight;
    }
    return line;
}

async function playBootLog() {
    const log = document.getElementById('boot-log');
    const scroller = log ? log.parentElement : null;
    if (!log) return;

    log.textContent = '';
    const fast = prefersReducedMotion() || isLowPerfTier();
    const lines = fast
        ? BOOT_LINES.filter((entry) => entry.cls === 'boot-ok' || entry.cls === 'boot-accent' || entry.cls === 'boot-title' || entry.text === '')
        : BOOT_LINES;

    for (let i = 0; i < lines.length; i += 1) {
        const entry = lines[i];
        appendBootLine(log, scroller, entry.text, entry.cls);

        const delay = fast
            ? 20
            : entry.text === ''
                ? 40
                : entry.text.includes('créé')
                    ? 55
                    : entry.text.includes('en cours')
                        ? 90 + Math.floor(Math.random() * 50)
                        : 28 + Math.floor(Math.random() * 36);

        await wait(delay);
    }

    await wait(fast ? 80 : 200);
}

function isInsideBootScroller(target) {
    const scroller = document.querySelector('.boot-console-inner');
    return Boolean(scroller && target instanceof Node && scroller.contains(target));
}

function lockPageScrollDuringBoot() {
    const onWheel = (event) => {
        if (isInsideBootScroller(event.target)) return;
        event.preventDefault();
    };
    const onTouchMove = (event) => {
        if (isInsideBootScroller(event.target)) return;
        event.preventDefault();
    };

    document.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    window.scrollTo(0, 0);

    return () => {
        document.removeEventListener('wheel', onWheel);
        document.removeEventListener('touchmove', onTouchMove);
    };
}

function waitForEnterToContinue(log, scroller) {
    return new Promise((resolve) => {
        appendBootLine(log, scroller, '', '');
        const prompt = appendBootLine(
            log,
            scroller,
            '>>> Appuyez sur Entrée pour entrer dans l’univers_',
            'boot-prompt'
        );
        prompt.setAttribute('role', 'status');
        prompt.setAttribute('aria-live', 'polite');
        if (scroller) {
            scroller.scrollTop = scroller.scrollHeight;
        }

        const onKey = (event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            document.removeEventListener('keydown', onKey);
            prompt.classList.remove('boot-prompt');
            prompt.classList.add('boot-ok');
            prompt.textContent = '>>> Entrée validée — lancement de l’interface...';
            resolve();
        };

        document.addEventListener('keydown', onKey);
    });
}

async function runUniverseBoot() {
    const body = document.body;
    const portfolioApp = document.getElementById('portfolio-app');
    const boot = document.getElementById('universe-boot');
    const log = document.getElementById('boot-log');
    const scroller = log ? log.parentElement : null;

    if (body.classList.contains('universe-entered') || body.classList.contains('boot-logging')) {
        return;
    }

    if (typeof cyberpunkAudio !== 'undefined' && cyberpunkAudio.prepareUniverseAudio) {
        cyberpunkAudio.prepareUniverseAudio();
    }

    if (body.classList.contains('portal-void')) {
        await wait(prefersReducedMotion() || isLowPerfTier() ? 80 : 220);
    } else {
        body.classList.add('portal-active');
        await wait(getPortalDuration());
        body.classList.add('portal-void');
        body.classList.remove('portal-active');
        await wait(160);
    }

    if (boot) {
        boot.setAttribute('aria-hidden', 'false');
    }
    body.classList.add('boot-logging', 'boot-awaiting-enter');
    body.classList.remove('portal-void');
    const unlockPageScroll = lockPageScrollDuringBoot();

    try {
        await playBootLog();

        if (log) {
            await waitForEnterToContinue(log, scroller);
            await wait(prefersReducedMotion() || isLowPerfTier() ? 80 : 280);
        }
    } finally {
        unlockPageScroll();
    }

    body.classList.remove('boot-logging', 'boot-awaiting-enter');
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

function initUniverseBoot() {
    try {
        sessionStorage.removeItem('portfolioUniverseEntered');
    } catch (e) {
        /* ignore */
    }
    document.documentElement.classList.remove('skip-gate');

    const portfolioApp = document.getElementById('portfolio-app');
    if (!portfolioApp) {
        document.body.classList.add('universe-entered', 'loaded');
        return;
    }

    runUniverseBoot();
}

window.initUniverseBoot = initUniverseBoot;
window.initRecruiterGate = initUniverseBoot;
