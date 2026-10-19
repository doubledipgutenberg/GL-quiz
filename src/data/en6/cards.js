// Erzeugt die Quiz-Karten für Englisch Klasse 6 aus EN6_VOCAB (Aufbau wie src/data/fr6/cards.js).
//   _de     : englisches Wort sehen (und hören) → deutsch antworten
//   _en     : deutsches Wort sehen → englisch schreiben
//   _gap    : Lückentext – Beispielsatz mit Lücke, das Wort einsetzen (deutsche Bedeutung als Hilfe)
//   _listen : nur hören → englisch schreiben
// Alle Kartenarten gehören zum Wortschatz (Audio ist Teil der Vokabeln, kein eigener Modus).
import { COURSE, EN6_VOCAB, speechText, exampleText, gapOf } from './vocab.js';

function audioOf(v) {
  return { course: COURSE, id: v.id, text: speechText(v), lang: 'en' };
}

function base(v, suffix) {
  return {
    id: `${v.id}_${suffix}`,
    vocabId: v.id,
    exam: v.exam,
    course: COURSE,
    added: v.added,
    topic: 'vocabulary',
    topicLabel: 'Wortschatz',
    category: 'vocabulary',
    difficulty: 1,
    audio: audioOf(v),
  };
}

export function toDeCard(v) {
  return {
    ...base(v, 'de'),
    type: 'vocab_card',
    instruction: 'Was heißt das auf Deutsch?',
    word: v.en,
    promptAudio: true,
    correct: v.de,
    alternativeCorrect: v.altDe || [],
    explanation: `${v.en} = ${v.de}`,
  };
}

export function toEnCard(v) {
  return {
    ...base(v, 'en'),
    type: 'vocab_card',
    instruction: 'Wie heißt das auf Englisch?',
    word: v.de,
    correct: v.en,
    alternativeCorrect: v.alt || [],
    explanation: `${v.de} = ${v.en}`,
  };
}

// Beispielsatz zur Hör-Karte (eigene Audiodatei <id>_ex.m4a), nur wenn `ex` gepflegt ist.
function exampleAudioOf(v) {
  return v.ex ? { course: COURSE, id: `${v.id}_ex`, text: v.sayEx || exampleText(v), lang: 'en' } : null;
}

export function toListenCard(v) {
  return {
    ...base(v, 'listen'),
    exampleAudio: exampleAudioOf(v),
    type: 'listen_card',
    instruction: 'Hör zu und schreib das Wort auf Englisch:',
    correct: v.en,
    alternativeCorrect: v.alt || [],
    explanation: `${v.en} = ${v.de}`,
  };
}

export function toGapCard(v) {
  const gap = gapOf(v);
  if (!gap) return null;
  return {
    ...base(v, 'gap'),
    type: 'fill_gap',
    topicLabel: 'Wortschatz',
    instruction: 'Setz das passende Wort ein:',
    question: `${gap.sentence} (${v.de})`,
    correct: gap.answer,
    alternativeCorrect: gap.alternatives,
    hint: `Beginnt mit „${gap.answer.charAt(0)}…“`,
    explanation: `${exampleText(v)} – ${v.en} = ${v.de}`,
  };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const forExam = (exam) => EN6_VOCAB.filter((v) => !exam || v.exam === exam);

function cardsFor(list) {
  return [
    ...shuffle(list.map(toDeCard)),
    ...shuffle(list.map(toEnCard)),
    ...shuffle(list.map(toListenCard)),
    ...shuffle(list.map(toGapCard).filter(Boolean)),
  ];
}

/** Wortschatz-Quiz einer Schulaufgabe. */
export function en6VocabCards(exam) {
  return cardsFor(forExam(exam));
}

/** Jüngster Batch des Kurses: Datum + Vokabeln. */
export function en6LatestBatch() {
  const latest = EN6_VOCAB.reduce((d, v) => (v.added > d ? v.added : d), '');
  return { added: latest, vocab: EN6_VOCAB.filter((v) => v.added === latest) };
}

export function en6NewVocabCards() {
  return cardsFor(en6LatestBatch().vocab);
}

/** Alle Karten (für das Wiederherstellen gespeicherter Runden per ID). */
export function en6AllCards() {
  return [
    ...EN6_VOCAB.map(toDeCard),
    ...EN6_VOCAB.map(toEnCard),
    ...EN6_VOCAB.map(toListenCard),
    ...EN6_VOCAB.map(toGapCard).filter(Boolean),
  ];
}

export const EN6_VOCAB_IDS = EN6_VOCAB.map((v) => v.id);
