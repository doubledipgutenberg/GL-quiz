#!/usr/bin/env bash
# Prüft, dass der Name des Englisch-Lehrwerks nirgends im Repo steht (Wunsch des Nutzers).
# Das Muster ist absichtlich umschrieben, damit der Name auch hier nicht auftaucht.
# Läuft automatisch in scripts/publish-spacefast.sh; vor jedem Commit ausführen.
set -euo pipefail
cd "$(dirname "$0")/.."
if git grep --untracked -niE 'gre{2}n[ _-]?lin[e]' -- . ':!node_modules' ':!dist'; then
  echo "✗ Verbotener Lehrwerk-Name gefunden (siehe oben) – bitte durch „English Topic“ ersetzen." >&2
  exit 1
fi
echo "✓ Namensprüfung"
