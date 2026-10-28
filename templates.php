<?php
declare(strict_types=1);

$navCurrent = 'templates';
$pageTitle = 'Templates · Jérémy Tarlié';
$pageDescription = 'Modèles de sites et d’interfaces — bientôt disponibles.';
$canonical = 'https://tarlie.fr/templates';
$bodyClass = '';

require __DIR__ . '/includes/home-bootstrap.php';
require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/home-nav.php';
?>
<main>
  <div class="wrap">
    <div class="page-hero">
      <h1 class="anim-fade-up">Templates</h1>
      <p class="lead anim-fade-up" style="--anim-delay:.1s">Des modèles de sites et d’interfaces prêts à adapter.</p>
    </div>
    <div class="coming-soon anim-fade-up" style="--anim-delay:.15s">
      <strong>Bientôt</strong>
      <p>Cette page accueillera mes templates. Revenez un peu plus tard ou écrivez-moi.</p>
      <p style="margin-top:1.2rem">
        <a class="btn pri" href="/contact">Me contacter</a>
      </p>
    </div>
  </div>
</main>
<?php
require __DIR__ . '/includes/home-footer.php';
require __DIR__ . '/includes/layout-foot.php';
