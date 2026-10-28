<?php
declare(strict_types=1);

$navCurrent = $navCurrent ?? 'home';
$skillsHref = $navCurrent === 'home' ? '#competences' : '/#competences';
?>
<header>
  <div class="wrap">
    <a href="/" class="logo" id="logo" aria-label="Jérémy Tarlié, retour à l’accueil"><span>J</span><span>T</span></a>
    <nav aria-label="Navigation principale">
      <a href="/"<?= $navCurrent === 'home' ? ' aria-current="page"' : '' ?>>Accueil</a>
      <a href="<?= htmlspecialchars($skillsHref, ENT_QUOTES, 'UTF-8') ?>">Mes compétences</a>
      <a href="/templates"<?= $navCurrent === 'templates' ? ' aria-current="page"' : '' ?>>Templates</a>
      <a href="/contact"<?= $navCurrent === 'contact' ? ' aria-current="page"' : '' ?>>Contact</a>
    </nav>
  </div>
</header>
