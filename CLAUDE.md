# Lern-Quiz Klasse 6d – Regeln für Agenten

Vor jeder Arbeit **`docs/WORKFLOW.md` lesen**: Dort steht der komplette Ablauf von den Fotos des
Stoffzettels bis zur Veröffentlichung, außerdem Backend-Referenz und Entscheidungen des Nutzers.

## Unverhandelbar

- **Git:** nie direkt auf `main`. Branch → PR über die GitHub-REST-API (kein `gh`, Token aus
  `git credential fill`) → Squash-Merge → Branch löschen. Commit und Push **nur mit ausdrücklicher
  Zustimmung** des Nutzers. Danach `git remote -v` prüfen: Es darf kein Token in `.git/config` stehen.
- **Kommunikation:** Deutsch, knapp. Über Git-Mechanik höchstens eine Zeile, keine Hashes, keine
  PR-Links, kein Mitschnitt von Abfragen. Über die eigentliche Arbeit sprechen.
- **Name des Englisch-Lehrwerks:** steht nirgends im Repo. Vor jedem Commit `npm run check:names`
  ausführen; das Veröffentlichungs-Skript prüft es ebenfalls.
- **Echter Space `klasse-6d`:** dort nichts testen, was PINs setzt. Die PINs der Kinder und die
  Eltern-PIN legt die Familie selbst fest. Für Tests einen eigenen Space verwenden und danach löschen.
- **Keine PINs oder Passwörter im Browser eintippen**, wenn sie an einen fremden Host gehen. Per `curl`
  anmelden und das Token in `localStorage` setzen (siehe WORKFLOW §3).
- **Spacefast-Space löschen** nur nach Freigabe des Nutzers (Approval-Link, siehe WORKFLOW §4).
- **Inhalte** nur aus dem Material des Nutzers, nie aus dem Gedächtnis. Vokabeln erst nach seiner
  Prüfung der seitenweisen Abschrift verwenden.

## Werkzeuge (isoliert, System bleibt unberührt)

- Node 22 + Spacefast-CLI: `~/.local/node22` → `scripts/setup-spacefast.sh`
- Kokoro (Vokabel-Audio, nur Klasse 6): `~/.local/kokoro` → `scripts/setup-kokoro.sh`
- Homebrew auf dem Mac ist sehr alt: nicht verwenden, nicht updaten.

## Prüfen vor dem Abschluss

`npm run build` · `npx eslint <geänderte Dateien>` · `npm run check:names` · Änderungen im Browser
durchspielen (Ablauf siehe WORKFLOW §2.6 und §3).
