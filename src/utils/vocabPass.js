// Wortschatz in Runden (Entscheidung des Nutzers, 2026-10-12): „Alle Vokabeln“ läuft nicht mehr als eine
// riesige Runde, sondern als Durchgang durch den ganzen Wortschatz in Runden à 50 Karten. Das Kind kann nach
// jeder Runde Pause machen; angezeigt wird, wie viele Karten und Runden noch übrig sind.
// Pro Kind und Schulaufgabe ein Durchgang: feste, zufällige Reihenfolge (seed) + erledigte Karten (done).
// Jede beantwortete Karte zählt sofort als erledigt. Ist alles erledigt, beginnt der nächste Durchgang.
// Reihenfolge: erst jedes Wort einmal, dann die weiteren Kartentypen (siehe planVocabRound, spreadCards.js).
// „Nur neue Vokabeln“ ist davon nicht betroffen (kleiner Ausschnitt, eine Runde).
import { getVocabularyQuestions } from '../data/questions';
import { getVocabProgress, setVocabProgress } from './storage';
import { spreadByWord, wordOf, MIN_GAP } from './spreadCards';

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

// Rechnung wie im Design System (ReviewPlan): Runden à 50 mit festen Grenzen – erledigt = abgeschlossene
// Runden × 50 + `cur` Karten der laufenden Runde. Die letzte Runde nimmt, was übrig ist.
function summarize(ids, entry) {
  const all = new Set(ids);
  const done = new Set((entry?.done || []).filter((id) => all.has(id)));
  const total = ids.length;
  const remaining = total - done.size;
  // Alles erledigt: auch die letzte, kürzere Runde zählt als abgeschlossen.
  const roundsDone = remaining === 0 ? Math.ceil(done.size / ROUND_SIZE) : Math.floor(done.size / ROUND_SIZE);
  const roundsLeft = Math.ceil(remaining / ROUND_SIZE);
  const roundsTotal = Math.max(1, roundsDone + roundsLeft);
  const cur = remaining === 0 ? 0 : done.size - roundsDone * ROUND_SIZE; // in der laufenden Runde schon geschafft
  const size = Math.min(ROUND_SIZE, cur + remaining); // Größe der laufenden Runde
  return {
    total,
    done: done.size,
    remaining,
    roundsDone,
    roundsLeft,
    roundsTotal,
    round: Math.min(roundsTotal, roundsDone + 1), // Nummer der laufenden bzw. nächsten Runde
    cur,
    size,
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

/**
 * Die nächste Runde: die restlichen Karten der laufenden Runde (size − cur), damit die Grenzen stabil bleiben
 * und „noch 38 Karten“ stimmt. Startet bei Bedarf einen neuen Durchgang.
 */
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
  // Reihenfolge des Durchgangs (2026-10-20): erst jedes Wort einmal, dann die weiteren Karten (spreadCards.js) –
  // so ist spätestens nach der Hälfte jedes Wort drangekommen. Fest per Startwert (auf jedem Gerät gleich);
  // Wörter, die in diesem Durchgang schon drankamen, haben keinen Vorrang mehr.
  const remaining = seededShuffle(ids, entry.seed)
    .filter((id) => !s.doneSet.has(id))
    .map((id) => byId.get(id));
  const seen = new Set([...s.doneSet].map((id) => wordOf(byId.get(id))));
  // recent: die zuletzt gefragten Wörter (aus markVocabDone) – kein Doppel über die Rundengrenze.
  const recent = entry.recent || [];
  return spreadByWord(remaining, { random: mulberry32(entry.seed ^ 0x5bd1e995), seen, recent }).slice(0, s.size - s.cur);
}

/** Beantwortete Karten als erledigt eintragen (Auto-Save nach jeder Antwort). */
export function markVocabDone(name, exam, questionIds) {
  const entry = entryOf(name, exam);
  if (!entry || !questionIds?.length) return;
  const done = new Set(entry.done || []);
  const before = done.size;
  questionIds.forEach((id) => done.add(id));
  if (done.size === before) return;
  // Die zuletzt gefragten Wörter merken (für die nächste Runde, siehe planVocabRound).
  const recent = [...(entry.recent || []), ...questionIds.map((id) => wordOf({ id }))].slice(-MIN_GAP);
  setVocabProgress(name, exam, { ...entry, done: [...done], recent });
}

const runden = (n) => `${n} ${n === 1 ? 'Runde' : 'Runden'}`;

/** Kurzer Stand für die Auswahl-Karte, z. B. „Noch 2 Runden · 75 von 437 Karten“. */
export function passText(st) {
  if (!st || st.total === 0) return null;
  if (st.complete) return `Alles geschafft! Neuer Durchgang mit ${st.total} Karten`;
  return `Noch ${runden(st.roundsLeft)} · ${st.remaining} von ${st.total} Karten`;
}

/** Hinweis unter dem Balken während einer Runde (RoundProgress). `after` = Runden nach dieser. */
export function roundNote(after) {
  if (after <= 0) return 'Letzte Runde – gleich geschafft!';
  if (after === 1) return 'Danach noch 1 Runde – dann bist du durch.';
  return `Danach noch ${after} Runden.`;
}

export { runden };
