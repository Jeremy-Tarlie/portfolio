function getYearsOfExperience(since = '2023-09-01') {
    const start = new Date(`${since}T00:00:00`);
    if (Number.isNaN(start.getTime())) return 0;

    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    const month = now.getMonth() - start.getMonth();
    const day = now.getDate() - start.getDate();

    if (month < 0 || (month === 0 && day < 0)) years -= 1;
    return Math.max(0, years);
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

window.PERF_TIER = 'high';

const _perfTierCallbacks = [];
let _tierResolved = false;
let _tierLocked = false;

function onPerfTierReady(callback) {
    _perfTierCallbacks.push(callback);
    if (_tierResolved) callback(window.PERF_TIER);
}

function isLowPerf() {
    return window.PERF_TIER === 'low';
}

function isMediumOrLowPerf() {
    return window.PERF_TIER === 'low' || window.PERF_TIER === 'medium';
}

function applyPerfClasses(tier) {
    const root = document.documentElement;
    const body = document.body;
    root.classList.remove('low-perf', 'medium-perf', 'high-perf');
    root.classList.add(tier + '-perf');
    if (body) {
        body.classList.remove('low-perf', 'medium-perf', 'high-perf');
        body.classList.add(tier + '-perf');
    }
}

function setPerfTier(tier, { lock = false, notify = true } = {}) {
    const rank = { high: 3, medium: 2, low: 1 };

    if (_tierLocked && rank[tier] >= rank[window.PERF_TIER]) return;

    // Only allow automatic downgrades after the first resolve
    if (_tierResolved && rank[tier] >= rank[window.PERF_TIER]) return;

    if (tier === window.PERF_TIER && _tierResolved) return;

    window.PERF_TIER = tier;
    applyPerfClasses(tier);
    _tierResolved = true;
    if (lock) _tierLocked = true;

    if (notify) {
        _perfTierCallbacks.forEach((cb) => {
            try { cb(tier); } catch (_) { /* ignore */ }
        });
    }
}

function isSoftwareRenderer() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return true;

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const renderer = String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '');
            if (/swiftshader|llvmpipe|softpipe|microsoft basic render|software|mesa offscreen|gdi generic/i.test(renderer)) {
                return true;
            }
        }

        const strictCanvas = document.createElement('canvas');
        const strictGl = strictCanvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });
        if (!strictGl) return true;
    } catch (_) {
        return true;
    }
    return false;
}

function getHeuristicTier() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection?.saveData === true;
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 8;
    const software = isSoftwareRenderer();
    const coarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const smallViewport = Math.min(window.innerWidth, window.innerHeight) < 700;

    if (reducedMotion || saveData || software || cores <= 2 || memory <= 2) {
        return 'low';
    }
    // Tablettes / tactile : medium max (canvas portail + particules trop lourds sinon)
    if (coarsePointer || (cores <= 4 && memory <= 4) || (cores <= 6 && smallViewport)) {
        return 'medium';
    }
    return 'high';
}

function sampleFrameBudget(sampleFrames = 40) {
    return new Promise((resolve) => {
        let frameCount = 0;
        const start = performance.now();

        function sample(now) {
            frameCount++;
            if (frameCount < sampleFrames) {
                requestAnimationFrame(sample);
                return;
            }
            const avgFrameMs = (now - start) / frameCount;
            if (avgFrameMs > 22) resolve('low');
            else if (avgFrameMs > 14) resolve('medium');
            else resolve('high');
        }

        requestAnimationFrame(sample);
    });
}

function startFpsWatchdog() {
    let last = performance.now();
    let badStreak = 0;

    function tick(now) {
        const dt = now - last;
        last = now;

        if (document.hidden) {
            badStreak = 0;
            requestAnimationFrame(tick);
            return;
        }

        // >33ms ≈ under 30fps ; ignore huge spikes (tab resume)
        if (dt > 33 && dt < 200) badStreak++;
        else badStreak = Math.max(0, badStreak - 1);

        if (badStreak >= 20 && window.PERF_TIER !== 'low') {
            const next = window.PERF_TIER === 'high' ? 'medium' : 'low';
            setPerfTier(next, { notify: true });
            badStreak = 0;
        }

        if (window.PERF_TIER !== 'low') {
            requestAnimationFrame(tick);
        }
    }

    requestAnimationFrame(tick);
}

function detectPerformanceTier() {
    const heuristic = getHeuristicTier();
    // Apply immediately so first paint already skips heavy effects
    setPerfTier(heuristic, { lock: heuristic === 'low', notify: true });

    if (heuristic === 'low') return;

    sampleFrameBudget(40).then((measured) => {
        const rank = { high: 3, medium: 2, low: 1 };
        if (rank[measured] < rank[window.PERF_TIER]) {
            setPerfTier(measured, { notify: true });
        }
        startFpsWatchdog();
    });
}

detectPerformanceTier();
