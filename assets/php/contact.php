<?php
// Session for CSRF
session_start();

// Basic security headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

define('TO_EMAIL', 'contact@tarlie.fr');
define('SITE_NAME', 'Portfolio');
define('RATE_LIMIT_REQUESTS', 5);
define('RATE_LIMIT_WINDOW', 3600);
define('LOG_FILE', __DIR__ . '/contact_log.txt');

function generateCSRFToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        $_SESSION['csrf_token_time'] = time();
    }
    return $_SESSION['csrf_token'];
}

function verifyCSRFToken($token) {
    if (empty($_SESSION['csrf_token']) || empty($token)) return false;
    if (time() - ($_SESSION['csrf_token_time'] ?? 0) > 3600) {
        unset($_SESSION['csrf_token'], $_SESSION['csrf_token_time']);
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

function checkRateLimit($ip) {
    $rateLimitFile = sys_get_temp_dir() . '/contact_ratelimit_' . md5($ip) . '.json';
    $data = ['count' => 0, 'first_request' => time()];
    if (file_exists($rateLimitFile)) {
        $data = json_decode(file_get_contents($rateLimitFile), true) ?: $data;
        if (time() - $data['first_request'] > RATE_LIMIT_WINDOW) {
            $data = ['count' => 0, 'first_request' => time()];
        }
    }
    if ($data['count'] >= RATE_LIMIT_REQUESTS) return false;
    $data['count']++;
    file_put_contents($rateLimitFile, json_encode($data));
    return true;
}

function sanitizeInput($input, $maxLength = 500) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    if (strlen($input) > $maxLength) $input = substr($input, 0, $maxLength);
    return $input;
}

function hasHeaderInjection($str) {
    return preg_match('/[\r\n]/', $str) || 
           stripos($str, 'Content-Type:') !== false ||
           stripos($str, 'MIME-Version:') !== false ||
           stripos($str, 'Content-Transfer-Encoding:') !== false ||
           stripos($str, 'bcc:') !== false ||
           stripos($str, 'cc:') !== false;
}

function logActivity($message, $ip) {
    $logEntry = date('Y-m-d H:i:s') . " | IP: $ip | $message\n";
    @file_put_contents(LOG_FILE, $logEntry, FILE_APPEND | LOCK_EX);
}

function jsonResponse($success, $message, $code = 200) {
    http_response_code($code);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['csrf'])) {
    echo json_encode(['csrf_token' => generateCSRFToken()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Méthode non autorisée', 405);
}

$clientIP = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['HTTP_X_REAL_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$clientIP = filter_var($clientIP, FILTER_VALIDATE_IP) ?: 'unknown';

if (!checkRateLimit($clientIP)) {
    logActivity('Rate limit exceeded', $clientIP);
    jsonResponse(false, 'Trop de requêtes. Veuillez réessayer dans une heure.', 429);
}

$csrfToken = $_POST['csrf_token'] ?? '';
if (!verifyCSRFToken($csrfToken)) {
    logActivity('Invalid CSRF token', $clientIP);
    jsonResponse(false, 'Session expirée. Veuillez rafraîchir la page et réessayer.', 403);
}

if (!empty($_POST['website'])) {
    logActivity('Honeypot triggered', $clientIP);
    jsonResponse(false, 'Erreur de validation', 400);
}

$formLoadTime = $_POST['_timestamp'] ?? 0;
if ($formLoadTime && (time() - intval($formLoadTime)) < 3) {
    logActivity('Form submitted too fast', $clientIP);
    jsonResponse(false, 'Erreur de validation', 400);
}

$name = sanitizeInput($_POST['name'] ?? '', 100);
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$subject = sanitizeInput($_POST['subject'] ?? '', 50);
$message = sanitizeInput($_POST['message'] ?? '', 5000);

$errors = [];

if (empty($name) || strlen($name) < 2) $errors[] = 'Le nom est requis (minimum 2 caractères)';
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Une adresse email valide est requise';

$disposableDomains = ['tempmail.com', 'throwaway.com', 'mailinator.com', 'guerrillamail.com', 'temp-mail.org'];
$emailDomain = strtolower(substr(strrchr($email, "@"), 1));
if (in_array($emailDomain, $disposableDomains)) $errors[] = 'Les adresses email temporaires ne sont pas acceptées';

if (empty($message) || strlen($message) < 10) $errors[] = 'Le message est requis (minimum 10 caractères)';
if (strlen($message) > 5000) $errors[] = 'Le message est trop long (max 5000 caractères)';

if (hasHeaderInjection($name) || hasHeaderInjection($email)) {
    logActivity('Header injection attempt', $clientIP);
    $errors[] = 'Caractères non autorisés détectés';
}

if (!empty($errors)) {
    jsonResponse(false, implode(', ', $errors), 400);
}

$subjects = [
    'project' => 'Nouveau projet',
    'collaboration' => 'Collaboration',
    'job' => 'Opportunité d\'emploi',
    'other' => 'Autre'
];
$subject_text = $subjects[$subject] ?? 'Contact';

$email_subject = "[" . SITE_NAME . "] $subject_text";

$email_body_text = "Nouveau message depuis le portfolio\n\n";
$email_body_text .= "Nom: $name\n";
$email_body_text .= "Email: $email\n";
$email_body_text .= "Sujet: $subject_text\n";
$email_body_text .= "Message:\n$message\n\n";
$email_body_text .= "---\nIP: $clientIP\n";
$email_body_text .= "Date: " . date('d/m/Y à H:i:s');

$email_body_html = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { background-color: #050508; font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #00f0ff, #ff00aa); padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #00f0ff; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
        .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #00f0ff; word-wrap: break-word; }
        .message-box { white-space: pre-wrap; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .meta { font-size: 11px; color: #999; margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>📧 Nouveau message</h1>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Nom</div>
                <div class='value'>" . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . "</div>
            </div>
            <div class='field'>
                <div class='label'>Email</div>
                <div class='value'><a href='mailto:" . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . "'>" . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . "</a></div>
            </div>
            <div class='field'>
                <div class='label'>Sujet</div>
                <div class='value'>" . htmlspecialchars($subject_text, ENT_QUOTES, 'UTF-8') . "</div>
            </div>
            <div class='field'>
                <div class='label'>Message</div>
                <div class='value message-box'>" . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . "</div>
            </div>
            <div class='meta'>
                IP: $clientIP | Envoyé le " . date('d/m/Y à H:i:s') . "
            </div>
        </div>
        <div class='footer'>
            Message envoyé depuis le portfolio
        </div>
    </div>
</body>
</html>
";

$boundary = md5(time());

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    'From: ' . SITE_NAME . ' <noreply@tarlie.fr>',
    'Reply-To: ' . str_replace(["\r", "\n"], '', $name) . ' <' . str_replace(["\r", "\n"], '', $email) . '>',
    'X-Mailer: Portfolio Contact Form',
    'X-Priority: 3',
    'X-Originating-IP: ' . $clientIP
];

$email_body = "--$boundary\r\n";
$email_body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$email_body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$email_body .= $email_body_text . "\r\n\r\n";
$email_body .= "--$boundary\r\n";
$email_body .= "Content-Type: text/html; charset=UTF-8\r\n";
$email_body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$email_body .= $email_body_html . "\r\n\r\n";
$email_body .= "--$boundary--";

$mail_sent = @mail(TO_EMAIL, $email_subject, $email_body, implode("\r\n", $headers));

if ($mail_sent) {
    unset($_SESSION['csrf_token'], $_SESSION['csrf_token_time']);
    logActivity("Message sent successfully from $name <$email>", $clientIP);
    jsonResponse(true, 'Votre message a été envoyé avec succès ! Je vous répondrai dans les plus brefs délais.');
} else {
    logActivity("Failed to send message from $name <$email>", $clientIP);
    jsonResponse(false, 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer ou me contacter directement par email.', 500);
}
