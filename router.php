<?php
declare(strict_types=1);

/**
 * Routeur pour `php -S localhost:8080 router.php`
 * (Apache utilise .htaccess en production.)
 */
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/');

$routes = [
    '/univers' => 'univers.php',
    '/univers/' => 'univers.php',
    '/templates' => 'templates.php',
    '/templates/' => 'templates.php',
    '/contact' => 'contact.php',
    '/contact/' => 'contact.php',
    '/cv' => 'cv.php',
    '/cv/' => 'cv.php',
];

if (isset($routes[$uri])) {
    require __DIR__ . '/' . $routes[$uri];
    return true;
}

if ($uri === '/index.html') {
    header('Location: /', true, 301);
    return true;
}

$file = __DIR__ . $uri;
if ($uri !== '/' && is_file($file)) {
    return false;
}

require __DIR__ . '/index.php';
return true;
