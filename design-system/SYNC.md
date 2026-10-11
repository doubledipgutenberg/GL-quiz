# design-system/ — Spiegel des Design Systems

**Nicht von Hand ändern.** Dieser Ordner ist eine Kopie des Design Systems *Clara & Jakob lernen Sprachen*.
Die Quelle ist das Artifact https://claude.ai/artifact/SXhyLTqocWhEDThbK8kxXa. Änderungen am Design passieren dort, danach mit `/sync-design` neu holen.

- Stand: Version `1791719831-0e2f` · synchronisiert 2026-10-11 11:59 UTC
- `README.md` — Markenbuch: Regeln, Farben, Typo, Mapping auf shadcn/Tailwind (Abschnitt „Using it in the app“)
- `tokens.json` — die Tokens (Quelle); `tokens.css` — daraus erzeugt (CSS-Variablen, `.dark` für Nacht)
- `components/bundle.css` — Klassen `.vx-*` der Referenz-Komponenten; `components/<Name>/README.md` Regeln, `preview.html` Ansicht (im Browser öffnen)
- `assets/Illustrations`, `assets/Icons` — SVGs (Paris blau, London rot)
- `design-system.json` — Index des Artifacts (Asset-IDs), wird vom Sync gebraucht
