<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/config.php';

$pageTitle = 'Univers · Jérémy Tarlié | Développeur Full Stack';
$pageDescription = 'Univers cyberpunk du portfolio de Jérémy Tarlié — projets, terminal interactif, compétences et easter eggs.';
$canonical = 'https://tarlie.fr/univers';
$themeColor = '#0a0a0f';
$colorScheme = 'dark';
$bodyClass = 'portal-void';

// Indice de perf avant le premier rendu (affiné ensuite par utils.js)
$extraHead = '
<script>
(function () {
    try {
        var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var cores = navigator.hardwareConcurrency || 4;
        var mem = navigator.deviceMemory || 8;
        var saveData = navigator.connection && navigator.connection.saveData;
        var coarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        var tier = "high";
        if (reduced || saveData || cores <= 2 || mem <= 2) tier = "low";
        else if (coarse || (cores <= 4 && mem <= 4)) tier = "medium";
        document.documentElement.classList.add(tier + "-perf");
    } catch (e) {
        document.documentElement.classList.add("low-perf");
    }
})();
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="' . asset('assets/css/variables.css') . '">
<link rel="stylesheet" href="' . asset('assets/css/base.css') . '">
<link rel="stylesheet" href="' . asset('assets/css/cursor.css') . '">
<link rel="stylesheet" href="' . asset('assets/css/backgrounds.css') . '">
<link rel="stylesheet" href="' . asset('assets/css/navigation.css') . '?v=vol-4">
<link rel="stylesheet" href="' . asset('assets/css/components.css') . '">
<link rel="stylesheet" href="' . asset('assets/css/hero.css') . '">
<link rel="stylesheet" href="' . asset('assets/css/sections.css') . '?v=reveal-300">
<link rel="stylesheet" href="' . asset('assets/css/about.css') . '">
<link rel="stylesheet" href="' . asset('assets/css/projects.css') . '">
<link rel="stylesheet" href="' . asset('assets/css/skills.css') . '">
<link rel="stylesheet" href="' . asset('assets/css/contact.css') . '">
<link rel="stylesheet" href="' . asset('assets/css/footer.css') . '">
<link rel="stylesheet" href="' . asset('assets/css/easter-eggs.css') . '">
<link rel="stylesheet" href="' . asset('assets/css/projects-modal.css') . '">
<link rel="stylesheet" href="' . asset('assets/css/gate.css') . '?v=boot-6">
<link rel="stylesheet" href="' . asset('assets/css/responsive.css') . '">
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
';

$jsonLd = json_encode([
    '@context' => 'https://schema.org',
    '@type' => 'WebPage',
    'name' => 'Univers — Portfolio Jérémy Tarlié',
    'url' => 'https://tarlie.fr/univers',
    'isPartOf' => ['@id' => 'https://tarlie.fr/#website'],
    'about' => ['@id' => 'https://tarlie.fr/#person'],
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP);

$scripts = [
    asset('assets/js/utils.js') . '?v=2026-10-28-perf',
    asset('assets/js/cursor.js') . '?v=2026-10-27',
    asset('assets/js/particles.js') . '?v=2026-10-27',
    asset('assets/js/navigation.js') . '?v=2026-10-27',
    asset('assets/js/animations.js') . '?v=2026-10-27',
    asset('assets/js/contact-form.js') . '?v=2026-10-27',
    asset('assets/js/components.js') . '?v=2026-10-27',
    asset('assets/js/audio.js') . '?v=2026-10-28-vol3',
    asset('assets/js/terminal.js') . '?v=2026-10-27',
    asset('assets/js/projects.js') . '?v=2026-10-27',
    asset('assets/js/easter-eggs.js') . '?v=2026-10-27',
    asset('assets/js/gate.js') . '?v=2026-10-28-boot3',
    asset('assets/js/main.js') . '?v=2026-10-28-boot3',
];

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/universe-body.php';
require __DIR__ . '/includes/layout-foot.php';
