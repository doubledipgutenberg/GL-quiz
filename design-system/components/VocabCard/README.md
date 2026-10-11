# VocabCard

The prompt for vocabulary questions: `vocab_card` shows the word to translate in the café-sign serif; `listen_card` shows only a big round speaker button.

- `vocab_card`: optional spot illustration (when the word has one), `question.instruction`, the multi-term hint in the pen colour (*· Es gibt 2 Begriffe.*), `question.word` in `word-xl`, speaker button if `promptAudio`.
- `listen_card`: plays once on appear; the 88px primary button replays (*Nochmal anhören*).
- The card's ground is `plate` (stays cream at night) so illustrations always sit on paper; its text is fixed navy for the same reason.
- The answer field below is the AnswerInput.
