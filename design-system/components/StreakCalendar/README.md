# StreakCalendar

The learner's practice days on the start page, like a contribution heatmap but readable as a calendar: **one block per month, weekdays as rows (Mo at the top), weeks as columns**. Each day is a little window that lights up when they practised — the lamp-yellow of the design system.

- **Levels** by cards answered that day (all courses together): 0 = `cream-200` (not practised), 1 = `lamp-100` (1–19), 2 = `lamp-300` (20–49), 3 = `lamp-500` (50+). At night the windows glow brighter instead of darker.
- **Today**: ring in the pen. **Future days** of the current month: faint outline. **Days before the 1st / after the last** of a month: empty (`.is-blank`) so every month starts on its real weekday.
- **Grid math** per month: `offset = (weekday of the 1st, Mo=0)`; day *d* sits at `row = weekday(d)`, `column = floor((d − 1 + offset) / 7)`. Render `offset` blank cells, then the days, in a CSS grid with `grid-auto-flow: column` and 7 rows.
- **How many months:** always render the last **6** (current month last). The CSS shows as many as fit, via container queries on `.vx-streak`: **3** on phones (card < 420px, 12px cells), **4** from 420px (13px), **6** from 640px (14px). Nothing to measure in JS. If a 6-week month ever overflows, `.vx-cal` scrolls sideways — set `scrollLeft = scrollWidth` once so today is visible.
- **Month names** above each block (*Jul, Aug, Sep, Okt*), the current one in the pen. Weekday labels *Mo · Mi · Fr · So* once on the left.
- **Stats above:** streak pill in lamp with the flame (*5 Tage am Stück*; *1 Tag am Stück*; none → *Heute schon geübt?* in an outline pill without flame), and *Rekord 12* with the star. A streak counts consecutive days with ≥ 1 card; it is not broken until today has passed (yesterday practised, today not yet → streak still shows).
- **Footer:** *<b>38</b> Tage geübt* (all time) on the left, legend *weniger* ▢▢▢▢ *mehr* on the right.
- Each day has a `title` / accessible label: *Mo, 6. Okt · 42 Karten*; the whole calendar has `role="img"` and a summary label.
- On the start page it sits under the masthead, in the house pen (navy); the course pens don't apply here.
