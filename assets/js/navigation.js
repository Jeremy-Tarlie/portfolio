// Navigation
function initNavigation() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const sections = document.querySelectorAll('section');
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;

            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offset = nav.offsetHeight;
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                const menuToggle = document.querySelector('.menu-toggle');
                mobileMenu?.classList.remove('active');
                menuToggle?.classList.remove('active');
                document.body.classList.remove('no-scroll');
                menuToggle?.setAttribute('aria-expanded', 'false');
                menuToggle?.setAttribute('aria-label', 'Ouvrir le menu de navigation');
            }
        });
    });
    
    // Update active nav link on scroll
    function updateActiveLink() {
        const scrollPos = window.scrollY + window.innerHeight / 3;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Navbar style on scroll
    function updateNavStyle() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', throttle(() => {
        updateActiveLink();
        updateNavStyle();
    }, 100));
    
    updateActiveLink();
    updateNavStyle();
}

// Menu mobile
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!menuToggle || !mobileMenu) return;
    
    const syncMenuState = () => {
        const isOpen = mobileMenu.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        menuToggle.setAttribute(
            'aria-label',
            isOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'
        );
    };

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        syncMenuState();
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            syncMenuState();
        }
    });
}

// Back to top
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, 100));
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Keyboard navigation
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        const sections = ['home', 'about', 'projects', 'skills', 'contact'];
        const num = parseInt(e.key);
        
        // Navigate sections with number keys 1-5
        if (num >= 1 && num <= 5) {
            const section = document.getElementById(sections[num - 1]);
            if (section) {
                const nav = document.querySelector('.nav');
                const offset = nav ? nav.offsetHeight : 0;
                
                window.scrollTo({
                    top: section.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        }
        
        // Go to top with Home key
        if (e.key === 'Home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Go to bottom with End key
        if (e.key === 'End') {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });
}

window.initNavigation = initNavigation;
window.initMobileMenu = initMobileMenu;
window.initBackToTop = initBackToTop;
window.initKeyboardNav = initKeyboardNav;
