<?php
declare(strict_types=1);

/**
 * Chemin racine absolu pour les assets (nécessaire avec /univers).
 */
function asset(string $path): string
{
    return '/' . ltrim($path, '/');
}
