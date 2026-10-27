$ErrorActionPreference = 'Stop'
$raw = [Console]::In.ReadToEnd()
try { $in = $raw | ConvertFrom-Json } catch { '{"permission":"allow"}'; exit 0 }
$file = [string]$in.file_path

# Autoriser explicitement .env.example
if ($file -match '\.env\.example$') { '{"permission":"allow"}'; exit 0 }

# Bloquer les fichiers sensibles
if ($file -match '(^|[\\/])\.env($|\.)|\.envrc$|\.pem$|\.key$|\.p12$|credentials.*\.json$|secrets?\.') {
  '{"permission":"deny","user_message":"Lecture bloquee : fichier sensible (.env/cle/secret). Seul .env.example est autorise."}'
  exit 0
}
'{"permission":"allow"}'
exit 0