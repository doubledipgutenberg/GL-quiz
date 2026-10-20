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

scripts/check-names.sh

# Versionsnummer für die Anzeige unten auf der Anmeldeseite (2026-10-19, Wunsch des Nutzers): die nächste
# Spacefast-Version (vN+1) samt Datum. Nach dem Veröffentlichen wird geprüft, ob die Nummer stimmt.
LAST=$(sf versions list --space "$SPACE" --json | node -e '
  let s = ""; process.stdin.on("data", (c) => (s += c)).on("end", () => {
    const v = JSON.parse(s).data.versions || [];
    console.log(Math.max(0, ...v.map((x) => x.number || 0)));
  });')
export VITE_APP_VERSION="$((LAST + 1))"
export VITE_APP_BUILT="$(date +%d.%m.%Y)"
echo "App-Version: $VITE_APP_VERSION ($VITE_APP_BUILT)"

VITE_BASE=/ npm run build

OUT=.sf-out
rm -rf "$OUT"
mkdir -p "$OUT"
cp -R dist/. "$OUT/"
cp -R functions "$OUT/functions"

sf publish "$OUT" --space "$SPACE" -m "$MESSAGE" --spa true --wait -y | tee "$OUT/publish.log"
if ! grep -Eq "^Version +v$VITE_APP_VERSION " "$OUT/publish.log"; then
  echo "ACHTUNG: Spacefast hat eine andere Versionsnummer vergeben als die App anzeigt (v$VITE_APP_VERSION) – bitte erneut veröffentlichen." >&2
fi
