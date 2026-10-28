function callInit(name) {
    const fn = window[name];
    if (typeof fn !== 'function') {
        console.error(`[main] ${name} is not defined — script manquant ou en erreur`);
        return;
    }
    fn();
}

document.addEventListener('DOMContentLoaded', () => {
    callInit('initUniverseBoot');

    callInit('initCustomCursor');
    callInit('initParticles');

    callInit('initNavigation');
    callInit('initMobileMenu');
    callInit('initBackToTop');
    callInit('initKeyboardNav');

    callInit('initTypewriter');
    callInit('initScrollAnimations');
    callInit('initParallaxEffects');
    callInit('initGlitchEffects');

    callInit('initCounters');
    callInit('initSkillBars');
    callInit('initProjectFilters');
    callInit('initMagneticButtons');
    callInit('initContactForm');

    callInit('initSoundToggle');
});

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('⚡ Page load time:', Math.round(perfData.loadEventEnd - perfData.startTime), 'ms');
            }
        }, 0);
    });
}
