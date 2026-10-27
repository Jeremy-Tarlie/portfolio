$ErrorActionPreference = 'Stop'
$raw = [Console]::In.ReadToEnd()
try { $in = $raw | ConvertFrom-Json } catch { '{}'; exit 0 }
$file = [string]$in.file_path
if (-not $file) { '{}'; exit 0 }

$root = $Env:CURSOR_PROJECT_DIR
if ($root) { Set-Location $root }

switch -Regex ($file) {
  '\.py$' {
    if (Test-Path '.venv\Scripts\ruff.exe') {
      & .\.venv\Scripts\ruff.exe format $file 2>$null 1>$null
    } elseif ((Test-Path 'uv.lock') -and (Get-Command uv -ErrorAction SilentlyContinue)) {
      & uv run ruff format $file 2>$null 1>$null
    }
  }
  '\.(ts|tsx|js|jsx|json|css|md)$' {
    if (Test-Path 'node_modules\.bin\prettier.cmd') {
      & .\node_modules\.bin\prettier.cmd --write $file 2>$null 1>$null
    }
  }
}
'{}'
exit 0