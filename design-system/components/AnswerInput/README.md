# AnswerInput

The typed answer: a big pen-outlined field, the *Antworten* button, and — for French (`answerLang === 'fr'`) — a row of accent keys.

- Placeholder *Deine Antwort…*; focus shows the lamp-yellow ring, never a grey one.
- *Antworten* stays disabled until there is text.
- Accent keys are 40×40 tiles in the word serif (é è ê ë à â ç î ï ô û ù œ); they keep focus in the field (`onMouseDown` preventDefault).
