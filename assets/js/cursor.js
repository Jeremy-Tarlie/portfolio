function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (!cursor || !follower || window.innerWidth < 768) {
        document.documentElement.classList.add('no-custom-cursor');
        return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    let cursorScale = 1;
    let followerScale = 1;
    let isHovering = false;
    let animationId = null;
    let isActive = false;
    let idleTimer = null;
    let needsFrame = false;

    function hideNative() {
        document.documentElement.classList.remove('no-custom-cursor');
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    }

    function showNative() {
        document.documentElement.classList.add('no-custom-cursor');
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
        stopLoop();
    }

    function stopLoop() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        needsFrame = false;
    }

    function animate() {
        if (!isActive) {
            animationId = null;
            return;
        }

        cursorX += (mouseX - cursorX) * 0.35;
        cursorY += (mouseY - cursorY) * 0.35;
        followerX += (mouseX - followerX) * 0.18;
        followerY += (mouseY - followerY) * 0.18;

        const targetCursorScale = isHovering ? 3 : 1;
        const targetFollowerScale = isHovering ? 1.5 : 1;
        cursorScale += (targetCursorScale - cursorScale) * 0.2;
        followerScale += (targetFollowerScale - followerScale) * 0.2;

        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(${cursorScale})`;
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%) scale(${followerScale})`;

        const moving =
            Math.abs(mouseX - cursorX) > 0.2 ||
            Math.abs(mouseY - cursorY) > 0.2 ||
            Math.abs(mouseX - followerX) > 0.2 ||
            Math.abs(mouseY - followerY) > 0.2 ||
            Math.abs(targetCursorScale - cursorScale) > 0.01;

        if (moving || needsFrame) {
            needsFrame = false;
            animationId = requestAnimationFrame(animate);
        } else {
            animationId = null;
        }
    }

    function requestLoop() {
        if (!isActive) return;
        needsFrame = true;
        if (!animationId) animationId = requestAnimationFrame(animate);
    }

    function enable() {
        if (isActive) return;
        isActive = true;
        hideNative();
    }

    function disable() {
        isActive = false;
        showNative();
    }

    function applyTier(tier) {
        // Curseur custom sur tous les tiers ; en low le follower reste léger (rAF idle)
        void tier;
        enable();
    }

    document.addEventListener('mousemove', (e) => {
        if (!isActive) return;
        mouseX = e.clientX;
        mouseY = e.clientY;
        requestLoop();

        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => stopLoop(), 120);
    }, { passive: true });

    const interactiveSelector = 'a, button, .project-card, .skill-card, .contact-card, .magnetic';

    document.addEventListener('mouseover', (e) => {
        if (!isActive) return;
        if (e.target.closest(interactiveSelector)) {
            isHovering = true;
            cursor.classList.add('hover');
            follower.classList.add('hover');
            requestLoop();
        }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
        if (!isActive) return;
        if (e.target.closest(interactiveSelector)) {
            isHovering = false;
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
            requestLoop();
        }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        if (!isActive) return;
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });

    if (typeof onPerfTierReady === 'function') {
        onPerfTierReady(applyTier);
    } else {
        applyTier(window.PERF_TIER || 'high');
    }
}
