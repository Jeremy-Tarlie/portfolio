
class EasterEggs {
    constructor() {
        // Easter eggs list with their discovery status
        this.easterEggs = {
            logo: { name: 'Secret du Logo', found: false },
            heart: { name: 'Cœurs Flottants', found: false },
            name: { name: 'Triple Clic', found: false },
            scroll: { name: 'Patience Récompensée', found: false },
            terminal: { name: 'Terminal Secret', found: false },
            console: { name: 'Console Dev', found: false }
        };
        
        this.loadProgress();
        this.init();
        this.createCounter();
    }

    init() {
        this.initLogoClicks();
        this.initHeartClick();
        this.initNameTripleClick();
        this.initBottomSecret();
        this.initTerminalSecret();
    }

    // Système de compteur
    loadProgress() {
        const saved = localStorage.getItem('easterEggsFound');
        if (saved) {
            const found = JSON.parse(saved);
            Object.keys(found).forEach(key => {
                if (this.easterEggs[key]) {
                    this.easterEggs[key].found = found[key];
                }
            });
        }
    }

    saveProgress() {
        const found = {};
        Object.keys(this.easterEggs).forEach(key => {
            found[key] = this.easterEggs[key].found;
        });
        localStorage.setItem('easterEggsFound', JSON.stringify(found));
    }

    discoverEgg(eggId) {
        if (!this.easterEggs[eggId]) return;
        if (this.easterEggs[eggId].found) return;
        
        this.easterEggs[eggId].found = true;
        this.saveProgress();
        this.updateCounter();
        
        setTimeout(() => {
            this.showDiscoveryToast(this.easterEggs[eggId].name);
        }, 100);
        
        // Vérifier si tous trouvés
        if (this.getFoundCount() === this.getTotalCount()) {
            setTimeout(() => this.showVictoryPopup(), 3500);
        }
    }
    
