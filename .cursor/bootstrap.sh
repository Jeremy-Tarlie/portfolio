#!/bin/bash
# Usage : ./bootstrap.sh /chemin/vers/nouveau-projet
set -e
SRC="$(cd "$(dirname "$0")" && pwd)"          # ce .cursor
DST="${1:?Donne le chemin du projet cible}/.cursor"

if [ -d "$DST" ]; then
  echo "Un .cursor existe déjà dans la cible. Fusion manuelle recommandée. Abandon."
  exit 1
fi
cp -r "$SRC" "$DST"
chmod +x "$DST"/hooks/*.sh 2>/dev/null || true

# .cursorignore à la racine du projet
cat > "${1}/.cursorignore" <<'EOF'
.env
.env.*
!.env.example
.envrc
*.pem
*.key
*.p12
credentials*.json
EOF
echo "✓ .cursor installé dans $1"
echo "Vérifie que jq est installé pour les hooks (brew install jq / apt install jq)."