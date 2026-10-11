# Choice

One choice in the welcome wizard (Schulaufgabe → Modus → Vokabeln) and in the *Runde fortsetzen* list: icon disc, title, subtitle, arrow.

- Replaces `stepButtonClass` buttons in `WelcomeScreen.jsx`. Step number in `label`, question in `title`.
- Icon per mode: grammar = *Normales Quiz*, book = *Wortschatz*, repeat = *Nur neue Vokabeln* / *Fortsetzen*, signpost = an exam.
- Disabled (*Inhalte kommen bald*): dashed border, no shadow, no arrow.
- Step 1 (*Was übst du?*) uses Course cards instead.
