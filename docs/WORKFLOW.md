# Arbeitsablauf: vom Stoffzettel bis live auf Spacefast

Diese Anleitung beschreibt **genau**, wie neue Inhalte entstehen, geprüft, vertont und veröffentlicht
werden – so, dass jeder Schritt reproduzierbar ist (für Menschen und für Agenten).

Stand: 2026-10-10 · Live: <https://klasse-6d.space.fast/> (passwortgeschützt)

---

## 0. Überblick

```
Fotos (Stoffzettel, Vokabelseiten)
  → Vokabeln seitenweise abschreiben  → Nutzer prüft
  → Datendateien (Vokabeln + Fragen)  → Antwort-Check anpassen
  → Audio erzeugen (nur Klasse 6)     → bauen, testen
  → Branch → PR → Squash-Merge        → auf Spacefast veröffentlichen
```

| Teil | Wo | Was |
|---|---|---|
| App | `src/` | React 19 + Vite + Tailwind, läuft komplett im Browser |
| Backend | `functions/api/[action].ts` | Spacefast Functions: Kinder-Login, Eltern-PIN, Speichern/Laden |
| Inhalte | `src/data/` | Kurse, Schulaufgaben, Fragen, Vokabeln |
| Audio | `public/audio/<kurs>/` | vorab erzeugte `.m4a`-Dateien + `index.json` |
| Werkzeuge | `scripts/` | Setup, Vertonung, Veröffentlichen |

---

## 1. Einmalige Einrichtung (macOS, Apple-Chip)

Das System-Node (18) und System-Python (3.9) sind zu alt und bleiben **unverändert**. Homebrew auf
dem Entwicklungs-Mac ist sehr alt (2.4.9) – **nicht** zum Installieren verwenden und nicht updaten.
Alles Nötige landet isoliert unter `~/.local/`.

```bash
scripts/setup-spacefast.sh   # Node v22.23.3 (Prüfsumme) + Spacefast-CLI 0.5.0 → ~/.local/node22
~/.local/node22/bin/sf login # einmalig, Bestätigung im Browser (Device-Code)
scripts/setup-kokoro.sh      # uv 0.13.0 (Prüfsumme), Python 3.12.15, kokoro-onnx 0.6.1,
                             # Modell + Stimmen (Bytegröße geprüft) → ~/.local/kokoro (~450 MB)
```

Beide Skripte sind idempotent: Ein zweiter Aufruf prüft nur und überspringt Vorhandenes.
Exakte Python-Paketversionen: `scripts/kokoro-requirements.txt`.

---

## 2. Neue Inhalte aufnehmen

### 2.1 Material vom Nutzer

Pro Prüfung: **Stoffzettel** (Themen, Grammatik, Vokabelbereich mit Seitenzahlen) und **Fotos aller
Vokabelseiten** des Bereichs inkl. Kästen. iPhone-Fotos kommen oft als `.heic`:

```bash
sips -s format png FOTO.HEIC --out /tmp/foto.png      # umwandeln
sips -r 90 /tmp/foto.png --out /tmp/foto_r.png        # drehen, falls nötig
sips --cropToHeightWidth H W /tmp/foto_r.png --out /tmp/ausschnitt.png   # zentrierter Ausschnitt
```

Inhalte **nie aus dem Gedächtnis ergänzen** – nur, was auf den Fotos steht.

### 2.2 Vokabeln seitenweise abschreiben → Nutzer prüft

Datei `VOCAB_<KURS>_<PRÜFUNG>_review.md` (Beispiele: `VOCAB_SA4_review.md`, `VOCAB_FR6_U1_review.md`), **eine Liste pro Buchseite**,
in Buchreihenfolge, mit den Abschnittsüberschriften des Buchs. Pro Zeile `wort – Übersetzung`, genau
wie gedruckt (inkl. `to`, `(pl)`, `(AE)`, `(BE)`, Akzente). Kästen mit 📦 markieren. Wo der Stoffzettel
den Bereich mitten auf einer Seite beginnen/enden lässt: markieren und **nachfragen**, nicht raten.

Der Nutzer prüft und entscheidet (z. B. welche Kästen/Randwörter rausfallen). Erst danach weiter.

Schickt der Nutzer **Buch und Vokabelheft** zum selben Stoff: abgleichen, **keine Duplikate**, Buchfassung
als Grundlage (Rechtschreibung), Heft zeigt den aktuellen Unterrichtsstand. Markierung ✓ = Buch + Heft,
📖 = nur Buch. Die Beispielsätze des Buchs dienen als **Vorlage** für eigene Fragen, sie werden nicht
wörtlich übernommen. Material aus offensichtlich illegalen Quellen (z. B. Schattenbibliotheken) nicht verwenden.

### 2.3 Datendateien

