function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;
    let isPaused = false;
    
    let perfTier = 'high';
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    let particleIdCounter = 0;
    
    class Particle {
        constructor() {
            this.id = particleIdCounter++;
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
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
            
            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
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
        const maxCount = perfTier === 'low' ? 35 : perfTier === 'medium' ? 65 : 100;
        const particleCount = Math.min(maxCount, Math.floor(canvas.width * canvas.height / 15000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function connectParticles() {
        const maxDistance = 150;
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
                            const opacity = (1 - distance / maxDistance) * 0.2;
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
    
    // Animation loop
    function animate() {
        if (isPaused) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        if (perfTier !== 'low') {
            connectParticles();
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    function startAnimation() {
        if (animationId) cancelAnimationFrame(animationId);
        animate();
    }
    
    document.addEventListener('visibilitychange', () => {
        isPaused = document.hidden;
        if (!isPaused) {
            startAnimation();
        }
    });
    
    let mouse = { x: null, y: null };
    let lastMouseUpdate = 0;
    
    canvas.addEventListener('mousemove', (e) => {
        const now = performance.now();
        if (now - lastMouseUpdate < 16) return;
        lastMouseUpdate = now;
        
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        particles.forEach(particle => {
            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.speedX += (dx / distance) * force * 0.5;
                particle.speedY += (dy / distance) * force * 0.5;
            }
        });
    });
    
    if (typeof onPerfTierReady === 'function') {
        onPerfTierReady((tier) => {
            perfTier = tier;
            createParticles();
            startAnimation();
        });
    } else {
        createParticles();
        startAnimation();
    }
}