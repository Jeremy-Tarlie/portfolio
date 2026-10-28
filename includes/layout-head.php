<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

$pageTitle = $pageTitle ?? 'Jérémy Tarlié · Développeur Full-Stack & IA';
$pageDescription = $pageDescription ?? 'Jérémy Tarlié, développeur Full Stack en France. React, Next.js, Node.js, PHP, Python. Ouvert CDI, freelance et télétravail.';
$canonical = $canonical ?? 'https://tarlie.fr/';
$themeColor = $themeColor ?? '#fbf3e9';
$colorScheme = $colorScheme ?? 'light dark';
$ogImage = $ogImage ?? 'https://tarlie.fr/assets/img/avatar.webp';
$bodyClass = $bodyClass ?? '';
$extraHead = $extraHead ?? '';
$jsonLd = $jsonLd ?? '';
$perfHint = $perfHint ?? false;
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
<meta name="description" content="<?= htmlspecialchars($pageDescription, ENT_QUOTES, 'UTF-8') ?>">
<meta name="author" content="Jérémy Tarlié">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="language" content="fr">
<link rel="canonical" href="<?= htmlspecialchars($canonical, ENT_QUOTES, 'UTF-8') ?>">
<link rel="alternate" hreflang="fr" href="<?= htmlspecialchars($canonical, ENT_QUOTES, 'UTF-8') ?>">
<link rel="alternate" hreflang="x-default" href="https://tarlie.fr/">

<meta name="geo.region" content="FR">
<meta name="geo.placename" content="France">
<meta name="coverage" content="France">

<meta property="og:type" content="profile">
<meta property="og:url" content="<?= htmlspecialchars($canonical, ENT_QUOTES, 'UTF-8') ?>">
<meta property="og:title" content="<?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?>">
<meta property="og:description" content="<?= htmlspecialchars($pageDescription, ENT_QUOTES, 'UTF-8') ?>">
<meta property="og:image" content="<?= htmlspecialchars($ogImage, ENT_QUOTES, 'UTF-8') ?>">
<meta property="og:image:alt" content="Portrait de Jérémy Tarlié, développeur Full Stack">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Portfolio Jérémy Tarlié">
<meta property="profile:first_name" content="Jérémy">
<meta property="profile:last_name" content="Tarlié">

<meta name="twitter:card" content="summary">
<meta name="twitter:url" content="<?= htmlspecialchars($canonical, ENT_QUOTES, 'UTF-8') ?>">
<meta name="twitter:title" content="<?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?>">
<meta name="twitter:description" content="<?= htmlspecialchars($pageDescription, ENT_QUOTES, 'UTF-8') ?>">
<meta name="twitter:image" content="<?= htmlspecialchars($ogImage, ENT_QUOTES, 'UTF-8') ?>">

<link rel="icon" type="image/png" sizes="32x32" href="<?= asset('assets/img/favicon-32x32.png') ?>">
<link rel="icon" type="image/png" sizes="16x16" href="<?= asset('assets/img/favicon-16x16.png') ?>">
<link rel="apple-touch-icon" sizes="180x180" href="<?= asset('assets/img/avatar.webp') ?>">
<link rel="manifest" href="<?= asset('site.webmanifest') ?>">
<meta name="theme-color" content="<?= htmlspecialchars($themeColor, ENT_QUOTES, 'UTF-8') ?>">
<meta name="color-scheme" content="<?= htmlspecialchars($colorScheme, ENT_QUOTES, 'UTF-8') ?>">

<?php if ($perfHint): ?>
<script>
(function () {
    try {
        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var cores = navigator.hardwareConcurrency || 4;
        var mem = navigator.deviceMemory || 8;
        var saveData = navigator.connection && navigator.connection.saveData;
        var coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        var small = Math.min(window.innerWidth, window.innerHeight) < 700;
        var tier = 'high';
        if (reduced || saveData || cores <= 2 || mem <= 2) tier = 'low';
        else if (coarse || (cores <= 4 && mem <= 4) || (cores <= 6 && small)) tier = 'medium';
        document.documentElement.classList.add(tier + '-perf');
    } catch (e) {
        document.documentElement.classList.add('low-perf');
    }
})();
</script>
<?php endif; ?>

<?= $extraHead ?>

<?php if ($jsonLd !== ''): ?>
<script type="application/ld+json"><?= $jsonLd ?></script>
<?php endif; ?>
</head>
<body<?= $bodyClass !== '' ? ' class="' . htmlspecialchars($bodyClass, ENT_QUOTES, 'UTF-8') . '"' : '' ?>>
