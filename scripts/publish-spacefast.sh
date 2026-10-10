#!/usr/bin/env bash
# Baut das Quiz und veröffentlicht es samt Backend (functions/) auf Spacefast.
#   scripts/publish-spacefast.sh "Änderungsnotiz"          -> Space "klasse-6d"
#   SF_SPACE=quiz-spike scripts/publish-spacefast.sh "…"    -> anderer Space (z. B. Test)
# Voraussetzung: Node >= 20.3 mit Spacefast-CLI (hier: ~/.local/node22) und `sf login`.
set -euo pipefail
cd "$(dirname "$0")/.."

export PATH="$HOME/.local/node22/bin:$PATH"
SPACE="${SF_SPACE:-klasse-6d}"
MESSAGE="${1:-publish}"

VITE_BASE=/ npm run build

OUT=.sf-out
rm -rf "$OUT"
mkdir -p "$OUT"
cp -R dist/. "$OUT/"
cp -R functions "$OUT/functions"

sf publish "$OUT" --space "$SPACE" -m "$MESSAGE" --spa true --wait -y
