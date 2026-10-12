import { useEffect, useMemo, useRef, useState } from 'react';
import { activityByDay, streakStats, pointStats, schoolYearMonths, level, dayKey } from '../utils/streak';

// Serien-Kalender auf der Startseite: Kalendermonate als Blöcke, Wochentage als Zeilen (Mo–So),
// Farbtiefe = Punkte an diesem Tag (5 Stufen, siehe level()), immer im roten Stift (en-pen) –
// bewusste Ausnahme vom Design System auf Wunsch des Nutzers; Farbe kommt trotzdem aus den Tokens.
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const FILL = [
  'var(--cream-200)',
  'color-mix(in srgb, var(--pen) 30%, var(--cream-50))',
  'color-mix(in srgb, var(--pen) 48%, var(--cream-50))',
  'color-mix(in srgb, var(--pen) 65%, var(--cream-50))',
  'color-mix(in srgb, var(--pen) 82%, var(--cream-50))',
  'var(--pen)',
];

// Überschrift (vom Nutzer gewählt, 2026-10-12): „5 Tage in Folge geübt!“
function headline({ current, todayDone }) {
  if (current === 0) return 'Starte heute deine Serie!';
  if (todayDone) return current === 1 ? 'Tag 1 - Baue deinen neuen Streak! Eine Runde jeden Tag...' : `${current} Tage in Folge geübt!`;
  return current === 1 ? 'Gestern geübt – bleib dran!' : `${current} Tage in Folge – bleib dran!`;
}

function Stat({ label, value, note }) {
  return (
    <div className="rounded-[var(--radius-sm)] bg-[var(--cream-200)] px-2 py-1.5">
      <span className="vx-label block text-[10px] leading-[14px] tracking-[0.08em]">{label}</span>
      <span className="text-base font-semibold">{value}</span>
      {note && <span className="block text-[11px] leading-[14px] text-[var(--ink-muted)]">{note}</span>}
    </div>
  );
}

// Aus den 12 Monaten des Schuljahrs die Gruppe à n Monate, in der der aktuelle Monat liegt.
function rowWithToday(months, n, now) {
  const idx = Math.max(0, months.findIndex((m) => m.key === `${now.getFullYear()}-${now.getMonth()}`));
  const start = Math.floor(idx / n) * n;
  return months.slice(start, start + n);
}

// Platz pro Monat bei kleinsten Kästchen (12px + 3px Abstand, bis 6 Wochen + Monatsabstand) und für die Wochentage.
const MONTH_MIN = 100;
const LABEL_COL = 26;

// Eine Reihe Monate als EIN Raster: Spalte 1 = Wochentage, dann je Monat seine Wochen-Spalten (teilen sich die
// Breite, Kästchen bleiben quadratisch) und eine schmale Lücke zum nächsten Monat. So füllt die Reihe die Karte.
function MonthRow({ months, counts, today, todayKey }) {
  const weeksOf = (m) => m.cells.length / 7;
  // Spalten: Wochentage | Monat 1 (Wochen) | Lücke | Monat 2 (Wochen) | …
  const columns = [`${LABEL_COL}px`, ...months.flatMap((m, i) => [...(i ? ['6px'] : []), `repeat(${weeksOf(m)}, minmax(0, 1fr))`])];
  // Erste Spalte jedes Monats: 2 + alle Wochen-Spalten und Lücken davor.
  const starts = months.map((_, i) => 2 + months.slice(0, i).reduce((sum, m) => sum + weeksOf(m) + 1, 0));
  return (
    // vx-en: Kalender immer im roten Stift (Wunsch des Nutzers, 2026-10-12) – über die Tokens, nicht fest eingetragen.
    <div className="vx-en grid gap-[3px]" style={{ gridTemplateColumns: columns.join(' '), gridTemplateRows: '16px repeat(7, auto)' }}>
      {WEEKDAYS.map((w, r) => (
        <span key={w} className="self-center text-[10px] leading-none text-[var(--ink-muted)]" style={{ gridColumn: 1, gridRow: r + 2 }}>
          {w}
        </span>
      ))}
      {months.map((m, i) => (
        <span
          key={`${m.key}-label`}
          className="vx-label text-[10px] leading-[16px]"
          style={{ gridColumn: `${starts[i]} / span ${weeksOf(m)}`, gridRow: 1 }}
        >
          {m.label}
        </span>
      ))}
      {months.flatMap((m, i) =>
        m.cells.map((d, k) => {
          if (!d) return null;
          const key = dayKey(d);
          const day = counts.get(key);
          const future = d > today && key !== todayKey;
          return (
            <span
              key={key}
              title={`${d.toLocaleDateString('de-DE')}: ${day?.answers || 0} Antworten · ${day?.points || 0} Punkte`}
              className="aspect-square max-w-[28px] rounded-[3px]"
              style={{
                gridColumn: starts[i] + Math.floor(k / 7),
                gridRow: (k % 7) + 2,
                background: future ? 'transparent' : FILL[level(day)],
                outline: key === todayKey ? '2px solid var(--lamp-300)' : future ? '1px dashed var(--rule-soft)' : 'none',
                outlineOffset: key === todayKey ? 1 : -1,
              }}
            />
          );
        }),
      )}
    </div>
  );
}

export default function StreakCalendar({ sessions }) {
  const today = useMemo(() => new Date(), []);
  const counts = useMemo(() => activityByDay(sessions), [sessions]);
  const stats = useMemo(() => streakStats(counts, today), [counts, today]);
  const year = useMemo(() => schoolYearMonths(today), [today]);
  const pts = useMemo(() => pointStats(sessions), [sessions]);
  const bestDate = pts.best
    ? new Date(`${pts.best.key}T12:00:00`).toLocaleDateString('de-DE', { day: 'numeric', month: 'numeric' })
    : null;
  const todayKey = dayKey(today);
  const tage = (n) => `${n} ${n === 1 ? 'Tag' : 'Tage'}`;
  const punkte = (n) => `${n} ${n === 1 ? 'Punkt' : 'Punkte'}`;

  // So viele Monate, wie in die Breite passen (gemessen), mindestens 3.
  const rowRef = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = rowRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const monthCount = Math.min(12, Math.max(3, Math.floor((width - LABEL_COL) / MONTH_MIN)));

  return (
    <section className="vx-card gap-4" aria-label="Deine Übungs-Serie">
      <div className="flex items-center gap-2">
        <i className="vx-ico vx-ico--streak-flame text-[var(--pen)]" aria-hidden="true" />
        <span className="vx-hand">{headline(stats)}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
        <Stat label="Rekord" value={tage(stats.longest)} />
        <Stat label="Geübt an" value={tage(stats.days)} />
        <Stat label="Runden" value={pts.rounds} />
        <Stat label="Antworten" value={stats.answers} />
        <Stat label="Gesamt" value={punkte(pts.points)} />
        <Stat label="Bester Tag" value={punkte(pts.best?.points ?? 0)} note={bestDate ? `am ${bestDate}` : null} />
      </div>

      {/* Eine Reihe aus dem Schuljahr (beginnt im September) mit dem aktuellen Monat – so viele Monate, wie
          Platz haben; die Kästchen füllen die Breite. */}
      <div ref={rowRef}>
        <MonthRow months={rowWithToday(year.months, monthCount, today)} counts={counts} today={today} todayKey={todayKey} />
      </div>
    </section>
  );
}
