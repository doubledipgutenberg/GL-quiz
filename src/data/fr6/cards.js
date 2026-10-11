// Erzeugt die Quiz-Karten für Französisch Klasse 6 aus FR6_VOCAB.
//   _de     : französisches Wort sehen (und hören) → deutsch antworten
//   _fr     : deutsches Wort sehen → französisch schreiben (Akzent-Tasten, Akzente streng)
//   _listen : nur hören → französisch schreiben („Hören & Schreiben“)
import { COURSE, FR6_VOCAB, speechText } from './vocab.js';

function audioOf(v) {
  return { course: COURSE, id: v.id, text: speechText(v), lang: 'fr' };
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
    word: v.fr,
    promptAudio: true,
    correct: v.de,
    alternativeCorrect: v.altDe || [],
    answerLang: 'de',
    explanation: `${v.fr} = ${v.de}`,
  };
}

export function toFrCard(v) {
  return {
    ...base(v, 'fr'),
    type: 'vocab_card',
    instruction: 'Wie heißt das auf Französisch?',
    word: v.de,
    correct: v.fr,
    alternativeCorrect: v.alt || [],
    answerLang: 'fr',
    explanation: `${v.de} = ${v.fr}`,
  };
}

export function toListenCard(v) {
  return {
    ...base(v, 'listen'),
    type: 'listen_card',
    topicLabel: 'Hören & Schreiben',
    instruction: 'Hör zu und schreib das Wort auf Französisch:',
    correct: v.fr,
    alternativeCorrect: v.alt || [],
    answerLang: 'fr',
    explanation: `${v.fr} = ${v.de}`,
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

const forExam = (exam) => FR6_VOCAB.filter((v) => !exam || v.exam === exam);

/** Wortschatz-Quiz: beide Richtungen, erst alle fr→de, dann alle de→fr. */
export function fr6VocabCards(exam) {
  const list = forExam(exam);
  return [...shuffle(list.map(toDeCard)), ...shuffle(list.map(toFrCard))];
}

export function fr6ListenCards(exam) {
  return shuffle(forExam(exam).map(toListenCard));
}

/** Jüngster Batch des Kurses: Datum + Vokabeln. */
export function fr6LatestBatch() {
  const latest = FR6_VOCAB.reduce((d, v) => (v.added > d ? v.added : d), '');
  return { added: latest, vocab: FR6_VOCAB.filter((v) => v.added === latest) };
}

export function fr6NewVocabCards() {
  const { vocab } = fr6LatestBatch();
  return [...shuffle(vocab.map(toDeCard)), ...shuffle(vocab.map(toFrCard))];
}

/** Alle Karten (für das Wiederherstellen gespeicherter Runden per ID). */
export function fr6AllCards() {
  return [...FR6_VOCAB.map(toDeCard), ...FR6_VOCAB.map(toFrCard), ...FR6_VOCAB.map(toListenCard)];
}

export const FR6_VOCAB_IDS = FR6_VOCAB.map((v) => v.id);
