# ReviewPlan

The overview before a vocabulary review (*Wortschatz → Alle Vokabeln*): how many cards are left of the whole vocabulary, split into sessions of 50, so a learner can stop after any session and still see how close they are.

- **Headline** = what is left, in sessions: kicker *Nur noch* over the display word — *9 Sessions* … *2 Sessions* … *1 Session*. When nothing is left: kicker *Wortschatz*, display **Geschafft!**, and the button starts a new pass.
- **Count line:** *<b>75</b> von 437 Karten übrig · je 50 Karten*; on the last session *· dann bist du durch!*
- **Math:** `left` = cards of this pass not answered yet; `sessionsLeft = ceil(left / 50)` (a paused session counts as one); `sessionsTotal = sessionsDone + sessionsLeft`. Example: 437 cards = 8 × 50 + 37 → 9 sessions; paused at card 12 of session 8 → 75 left → *Nur noch 2 Sessions*.
- **Session track** (`.vx-sessions`): one pill per session of the pass. Done = filled pen, current = outlined with lamp-yellow fill up to `--fill` (cards done ÷ 50), still to come = dashed. 2–12 pills fit a phone; above 12 the pills just get thinner.
- **Meta line:** *Session 8 von 9* left, *12 / 50 geschafft* right.
- **Button:** *Session 8 starten* when it has not begun, *Weitermachen · noch 38 Karten* when it was paused mid-way, *Letzte Session starten* on the last one.
- Sessions are 50 cards; the last one takes whatever is left. A pass = every card of the course's general vocabulary once (not *Nur neue Vokabeln*, which stays as it is).
- Sticker optional (a Richtig sticker of the course) — leave it out when the card is narrow.
