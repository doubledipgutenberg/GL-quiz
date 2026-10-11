# Clara & Jakob lernen Sprachen

The look of the family vocabulary-and-grammar quiz for Clara and Jakob — **Französisch** set in **Paris**, **Englisch** set in **London** — drawn like a café poster: one bold pen on warm cream paper, a chunky headline word, lit windows in lamp yellow.

Each language has its own pen. **French draws in cobalt blue** (Paris street plaques); **English draws in postbox red** (London buses, phone boxes). Everything else — paper, ink, lamp light, type, shapes — is shared, so the two courses feel like one app.

## Content fundamentals

- **The app speaks German** (*Weiter*, *Antworten*, *Tipp anzeigen*, *Richtig!*, *Nicht ganz…*) — it is for German pupils in Klasse 5–6. Use *du*, short sentences, and be encouraging.
- **The learned language appears as material**: the words, the example sentences, and the course card kickers (*Vivre à* / **PARIS**, *Living in* / **LONDON**).
- **Every lesson lives somewhere.** Illustrations, unit names and examples belong to the course's city. Never mix Paris and London in one course.
- Verdicts are short and kind: *Richtig! +2 Punkte*, *Nicht ganz…*, then the right answer and one sentence of explanation. Grade words: *Fantastisch!*, *Super!*, *Gut gemacht!*, *Nicht schlecht!*, *Weiter üben!*.

## Visual foundations

**One pen per course.** Components only use the aliases `pen`, `pen-strong`, `pen-tint` and `pen-shadow`. Setting `data-course="fr"` or `data-course="en"` on a screen points them at:

| | French · Paris | English · London | Before a course is picked |
|---|---|---|---|
| `pen` | `fr-pen` #1F45A8 cobalt | `en-pen` #BA2820 postbox red | `house-pen` #142554 navy |
| `pen-tint` | `fr-tint` (the Seine) | `en-tint` (the Thames) | `house-tint` |
| Illustrations | `paris-scene` + Paris spots | `london-scene` + London spots | both, in the Masthead awning |

**Paper, not white.** The ground is `cream-100`; raised things are `cream-50`; wells, hovers and hints are `cream-200`. Text is navy `ink`, which sits with both pens. The Night theme turns the paper into a navy night sky and lightens both pens. Illustrations keep their cream `plate`.

**Bold strokes.** Controls use `stroke-ui` (2.5px), pills and icons `stroke-hair` (2px), and emphasis `stroke-bold` (3.5px), all matching the drawings. No grey borders.

**Print shadow.** No blur anywhere. Raised things get a hard 3px offset in the pen (`3px 3px 0 var(--pen-shadow)`) and sink into it when pressed.

**Signal colours** never borrow a pen:

| Token | Meaning |
|---|---|
| `olive-600` / `olive-100` | Richtig — always with the check icon |
| `ochre-600` / `ochre-100` | Nicht ganz — always with the cross icon. **Never red**: red is the English pen |
| `lamp-300` | Light and reward: answered questions, points, focus ring. Text on it is navy |

**Type.** Four voices, one job each:
- **Bricolage Grotesque 800** (`display`): one uppercase poster word per screen, in the pen — **PARIS**, **LONDON**, **SUPER!**, **SPRACHEN**.
- **Fraunces** (`word`): the words being learned (vocab card, chips, the right answer).
- **Caveat** (`hand`): kickers, verdicts, hints, quotes.
- **Outfit** (`sans`): everything else.

The signature is a handwritten kicker tilted −3° over one display word: *Vivre à* / **PARIS**, *Living in* / **LONDON**, *Das war* / **SUPER!**, *Clara & Jakob lernen* / **SPRACHEN**.

**Motifs.** The *awning* tops course cards and the masthead. *String lights* show progress through a quiz, and a *ring of bulbs* shows the score. *Street plaques* name exams and units. *Paper tiles* hold the words to put in order.

**Layout.** Phone first, single column, max width 400–420px as in the app. Gutters `space-4`, card padding `space-6`. One primary button per screen.

## Using it in the app (shadcn + Tailwind v4)

The app's `src/index.css` already uses shadcn variables. Point them at this system and every `Button`, `Card`, `Input` and `Progress` follows. Then set `data-course` from `course.lang` on the app's root `<div>`.

```css
:root {
  --background: var(--cream-100);  --foreground: var(--ink);
  --card: var(--cream-50);         --card-foreground: var(--ink);
  --popover: var(--cream-50);      --popover-foreground: var(--ink);
  --primary: var(--pen);           --primary-foreground: var(--on-pen);
  --secondary: var(--cream-200);   --secondary-foreground: var(--ink);
  --muted: var(--cream-200);       --muted-foreground: var(--ink-muted);
  --accent: var(--pen-tint);       --accent-foreground: var(--ink);
  --destructive: var(--ochre-600); --success: var(--olive-600);
  --border: var(--pen);  --input: var(--pen);  --ring: var(--lamp-300);
  --radius: 14px;  --shadow: 3px 3px 0 var(--pen-shadow);
}
/* tokens.css supplies --cream-100 … --pen; [data-course] rules come from bundle.css */
```

Replace the 🔊 emoji with the speaker icon (or lucide `Volume2`, `strokeWidth={2.25}`). Swap `border` for `border-[2.5px]`, and use `rounded-full` on buttons.

## Iconography & illustration

24px line icons with the same pen (see **Icons**). The illustrations (see **Illustrations**) are the heart of the system:
- Paris, in blue: the street scene with the Eiffel Tower, café table, croissant, coffee and awning.
- London, in red: the street scene with Big Ben and the double-decker, phone box, tea and umbrella.

They are flat: pen line, cream fill, lamp for light, tint for water.

## Do / don't

- Do set `data-course` once per screen. Never hard-code blue or red in a component.
- Do pair Richtig / Nicht ganz colours with an icon and a word.
- Don't use red for mistakes, ever.
- Don't use gradients, blurred shadows, emoji or photos.
