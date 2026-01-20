class InteractiveTerminal {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.output = document.getElementById('terminalOutput');
        this.input = document.getElementById('terminalInput');
        this.pathDisplay = document.getElementById('inputPath');
        this.titlePath = document.getElementById('terminalPath');

        this.currentPath = '~/about';
        this.commandHistory = [];
        this.historyIndex = -1;

        // Virtual file system
        this.fileSystem = {
            '~': {
                type: 'dir',
                children: ['about', 'projects', 'skills', 'contact']
            },
            '~/about': {
                type: 'dir',
                children: ['introduction.md', 'experience.md', 'philosophy.md', 'hobbies.md', 'goals.md', 'education.md', 'certifications.md', 'stack.md']
            },
            '~/projects': {
                type: 'dir',
                children: ['portfolio.md', 'ecommerce.md', 'webapp.md', 'api.md']
            },
            '~/skills': {
                type: 'dir',
                children: ['frontend.md', 'backend.md', 'databases.md', 'datascience.md', 'tools.md', 'soft-skills.md']
            },
            '~/contact': {
                type: 'dir',
                children: ['email.md', 'social.md', 'availability.md']
            },
            // About files
            '~/about/introduction.md': {
                type: 'file',
                content: `<span class="output-emoji">👋</span> Bonjour ! Je suis <span class="highlight">Jérémy Tarlié</span>, développeur Full Stack passionné par la création d'expériences web innovantes et performantes.`
            },
            '~/about/experience.md': {
                type: 'file',
                content: `<span class="output-emoji">💼</span> Avec plus de <span class="highlight">2 ans d'expérience</span>, je me spécialise dans la création de sites web qui allient <span class="highlight">esthétique</span> et <span class="highlight">fonctionnalité</span>.`
            },
            '~/about/philosophy.md': {
                type: 'file',
                content: `<span class="output-emoji">🎯</span> Je crois que chaque ligne de code raconte une histoire. Mon objectif ? Créer des solutions qui <span class="highlight">impressionnent</span>, qui <span class="highlight">performent</span> et qui <span class="highlight">durent</span>.`
            },
            '~/about/hobbies.md': {
                type: 'file',
                content: `<span class="output-emoji">🎮</span> En dehors du code, je suis passionné par les <span class="highlight">jeux vidéo</span>, la <span class="highlight">musique</span> et l'exploration de nouvelles <span class="highlight">technologies</span>.`
            },
            '~/about/goals.md': {
                type: 'file',
                content: `<span class="output-emoji">🚀</span> Mon ambition : contribuer à des projets <span class="highlight">innovants</span> et continuer à apprendre chaque jour pour repousser les limites du <span class="highlight">développement web</span>.`
            },
            '~/about/education.md': {
                type: 'file',
                content: `<span class="highlight">🎓 Parcours de formation</span><br><br>
<span class="highlight">Master Chef de Projet IA</span> | Oct. 2023 - Oct. 2026<br>
   Nexa - Nantes<br><br>
<span class="highlight">Formation Développeur Web & IA</span> | Sept. 2023<br>
   Doranco / Nexa - Nantes<br>
   Java, NoSQL, Node.JS, Python, Swing, Spring Boot, React, Django<br>
   Sécurisation, tests unitaires, Intelligence Artificielle<br><br>
<span class="highlight">Formation Développeur Web</span> | Fév. - Juil. 2021<br>
   WebForce3 - Dieppe<br>
   HTML, CSS, JS, PHP, SQL, Front-end & Back-end<br><br>
<span class="highlight">Licence 1 Informatique</span> | 2017 - 2019<br>
   UFR Sciences et Techniques - Rouen<br>
   Algorithmique, web, mathématiques, projets en groupe<br>
   Langage C, projet Arduino panneau solaire<br><br>
<span class="highlight">Bac STI2D</span> | 2017<br>
   Pablo Neruda - Dieppe`
            },
            '~/about/certifications.md': {
                type: 'file',
                content: `<span class="highlight">📜 Certifications & Projets notables</span><br><br>
<span class="highlight">Titre RNCP Niveau 6</span> - Développeur d'applications<br>
   Doranco / Nexa - 2023<br><br>
<span class="highlight">Titre Professionnel</span> - Développeur Web et Web Mobile<br>
   WebForce3 - 2021`
            },
            '~/about/stack.md': {
                type: 'file',
                content: `<span class="highlight">⚡ Ma Stack Préférée</span><br><br>
<span class="cmd-name">Frontend:</span> <span class="highlight">React</span> / <span class="highlight">Next.js</span> + Tailwind CSS<br>
<span class="cmd-name">Backend:</span> <span class="highlight">Node.js</span> + Express / <span class="highlight">Python</span> + FastAPI<br>
<span class="cmd-name">Database:</span> <span class="highlight">PostgreSQL</span> / MongoDB / MySQL<br>
<span class="cmd-name">DevOps:</span> Docker, Git, CI/CD<br>
<span class="cmd-name">Data/IA:</span> Pandas, NumPy, TensorFlow, OpenAI API<br><br>
<span class="tip">💡 J'aime combiner performance et expérience utilisateur !</span>`
            },
            '~/projects/portfolio.md': {
                type: 'file',
                content: `<span class="output-emoji">🌐</span> <span class="highlight">Portfolio Cyberpunk</span> - Ce site que vous visitez actuellement ! Construit avec HTML, CSS et JavaScript vanille avec un design néon futuriste.`
            },
            '~/projects/ecommerce.md': {
                type: 'file',
                content: `<span class="output-emoji">🛒</span> <span class="highlight">E-Commerce Platform</span> - Plateforme de vente en ligne complète avec React, Node.js et Stripe. Gestion des stocks et tableau de bord admin.`
            },
            '~/projects/webapp.md': {
                type: 'file',
                content: `<span class="output-emoji">📱</span> <span class="highlight">Task Manager App</span> - Application de gestion de tâches collaborative avec Next.js, Prisma et authentification OAuth.`
            },
            '~/projects/api.md': {
                type: 'file',
                content: `<span class="output-emoji">⚡</span> <span class="highlight">REST API</span> - API robuste et documentée pour une application mobile, construite avec Node.js, Express et MongoDB.`
            },
            '~/skills/frontend.md': {
                type: 'file',
                content: `<span class="output-emoji">🎨</span> <span class="highlight">Frontend</span>: React, Next.js, Vue.js, HTML5, CSS3, Tailwind, SASS, JavaScript/TypeScript, animations CSS, responsive design.`
            },
            '~/skills/backend.md': {
                type: 'file',
                content: `<span class="output-emoji">⚙️</span> <span class="highlight">Backend</span>: Node.js, Python, FastAPI, PHP, Symfony, Express, Prisma, REST APIs, GraphQL.`
            },
            '~/skills/databases.md': {
                type: 'file',
                content: `<span class="output-emoji">🗄️</span> <span class="highlight">Bases de données</span>: MySQL, PostgreSQL, MongoDB, SQLite, Prisma ORM.`
            },
            '~/skills/datascience.md': {
                type: 'file',
                content: `<span class="output-emoji">🤖</span> <span class="highlight">Data Science / IA</span>: Python, Pandas, NumPy, Matplotlib, Seaborn, TensorFlow, OpenAI API.`
            },
            '~/skills/tools.md': {
                type: 'file',
                content: `<span class="output-emoji">🔧</span> <span class="highlight">Outils</span>: Git, GitHub, Docker, VS Code, Figma, Postman, Linux, CI/CD, Vercel, Netlify.`
            },
            '~/skills/soft-skills.md': {
                type: 'file',
                content: `<span class="output-emoji">🤝</span> <span class="highlight">Soft Skills</span>: Travail d'équipe, communication, résolution de problèmes, gestion du temps, apprentissage continu, adaptabilité.`
            },
            '~/contact/email.md': {
                type: 'file',
                content: `<span class="output-emoji">📧</span> Email: <span class="highlight">contact@tarlie.fr</span> - N'hésitez pas à me contacter pour toute opportunité ou collaboration !`
            },
            '~/contact/social.md': {
                type: 'file',
                content: `<span class="output-emoji">🔗</span> Réseaux: <span class="highlight">GitHub</span> (Jeremy-Tarlie) | <span class="highlight">LinkedIn</span> (/in/jeremy-tarlie)`
            },
            '~/contact/availability.md': {
                type: 'file',
                content: `<span class="output-emoji">✅</span> Statut: <span class="highlight" style="color: var(--neon-green);">Disponible pour freelance</span> - Réponse garantie sous 24h !`
            }
        };

        // Available commands
        this.commands = {
            help: this.cmdHelp.bind(this),
            cat: this.cmdCat.bind(this),
            ls: this.cmdLs.bind(this),
            cd: this.cmdCd.bind(this),
            clear: this.cmdClear.bind(this),
            whoami: this.cmdWhoami.bind(this),
            date: this.cmdDate.bind(this),
            echo: this.cmdEcho.bind(this),
            neofetch: this.cmdNeofetch.bind(this),
            contact: this.cmdContact.bind(this),
            skills: this.cmdSkills.bind(this),
            projects: this.cmdProjects.bind(this),
            social: this.cmdSocial.bind(this),
            secret: this.cmdSecret.bind(this),
            matrix: this.cmdMatrix.bind(this),
            hack: this.cmdHack.bind(this)
        };

        this.init();
    }

    init() {
        this.displayInitialCommands();

        // Event listeners
        this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.container.addEventListener('click', () => this.input.focus());

        // Terminal buttons
        const clearBtn = this.container.querySelector('[data-action="clear"]');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.cmdClear();
            });
        }
    }

    displayInitialCommands() {
        // Show the 3 initial cat commands
        const initialCommands = [
            { cmd: 'cat introduction.md', file: '~/about/introduction.md' },
            { cmd: 'cat experience.md', file: '~/about/experience.md' },
            { cmd: 'cat philosophy.md', file: '~/about/philosophy.md' }
        ];

        initialCommands.forEach(({ cmd, file }) => {
            this.addCommandLine(cmd);
            this.addOutput(this.fileSystem[file].content);
        });
    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            const command = this.input.value.trim();
            if (command) {
                this.executeCommand(command);
                this.commandHistory.unshift(command);
                this.historyIndex = -1;
            }
            this.input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.input.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = -1;
                this.input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autocomplete();
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            this.cmdClear();
        }
    }

    autocomplete() {
        const input = this.input.value;
        const parts = input.split(' ');
        const lastPart = parts[parts.length - 1];

        // Get current directory files
        const currentDir = this.fileSystem[this.currentPath];
        if (!currentDir || currentDir.type !== 'dir') return;

        const matches = currentDir.children.filter(child =>
            child.toLowerCase().startsWith(lastPart.toLowerCase())
        );

        if (matches.length === 1) {
            parts[parts.length - 1] = matches[0];
            this.input.value = parts.join(' ');
        } else if (matches.length > 1) {
            this.addCommandLine(input);
            this.addOutput(matches.join('  '), 'ls-output');
        }
    }

    executeCommand(input) {
        this.addCommandLine(input);

        const parts = input.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Play sound if available
        if (typeof cyberpunkAudio !== 'undefined' && cyberpunkAudio.playClick) {
            cyberpunkAudio.playClick();
        }

        if (this.commands[cmd]) {
            this.commands[cmd](args);
        } else if (cmd === '') {
            this.addOutput('');
        } else {
            this.addOutput(`<span class="error">Commande non trouvée: ${cmd}</span><br>Tapez <span class="highlight">help</span> pour voir les commandes disponibles.`);
        }

        this.scrollToBottom();
    }

    addCommandLine(command) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `
            <span class="terminal-prompt">➜</span>
            <span class="terminal-path">${this.currentPath}</span>
            <span class="terminal-command">${this.escapeHtml(command)}</span>
        `;
        this.output.appendChild(line);
    }

    addOutput(content, className = '') {
        const output = document.createElement('div');
        output.className = `terminal-output ${className}`;
        output.innerHTML = `<p>${content}</p>`;
        this.output.appendChild(output);
    }

    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    updatePath(newPath) {
        this.currentPath = newPath;
        this.pathDisplay.textContent = newPath;
        this.titlePath.textContent = newPath;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    resolvePath(path) {
        if (path.startsWith('~/') || path === '~') {
            return path;
        }
        if (path.startsWith('/')) {
            return '~' + path;
        }
        if (path === '..') {
            const parts = this.currentPath.split('/');
            parts.pop();
            return parts.length > 0 ? parts.join('/') || '~' : '~';
        }
        if (path === '.') {
            return this.currentPath;
        }
        return `${this.currentPath}/${path}`;
    }

    cmdHelp() {
        const helpText = `
<span class="highlight">━━━ Commandes disponibles ━━━</span><br><br>
<span class="cmd-name">Navigation:</span><br>
  <span class="highlight">ls</span> ............ Liste les fichiers<br>
  <span class="highlight">cd</span> [dir] ...... Change de répertoire<br><br>
<span class="cmd-name">Fichiers:</span><br>
  <span class="highlight">cat</span> [file] .... Affiche le contenu d'un fichier<br>
  <span class="highlight">clear</span> ......... Efface le terminal (ou Ctrl+L)<br><br>
<span class="cmd-name">Infos:</span><br>
  <span class="highlight">whoami</span> ........ Qui suis-je ?<br>
  <span class="highlight">neofetch</span> ...... Affiche les infos système<br>
  <span class="highlight">date</span> .......... Affiche la date et l'heure<br><br>
<span class="cmd-name">Raccourcis:</span><br>
  <span class="highlight">contact</span> ....... Affiche mes coordonnées<br>
  <span class="highlight">skills</span> ........ Affiche mes compétences<br>
  <span class="highlight">projects</span> ...... Affiche mes projets<br>
  <span class="highlight">social</span> ........ Ouvre mes réseaux sociaux<br><br>
<span class="cmd-name">Fun:</span><br>
  <span class="highlight">echo</span> [msg] .... Affiche un message<br>
  <span class="highlight">matrix</span> ........ 🔴 Pilule rouge...<br>
  <span class="highlight">hack</span> .......... 👨‍💻 Mode hacker<br><br>
<span class="tip">💡 Astuce: Tab pour autocomplétion, ↑↓ pour l'historique</span>
        `;
        this.addOutput(helpText.trim());
    }

    cmdCat(args) {
        if (args.length === 0) {
            this.addOutput('<span class="error">Usage: cat [fichier]</span>');
            return;
        }

        const fileName = args[0];
        let filePath = this.resolvePath(fileName);

        if (!this.fileSystem[filePath]) {
            filePath = `${this.currentPath}/${fileName}`;
        }

        const file = this.fileSystem[filePath];
        if (!file) {
            this.addOutput(`<span class="error">cat: ${fileName}: Fichier non trouvé</span>`);
            return;
        }
        if (file.type === 'dir') {
            this.addOutput(`<span class="error">cat: ${fileName}: Est un répertoire</span>`);
            return;
        }

        this.addOutput(file.content);
    }

    cmdLs(args) {
        const path = args.length > 0 ? this.resolvePath(args[0]) : this.currentPath;
        const dir = this.fileSystem[path];

        if (!dir) {
            this.addOutput(`<span class="error">ls: ${args[0] || path}: Répertoire non trouvé</span>`);
            return;
        }
        if (dir.type !== 'dir') {
            this.addOutput(`<span class="error">ls: ${args[0]}: N'est pas un répertoire</span>`);
            return;
        }

        const items = dir.children.map(child => {
            const fullPath = `${path}/${child}`;
            const item = this.fileSystem[fullPath];
            if (item && item.type === 'dir') {
                return `<span class="dir">${child}/</span>`;
            }
            return `<span class="file">${child}</span>`;
        });

        this.addOutput(items.join('  '), 'ls-output');
    }

    cmdCd() {
        this.addOutput(`<span class="highlight">🤔 Avant d'aller plus loin, il faut d'abord apprendre à se connaître...</span><br><span class="tip">Explorez les fichiers ici avec <span class="highlight">ls</span> et <span class="highlight">cat</span> !</span>`);
    }

    cmdClear() {
        this.output.innerHTML = '';
    }

    cmdWhoami() {
        this.addOutput(`<span class="highlight">Je suis Jérémy Tarlié</span>, un développeur Full Stack de <span class="highlight">France</span> passionné par la création d'expériences web uniques. Vous pouvez me contacter à <span class="highlight">contact@tarlie.fr</span> ou visiter mon site <span class="highlight">tarlie.fr</span> ! 🚀`);
    }

    cmdDate() {
        const now = new Date();
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

        const time = now.toLocaleTimeString('fr-FR', timeOptions);
        const date = now.toLocaleDateString('fr-FR', dateOptions);

        this.addOutput(`<span class="highlight">🕐 Il est ${time}</span> et on est le <span class="highlight">${date}</span>.`);
    }

    cmdEcho(args) {
        if (args.length === 0) {
            this.addOutput('');
            return;
        }
        this.addOutput(this.escapeHtml(args.join(' ')));
    }

    cmdNeofetch() {
        const neofetch = `
<pre class="neofetch">
<span class="cyan">       ██╗████████╗</span>    <span class="highlight">jeremy</span>@<span class="highlight">portfolio</span>
<span class="cyan">       ██║╚══██╔══╝</span>    ─────────────────
<span class="cyan">       ██║   ██║   </span>    <span class="label">OS:</span> Web Browser
<span class="cyan">       ██║   ██║   </span>    <span class="label">Host:</span> tarlie.fr
<span class="cyan">  ██   ██║   ██║   </span>    <span class="label">Kernel:</span> JavaScript ES6+
<span class="cyan">  ╚█████╔╝   ██║   </span>    <span class="label">Shell:</span> Interactive Terminal
<span class="cyan">   ╚════╝    ╚═╝   </span>    <span class="label">Resolution:</span> ${window.innerWidth}x${window.innerHeight}
<span class="cyan">                   </span>    <span class="label">Theme:</span> Cyberpunk Neon
<span class="cyan">                   </span>    <span class="label">Terminal:</span> Custom JS
<span class="cyan">                   </span>    <span class="label">CPU:</span> Your Brain 🧠
<span class="cyan">                   </span>    <span class="label">Memory:</span> ${navigator.deviceMemory || '?'}GB

<span class="color-block cyan">███</span><span class="color-block pink">███</span><span class="color-block purple">███</span><span class="color-block green">███</span><span class="color-block yellow">███</span><span class="color-block orange">███</span>
</pre>
        `;
        this.addOutput(neofetch.trim());
    }

    cmdContact() {
        this.addOutput(`
<span class="highlight">━━━ Contact ━━━</span><br><br>
<span class="output-emoji">📧</span> Email:<br>
   <a href="mailto:contact@tarlie.fr" class="link">contact@tarlie.fr</a><br><br>
<span class="output-emoji">🔗</span> GitHub:<br>
   <a href="https://github.com/Jeremy-Tarlie" target="_blank" class="link">github.com/Jeremy-Tarlie</a><br><br>
<span class="output-emoji">💼</span> LinkedIn:<br>
   <a href="https://www.linkedin.com/in/jeremy-tarlie/" target="_blank" class="link">linkedin.com/in/jeremy-tarlie</a><br><br>
<span class="output-emoji">🌐</span> Website:<br>
   <a href="https://tarlie.fr" target="_blank" class="link">tarlie.fr</a><br><br>
<span class="success">✅ Disponible pour freelance !</span>
        `.trim());
    }

    cmdSkills() {
        this.addOutput(`
<span class="highlight">━━━ Compétences ━━━</span><br><br>
<span class="cmd-name">Frontend:</span><br>
  React, Next.js, Vue.js, HTML5, CSS3, Tailwind, Bootstrap, TypeScript<br><br>
<span class="cmd-name">Backend:</span><br>
  Node.js, Python, FastAPI, PHP, Symfony, Express, Prisma<br><br>
<span class="cmd-name">Base de données:</span><br>
  MySQL, PostgreSQL, MongoDB, SQLite<br><br>
<span class="cmd-name">Data Science / IA:</span><br>
  Pandas, NumPy, Matplotlib, Seaborn, TensorFlow, OpenAI API<br><br>
<span class="cmd-name">Outils:</span><br>
  Git, Docker, VS Code, Figma, Linux, CI/CD, Electron.js
        `.trim());
    }

    cmdProjects() {
        this.addOutput(`
<span class="highlight">━━━ Projets ━━━</span><br><br>
<span class="output-emoji">🌐</span> <span class="highlight">Portfolio Cyberpunk</span><br>
   HTML/CSS/JS<br><br>
<span class="output-emoji">🛒</span> <span class="highlight">E-Commerce Platform</span><br>
   React/Node.js<br><br>
<span class="output-emoji">📱</span> <span class="highlight">Task Manager App</span><br>
   Next.js/Prisma<br><br>
<span class="output-emoji">⚡</span> <span class="highlight">REST API</span><br>
   Node.js/MongoDB
        `.trim());
    }

    cmdSocial() {
        this.addOutput(`
            <span class="highlight">Ouverture des réseaux sociaux...</span> <br>
        `);
        setTimeout(() => {
            window.open('https://github.com/Jeremy-Tarlie', '_blank');
        }, 500);
        setTimeout(() => {
            window.open('https://linkedin.com/in/jeremy-tarlie', '_blank');
        }, 1000);
        this.addOutput(`
            <span class="highlight">Réseaux sociaux ouverts !</span> <br>
        `);
    }

    cmdSecret() {
        this.addOutput(`
<span class="rainbow">🎉 Félicitations ! Vous avez trouvé le secret ! 🎉</span><br>
<span class="highlight">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span><br>
Vous êtes un vrai explorateur !<br>
Merci d'avoir pris le temps de découvrir ce terminal.<br>
<span class="highlight">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
        `.trim());

        if (window.easterEggs && window.easterEggs.discoverEgg) {
            window.easterEggs.discoverEgg('terminal');
        }
    }

    cmdMatrix() {
        this.addOutput(`<span class="matrix-text">Wake up, Neo...</span>`);
        setTimeout(() => {
            this.addOutput(`<span class="matrix-text">The Matrix has you...</span>`);
        }, 1000);
        setTimeout(() => {
            this.addOutput(`<span class="matrix-text">Follow the white rabbit. 🐰</span>`);
        }, 2000);
        setTimeout(() => {
            document.body.classList.add('matrix-mode');
            setTimeout(() => {
                document.body.classList.remove('matrix-mode');
            }, 5000);
        }, 3000);
    }

    cmdHack() {
        const hackLines = [
            'Initialisation du protocole...',
            'Connexion au serveur distant...',
            'Bypass du firewall...',
            'Injection SQL en cours...',
            'Décryptage des données...',
            'Accès root obtenu !',
            '',
            'C\'est juste une blague ! Je suis un développeur éthique !'
        ];

        let delay = 0;
        hackLines.forEach((line) => {
            setTimeout(() => {
                this.addOutput(`<span class="hack-text">${line}</span>`);
                this.scrollToBottom();
            }, delay);
            delay += 400;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.interactiveTerminal = new InteractiveTerminal('aboutTerminal');
});
