const SKILLS = [
    ['Front-end', ['React', 'Next.js', 'TypeScript'], 'Des interfaces réactives, accessibles et soignées, du prototype Figma à la production.', ['JavaScript', 'Vue.js', 'React Native', 'Tailwind CSS', 'Bootstrap', 'SASS', 'Responsive design']],
    ['Back-end', ['Node.js', 'Python', 'PHP'], 'Des API solides et sécurisées, avec l’authentification et la logique métier qui vont avec.', ['Express', 'FastAPI', 'Symfony', 'Java / Spring Boot', 'Prisma', 'REST', 'GraphQL', 'JWT', 'Electron.js']],
    ['Data & IA', ['Machine Learning', 'LLM / NLP', 'Python'], 'Du modèle à l’application : j’intègre l’IA là où elle fait gagner du temps.', ['Deep Learning', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'OpenAI API']],
    ['Bases de données', ['PostgreSQL', 'MySQL', 'MongoDB'], 'Modélisation, requêtes et choix du bon moteur selon le besoin.', ['MariaDB', 'SQLite']],
    ['DevOps & cloud', ['Docker', 'CI/CD', 'AWS'], 'Déploiements automatisés et infrastructures fiables, avec une préparation à la certification AWS.', ['Git / GitHub', 'GitHub Actions', 'GCP', 'Linux', 'Vercel', 'Netlify']],
    ['Méthodes & outils', ['Agile / Scrum', 'OWASP', 'Figma'], 'Une façon de travailler claire, en équipe, avec la sécurité en tête dès la conception.', ['Kanban', 'Microservices', 'SEO technique', 'VS Code', 'Cursor', 'Claude', 'Postman']],
    ['Qualités humaines', ['Autonomie', 'Rigueur', 'Communication'], 'Curieux, à l’écoute et à l’aise en équipe comme en autonomie.', ['Adaptabilité', 'Écoute active', 'Résolution de problèmes', 'Gestion du temps', 'Apprentissage continu']],
    ['Langues', ['Français', 'Anglais'], 'Français langue maternelle, anglais technique (B1).', []]
];

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function initHomeSkills() {
    const root = document.getElementById('skills');
    if (!root) return;

    SKILLS.forEach(([name, top, txt, more], i) => {
        const c = document.createElement('div');
        c.className = 'skill';
        const moreChips = more.length
            ? `<ul class="chips">${more.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>`
            : '<div style="height:1.2rem"></div>';
        c.innerHTML = `<button type="button" aria-expanded="false" aria-controls="m${i}"><span class="head"><span class="skill-title">${escapeHtml(name)}</span><span class="plus" aria-hidden="true">+</span></span><ul class="chips">${top.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul></button><div class="more" id="m${i}" hidden><div><p>${escapeHtml(txt)}</p>${moreChips}</div></div>`;
        const b = c.querySelector('button');
        const panel = c.querySelector('.more');
        b.addEventListener('click', () => {
            const o = c.classList.toggle('open');
            b.setAttribute('aria-expanded', String(o));
            if (panel) {
                if (o) panel.removeAttribute('hidden');
                else panel.setAttribute('hidden', '');
            }
        });
        root.appendChild(c);
    });
}

function playLogoPop(logo) {
    logo.classList.remove('pop', 'logo-ready', 'logo-enter');
    void logo.offsetWidth;
    logo.classList.add('pop');
    window.setTimeout(() => {
        logo.classList.remove('pop');
        logo.classList.add('logo-ready');
    }, 520);
}

function initHomeLogo() {
    const logo = document.getElementById('logo');
    if (!logo) return;

    logo.classList.add('logo-enter');
    const onEnterEnd = (event) => {
        if (event.animationName !== 'logo-enter') return;
        logo.classList.remove('logo-enter');
        logo.classList.add('logo-ready');
        logo.removeEventListener('animationend', onEnterEnd);
    };
    logo.addEventListener('animationend', onEnterEnd);

    logo.addEventListener('click', (e) => {
        const onHome = window.location.pathname === '/' || window.location.pathname.endsWith('/index.php');
        if (onHome) {
            e.preventDefault();
            playLogoPop(logo);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        playLogoPop(logo);
    });
}

function initPortalLeave() {
    const portal = document.getElementById('enter-universe');
    if (!portal) return;

    portal.addEventListener('click', (event) => {
        const href = portal.getAttribute('href') || '/univers';
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || portal.target === '_blank') {
            return;
        }

        event.preventDefault();
        if (document.body.classList.contains('portal-leaving')) return;

        document.body.classList.add('portal-leaving');
        portal.setAttribute('aria-busy', 'true');

        const delay = 720;
        window.setTimeout(() => {
            window.location.href = href;
        }, delay);
    });
}

function initPageAnimations() {
    const els = document.querySelectorAll('.anim-fade-up');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });
    els.forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
    initHomeSkills();
    initHomeLogo();
    initPortalLeave();
    if (typeof initContactForm === 'function') {
        initContactForm();
    }
    initPageAnimations();
});
