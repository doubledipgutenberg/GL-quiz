// Übungs-Serie für die Startseite: Antworten pro Kalendertag und Serien (Tage am Stück).
// Tag einer Antwort = `at` (seit 2026-10-12 je Antwort gespeichert), bei älteren Einträgen der
// letzte Speicherzeitpunkt bzw. der Start der Runde.

export const dayKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Map 'YYYY-MM-DD' → { answers, points } (lokale Zeit). */
export function activityByDay(sessions) {
  return daysOf(sessions);
}

// Punkte wie im Quiz (calculatePoints): Schwierigkeit der Frage, wenn richtig.
const pointsOf = (a) => (a.isCorrect ? a.difficulty || 1 : 0);

/** Map 'YYYY-MM-DD' → { answers, points }. */
function daysOf(sessions) {
  const days = new Map();
  for (const s of sessions || []) {
    const fallback = s.updatedAt || s.date;
    for (const a of s.answers || []) {
      const iso = a.at || fallback;
      if (!iso) continue;
      const key = dayKey(new Date(iso));
      const d = days.get(key) || { answers: 0, points: 0 };
      d.answers += 1;
      d.points += pointsOf(a);
      days.set(key, d);
    }
  }
  return days;
}

/** Punkte gesamt, bester Tag (meiste Punkte) und Zahl der Runden. */
export function pointStats(sessions) {
  let points = 0;
  let best = null;
  for (const [key, d] of daysOf(sessions)) {
    points += d.points;
    if (d.points > 0 && (!best || d.points > best.points)) best = { key, points: d.points };
  }
  const rounds = (sessions || []).filter((s) => (s.answers || []).length > 0).length;
  return { points, best, rounds };
}

const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** Aktuelle Serie (bis heute; zählt auch, wenn heute noch nicht geübt wurde), längste Serie, Übungstage. */
export function streakStats(days, today = new Date()) {
  const has = (d) => (days.get(dayKey(d))?.answers || 0) > 0;
  let current = 0;
  let d = has(today) ? today : addDays(today, -1);
  while (has(d)) {
    current += 1;
    d = addDays(d, -1);
  }
  const active = [...days.keys()].filter((k) => days.get(k).answers > 0).sort();
  let longest = 0;
  let run = 0;
  let prev = null;
  for (const k of active) {
    const [y, m, dd] = k.split('-').map(Number);
    const cur = new Date(y, m - 1, dd);
    run = prev && dayKey(addDays(prev, 1)) === k ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = cur;
  }
  const answers = [...days.values()].reduce((sum, d) => sum + d.answers, 0);
  return { current, longest, days: active.length, answers, todayDone: has(today) };
}

/**
 * Farbstufe eines Tages nach Punkten (Vorgabe des Nutzers, 2026-10-12): 0 = nicht geübt,
 * 1 = 0–50, 2 = 51–100, 3 = 101–150, 4 = 151–250, 5 = ab 251 Punkte.
 */
export function level(day) {
  if (!day || !day.answers) return 0;
  const p = day.points;
  if (p <= 50) return 1;
  if (p <= 100) return 2;
  if (p <= 150) return 3;
  if (p <= 250) return 4;
  return 5;
}

/**
 * Das Schuljahr als Kalendermonate (Wunsch des Nutzers): September bis August. Pro Monat Spalten = Wochen
 * (Mo–So), Zeilen = Wochentage; Zellen außerhalb des Monats sind null. Ab September beginnt das neue Schuljahr.
 */
export function schoolYearMonths(today = new Date()) {
  const startYear = today.getMonth() >= 8 ? today.getFullYear() : today.getFullYear() - 1;
  const months = [];
  for (let i = 0; i < 12; i++) {
    const first = new Date(startYear, 8 + i, 1);
    const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
    const lead = (first.getDay() + 6) % 7; // Montag = 0
    const cells = [];
    for (let k = 0; k < lead; k++) cells.push(null);
    for (let day = 1; day <= last.getDate(); day++) cells.push(new Date(first.getFullYear(), first.getMonth(), day));
    while (cells.length % 7) cells.push(null);
    months.push({
      key: `${first.getFullYear()}-${first.getMonth()}`,
      label: first.toLocaleDateString('de-DE', { month: 'short' }).replace('.', ''),
      cells,
    });
  }
  return { label: `Schuljahr ${startYear}/${String((startYear + 1) % 100).padStart(2, '0')}`, months };
}
