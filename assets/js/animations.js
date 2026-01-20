// Preloader
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const percentage = document.querySelector('.preloader-percentage');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                document.body.classList.add('loaded');
                
                // Start hero animations
                setTimeout(() => {
                    animateHeroElements();
                }, 300);
            }, 500);
        }
        if (percentage) {
            percentage.textContent = Math.floor(progress) + '%';
        }
    }, 100);
}

function animateHeroElements() {
    const elements = document.querySelectorAll('.hero .reveal-up');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('active');
        }, index * 150);
    });
}

// Typewriter
function initTypewriter() {
    const typewriter = document.querySelector('.typewriter');
    if (!typewriter) return;
    
    const texts = JSON.parse(typewriter.dataset.texts || '["FULLSTACK DEVELOPER"]');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typewriter.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriter.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before next word
        }
        
        setTimeout(type, typingSpeed);
    }
    
    setTimeout(type, 1000);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Observe all reveal elements
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    revealElements.forEach(el => observer.observe(el));
    
    // Observe section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach((header, index) => {
        header.classList.add('reveal-up');
        header.style.setProperty('--delay', `${index * 0.1}s`);
        observer.observe(header);
    });
    
    // Observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.classList.add('reveal-up');
        card.style.setProperty('--delay', `${index * 0.1}s`);
        observer.observe(card);
    });
    
    // Observe skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        card.classList.add('reveal-up');
        card.style.setProperty('--delay', `${(index % 6) * 0.1}s`);
        observer.observe(card);
    });
}

// Parallax
function initParallaxEffects() {
    const heroGlows = document.querySelectorAll('.hero-glow');
    const codeWindow = document.querySelector('.code-window');
    
    // Mouse parallax for hero section
    document.addEventListener('mousemove', throttle((e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        
        heroGlows.forEach((glow, index) => {
            const speed = (index + 1) * 20;
            glow.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
        });
        
        if (codeWindow && window.innerWidth > 1024) {
            codeWindow.style.transform = `
                perspective(1000px) 
                rotateY(${mouseX * -5}deg) 
                rotateX(${mouseY * 5}deg)
            `;
        }
    }, 50));
    
    // Scroll parallax
    window.addEventListener('scroll', throttle(() => {
        const scrollY = window.scrollY;
        
        heroGlows.forEach((glow, index) => {
            const speed = 0.1 + (index * 0.05);
            glow.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }, 50));
}

// Glitch effects
function initGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch, .glitch-hover');
    
    // Random glitch effect
    function triggerRandomGlitch() {
        const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
        if (randomElement) {
            randomElement.classList.add('glitching');
            setTimeout(() => {
                randomElement.classList.remove('glitching');
            }, 200);
        }
    }
    
    setInterval(triggerRandomGlitch, 8000);
}
