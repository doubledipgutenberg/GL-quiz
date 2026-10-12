# ReviewPlan

The overview before a vocabulary review (*Wortschatz → Alle Vokabeln*): how many cards are left of the whole vocabulary, split into rounds of 50, so a learner can stop after any round and still see how close they are.

- **Headline** = what is left, in rounds: kicker *Nur noch* over the display word — *9 Runden* … *2 Runden* … *1 Runde*. When nothing is left: kicker *Wortschatz*, display **Geschafft!**, and the button starts a new pass.
- **Count line:** *<b>75</b> von 437 Karten übrig · je 50 Karten*; on the last round *· dann bist du durch!*
- **Math:** `left` = cards of this pass not answered yet; `roundsLeft = ceil(left / 50)` (a paused round counts as one); `roundsTotal = roundsDone + roundsLeft`. Example: 437 cards = 8 × 50 + 37 → 9 rounds; paused at card 12 of round 8 → 75 left → *Nur noch 2 Runden*.
- **Round track** (`.vx-rounds`): one pill per round of the pass. Done = filled pen, current = outlined with lamp-yellow fill up to `--fill` (cards done ÷ 50), still to come = dashed. 2–12 pills fit a phone; above 12 the pills just get thinner.
- **Meta line:** *Runde 8 von 9* left, *12 / 50 geschafft* right.
- **Button:** *Runde 8 starten* when it has not begun, *Weitermachen · noch 38 Karten* when it was paused mid-way, *Letzte Runde starten* on the last one.
- Rounds are 50 cards; the last one takes whatever is left. A pass = every card of the course's general vocabulary once (not *Nur neue Vokabeln*, which stays as it is).
- **Wording:** in the app the 50-card units are always called **Runde / Runden** (*Runde 8 von 9*, *Nur noch 2 Runden*, *Nächste Runde*) — never *Session*.
- Sticker optional (a Richtig sticker of the course) — leave it out when the card is narrow.