- **Kurse** stehen in `COURSES` in `src/data/questions.js` (`en-6`, `fr-6`, `en-5`).
  Ein Kurs ohne Schulaufgaben erscheint als „Inhalte kommen bald“.
- **Schulaufgabe registrieren:** Eintrag in `EXAMS` mit `id`, `course`, `label`, `units`, `subtitle`.
  Die neueste Schulaufgabe eines Kurses (letzter Eintrag) ist vorausgewählt.
- **Vokabeln, Klasse 6** (Vorbilder: `src/data/fr6/vocab.js`, `src/data/en6/vocab.js` – Englisch hat `en`
  statt `fr`, Karten `_de`/`_en`/`_listen`): Jede Lieferung ist ein **Batch** mit `exam`
  und `added` = **Datum, an dem sie ins Quiz kam** (Entscheidung des Nutzers). Darin Abschnitte mit
  Einträgen `{ fr, de, alt?, altDe?, say? }`. Mehrere Bedeutungen mit `;`. `alt` = weitere richtige
  Antworten (z. B. „À plus!“, wenn das Buch das große A ohne Akzent druckt, oder Synonyme mit gleicher
  Übersetzung wie *ami*/*copain*). `say` = gesprochener Text, falls er abweichen soll. Die Datei hat
  **keine Importe** (sie wird auch von Node fürs Audio-Manifest gelesen).
  `src/data/fr6/cards.js` erzeugt daraus die Karten: `_de` (frz. sehen + 🔊 → deutsch), `_fr` (deutsch →
  frz. schreiben), `_gap` (Lückentext: Beispielsatz mit Lücke + deutsche Bedeutung) und `_listen` (nur hören →
  frz. schreiben). Die Lücke steht im Beispielsatz `ex` in [eckigen Klammern], Alternativen mit `|`
  (`'Our ball [ended up] in the river.'`); `exampleText` entfernt die Klammern fürs Audio, `gapOf` baut die
  Lücke. Jede neue Vokabel braucht deshalb einen `ex`-Satz mit genau einer [Lücke]. Hör-Karten spielen erst das Wort, kurz danach
  den Beispielsatz `ex` (eigene Formulierung, nur bekannte Wörter; Audio `<id>_ex.m4a`, `playSequence` in
  `src/lib/audio.js`). **Alle drei gehören zum Wortschatz**,
  es gibt keinen eigenen Hör-Modus (Entscheidung des Nutzers).
  Neue Lieferung = **neuer Batch** mit dem heutigen Datum, alte Batches nie umdatieren. „Nur neue
  Vokabeln“ ist ein **Filter auf den Wortschatz**: der jüngste Batch des Kurses.
- **Vokabeln, Klasse 5** (Altbestand): `src/data/vocabList.js`, `src/data/vocabListSA4.js`.
- **Fragen:** eigene Datei je Prüfung (Vorbilder: `src/data/fr6/questions.js`, `src/data/questionsSA4.js`)
  und in `questions.js` zusammenführen. Französische Freitext-Fragen bekommen `answerLang: 'fr'`
  (Akzent-Tasten + strenger Check). **Kein Komma und kein Semikolon in `correct`** von Freitext-Fragen:
  Die trennen dort Alternativen. Weitere richtige Lösungen gehören in `alternativeCorrect`.
  Wahr/Falsch-Fragen mit deutschen Aussagen bekommen `tfLabels: ['Richtig', 'Falsch']`
  (in `fr6/questions.js` automatisch).
- **Übungsaufgaben als Vorlage:** Scans aus dem Cahier d'activités oder aus Bilan-Seiten des Buchs zeigen,
  *welche Inhalte und Aufgabentypen* drankommen. Daraus eigene Fragen formulieren, nicht abschreiben.
  Hör-Aufgaben nur inhaltlich auswerten.
- **Kurs mit Audio:** `audio: true` in `COURSES` heißt: Vokabeln sind vertont (2.5), der Wortschatz enthält
  die Hör-Karten.
- **Startseite** (`WelcomeScreen.jsx`): immer nur eine Frage pro Schritt. Fach → Schulaufgabe →
  „Normales Quiz“ oder „Wortschatz“ → (nur Wortschatz, falls es datierte Batches gibt) „Alle Vokabeln“
  oder „Nur neue Vokabeln“. Die letzte Wahl startet das Quiz, „Zurück“ geht einen Schritt zurück.
- **Eigennamen** als Vokabelkarte nur, wenn sie sich in der Übersetzung unterscheiden
  (Strasbourg–Straßburg ja, Paris–Paris oder Hundenamen nein). In Sätzen kommen sie trotzdem vor.
- **IDs** müssen app-weit eindeutig sein und bleiben dauerhaft gleich (die Lernhistorie hängt daran).
  Präfix pro Kurs/Prüfung, z. B. `fr6-sa1-g01` (Fragen), `fr6_ecole` (Vokabeln).
- **Fragetypen:** `multiple_choice`, `fill_gap`, `word_order`, `translate`, `reading_true_false`,
  `picture_vocab`, `vocab_card`. Kategorien: `grammar`, `vocabulary`, `reading`, `mediation`.
- **Name:** Der Name des Englisch-Lehrwerks steht nirgends im Repo, auch nicht in Kommentaren oder
  Doku (Nutzerwunsch). Im Quiz heißt es „English Topic“.

### 2.4 Antwort-Check (`src/utils/scoring.js`)

„Freundlich bei der Form, streng bei der Rechtschreibung“: Groß-/Kleinschreibung, Leerzeichen,
Satzzeichen, führender Artikel/„to“, ä=ae/ß=ss, Klammern optional (mit *und* ohne Inhalt), eine von
mehreren Bedeutungen und Genus-Endungen (`/-in`) zählen als richtig. Echte Tippfehler zählen als falsch,
es gibt bewusst keine Toleranz für Tippfehler.

**Französisch** (`answerLang: 'fr'`, Entscheidung des Nutzers): Ein fehlender oder falscher Akzent
(auch Cedille) zählt als **falsch**. Der Artikel (`le/la/l'/les/un/une/des/du`) darf fehlen, ein
**falscher** Artikel (falsches Geschlecht, z. B. „une chat“) ist falsch. Verkürzte Formen (l', m', t' …)
und typografische Apostrophe werden richtig erkannt. Unter dem Eingabefeld gibt es Akzent-Tasten
(é è ê ë à â ç î ï ô û ù œ), die an der Cursor-Position einfügen. Deutsche Antworten in französischen
Karten folgen den normalen Regeln (ä = ae).

### 2.5 Audio (nur Klasse 6)

Klasse 5 wird **nicht** vertont. Für Kurse der 6. Klasse:

```bash
npm run audio      # = scripts/build-audio.sh
```

Das Skript liest die Vokabel-Dateien (`scripts/export-audio-manifest.mjs` → Manifest mit `id`, `text`,
`lang`), vertont mit `scripts/generate-audio.py` nur neue oder geänderte Wörter und entfernt gelöschte.
Gesprochen wird der Eintrag ohne Hinweise in Klammern; „ / “ wird zur Aufzählung (oder `say`).
Ergebnis `public/audio/<kurs>/<id>.m4a` + `index.json` **einchecken** (je ca. 10 KB). Ein neuer Kurs
wird in `SOURCES` von `export-audio-manifest.mjs` und in der Schleife von `build-audio.sh` ergänzt.

In der App: 🔊 am französischen Wort (Karte `_de`), in der Rückmeldung nach jeder Antwort und bei den
Hör-Karten (`_listen`) im Wortschatz automatisch. **Wiedergabe** (`src/lib/audio.js`): ein wiederverwendetes `<audio>`-Element,
beim ersten Tippen stumm freigeschaltet (Safari). Die Sprachausgabe des Browsers springt nur bei einer wirklich
fehlenden/kaputten Datei ein – nie bei `AbortError` (Unterbrechung) oder `NotAllowedError` (Autoplay
blockiert). Sonst spricht eine fremde Stimme in die 0,8 s Stille vor dem Wort (Fehler vom 2026-10-12). Fehlt eine Datei, spricht die Sprachausgabe des Browsers (`src/lib/audio.js`).

Freigegebene Stimmen: Französisch `ff_siwis` mit Tempo 0.75 (bis 19.10.: 0.9 – Sätze waren zu schnell), Englisch (britisch) `bf_emma` mit 0.95,
optional `bm_george`. Das Skript erzeugt nur neue oder geänderte Einträge. Das Modell und die
Python-Umgebung gehören **nicht** ins Repo (325 MB, rechnerspezifisch); das Setup-Skript stellt sie
jederzeit wieder her.

### 2.6 Prüfen

```bash
npm run build
npx eslint <geänderte Dateien>
```

- Antwort-Check mit konkreten Fällen testen. `scoring.js` hat keine Importe und lässt sich direkt
  mit Node ausführen. Andere Module nutzen Vite-Importe ohne Endung, die prüft man im Browser per
  `await import('/src/…')`.
- Fragen und Vokabeln zählen (pro Kategorie), Stichproben im Browser durchspielen.

---

## 3. Testen gegen das Backend

**Erste Wahl: die lokale Test-Attrappe.** `MOCK_API=1 npm run dev` startet die App mit einem Backend
im Speicher (`scripts/dev-mock-api.js`, gleiche Routen wie die echte Function). In der Desktop-App gibt
es dafür die Launch-Konfiguration `english-topic-quiz-mock` (Port 5176). Weil alles auf localhost
bleibt, dürfen dort **Test-PINs** eingetippt werden (z. B. 1111 / Eltern 2222). Testdaten kann man im
Browser per `await import('/src/utils/storage.js')` anlegen. Ein echter Test-Space ist nur nötig, wenn die
Function selbst geändert wurde.

- **Nie im echten Space `klasse-6d` testen**, wenn dabei PINs gesetzt würden. Die PINs der Kinder und die
  Eltern-PIN legt **die Familie selbst** beim ersten Login fest. Für Tests einen eigenen Space nutzen:
  `SF_SPACE=<test-space> scripts/publish-spacefast.sh "test"`.
- **Keine PINs oder Passwörter im Browser eintippen**, wenn sie an einen fremden Host gehen. Stattdessen
  per `curl` anmelden (`POST /api/login`, `POST /api/parent`) und das Token im Browser in
  `localStorage` setzen (`lernquiz_kid_session` = `{"name","token"}`, `lernquiz_parent_token`).
- **Lokale Oberfläche gegen das Test-Backend:** Vite leitet `/api` weiter, wenn `SF_PROXY_TARGET` und
  `SF_PROXY_COOKIE` gesetzt sind (Session-Cookie des Test-Space, per `curl` mit dem Space-Passwort holen;
  POST braucht einen `Origin`-Header). Die Vorschau-Sandbox der Desktop-App kann keine versteckten
  Dateien lesen, die die Shell angelegt hat. Deshalb die beiden Werte nur temporär als `env` in die
  lokale `.claude/launch.json` **außerhalb** des Repos eintragen und danach wieder entfernen.
- Test-Space und Test-Tokens nach dem Test löschen.

---

## 4. Veröffentlichen

**Git** (Regeln des Nutzers): nie direkt auf `main`. Branch → PR über die GitHub-REST-API (kein `gh`) →
Squash-Merge → Branch löschen. Commit und Push **nur mit ausdrücklicher Zustimmung**. Git-Mechanik
gegenüber dem Nutzer in höchstens einer Zeile berichten.

**Spacefast:**

```bash
scripts/publish-spacefast.sh "Änderungsnotiz"    # baut, packt dist/ + functions/, veröffentlicht klasse-6d
```

**Versionsnummer in der App** (2026-10-19): Das Skript fragt vor dem Bauen die nächste Spacefast-Version ab
(`sf versions list`, höchste Nummer + 1) und baut sie mit Datum ein (`VITE_APP_VERSION`, `VITE_APP_BUILT` →
`src/components/AppVersion.jsx`). Angezeigt ganz unten auf der Anmeldeseite und in der Fußzeile der Startseite,
z. B. „Version 25 · 19.10.2026“. Weicht die vergebene Nummer ab, warnt das Skript. Lokale Builds zeigen „Version lokal“.
Dem Nutzer die Nummer nennen, damit er auf dem iPad sieht, ob das Update angekommen ist.

GitHub Pages baut **nicht** mehr automatisch, weil die App dort kein Backend hätte. Die alte Seite
bleibt aber auf Wunsch des Nutzers online; manuell bauen ginge mit `VITE_BASE=/GL-quiz/`.

**Einen neuen Space anlegen** (zum Beispiel einen weiteren Test-Space):

```bash
sf publish .sf-out -n "Name" --slug <slug> --access private --spa true --wait -y
printf '%s' "$PASSWORT" | sf share password create --space <slug> --name "Familie" --path '/**' --password-from-stdin -y
sf share list --space <slug>        # Freigabe "Open" (Sharing settings) per `sf share revoke <id>` entfernen
curl -s -o /dev/null -w '%{http_code}' https://<slug>.space.fast/   # muss 403 liefern
```

- „Request access“ auf der Sperrseite lässt sich nicht abschalten. Anfragen gehen nur an den Besitzer.
- **Löschen** (`sf spaces rm`) braucht eine Freigabe durch den Nutzer: Der Befehl liefert einen
  `my.spacefast.com/approvals/…`-Link. Nach der Bestätigung `POST /v1/actions/resume` mit dem
  `continuationToken` abfragen (die Antwort hat `data.status = completed`, `result.approved = true`)
  und `sf spaces rm` **erneut** ausführen.

---

## 5. Referenz: Backend

| Route | Wer | Zweck |
|---|---|---|
| `GET /api/kids` | alle | Profile + ob PIN/Eltern-PIN gesetzt |
| `POST /api/login {name, pin}` | alle | Kind-Login. Ohne PIN wird sie dabei **gesetzt** |
| `POST /api/parent {pin}` | alle | Eltern-Login. Beim ersten Mal wird die PIN gesetzt |
| `GET /api/state` | Token | alle gespeicherten Daten |
| `PUT /api/state {items:[{owner,key,value}]}` | Token | Speichern. Kind nur eigene Daten, `value: null` löscht |
| `POST /api/reset-pin {name}` | Eltern | PIN eines Kindes zurücksetzen |
| `POST /api/clear` | Eltern | alle Quiz-Daten löschen |

- **Profile** stehen als `KIDS` direkt in der Function. Ein neues Kind heißt: dort eintragen und neu veröffentlichen.
- **Datenmodell:** `owner` = Kindername mit den Schlüsseln `history`, `highscores`, `savedRounds`, `draft`,
  oder `_family` mit `teacherDismissals` und `teacherMarkedCorrect`.
- **Sperre:** nach 5 falschen PINs für 5 Minuten, Status **423**. 429 nicht verwenden, das ersetzt
  Spacefast durch eine eigene HTML-Seite.
- **Gültigkeit:** Kind-Token 90 Tage, Eltern-Token 12 Stunden, Space-Passwort-Sitzung 30 Tage.
- **Datenbank-Grenze:** max. **64 KB pro SQL-Anweisung**. Deshalb werden JSON-Werte in Stücke zu 20.000
  Zeichen geteilt und versioniert gespeichert (erst die neuen Stücke, dann der Zeiger, dann Aufräumen).
- **Client-Sync** (`src/utils/sync.js`): `localStorage` ist die Arbeitskopie. `storage.js` meldet
  Änderungen per `markDirty`, der Upload folgt nach 1,5 s (Wiederholung nach 10 s, beim Verlassen der
  Seite sofort). Beim Login holt die App den Server-Stand, ohne lokale ungesicherte Änderungen zu
  überschreiben. Ein Kind sieht nur eigene Runden, Highscores und Historie aller Kinder sind sichtbar.
- **„Na ja, schon fast richtig“** (Wortschatz): Auf der Rückmeldung zu einer falsch gewerteten Vokabel kann
  das Kind die Antwort melden (`flagAlmostRight`, Schlüssel `answerFlags` – gehört dem Kind). Im Lehrer-Bereich
  stehen die Meldungen je Kind und Fach unter „Zur Prüfung“; das Urteil „Doch richtig“/„Falsch“ liegt in
  `flagReviews` (Familie) und „Doch richtig“ zählt den Versuch in der Auswertung als richtig.
  **Auswertung für den Coding-Agent:** Lehrer-Bereich → „Antwort-Review exportieren“ → JSON, dann
  `node scripts/review-flags.mjs <datei>`. ❗-Fälle („doch richtig“, aber weiter abgelehnt) beheben: Einzelfall →
  Alternative (`alt`/`altDe`/`alternativeCorrect`), wiederkehrendes Muster → Regel in `src/utils/scoring.js`
  (mit Testfällen). ⚠️-Fälle („falsch“, aber akzeptiert) zeigen, dass der Check zu großzügig ist. Skript erneut
  laufen lassen, bis keine ❗/⚠️ übrig sind; Erkenntnisse unten in „Entscheidungen“ festhalten.
- **Wortschatz in Runden** (`src/utils/vocabPass.js`, Schlüssel `vocabProgress` – gehört dem Kind): „Alle
  Vokabeln“ ist ein Durchgang durch den ganzen Wortschatz der Schulaufgabe in Runden à 50 Karten (feste
  Zufallsreihenfolge per `seed`, erledigte Karten in `done`; jede Antwort zählt sofort). Startseite und
  Rundengrenzen sind fest (erledigt = abgeschlossene Runden × 50 + Karten der laufenden Runde); eine angefangene
  Runde holt nur ihre restlichen Karten. Oberfläche nach dem Design System: **ReviewPlan** vor dem Start
  (`ReviewPlan.jsx`, „Nur noch 2 Runden“, Runden-Leiste, „Weitermachen · noch 38 Karten“), **RoundProgress**
  während der Runde (in `App.jsx` statt ProgressBar), **RoundBreak** danach (`RoundBreak.jsx`, „Runde geschafft –
  PAUSE!“, „Nächste Runde“ / „Pause machen“); ist alles erledigt, ScoreBoard mit „Geschafft!“ und „Neuer
  Durchgang“. In der Oberfläche heißen die 50er-Einheiten immer **Runde**, nie „Session“ (Entscheidung des
  Nutzers). „Nur neue Vokabeln“ bleibt eine Runde.
- **Serien-Kalender** (`StreakCalendar.jsx`, `src/utils/streak.js`) auf der Startseite (Schritt 1): Monate als
  Blöcke, alle Wochentage als Zeilen, Farbtiefe in Rot (en-pen über `.vx-en`, bewusste Ausnahme vom Design System) = Punkte pro Tag in 5 Stufen (0–50, 51–100, 101–150, 151–250, ab 251; Zeitpunkt `at` je Antwort). Kennzahlen:
  Rekord, Geübt an, Runden, Antworten, Gesamt (Punkte), Bester Tag (meiste Punkte). Überschrift (Wahl des Nutzers):
  „5 Tage in Folge geübt!“ / „Tag 1 - Baue deinen neuen Streak! Eine Runde jeden Tag...“ / „… – bleib dran!“. Zeigt eine Reihe aus dem Schuljahr (beginnt im September) mit dem aktuellen Monat – so viele Monate, wie in die Breite passen (gemessen, mind. 3); die Kästchen füllen die Reihe.
- **Offline (iPad, 2026-10-14):** Service Worker (`scripts/sw-template.js` → beim Build `dist/sw.js` über
  `scripts/build-sw.mjs`, `npm run build` macht beides). Er speichert die App beim Installieren, lädt danach alle
  Aufnahmen (Schlüssel mit Inhalts-Hash, neue Fassungen ersetzen alte) und die Google-Schriften im Hintergrund.
  Seitenaufruf: erst Netz, ohne Netz die gespeicherte App; die Spacefast-Passwortseite wird nie gespeichert;
  `/api/` nie über den Zwischenspeicher. Registrierung nur im echten Build (`src/main.jsx`). iPad: in Safari
  „Teilen → Zum Home-Bildschirm“ (`public/manifest.json`, `touch-icon.png`; App-Symbol aus
  `design-system/assets/AppIcon/`, 1:1 nach `public/` kopiert; das 180er-Bild heißt dort `touch-icon.png`, weil
  Spacefast unter `/apple-touch-icon*` immer ein eigenes graues Platzhalterbild ausliefert). iOS merkt sich das Symbol: nach einem neuen
  Symbol die alte Verknüpfung löschen und neu hinzufügen. Die Home-Bildschirm-App hat eigene Cookies: Familien-Passwort und PIN dort einmal mit Netz.
  **Sync offline-fest** (`src/utils/sync.js`): offene Änderungen stehen in `lernquiz_sync_pending` (überstehen
  Neuladen); nach Offline-Zeit erst Server-Stand holen und zusammenführen (Runden per ID, Durchgang, Markierungen,
  Highscores, gespeicherte Runden), dann hochladen; `online`-Event löst sofort aus.
  **Statusanzeige** links oben (`src/components/SyncStatus.jsx`): Punkt + Wort („Gespeichert“, „Speichert …“,
  „Offline“); antippen zeigt Erklärung, ob noch etwas zu übertragen ist, wann zuletzt übertragen wurde, und
  offline „Jetzt erneut versuchen“. Kein großer Hinweistext mehr auf der Startseite. Zeile „Offline nutzbar“ fragt den
  Service Worker (Nachricht `status`), ob App und wie viele Aufnahmen auf dem Gerät liegen – so lässt sich auf dem
  iPad ohne Entwicklerwerkzeuge prüfen, ob es offline bereit ist. Beim Start schickt die App `fill`, damit fehlende
  Aufnahmen nachgeladen werden (iOS beendet den Service Worker manchmal mitten im Laden).
  **Spacefast-Besonderheiten** (live gemessen 2026-10-15): `/assets/*` antwortet mit 307 auf `/assets/*;sf-private`
  (gleicher Host, braucht das Cookie); ohne Cookie gibt es für alles 403 + Passwortseite; `/apple-touch-icon*` und
  `/favicon.ico` liefert die Plattform selbst aus (graues Bild). Safari lädt App-Symbole ohne Cookie – die
  Symbol-Dateien müssen deshalb ohne Passwort abrufbar sein (Space-Freigabe nur für diese Pfade).
  **Test mit Safari-Engine:** Playwright-WebKit gegen einen lokalen Spacefast-Nachbau (Cookie-Sperre, 307 für
  `/assets/`); „offline“ dabei durch Abschalten des Servers, nicht `setOffline` (das bricht in WebKit ab).
  **Profilwechsel offline** (2026-10-15, `src/lib/api.js`, `KidLogin.jsx`): Nach jeder Anmeldung mit Netz merkt sich
  das Gerät Profilliste (`lernquiz_kids_cache`) und je Kind Token + PIN-Prüfwert (PBKDF2 mit Salz, `lernquiz_known_kids`).
  Ohne Netz zeigt die Anmeldung die gemerkte Liste; anmelden kann, wer sich auf dem Gerät schon einmal mit Netz angemeldet
  hat (5 Fehlversuche → 5 Minuten Pause; PIN festlegen nur mit Netz). `sync.js` lädt jedes Kind mit seinem eigenen
  Token hoch; Runden anderer Kinder werden beim Abgleich nicht überschrieben, die Startseite zeigt nur eigene Runden.
  **iPad:** Die Home-Bildschirm-App hat eigenen Speicher (Cookies, Service Worker, Daten) – sie muss selbst einmal
  mit Internet geöffnet werden (Passwort + PIN darin), erst dann ist sie offline nutzbar.
  **Testen:** Launch-Konfiguration `english-topic-quiz-offline` (Produktions-Build + Test-Attrappe auf Port 5177,
  `configurePreviewServer` in `scripts/dev-mock-api.js`); Server stoppen = offline.
- **Auto-Save der Ergebnisse** (`useQuiz.js`, `upsertStudentSession` in `storage.js`): Jede Runde hat eine
  `sessionId` und steht nach **jeder Antwort** in der Historie (`complete: false`, am Ende `true`). Der
  Lehrer-Bereich sieht also auch angefangene Runden, ohne „Runde speichern“. Die aktuelle Runde läuft beim
  Fortsetzen unter ihrer ID weiter; gespeicherte Runden und Wiederholungs-Quizze bekommen eine neue ID und
  zählen nur neue Antworten (`answersOffset`). Gespeichert wird in Effects, nicht im Reducer.
- **Lehrer-Bereich: erst das Kind, dann das Fach** (`AdminDashboard.jsx`, `src/utils/courseOf.js`): Nach der
  Eltern-PIN wählt man ein Kind (Karte je Profil, dort auch PIN-Reset). Dessen Dashboard hat Reiter je Fach.
  Jede Antwort wird über ihre Frage-ID einem Kurs zugeordnet (Frage → `exam` → `course`), die Historie wird
  pro Reiter gefiltert, *bevor* sie ausgewertet wird. Damit sind Details, Fehler, Vokabel-Stufen,
  „Vokabeln gekonnt“ und Wiederholungs-Quizze automatisch getrennt. Vokabeln stehen in zwei Bereichen:
  „Neue Vokabeln“ (jüngster Batch) und „Gesamter Wortschatz“ – dieselben Antworten, die neuen sind nur ein
  Ausschnitt. Je 6 Stufen von „Nie richtig“ bis „Immer richtig“, jede Liste auf-/zuklappbar.
  Übungshinweise mit Arbeitsheft-Seiten gibt es nur für Englisch 5. Einträge ohne Kursangabe (Altbestand) zählen zu Englisch 5. Wichtig: Jede neue
  Frage bzw. Karte braucht `exam` oder `course`.

---

## 6. Entscheidungen des Nutzers (Stand 2026-10-11)

- Hosting komplett auf Spacefast (statt Supabase), Space `klasse-6d`, Familien-Passwort, nur die eigenen
  Kinder (Jakob, Clara) plus ein Profil „Test“ zum Ausprobieren. Wo Spacefast die Daten speichert (EU?), ist nicht dokumentiert. Das wurde akzeptiert.
- Antwort-Check freundlich bei der Form, streng bei der Rechtschreibung. Französisch: fehlender Akzent = falsch.
- Akzent-Tasten: ja. Audio: nur Klasse 6, Kokoro, Stimmen wie oben.
- Englisch 6 = Band 2 des Englisch-Lehrwerks, Französisch 6 = Découvertes 1 (Klett). Der Name des
  Englisch-Lehrwerks steht nirgends im Repo.
- Die alte GitHub-Pages-Seite bleibt online (enthält die alten, lokal gespeicherten Ergebnisse).
- Französisch 6 = Découvertes 1, **Ausgabe Bayern**. Unité 1: Umfang wie im Vokabelheft (bis B5), dazu
  die freiwilligen Tiere aus „Mon dico personnel“. Eigennamen nur als Karte, wenn die Übersetzung abweicht.
- „Neue Vokabeln“ = jüngster Batch nach **Tag des Hinzufügens**, nur ein Filter auf den Wortschatz.
- Audio ist Teil des Wortschatzes, kein eigener Modus. Startseite Schritt für Schritt, eine Frage pro Schritt.
- Lehrer-Bereich: jedes Kind hat sein eigenes Dashboard (erst Kind wählen), darin klare Trennung nach Fach.
- Unité 1: Die Zahlen 0–12 (Kasten im Buch) sind mit drin, weil das Cahier sie abfragt. Die Fragen
  (115) orientieren sich am Cahier (S. 7–17) und an Bilan/Grammaire/Alphabet im Buch (S. 24–26).
- Englisch 6, Unit 1: Vokabeln bis „to fix“ (Buch S. 195–198, Abschrift `VOCAB_EN6_U1_review.md`), Stimme
  bf_emma. Fragen nach Grammatik G1–G3 und Practice pool der Unit.
- Hör-Karten: erst das Wort, dann ein kurzer Beispielsatz (nur bei Hör-Karten).
- Wortschatz hat vier Kartenarten: übersetzen, in der Fremdsprache schreiben, Lückentext, nach Gehör schreiben.
- Dasselbe Wort **nie direkt hintereinander** (auch nicht in anderer Kartenart), möglichst 5 andere Karten
  dazwischen (`src/utils/spreadCards.js`, nach dem Mischen in `useQuiz` und bei Wiederholungen aus dem Lehrer-Bereich).
- **Erst jedes Wort einmal** (2026-10-20): Nach der Hälfte einer Runde bzw. eines Durchgangs muss jedes Wort
  mindestens einmal drangekommen sein. `spreadByWord` legt zuerst je eine Karte pro Wort (zufälliger Kartentyp),
  danach die übrigen. „Alle Vokabeln“: Die Reihenfolge des ganzen Durchgangs entsteht so in `planVocabRound`
  (fest per Startwert, schon erledigte Wörter ohne Vorrang, `recent` = zuletzt gefragte Wörter gegen Doppel über
  Rundengrenzen); Runden des Durchgangs werden in `useQuiz` nicht noch einmal gemischt. Simulation: jedes Wort
  spätestens nach ~25 % dran (angefangene Durchgänge mit alter Reihenfolge: ~36 %), nie ein Doppel.
- „Na ja, schon fast richtig“ (nur Wortschatz): Kind meldet, Eltern urteilen, Agent wertet aus (siehe oben).
- „Alle Vokabeln“ in Runden à 50 Karten mit Anzeige der restlichen Karten/Runden; in der Oberfläche heißt eine
  Session „Runde“. Serien-Kalender auf der Startseite (Monate als Blöcke, Wochentage als Zeilen).
- Lehrer-Bereich: „Neue Vokabeln“ und „Gesamter Wortschatz“ als eigene Bereiche, alle Listen klappbar, mobil kompakt.
- Audio: Einzelwörter langsamer (0,8) mit 0,8 s Stille davor, damit kurze Wörter wie „air“ nicht verschluckt
  werden (`KIND` in `scripts/generate-audio.py`); Beispielsätze im normalen Tempo.
- Audio-Anlaut (2026-10-13): Kokoro setzt vor Vokal-Anfänge oft Klick + Hauchen („air“ ≈ „hair“). Der Generator
  erzeugt für Einträge mit Vokal/Halbvokal am Anfang mehrere Varianten (Standard, Punkt am Ende, Glottisschlag,
  etwas schneller) und behält die mit dem saubersten Anfang (`onset_score`, Ergebnis als `variant`/`onset` in
  `index.json`). Spricht Kokoro ein Wort falsch aus, Laute direkt vorgeben: `sayPhonemes` in der Vokabel
  (z. B. „what a“ → `wˈɒt ə`, sonst Buchstaben-A). Für Beispielsätze: `sayEx` (anderer gesprochener Text) bzw.
  `sayExPhonemes` (Laute direkt). Französische Stolperfallen (2026-10-19): „BD“ wird zu „boulevard“ (→ `bédé`),
  „sac à dos“ springt bei „dos“ ins Englische (→ Laute `sˈak a dˈo`). Neue Wörter und Sätze vor dem Veröffentlichen
  mit `kokoro.tokenizer.phonemize(text, 'fr-fr')` prüfen – `(en)…(fr)` in der Ausgabe heißt: falsche Sprache.
- Wort-Audio **ohne Artikel** (2026-10-20, Nutzer: „am Anfang voller Fokus auf den puren Begriff“): Französische
  Nomen werden ohne un/une/le/la gesprochen („magasin“), der Artikel steht auf der Karte und im Beispielsatz
  (`speechText` in `src/data/fr6/vocab.js`; Wendungen wie „Bonjour, les amis!“ und „un“ als Zahl bleiben).
  Englisch: Vokabeln stehen ohne Artikel; „a bit“ ist eine feste Wendung und bleibt.
- Design System „Clara & Jakob lernen Sprachen“ (`design-system/`, Regeln in `CLAUDE.md`): eingebunden in
  `src/index.css` (tokens.css ohne Layer, bundle.css im Layer `components`, shadcn-Variablen auf die Tokens
  gemappt), Schriften per `<link>` in `index.html`. Stift über `data-course` am `<body>` (App.jsx) – nicht am
  `<html>`, dort gewinnt tokens.css. Umgebaut: Startseite (Masthead, Kurskarten, Choices, Straßenschild).
- Multiple-Choice-Optionen werden bei jeder Runde gemischt (`useQuiz.js`); das normale Quiz nimmt nur Fragen
  der gewählten Schulaufgabe, ungesehene zuerst.
