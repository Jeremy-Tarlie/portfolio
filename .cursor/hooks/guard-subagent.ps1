$ErrorActionPreference = 'Stop'
$raw = [Console]::In.ReadToEnd()
try { $in = $raw | ConvertFrom-Json } catch { '{"permission":"allow"}'; exit 0 }
$task = ([string]$in.task).ToLower()

# Empeche le lancement DIRECT des sous-agents internes (doivent passer par leur parent)
if ($task -match 'pentest-auth|pentest-inputs|aipd-analyst') {
  '{"permission":"deny","user_message":"Ce sous-agent interne doit etre lance par son parent (pentester ou rgpd-auditor), pas directement."}'
  exit 0
}
'{"permission":"allow"}'
exit 0