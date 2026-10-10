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

Datei `VOCAB_<KURS>_<PRÜFUNG>_review.md` (Beispiel: `VOCAB_SA4_review.md`), **eine Liste pro Buchseite**,
in Buchreihenfolge, mit den Abschnittsüberschriften des Buchs. Pro Zeile `wort – Übersetzung`, genau
wie gedruckt (inkl. `to`, `(pl)`, `(AE)`, `(BE)`, Akzente). Kästen mit 📦 markieren. Wo der Stoffzettel
den Bereich mitten auf einer Seite beginnen/enden lässt: markieren und **nachfragen**, nicht raten.

Der Nutzer prüft und entscheidet (z. B. welche Kästen/Randwörter rausfallen). Erst danach weiter.

### 2.3 Datendateien

- **Kurse** stehen in `COURSES` in `src/data/questions.js` (`en-6`, `fr-6`, `en-5`).
  Ein Kurs ohne Schulaufgaben erscheint als „Inhalte kommen bald“.
- **Schulaufgabe registrieren:** Eintrag in `EXAMS` mit `id`, `course`, `label`, `units`, `subtitle`.
  Die neueste Schulaufgabe eines Kurses (letzter Eintrag) ist vorausgewählt.
- **Vokabeln:** eigene Datei je Prüfung (Vorbild: `src/data/vocabListSA4.js`), Format `wort – Übersetzung`,
  mehrere Bedeutungen mit `;`. Daraus entstehen je Vokabel zwei Karten (hin und zurück).
- **Fragen:** eigene Datei je Prüfung (Vorbild: `src/data/questionsSA4.js`) und in `questions.js`
  mit dem passenden `exam` zusammenführen.
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

**Französisch (Entscheidung des Nutzers):** Ein fehlender oder falscher Akzent zählt als **falsch**.
Artikel `le/la/l'/les/un/une/des` werden wie die englischen Artikel behandelt. Unter dem Eingabefeld gibt
es Akzent-Tasten (é è ê à ç ô …), sobald die Antwort auf Französisch erwartet wird.

### 2.5 Audio (nur Klasse 6)

Klasse 5 wird **nicht** vertont. Für Kurse der 6. Klasse:

1. Manifest erzeugen: `{"course": "fr-6", "items": [{"id", "text", "lang"}]}`. `text` ist das, was
   gesprochen wird, also ohne Hinweise wie `(pl)` oder `…`.
2. Vertonen:
   ```bash
   ~/.local/kokoro/venv/bin/python -I scripts/generate-audio.py MANIFEST.json --out public/audio --prune
   ```
3. Ergebnis `public/audio/<kurs>/<id>.m4a` + `index.json` **einchecken** (je ca. 10 KB).

Freigegebene Stimmen: Französisch `ff_siwis` mit Tempo 0.9, Englisch (britisch) `bf_emma` mit 0.95,
optional `bm_george`. Das Skript erzeugt nur neue oder geänderte Einträge. Das Modell und die
Python-Umgebung gehören **nicht** ins Repo (325 MB, rechnerspezifisch); das Setup-Skript stellt sie
jederzeit wieder her.

*Noch offen (kommt mit dem ersten Inhalt der 6. Klasse):* Manifest automatisch aus den Vokabel-Dateien
erzeugen, 🔊-Button auf Vokabelkarten, Modus „Hören & Schreiben“, Akzent-Tasten.

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

---

## 6. Entscheidungen des Nutzers (Stand 2026-10-10)

- Hosting komplett auf Spacefast (statt Supabase), Space `klasse-6d`, Familien-Passwort, nur die eigenen
  Kinder (Jakob, Clara). Wo Spacefast die Daten speichert (EU?), ist nicht dokumentiert. Das wurde akzeptiert.
- Antwort-Check freundlich bei der Form, streng bei der Rechtschreibung. Französisch: fehlender Akzent = falsch.
- Akzent-Tasten: ja. Audio: nur Klasse 6, Kokoro, Stimmen wie oben.
- Englisch 6 = Band 2 des Englisch-Lehrwerks, Französisch 6 = Découvertes 1 (Klett). Der Name des
  Englisch-Lehrwerks steht nirgends im Repo.
- Die alte GitHub-Pages-Seite bleibt online (enthält die alten, lokal gespeicherten Ergebnisse).
