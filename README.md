# Lern-Quiz Klasse 6d

Übungs-Quiz für Englisch und Französisch: Grammatik, Vokabeln, Leseverstehen und Sprachmittlung,
passend zu den Schulaufgaben. Kinder melden sich mit Namen und PIN an. Der Fortschritt wird auf dem
Server gespeichert und gilt auf jedem Gerät. Eltern sehen im Lehrer-Bereich die Schwächen und können
gezielte Wiederholungs-Quizze starten.

- **Live:** <https://klasse-6d.space.fast/> (Spacefast, passwortgeschützt)
- **Ablauf, Einrichtung, Referenz:** [`docs/WORKFLOW.md`](docs/WORKFLOW.md)
- **Regeln für Agenten:** [`CLAUDE.md`](CLAUDE.md)

## Kurz

```bash
npm install
npm run dev                          # Oberfläche lokal (Backend siehe WORKFLOW §3)
npm run build
npm run check:names
scripts/setup-spacefast.sh           # einmalig: Node 22 + Spacefast-CLI
scripts/setup-kokoro.sh              # einmalig: Sprachausgabe für Vokabel-Audios
scripts/publish-spacefast.sh "Notiz" # veröffentlichen
```

| Ordner | Inhalt |
|---|---|
| `src/` | React-App (Vite, Tailwind) |
| `src/data/` | Kurse, Schulaufgaben, Fragen, Vokabeln |
| `functions/api/` | Spacefast-Backend (Login, PINs, Speichern) |
| `public/audio/` | Vokabel-Audios der 6. Klasse (Kokoro, vorab erzeugt) |
| `scripts/` | Setup, Vertonung, Namensprüfung, Veröffentlichen |
