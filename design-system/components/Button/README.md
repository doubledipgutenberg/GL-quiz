# Button

Pill-shaped actions drawn in the current pen: a 2.5px outline and a hard print-offset shadow that the button sinks into when pressed.

- **Primary** (pen fill): one per screen — *Weiter*, *Antworten*, *Fortsetzen*. Maps to shadcn `variant="default"`.
- **Default** (cream fill, pen text): *Zurück*, *Anhören*, *Aussprache anhören* → `variant="outline"`.
- **Ghost**: *Tipp anzeigen* → `variant="ghost"`. **Link**: footer links (*Lehrer-Bereich*, *Profil wechseln*) → `variant="link"`.
- `--sm` for the speaker button and wizard *Zurück*; `--block` for *Weiter* in feedback.
- Replace the 🔊 emoji with the speaker icon (or lucide `Volume2` at strokeWidth 2.25).
- The colour comes from the nearest `data-course`; never hard-code blue or red.
