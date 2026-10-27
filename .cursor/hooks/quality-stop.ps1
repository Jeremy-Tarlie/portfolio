$ErrorActionPreference = 'Stop'
$raw = [Console]::In.ReadToEnd()
try { $in = $raw | ConvertFrom-Json } catch { '{}'; exit 0 }
if ([string]$in.status -ne 'completed') { '{}'; exit 0 }
$loop = [int]$in.loop_count

$root = $Env:CURSOR_PROJECT_DIR
if ($root) { Set-Location $root }
$fails = @()

# Python (ruff)
if ((Test-Path 'pyproject.toml') -or (Get-ChildItem -Filter *.py -ErrorAction SilentlyContinue)) {
  if (Test-Path '.venv\Scripts\ruff.exe') {
    & .\.venv\Scripts\ruff.exe check . 2>$null 1>$null; if ($LASTEXITCODE -ne 0) { $fails += 'ruff-check' }
  } elseif ((Test-Path 'uv.lock') -and (Get-Command uv -ErrorAction SilentlyContinue)) {
    & uv run ruff check . 2>$null 1>$null; if ($LASTEXITCODE -ne 0) { $fails += 'ruff-check' }
  }
}

# JS/TS — uniquement les scripts reellement definis
if (Test-Path 'package.json') {
  $pkg = Get-Content 'package.json' -Raw | ConvertFrom-Json
  if ($pkg.scripts.lint)      { & npm run -s lint 2>$null 1>$null;      if ($LASTEXITCODE -ne 0) { $fails += 'lint' } }
  if ($pkg.scripts.typecheck) { & npm run -s typecheck 2>$null 1>$null; if ($LASTEXITCODE -ne 0) { $fails += 'typecheck' } }
}

if ($fails.Count -gt 0) {
  $list = $fails -join ', '
  if ($loop -ge 2) {
    $msg = "Portail qualite toujours rouge ($list) apres plusieurs tentatives. Arrete de corriger, montre la sortie exacte des outils en echec et ce que tu as tente. Pas de noqa, ts-ignore, ni eslint-disable."
  } else {
    $msg = "Portail qualite rouge : $list. Corrige la cause (pas le symptome), sans masquer (pas de noqa/ts-ignore/eslint-disable/skip), puis relance les outils."
  }
  @{ followup_message = $msg } | ConvertTo-Json -Compress
  exit 0
}
'{}'
exit 0