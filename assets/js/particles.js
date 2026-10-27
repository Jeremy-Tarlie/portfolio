function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    let particles = [];
    let animationId = null;
    let isPaused = false;
    let isEnabled = true;
    let perfTier = window.PERF_TIER || 'high';
    let lastFrame = 0;
    let particleIdCounter = 0;

    // Cap DPR — high DPR canvases are brutal without GPU
    function getDpr() {
        if (perfTier === 'low') return 1;
        if (perfTier === 'medium') return 1;
        return Math.min(window.devicePixelRatio || 1, 1.5);
    }

    function resizeCanvas() {
        const dpr = getDpr();
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    class Particle {
        constructor() {
            this.id = particleIdCounter++;
            this.reset();
        }

        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.45 + 0.15;
            this.color = this.getRandomColor();
        }

        getRandomColor() {
            const colors = [
                'rgba(0, 240, 255, ',
                'rgba(255, 0, 170, ',
                'rgba(139, 92, 246, '
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            const w = window.innerWidth;
            const h = window.innerHeight;
            if (this.x < 0) this.x = w;
            if (this.x > w) this.x = 0;
            if (this.y < 0) this.y = h;
            if (this.y > h) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        const area = window.innerWidth * window.innerHeight;
        const maxCount = perfTier === 'low' ? 22 : perfTier === 'medium' ? 32 : 55;
        const density = perfTier === 'low' ? 28000 : perfTier === 'medium' ? 24000 : 18000;
        const particleCount = Math.min(maxCount, Math.floor(area / density));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function drawStatic() {
        stopAnimation();
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
        }
    }

    function connectParticles() {
        const maxDistance = 120;
        const cellSize = maxDistance;
        const grid = new Map();

        function cellKey(cx, cy) {
            return cx + ',' + cy;
        }

        for (const p of particles) {
            const cx = Math.floor(p.x / cellSize);
            const cy = Math.floor(p.y / cellSize);
            const key = cellKey(cx, cy);
            if (!grid.has(key)) grid.set(key, []);
            grid.get(key).push(p);
        }

        const checked = new Set();

        for (const p of particles) {
            const cx = Math.floor(p.x / cellSize);
            const cy = Math.floor(p.y / cellSize);

            for (let ox = -1; ox <= 1; ox++) {
                for (let oy = -1; oy <= 1; oy++) {
                    const neighbors = grid.get(cellKey(cx + ox, cy + oy));
                    if (!neighbors) continue;

                    for (const other of neighbors) {
                        if (other === p) continue;

                        const pairKey = p.id < other.id ? p.id + '-' + other.id : other.id + '-' + p.id;
                        if (checked.has(pairKey)) continue;
                        checked.add(pairKey);

                        const dx = p.x - other.x;
                        const dy = p.y - other.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < maxDistance) {
                            const opacity = (1 - distance / maxDistance) * 0.15;
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                            ctx.lineWidth = 0.5;
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(other.x, other.y);
                            ctx.stroke();
                        }
                    }
                }
            }
        }
    }

    function stopAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    function disable() {
        isEnabled = false;
        isPaused = true;
        stopAnimation();
        particles = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
    }

    function enableAnimated() {
        isEnabled = true;
        isPaused = document.hidden;
        canvas.style.display = '';
        resizeCanvas();
        createParticles();
        startAnimation();
    }

    function enableStatic() {
        isEnabled = true;
        isPaused = true;
        canvas.style.display = '';
        resizeCanvas();
        createParticles();
        drawStatic();
    }

    function animate(now) {
        if (!isEnabled || isPaused || perfTier === 'low') return;

        // medium → ~45fps ; high → ~60fps
        const minDelta = perfTier === 'medium' ? 22 : 0;
        if (minDelta && now - lastFrame < minDelta) {
            animationId = requestAnimationFrame(animate);
            return;
        }
        lastFrame = now;

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        if (perfTier === 'high') {
            connectParticles();
        }

        animationId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        stopAnimation();
        if (!isEnabled || isPaused || perfTier === 'low') return;
        lastFrame = 0;
        animationId = requestAnimationFrame(animate);
    }

    function applyTier(tier) {
        perfTier = tier;
        if (tier === 'low') {
            enableStatic();
            return;
        }
        enableAnimated();
    }

    window.addEventListener('resize', debounce(() => {
        if (!isEnabled) return;
        resizeCanvas();
        createParticles();
        if (perfTier === 'low') drawStatic();
    }, 200));

    document.addEventListener('visibilitychange', () => {
        if (perfTier === 'low') return;
        isPaused = document.hidden;
        if (!isPaused && isEnabled) startAnimation();
        else stopAnimation();
    });

    // Mouse repulsion only on high tier, throttled
    let lastMouseUpdate = 0;
    canvas.style.pointerEvents = 'none';
    document.addEventListener('mousemove', (e) => {
        if (perfTier !== 'high' || !isEnabled) return;
        const now = performance.now();
        if (now - lastMouseUpdate < 50) return;
        lastMouseUpdate = now;

        const mx = e.clientX;
        const my = e.clientY;

        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            const dx = particle.x - mx;
            const dy = particle.y - my;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 90 && distance > 0) {
                const force = (90 - distance) / 90;
                particle.speedX += (dx / distance) * force * 0.35;
                particle.speedY += (dy / distance) * force * 0.35;
            }
        }
    }, { passive: true });

    if (typeof onPerfTierReady === 'function') {
        onPerfTierReady(applyTier);
    } else {
        applyTier(perfTier);
    }
}
