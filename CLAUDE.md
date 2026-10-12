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
- **Testen zuerst lokal** mit `MOCK_API=1 npm run dev` (Test-Attrappe, Test-PINs erlaubt). **Keine PINs oder
  Passwörter im Browser eintippen**, wenn sie an einen fremden Host gehen: dann per `curl` anmelden und
  das Token in `localStorage` setzen (siehe WORKFLOW §3).
- **Spacefast-Space löschen** nur nach Freigabe des Nutzers (Approval-Link, siehe WORKFLOW §4).
- **Inhalte** nur aus dem Material des Nutzers, nie aus dem Gedächtnis. Vokabeln erst nach seiner
  Prüfung der seitenweisen Abschrift verwenden.

## Antwort-Review („Na ja, schon fast richtig“)

Wenn der Nutzer einen Antwort-Review-Export schickt (`antwort-review-*.json`): `node scripts/review-flags.mjs
<datei>` laufen lassen und die ❗/⚠️-Fälle beheben – Einzelfall per Alternative, Muster per Regel im Matcher
mit Testfällen (Ablauf: `docs/WORKFLOW.md`, Abschnitt „Na ja, schon fast richtig“). Danach erneut prüfen.

## Design System „Clara & Jakob lernen Sprachen“

Vor **jeder UI-Arbeit** `design-system/README.md` lesen, dann die README der betroffenen Komponente
unter `design-system/components/<Name>/README.md` (Ansicht: `preview.html` im Browser öffnen).

- **`design-system/` nicht von Hand ändern.** Es ist ein Spiegel des Artifacts (Quelle und Stand in
  `design-system/SYNC.md`). Neuer Stand nur über `/sync-design`; danach den Diff ansehen und die
  betroffenen Screens anpassen. Wenn am Design etwas fehlt oder nicht passt: dem Nutzer sagen, nicht im
  Spiegel ausbessern.
- **Farben je Kurs:** Französisch = blauer Stift (`fr-pen`), Englisch = roter Stift (`en-pen`), vor der
  Kurswahl Navy (`house-pen`). Komponenten benutzen nur `--pen`, `--pen-strong`, `--pen-tint`,
  `--pen-shadow`; umgeschaltet wird über `data-course="fr" | "en"` (aus `course.lang`) am Wurzel-Element.
  Nie Blau oder Rot fest eintragen.
- **Rot heißt nie „falsch“.** Falsch = Ocker (`ochre-*`) mit Kreuz-Icon, richtig = Oliv (`olive-*`) mit Haken.
- **Einbindung:** `design-system/tokens.css` (erzeugt) und die shadcn-Zuordnung aus dem README
  (Abschnitt „Using it in the app“) in `src/index.css`. Klassen aus `components/bundle.css` sind Referenz;
  in React-Komponenten mit Tailwind/shadcn nachbauen oder die Datei importieren – eine Variante wählen und
  dabei bleiben.
- Illustrationen und Icons aus `design-system/assets/` verwenden, nicht nachzeichnen; 🔊-Emoji durch das
  Lautsprecher-Icon ersetzen.
- UI-Texte bleiben Deutsch wie bisher.

## Werkzeuge (isoliert, System bleibt unberührt)

- Node 22 + Spacefast-CLI: `~/.local/node22` → `scripts/setup-spacefast.sh`
- Kokoro (Vokabel-Audio, nur Klasse 6): `~/.local/kokoro` → `scripts/setup-kokoro.sh`
- Homebrew auf dem Mac ist sehr alt: nicht verwenden, nicht updaten.

## Prüfen vor dem Abschluss

`npm run build` · `npx eslint <geänderte Dateien>` · `npm run check:names` · Änderungen im Browser
durchspielen (Ablauf siehe WORKFLOW §2.6 und §3).
