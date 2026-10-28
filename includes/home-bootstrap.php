<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

$themeColor = $themeColor ?? '#fbf3e9';
$colorScheme = 'light';
$cssVersion = '2026-10-28-home3';
$extraHead = ($extraHead ?? '') . '
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Figtree:wght@400;500;600&family=Chakra+Petch:wght@500;700&family=Orbitron:wght@500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="' . asset('assets/css/home.css') . '?v=' . $cssVersion . '">
';

$scripts = $scripts ?? [
    asset('assets/js/home.js') . '?v=' . $cssVersion,
];
