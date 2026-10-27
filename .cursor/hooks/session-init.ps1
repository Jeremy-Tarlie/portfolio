$ErrorActionPreference = 'Stop'
[void][Console]::In.ReadToEnd()
$root = $Env:CURSOR_PROJECT_DIR
if ($root) { Set-Location $root }

$ctx = "Projet : $(Split-Path -Leaf (Get-Location))."
if (Test-Path 'package.json')   { $ctx += ' Stack JS/TS.' }
if (Test-Path 'pyproject.toml') { $ctx += ' Stack Python.' }
if (Test-Path 'uv.lock')        { $ctx += ' Gestionnaire uv.' }
if ((Test-Path 'docker-compose.yml') -or (Test-Path 'compose.yml')) { $ctx += ' Docker Compose present.' }
if (Test-Path '.env.example')   { $ctx += ' .env.example present (ne jamais lire .env).' }
$ctx += ' Suis le workflow en phases. Presente un plan avant d ecrire du code.'

@{ additional_context = $ctx } | ConvertTo-Json -Compress
exit 0