    showVictoryPopup() {
        const popup = document.createElement('div');
        popup.className = 'victory-popup';
        popup.innerHTML = `
            <div class="victory-content">
                <div class="victory-icon">🏆</div>
                <h2 class="victory-title">Félicitations !</h2>
                <p class="victory-text">Tu as découvert tous les <span class="highlight">7 easter eggs</span> !</p>
                <p class="victory-subtitle">Tu es un vrai explorateur 🚀</p>
                <button class="victory-close">Merci !</button>
            </div>
        `;
        document.body.appendChild(popup);
        
        setTimeout(() => popup.classList.add('active'), 10);
        
        const closeBtn = popup.querySelector('.victory-close');
        closeBtn.addEventListener('click', () => {
            popup.classList.remove('active');
            setTimeout(() => popup.remove(), 500);
        });
        
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('active');
                setTimeout(() => popup.remove(), 500);
            }
        });
    }
    
    resetProgress() {
        Object.keys(this.easterEggs).forEach(key => {
            this.easterEggs[key].found = false;
        });
        localStorage.removeItem('easterEggsFound');
        this.updateCounter();
    }

    getFoundCount() {
        return Object.values(this.easterEggs).filter(e => e.found).length;
    }

    getTotalCount() {
        return Object.keys(this.easterEggs).length;
    }

    createCounter() {
        const counter = document.createElement('div');
        counter.className = 'easter-egg-counter';
        counter.innerHTML = `
            <span class="egg-icon">🥚</span>
            <span class="egg-count">${this.getFoundCount()}/${this.getTotalCount()}</span>
        `;
        counter.title = 'Easter Eggs découverts';
        document.body.appendChild(counter);

        // Click to show details
        counter.addEventListener('click', () => this.showEggList());
    }

    updateCounter() {
        const countEl = document.querySelector('.egg-count');
        if (countEl) {
            countEl.textContent = `${this.getFoundCount()}/${this.getTotalCount()}`;
            
            // Animate on update
            const counter = document.querySelector('.easter-egg-counter');
            counter.classList.add('pulse');
            setTimeout(() => counter.classList.remove('pulse'), 500);
        }
    }

    showDiscoveryToast(eggName) {
        const toast = document.createElement('div');
        toast.className = 'egg-discovery-toast';
        toast.innerHTML = `
            <span class="toast-icon">🎉</span>
            <span class="toast-text">Easter egg découvert : <strong>${eggName}</strong></span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    showEggList() {
        // Remove existing popup
        const existing = document.querySelector('.egg-list-popup');
        if (existing) {
            existing.remove();
            return;
        }

        const popup = document.createElement('div');
        popup.className = 'egg-list-popup';
        
        const eggsList = Object.entries(this.easterEggs).map(([key, egg]) => `
            <div class="egg-item ${egg.found ? 'found' : ''}">
                <span class="egg-status">${egg.found ? '✅' : '❓'}</span>
                <span class="egg-name">${egg.found ? egg.name : '???'}</span>
            </div>
        `).join('');

        popup.innerHTML = `
            <div class="egg-popup-content">
                <div class="egg-popup-header">
                    <span>🥚 Easter Eggs</span>
                    <span class="egg-popup-count">${this.getFoundCount()}/${this.getTotalCount()}</span>
                </div>
                <div class="egg-list">
                    ${eggsList}
                </div>
                <div class="egg-popup-hint">
                    ${this.getFoundCount() === this.getTotalCount() 
                        ? '🏆 Tu les as tous trouvés !' 
                        : '💡 Continue à explorer...'}
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        setTimeout(() => popup.classList.add('show'), 10);

        // Close on click outside
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('show');
                setTimeout(() => popup.remove(), 300);
            }
        });
    }

    // Terminal secret
    initTerminalSecret() {}

    

    // Logo 5 clics
    initLogoClicks() {
        const logo = document.querySelector('.nav-logo');
        if (!logo) return;

        let clickCount = 0;
        let clickTimer = null;

        logo.addEventListener('click', (e) => {
            e.preventDefault();
            clickCount++;

            if (clickTimer) clearTimeout(clickTimer);

            if (clickCount >= 5) {
                this.triggerLogoSecret();
                clickCount = 0;
            }

            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 1000);
        });
    }

    triggerLogoSecret() {
        this.discoverEgg('logo');
        
        // Play sound
        if (typeof cyberpunkAudio !== 'undefined' && cyberpunkAudio.playSuccess) {
            cyberpunkAudio.playSuccess();
        }

        // Create glitch overlay
        const glitchOverlay = document.createElement('div');
        glitchOverlay.className = 'logo-secret-overlay';
        glitchOverlay.innerHTML = `
            <div class="secret-content">
                <div class="glitch-text" data-text="ACCÈS ACCORDÉ">ACCÈS ACCORDÉ</div>
                <div class="secret-message">
                    <p>🔓 Tu as découvert le secret du logo !</p>
                    <p class="secret-hint">Développé avec passion par <span class="highlight">Jérémy Tarlié</span></p>
                    <p class="secret-code">// Code is poetry 💜</p>
                </div>
            </div>
        `;
        document.body.appendChild(glitchOverlay);

        // Animate in
        setTimeout(() => glitchOverlay.classList.add('active'), 10);

        // Click to close
        glitchOverlay.addEventListener('click', () => {
            glitchOverlay.classList.remove('active');
            setTimeout(() => glitchOverlay.remove(), 500);
        });

        // Auto close after 5 seconds
        setTimeout(() => {
            if (glitchOverlay.parentNode) {
                glitchOverlay.classList.remove('active');
                setTimeout(() => glitchOverlay.remove(), 500);
            }
        }, 5000);
    }

    // Clic coeur footer
    initHeartClick() {
        const heart = document.querySelector('.footer-made .heart');
        if (!heart) return;

        heart.style.cursor = 'pointer';
        heart.addEventListener('click', () => {
            this.triggerHeartEffect(heart);
        });
    }

    triggerHeartEffect(heartElement) {
        this.discoverEgg('heart');
        
        // Play sound
        if (typeof cyberpunkAudio !== 'undefined' && cyberpunkAudio.playSuccess) {
            cyberpunkAudio.playSuccess();
        }

        const rect = heartElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Create floating hearts
        for (let i = 0; i < 20; i++) {
            const floatingHeart = document.createElement('div');
            floatingHeart.className = 'floating-heart';
            floatingHeart.innerHTML = ['❤️', '💜', '💙', '💖', '💝'][Math.floor(Math.random() * 5)];
            floatingHeart.style.cssText = `
                left: ${centerX + (Math.random() - 0.5) * 100}px;
                top: ${centerY}px;
                animation-delay: ${Math.random() * 0.5}s;
                font-size: ${1 + Math.random() * 1.5}rem;
            `;
            document.body.appendChild(floatingHeart);

            // Remove after animation
            setTimeout(() => floatingHeart.remove(), 3000);
        }

        // Show love message
        const loveMessage = document.createElement('div');
        loveMessage.className = 'love-message';
        loveMessage.innerHTML = 'Merci pour l\'amour ! 💕';
        loveMessage.style.cssText = `
            left: ${centerX}px;
            top: ${centerY - 50}px;
        `;
        document.body.appendChild(loveMessage);

        setTimeout(() => {
            loveMessage.classList.add('show');
        }, 10);

        setTimeout(() => {
            loveMessage.classList.remove('show');
            setTimeout(() => loveMessage.remove(), 500);
        }, 2000);
    }

    // Triple clic nom
    initNameTripleClick() {
        // Target the hero name
        const heroName = document.querySelector('.hero-text');
        if (!heroName) return;

        heroName.addEventListener('click', (e) => {
            if (e.detail === 3) { // Triple click
                this.triggerNameSecret();
            }
        });
    }

    triggerNameSecret() {
        this.discoverEgg('name');
        
        // Play sound
        if (typeof cyberpunkAudio !== 'undefined' && cyberpunkAudio.playSuccess) {
            cyberpunkAudio.playSuccess();
        }

        const secretPopup = document.createElement('div');
        secretPopup.className = 'name-secret-popup';
        secretPopup.innerHTML = `
            <div class="popup-content">
                <div class="popup-icon">👋</div>
                <h3>Hey, tu m'as trouvé !</h3>
                <p>Je suis <span class="highlight">Jérémy</span>, le créateur de ce portfolio.</p>
                <p>Fun fact : Ce site a été codé avec beaucoup de ☕ et de 🎵 lofi.</p>
                <p class="popup-hint">Psst... Il y a d'autres secrets cachés 🤫</p>
                <button class="popup-close">Fermer</button>
            </div>
        `;
        document.body.appendChild(secretPopup);

        setTimeout(() => secretPopup.classList.add('active'), 10);

        const closeBtn = secretPopup.querySelector('.popup-close');
        closeBtn.addEventListener('click', () => {
            secretPopup.classList.remove('active');
            setTimeout(() => secretPopup.remove(), 500);
        });

        secretPopup.addEventListener('click', (e) => {
            if (e.target === secretPopup) {
                secretPopup.classList.remove('active');
                setTimeout(() => secretPopup.remove(), 500);
            }
        });
    }

    // Scroll en bas + attente
    initBottomSecret() {
        let bottomTimer = null;
        let secretShown = false;

        window.addEventListener('scroll', () => {
            const scrolledToBottom = (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 50;

            if (scrolledToBottom && !secretShown) {
                if (!bottomTimer) {
                    bottomTimer = setTimeout(() => {
                        this.triggerBottomSecret();
                        secretShown = true;
                    }, 10000); // 10 seconds
                }
            } else {
                if (bottomTimer) {
                    clearTimeout(bottomTimer);
                    bottomTimer = null;
                }
            }
        });
    }

    triggerBottomSecret() {
        this.discoverEgg('scroll');
        
        // Play sound
        if (typeof cyberpunkAudio !== 'undefined' && cyberpunkAudio.playSuccess) {
            cyberpunkAudio.playSuccess();
        }

        const bottomMessage = document.createElement('div');
        bottomMessage.className = 'bottom-secret-message';
        bottomMessage.innerHTML = `
            <div class="bottom-secret-content">
                <span class="bottom-secret-icon">🏆</span>
                <span class="bottom-secret-text">
                    Félicitations ! Tu as scrollé jusqu'en bas et tu es resté 10 secondes.<br>
                    <span class="highlight">Tu es vraiment curieux(se), j'aime ça ! 🚀</span>
                </span>
                <button class="bottom-secret-close">✕</button>
            </div>
        `;
        document.body.appendChild(bottomMessage);

        setTimeout(() => bottomMessage.classList.add('show'), 10);

        const closeBtn = bottomMessage.querySelector('.bottom-secret-close');
        closeBtn.addEventListener('click', () => {
            bottomMessage.classList.remove('show');
            setTimeout(() => bottomMessage.remove(), 500);
        });

        // Auto hide after 8 seconds
        setTimeout(() => {
            if (bottomMessage.parentNode) {
                bottomMessage.classList.remove('show');
                setTimeout(() => bottomMessage.remove(), 500);
            }
        }, 8000);
    }
}


// Easter egg console
window.secret = function() {
    console.clear();
    console.log(`
%c╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Portfolio de Jérémy Tarlié                          ║
║   ─────────────────────────────────                       ║
║                                                           ║
║   ⚡ Full Stack Developer                                 ║
║   🌐 https://tarlie.fr                                    ║
║   📧 contact@tarlie.fr                                    ║
║                                                           ║
║   🎉 Tu as trouvé un easter egg !                         ║
║   Il y en a 7 au total, continue à chercher...           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`, 'color: #00f0ff; font-family: monospace; font-size: 12px;');
    
    if (window.easterEggs) {
        window.easterEggs.discoverEgg('console');
    }
    return '🎮 Easter egg débloqué !';
};

// Hint in the console
console.log('%c🔍 Un secret se cache ici... Tape secret() pour le découvrir !', 'color: #00f0ff; font-size: 11px;');

document.addEventListener('DOMContentLoaded', () => {
    window.easterEggs = new EasterEggs();
});
