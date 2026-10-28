<?php
declare(strict_types=1);

$navCurrent = 'home';
$pageTitle = 'Jérémy Tarlié · Développeur Full-Stack & IA';
$pageDescription = 'Je conçois des applications web qui intègrent du Machine Learning et de l’automatisation, avec des architectures rapides, sûres et faciles à faire évoluer.';
$canonical = 'https://tarlie.fr/';
$bodyClass = '';

require __DIR__ . '/includes/home-bootstrap.php';

$jsonLd = json_encode([
    '@context' => 'https://schema.org',
    '@graph' => [
        [
            '@type' => 'WebSite',
            '@id' => 'https://tarlie.fr/#website',
            'url' => 'https://tarlie.fr/',
            'name' => 'Portfolio Jérémy Tarlié',
            'description' => 'Portfolio de Jérémy Tarlié, développeur Full Stack & IA en France.',
            'inLanguage' => 'fr-FR',
            'publisher' => ['@id' => 'https://tarlie.fr/#person'],
        ],
        [
            '@type' => 'Person',
            '@id' => 'https://tarlie.fr/#person',
            'name' => 'Jérémy Tarlié',
            'url' => 'https://tarlie.fr/',
            'image' => [
                '@type' => 'ImageObject',
                'url' => 'https://tarlie.fr/assets/img/avatar.webp',
                'caption' => 'Jérémy Tarlié, développeur Full Stack',
            ],
            'jobTitle' => 'Développeur Full-Stack & Expert en Intelligence Artificielle',
            'email' => 'mailto:contact@tarlie.fr',
            'nationality' => 'FR',
            'sameAs' => [
                'https://github.com/Jeremy-Tarlie',
                'https://www.linkedin.com/in/jeremy-tarlie/',
            ],
        ],
    ],
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP);

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/home-nav.php';
?>
<main>
  <div class="wrap">
    <div class="hero">
      <p class="avail"><i></i>Disponible en CDI et en freelance</p>
      <h1>Jérémy Tarlié</h1>
      <p class="role">Développeur Full-Stack &amp; Expert en Intelligence Artificielle</p>
      <p class="pitch">Je conçois des applications web qui intègrent du Machine Learning et de l’automatisation, avec des architectures rapides, sûres et faciles à faire évoluer.</p>
      <div class="links">
        <a class="btn pri" href="/cv" target="_blank" rel="noopener noreferrer">Télécharger mon CV</a>
        <a class="btn sec" href="https://www.linkedin.com/in/jeremy-tarlie/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a class="btn sec" href="https://github.com/Jeremy-Tarlie" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a class="btn sec" href="/contact">Écrire un message</a>
      </div>
      <ul class="facts">
        <li><b>3 ans</b> d’expérience</li>
        <li><b>15+</b> projets livrés</li>
        <li><b>Master</b> Web &amp; IA (Bac+5)</li>
        <li>Télétravail possible, réponse sous 24 h</li>
      </ul>
    </div>

    <div class="portal-wrap">
      <a href="/univers" class="portal" id="enter-universe">
        <span class="portal-frame" aria-hidden="true"></span>
        <span class="portal-corners" aria-hidden="true"></span>
        <span class="portal-scan" aria-hidden="true"></span>
        <span class="portal-tag">JT_OS // PORTAL</span>
        <small>Envie de voir autre chose ?</small>
        <strong>Entrer dans mon univers</strong>
        <span class="portal-status" aria-hidden="true">status: OPEN_TO_WORK = true</span>
        <span class="go" aria-hidden="true">›</span>
      </a>
    </div>

    <section id="parcours">
      <h2>Mon parcours</h2>
      <p class="lead">Trois ans à construire des applications utiles, de l’agence web à l’intégration d’IA dans des outils métier.</p>
      <h3>Expérience</h3>
      <ol class="tl">
        <li>
          <div class="top"><div><span class="t">Développeur Web &amp; IA</span> · <span class="o">Romain Piveteau</span></div><time>2024 – 2026</time></div>
          <ul><li>Solutions web intégrant Machine Learning et automatisation</li><li>Architectures performantes, sécurisées et optimisées</li><li>Briques d’IA intégrées dans des applications métier</li></ul>
        </li>
        <li>
          <div class="top"><div><span class="t">Concepteur Développeur d’Applications Web</span> · <span class="o">Myreklam</span></div><time>2023 – 2024</time></div>
          <ul><li>Applications web sur mesure, de l’analyse du besoin au développement agile en équipe</li><li>Modèles d’IA pour automatiser des processus métier</li><li>Optimisation des performances et renforcement de la sécurité</li></ul>
        </li>
        <li>
          <div class="top"><div><span class="t">Développeur Web</span> · <span class="o">Oxygène</span></div><time>Mai – juillet 2021</time></div>
          <ul><li>Site vitrine et intranet développés en autonomie (HTML, CSS, JavaScript, PHP, MariaDB)</li></ul>
        </li>
      </ol>

      <h3>Formation</h3>
      <div class="grid">
        <div class="card"><time>2026</time><b>Master Expert en Développement Web et IA</b><span>Nexa, Nantes · Bac+5</span></div>
        <div class="card"><time>2024</time><b>Concepteur Développeur d’Applications</b><span>Nexa, Nantes · Bac+3</span></div>
        <div class="card"><time>2021</time><b>Formation Développeur Web</b><span>WebForce3, Dieppe · Bac+2</span></div>
        <div class="card"><time>2017</time><b>Bac STI2D</b><span>Lycée Pablo Neruda, Dieppe</span></div>
      </div>
      <h3>Certification</h3>
      <div class="grid">
        <div class="card"><time>2026</time><b>Préparation AWS Certified Solutions Architect – Associate</b><span>Coursera / Amazon Web Services</span>
          <a href="https://coursera.org/share/d6f4bd2ce807ebd699fa4799bcd788b2" target="_blank" rel="noopener noreferrer">Voir le certificat</a></div>
      </div>
    </section>

    <section id="competences">
      <h2>Mes compétences</h2>
      <p class="lead">L’essentiel en un coup d’œil. Ouvrez une carte pour voir le détail.</p>
      <div class="skills" id="skills"></div>
    </section>
  </div>
</main>
<?php
require __DIR__ . '/includes/home-footer.php';
require __DIR__ . '/includes/layout-foot.php';
