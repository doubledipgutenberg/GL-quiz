# QuizOption

One answer for `multiple_choice` (A, B, C…) and the two big buttons of `reading_true_false` (`.vx-tf`, labels from `question.tfLabels`).

- In the app a tap submits right away, so the live states are default → pressed. Show the result states only if you add a review step.
- Result states: `.is-correct` (olive + check + *Richtig*), `.is-wrong` (ochre + cross + *Deine Wahl*), everything else `.is-dimmed`. Never colour alone, and never red — red is the English pen.
- Key letters are a circle, not `A)` text. Gap between options `space-3`.
