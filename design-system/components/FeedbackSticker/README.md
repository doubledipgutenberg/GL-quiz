# FeedbackSticker

A random sticker on every feedback card: 32 little textured characters, 20 for *Richtig!* and 12 for *Nicht ganz…*, each in the Paris (blue) or London (red) course colour. The pose carries the feeling: cheering, thumbs up, star eyes, clapping, jumping; or shrugging, "oops", thinking, reaching for a star that is just out of reach.

- **Data:** `assets/Stickers/stickers.json` — one entry per sticker: `file`, `course` (`fr` | `en`), `verdict` (`richtig` | `nicht-ganz`), `exclaim` (in the course language, e.g. *Youpi !*, *Spot on!*, *Presque !*, *Nearly!*) and `line` (German, one short warm sentence).
- **Pick:** filter by the course's `lang` (Englisch 5 and 6 → `en`) and the verdict.
- **Rotate with a shuffle bag:** shuffle the pool, hand them out one by one, reshuffle when empty. The first of a new bag is never the last one shown. Keep the bag per course and verdict for the whole round, so a learner sees every sticker before any repeats.
- **Show:** 112px wide (the SVGs are 220×226, no frame, a soft ground shadow), a random tilt between −4° and +4°, a short pop-in (off when `prefers-reduced-motion`). `exclaim` is the handwritten kicker above the verdict; `line` replaces the quote.
- Stickers are decoration: `alt=""`. The verdict text and icon carry the meaning.
