# Feedback

The card after each answer (`FeedbackCard.jsx`): a handwritten verdict, the answers, the explanation, the pronunciation button, a quote, and *Weiter*.

- **Richtig!** olive + check + a lamp pill *+{points} Punkt(e)*. **Nicht ganz…** ochre + cross, then *Deine Antwort* (struck through) and *Richtig ist* (in the word serif). Never red.
- `question.explanation` in one or two short sentences.
- **Sticker** (left, 112px wide, slightly tilted, pops in): one from the **Stickers** set, picked at random for this verdict and course — see the FeedbackSticker card for the rotation rules. Its `exclaim` (in the course language) sits as a handwritten kicker above the verdict; its German `line` is the quote. This replaces the mascot pictures and quotes.
- *Weiter* is full width in the verdict colour and keeps `autoFocus`.
- The sheet takes its colour from the verdict, not the course pen.
