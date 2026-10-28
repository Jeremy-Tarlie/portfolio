<?php
declare(strict_types=1);

$scripts = $scripts ?? [];
foreach ($scripts as $src):
    $srcAttr = htmlspecialchars((string) $src, ENT_QUOTES, 'UTF-8');
?>
<script defer src="<?= $srcAttr ?>"></script>
<?php endforeach; ?>
</body>
</html>
