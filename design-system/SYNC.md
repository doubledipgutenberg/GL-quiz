# design-system/ — Spiegel des Design Systems

**Nicht von Hand ändern.** Dieser Ordner ist eine Kopie des Design Systems *Clara & Jakob lernen Sprachen*.
Die Quelle ist das Artifact https://claude.ai/artifact/SXhyLTqocWhEDThbK8kxXa. Änderungen am Design passieren dort, danach mit `/sync-design` neu holen.

- Stand: Version `1791991266-46f9` · synchronisiert 2026-10-14 15:21 UTC
- `README.md` — Markenbuch: Regeln, Farben, Typo, Mapping auf shadcn/Tailwind (Abschnitt „Using it in the app“)
- `tokens.json` — die Tokens (Quelle); `tokens.css` — daraus erzeugt (CSS-Variablen, `.dark` für Nacht)
- `components/bundle.css` — Klassen `.vx-*` der Referenz-Komponenten; `components/<Name>/README.md` Regeln, `preview.html` Ansicht (im Browser öffnen)
- `assets/Illustrations`, `assets/Icons`, `assets/Stickers` — SVGs (Paris blau, London rot); `assets/AppIcon` — App-Symbol (PNGs + SVG-Master, siehe `components/AppIcon/README.md`)
- `design-system.json` — Index des Artifacts (Asset-IDs), wird vom Sync gebraucht
