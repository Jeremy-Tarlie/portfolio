<?php
declare(strict_types=1);

$navCurrent = 'contact';
$pageTitle = 'Contact · Jérémy Tarlié';
$pageDescription = 'Une opportunité, une mission ou une question : contact@tarlie.fr — réponse sous 24 h.';
$canonical = 'https://tarlie.fr/contact';
$bodyClass = '';

require __DIR__ . '/includes/home-bootstrap.php';

$scripts = [
    asset('assets/js/contact-form.js') . '?v=' . $cssVersion,
    asset('assets/js/home.js') . '?v=' . $cssVersion,
];

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/home-nav.php';
?>
<main>
  <div class="wrap">
    <div class="page-hero">
      <h1 class="anim-fade-up">Parlons-en</h1>
      <p class="lead anim-fade-up" style="--anim-delay:.1s">Une opportunité, une mission ou une simple question : je réponds sous 24 h.</p>
      <a class="mail anim-fade-up" style="--anim-delay:.2s" href="mailto:contact@tarlie.fr">contact@tarlie.fr</a>
    </div>
    <?php
    $formId = 'pageContactForm';
    $formClass = 'home-form anim-fade-up';
    $idPrefix = 'contact';
    require __DIR__ . '/includes/contact-form.php';
    ?>
  </div>
</main>
<?php
require __DIR__ . '/includes/home-footer.php';
require __DIR__ . '/includes/layout-foot.php';
