document.addEventListener('DOMContentLoaded', () => {
    // Core UI
    initPreloader();
    initCustomCursor();
    initParticles();
    
    // Navigation
    initNavigation();
    initMobileMenu();
    initBackToTop();
    initKeyboardNav();
    
    // Animations
    initTypewriter();
    initScrollAnimations();
    initParallaxEffects();
    initGlitchEffects();
    
    // Components
    initCounters();
    initSkillBars();
    initProjectFilters();
    initMagneticButtons();
    initContactForm();
    
    // Audio
    initSoundToggle();
});

// Perf monitoring
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

