# Pill

Small uppercase labels in an outlined pill — the topic of a question (`question.topicLabel`), with the difficulty dots beside it.

- `.vx-qhead` = the row at the top of `QuizQuestion`: topic pill left, three `.vx-dots` right (filled = `question.difficulty`). Keep the `aria-label` *Schwierigkeit: n von 3*.
- `--solid`: unit / exam (*Unité 1*, *Unit 3*). `--lamp`: points earned (*+2 Punkte*) — text stays ink.
- All categories (grammar, vocabulary, reading, mediation) share one style; the topic name carries the meaning.
