# ProgressLights

Quiz progress drawn as café string lights: one bulb per question, answered ones lit, the current one with a dashed glow. Replaces `ProgressBar.jsx`.

- Meta line above: *Frage {current} von {total}* left, *{score} Punkte* right in ink.
- Up to 15 questions: lights. More than 15: the plain `.vx-track` bar with the same meta line.
- Bulbs don't show right/wrong — progress is about getting through, not about mistakes.
- It is a `progressbar`: keep `aria-valuenow` / `aria-valuemax`.
