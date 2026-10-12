# SessionBreak

The screen after each session of 50 cards: a reward, a clear invitation to take a break, and how much is left — in cards and in sessions.

- Sticker: a *Richtig* sticker of the course (same shuffle bag as the feedback card). Kicker *Session geschafft –* over the display word **PAUSE!**
- Stats pills: cards in this session, how many right (lamp pill).
- The handwritten line says what is left: *Noch <b>87 Karten</b> – nur 2 Sessions, dann bist du durch.* / one left: *Noch <b>23 Karten</b> – nur noch 1 Session!* / none left: replace the whole screen with the ScoreBoard + **Geschafft!**
- Session track as on the ReviewPlan (done pills filled).
- Two buttons: *Nächste Session* (primary, first in the DOM so it gets focus) and *Pause machen* (back to the start page; the plan remembers where they are). Side by side on wider cards with *Pause machen* on the left (`flex-direction: row-reverse`), stacked on phones with *Nächste Session* on top. Under them *Dein Stand ist gespeichert.*
