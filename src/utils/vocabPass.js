// Wortschatz in Runden (Entscheidung des Nutzers, 2026-10-12): „Alle Vokabeln“ läuft nicht mehr als eine
// riesige Runde, sondern als Durchgang durch den ganzen Wortschatz in Runden à 50 Karten. Das Kind kann nach
// jeder Runde Pause machen; angezeigt wird, wie viele Karten und Runden noch übrig sind.
// Pro Kind und Schulaufgabe ein Durchgang: feste, zufällige Reihenfolge (seed) + erledigte Karten (done).
// Jede beantwortete Karte zählt sofort als erledigt. Ist alles erledigt, beginnt der nächste Durchgang.
// „Nur neue Vokabeln“ ist davon nicht betroffen (kleiner Ausschnitt, eine Runde).
import { getVocabularyQuestions } from '../data/questions';
import { getVocabProgress, setVocabProgress } from './storage';

export const ROUND_SIZE = 50;

// Kleiner Zufallsgenerator mit Startwert – dieselbe Reihenfolge auf jedem Gerät.
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(list, seed) {
  const rnd = mulberry32(seed);
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const entryOf = (name, exam) => getVocabProgress()[name]?.[exam] || null;

function cardsOf(exam) {
  const cards = getVocabularyQuestions(exam);
  return { cards, ids: cards.map((c) => c.id).sort() };
}

function summarize(ids, entry) {
  const all = new Set(ids);
  const done = new Set((entry?.done || []).filter((id) => all.has(id)));
  const total = ids.length;
  const remaining = total - done.size;
  const roundsTotal = Math.max(1, Math.ceil(total / ROUND_SIZE));
  const roundsLeft = Math.ceil(remaining / ROUND_SIZE);
  return {
    total,
    done: done.size,
    remaining,
    roundsTotal,
    roundsLeft,
    round: Math.min(roundsTotal, roundsTotal - roundsLeft + 1), // Nummer der nächsten Runde
    pass: entry?.pass || 1,
    complete: total > 0 && remaining === 0,
    started: !!entry && done.size > 0,
    doneSet: done,
  };
}

/** Stand des Durchgangs für Anzeige (Startseite, Ergebnisseite). */
export function vocabPassStatus(name, exam) {
  const { ids } = cardsOf(exam);
  const status = summarize(ids, entryOf(name, exam));
  delete status.doneSet;
  return status;
}

/** Die nächste Runde: bis zu 50 noch nicht geübte Karten. Startet bei Bedarf einen neuen Durchgang. */
export function planVocabRound(name, exam) {
  const { cards, ids } = cardsOf(exam);
  let entry = entryOf(name, exam);
  let s = summarize(ids, entry);
  if (!entry || s.complete) {
    entry = {
      pass: (entry?.pass || 0) + 1,
      seed: Math.floor(Math.random() * 2 ** 31),
      done: [],
      startedAt: new Date().toISOString(),
    };
    setVocabProgress(name, exam, entry);
    s = summarize(ids, entry);
  }
  const byId = new Map(cards.map((c) => [c.id, c]));
  const next = seededShuffle(ids, entry.seed)
    .filter((id) => !s.doneSet.has(id))
    .slice(0, ROUND_SIZE)
    .map((id) => byId.get(id));
  return next;
}

/** Beantwortete Karten als erledigt eintragen (Auto-Save nach jeder Antwort). */
export function markVocabDone(name, exam, questionIds) {
  const entry = entryOf(name, exam);
  if (!entry || !questionIds?.length) return;
  const done = new Set(entry.done || []);
  const before = done.size;
  questionIds.forEach((id) => done.add(id));
  if (done.size === before) return;
  setVocabProgress(name, exam, { ...entry, done: [...done] });
}

// Text zum Wortschatz-Durchgang (Runden à 50 Karten), z. B. „Runde 3 von 7 · noch 212 Karten (5 Runden)“.
export function passText(st) {
  if (!st || st.total === 0) return null;
  if (st.complete) return `Alles geschafft! Nächster Durchgang: ${st.total} Karten in ${st.roundsTotal} Runden`;
  const rounds = `${st.roundsLeft} ${st.roundsLeft === 1 ? 'Runde' : 'Runden'}`;
  const tail = st.roundsLeft <= 2 ? ` – nur noch ${rounds}, dann bist du durch!` : ` (${rounds})`;
  return `Runde ${st.round} von ${st.roundsTotal} · noch ${st.remaining} von ${st.total} Karten${tail}`;
}
