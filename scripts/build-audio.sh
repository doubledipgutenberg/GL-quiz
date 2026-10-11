#!/usr/bin/env bash
# Erzeugt bzw. aktualisiert die Vokabel-Audios aller vertonten Kurse (nur Klasse 6).
#   scripts/build-audio.sh            (oder: npm run audio)
# Voraussetzung: scripts/setup-kokoro.sh. Nur neue/geänderte Wörter werden erzeugt,
# gelöschte entfernt. Ergebnis in public/audio/<kurs>/ – einchecken.
set -euo pipefail
cd "$(dirname "$0")/.."

PY="$HOME/.local/kokoro/venv/bin/python"
[ -x "$PY" ] || { echo "Kokoro fehlt – zuerst scripts/setup-kokoro.sh ausführen." >&2; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
for course in fr-6 en-6; do
  node scripts/export-audio-manifest.mjs "$course" "$TMP/$course.json"
  "$PY" -I scripts/generate-audio.py "$TMP/$course.json" --out public/audio --prune 2>&1 | grep -v '^WARNING'
done
