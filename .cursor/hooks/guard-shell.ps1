$ErrorActionPreference = 'Stop'
$raw = [Console]::In.ReadToEnd()
try { $in = $raw | ConvertFrom-Json } catch { '{"permission":"allow"}'; exit 0 }
$cmd = [string]$in.command

function Deny($m) { '{"permission":"deny","user_message":"' + $m + '"}'; exit 0 }
function Ask($m)  { '{"permission":"ask","user_message":"'  + $m + '"}'; exit 0 }

# 1. Lecture/affichage d'un .env (type, cat, gc, Get-Content, findstr)
if ($cmd -match '(type|cat|gc|Get-Content|findstr|Select-String)[^|]*\.env($|[^.a-zA-Z])') {
  Deny "Commande bloquee : tentative de lecture d'un .env."
}
# 2. Dump de variables d'environnement
if ($cmd -match '(Get-ChildItem +Env:|dir +Env:|gci +Env:|printenv|process\.env|os\.environ|echo +\$Env:)') {
  Deny "Commande bloquee : affichage de variables d'environnement."
}
# 3. Destruction massive
if ($cmd -match '(Remove-Item[^;]*-Recurse[^;]*-Force|rm +-rf|rd +/s|del +/s|Format-Volume|DROP +DATABASE|TRUNCATE )') {
  Deny "Commande bloquee : operation destructrice. Confirme explicitement si c'est voulu."
}
# 4. Installation / modification systeme -> demander
if ($cmd -match '(winget +install|choco +install|scoop +install|npm +i(nstall)? +-g|pip[0-9]? +install|conda +install)') {
  Ask "Installation/modification systeme detectee. Confirmer ?"
}

'{"permission":"allow"}'
exit 0