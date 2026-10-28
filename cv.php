<?php
declare(strict_types=1);

$pdfPath = __DIR__ . '/assets/file/CV_TARLIE_JEREMY.pdf';
$downloadName = 'CV_TARLIE_JEREMY.pdf';

if (!is_file($pdfPath) || !is_readable($pdfPath)) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'CV introuvable.';
    exit;
}

$size = filesize($pdfPath);
if ($size === false) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Impossible de lire le CV.';
    exit;
}

$disposition = (isset($_GET['download']) && $_GET['download'] === '1')
    ? 'attachment'
    : 'inline';

header('Content-Type: application/pdf');
header('Content-Length: ' . (string) $size);
header('Content-Disposition: ' . $disposition . '; filename="' . $downloadName . '"');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: public, max-age=86400');

readfile($pdfPath);
exit;
