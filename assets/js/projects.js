class ProjectModal {
    constructor() {
        this.projects = {
            'portfolio': {
                title: 'Portfolio Cyberpunk',
                category: 'Site Web',
                year: '2026',
                description: `Mon portfolio personnel présentant mes compétences et projets avec un design cyberpunk unique. 
                
Ce site a été entièrement développé from scratch avec HTML, CSS et JavaScript vanille. Il inclut de nombreuses fonctionnalités interactives comme un terminal personnalisé, des effets sonores, des animations fluides et des easter eggs cachés.

Le design s'inspire de l'esthétique cyberpunk avec des couleurs néon, des effets de glitch et une ambiance futuriste.`,
                tech: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'Docker'],
                images: ['assets/img/portfolio.png'],
                links: {
                    demo: 'https://tarlie.fr',
                    github: 'https://github.com/Jeremy-Tarlie/portfolio'
                }
            },
            'codepath': {
                title: 'Codepath',
                category: 'Site Web',
                year: '2025',
                description: `Entreprise de développement web proposant des devis personnalisés et des templates prêts à l'emploi.

Codepath est une plateforme qui permet aux entreprises et particuliers d'obtenir des sites web professionnels. Le site propose un système de devis en ligne, une galerie de templates et un espace client.`,
                tech: ['HTML', 'CSS', 'JavaScript', 'PHP'],
                images: ['assets/img/codepath.png'],
                links: {
                    demo: 'https://codepath.fr'
                }
            },
            'codepass': {
                title: 'Codepass',
                category: 'Application',
                year: '2025',
                description: `Gestionnaire de mots de passe sécurisé avec chiffrement AES-256 et synchronisation multi-appareils.

Codepass est une application de gestion de mots de passe qui met l'accent sur la sécurité et la facilité d'utilisation. Elle utilise un chiffrement de bout en bout pour protéger vos données sensibles.

Fonctionnalités principales :
• Chiffrement AES-256 de bout en bout
• Synchronisation multi-appareils
• Générateur de mots de passe sécurisés
`,
                tech: ['React.js', 'Node.js', 'MongoDB', 'JWT', 'Electron'],
                images: ['assets/img/codepass.png'],
                links: {}
            },
            'mydiscordbot': {
                title: 'MyDiscordBot',
                category: 'Bot / SaaS',
                year: '2024',
                description: `Plateforme de création et gestion de bots Discord personnalisés pour les communautés.

MyDiscordBot permet à n'importe qui de créer son propre bot Discord sans avoir besoin de coder. L'interface intuitive permet de configurer des commandes personnalisées, des systèmes de modération, des messages automatiques et bien plus.

Fonctionnalités :
• Création de bots sans code
• Commandes personnalisables
• Système de modération avancé
• Analytics et statistiques
• Intégrations tierces
• Support 24/7`,
                tech: ['Node.js', 'Discord.js', 'Next.js', 'Prisma', 'PostgreSQL'],
                images: ['assets/img/mydiscordbot.png'],
                links: {
                    demo: 'https://mydiscordbot.com'
                }
            },
            'cotapro': {
                title: 'CotaPro',
                category: 'Application Desktop',
                year: '2024',
                description: `Application desktop de gestion et de suivi de cotations professionnelles.

CotaPro est une solution complète pour les professionnels qui ont besoin de gérer leurs devis et cotations. L'application fonctionne en local pour une confidentialité maximale et offre une interface moderne et intuitive.

Fonctionnalités :
• Création rapide de devis
• Gestion des clients
• Suivi des cotations en cours
• Génération de PDF professionnels
• Statistiques et rapports
• Sauvegarde automatique`,
                tech: ['Electron.js', 'SQLite', 'Next.js', 'Tailwind CSS'],
                images: ['assets/img/cotapro.png'],
                links: {}
            }
        };

        this.currentProject = null;
        this.currentImageIndex = 0;
        this.modal = null;
        this.zoomOverlay = null;

        this.init();
    }

    init() {
        this.createModal();
        this.createZoomOverlay();
        this.bindEvents();
    }
    
    createZoomOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'image-zoom-overlay';
        overlay.innerHTML = `
            <img src="" alt="" id="zoomImage">
            <span class="zoom-close-hint">Cliquez pour fermer</span>
        `;
        document.body.appendChild(overlay);
        this.zoomOverlay = overlay;
        
        overlay.addEventListener('click', () => this.closeZoom());
    }
    
    openZoom(imageSrc, imageAlt) {
        const zoomImg = document.getElementById('zoomImage');
        zoomImg.src = imageSrc;
        zoomImg.alt = imageAlt;
        this.zoomOverlay.classList.add('active');
    }
    
    closeZoom() {
        this.zoomOverlay.classList.remove('active');
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-container">
                <button class="modal-close" aria-label="Fermer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
                
                <div class="modal-content">
                    <div class="modal-gallery">
                        <div class="gallery-main">
                            <img src="" alt="" class="gallery-image" id="modalMainImage">
                            <button class="gallery-nav gallery-prev" aria-label="Image précédente">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="15 18 9 12 15 6"/>
                                </svg>
                            </button>
                            <button class="gallery-nav gallery-next" aria-label="Image suivante">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="9 18 15 12 9 6"/>
                                </svg>
                            </button>
                        </div>
                        <div class="gallery-dots" id="galleryDots"></div>
                    </div>
                    
                    <div class="modal-info">
                        <div class="modal-header">
                            <div class="modal-meta">
                                <span class="modal-category" id="modalCategory"></span>
                                <span class="modal-year" id="modalYear"></span>
                            </div>
                            <h2 class="modal-title" id="modalTitle"></h2>
                        </div>
                        
                        <div class="modal-description" id="modalDescription"></div>
                        
                        <div class="modal-tech" id="modalTech"></div>
                        
                        <div class="modal-links" id="modalLinks"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.modal = modal;
    }

    bindEvents() {
        this.modal.querySelector('.modal-close').addEventListener('click', () => this.close());
        
        this.modal.querySelector('.modal-overlay').addEventListener('click', () => this.close());
        
        this.modal.querySelector('.gallery-image').addEventListener('click', () => {
            const mainImage = document.getElementById('modalMainImage');
            this.openZoom(mainImage.src, mainImage.alt);
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.zoomOverlay.classList.contains('active')) {
                    this.closeZoom();
                } else if (this.modal.classList.contains('active')) {
                    this.close();
                }
            }
        });

        this.modal.querySelector('.gallery-prev').addEventListener('click', () => this.prevImage());
        this.modal.querySelector('.gallery-next').addEventListener('click', () => this.nextImage());

        document.querySelectorAll('.project-card').forEach(card => {
            const overlay = card.querySelector('.project-overlay');
            const projectTitle = card.querySelector('.project-title')?.textContent.toLowerCase().replace(/\s+/g, '');
            
            let projectKey = null;
            for (const [key, data] of Object.entries(this.projects)) {
                if (data.title.toLowerCase().replace(/\s+/g, '').includes(projectTitle) || 
                    projectTitle.includes(key)) {
                    projectKey = key;
                    break;
                }
            }

            if (overlay && projectKey) {
                const href = overlay.getAttribute('href');
                if (href === '#') {
                    overlay.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.open(projectKey);
                    });
                }
            }
        });
    }

    open(projectKey) {
        const project = this.projects[projectKey];
        if (!project) return;

        this.currentProject = project;
        this.currentImageIndex = 0;

        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalCategory').textContent = project.category;
        document.getElementById('modalYear').textContent = project.year;
        document.getElementById('modalDescription').innerHTML = project.description.replace(/\n/g, '<br>');
        
        const techContainer = document.getElementById('modalTech');
        techContainer.innerHTML = project.tech.map(t => `<span class="modal-tech-tag">${t}</span>`).join('');

        const linksContainer = document.getElementById('modalLinks');
        let linksHtml = '';
        if (project.links.demo) {
            linksHtml += `<a href="${project.links.demo}" target="_blank" class="modal-link modal-link-demo">
                <span>Voir le site</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
            </a>`;
        }
        if (project.links.github) {
            linksHtml += `<a href="${project.links.github}" target="_blank" class="modal-link modal-link-github">
                <span>GitHub</span>
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            </a>`;
        }
        linksContainer.innerHTML = linksHtml;

        this.updateGallery();

        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (typeof cyberpunkAudio !== 'undefined' && cyberpunkAudio.playClick) {
            cyberpunkAudio.playClick();
        }
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        if (typeof cyberpunkAudio !== 'undefined' && cyberpunkAudio.playClick) {
            cyberpunkAudio.playClick();
        }
    }

    updateGallery() {
        const mainImage = document.getElementById('modalMainImage');
        const dotsContainer = document.getElementById('galleryDots');
        const images = this.currentProject.images;

        mainImage.src = images[this.currentImageIndex];
        mainImage.alt = this.currentProject.title;

        dotsContainer.innerHTML = images.map((_, i) => 
            `<button class="gallery-dot ${i === this.currentImageIndex ? 'active' : ''}" data-index="${i}"></button>`
        ).join('');

        dotsContainer.querySelectorAll('.gallery-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                this.currentImageIndex = parseInt(dot.dataset.index);
                this.updateGallery();
            });
        });

        const prevBtn = this.modal.querySelector('.gallery-prev');
        const nextBtn = this.modal.querySelector('.gallery-next');
        
        if (images.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            dotsContainer.style.display = 'none';
        } else {
            prevBtn.style.display = '';
            nextBtn.style.display = '';
            dotsContainer.style.display = '';
        }
    }

    prevImage() {
        const images = this.currentProject.images;
        this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
        this.updateGallery();
    }

    nextImage() {
        const images = this.currentProject.images;
        this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
        this.updateGallery();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.projectModal = new ProjectModal();
});
