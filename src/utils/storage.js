// localStorage helpers for persisting quiz data
// Jede Änderung wird per markDirty(owner, key) gemeldet; sync.js lädt sie zum Server hoch.

import { markDirty } from './dirty';

const HIGHSCORES_KEY = 'english_topic_quiz_highscores';
const HISTORY_KEY = 'english_topic_quiz_history';
const DRAFT_KEY = 'english_topic_quiz_draft';
const SAVED_ROUNDS_KEY = 'english_topic_quiz_saved_rounds';
const TEACHER_DISMISSALS_KEY = 'english_topic_quiz_teacher_dismissals';
const TEACHER_MARKED_CORRECT_KEY = 'english_topic_quiz_teacher_marked_correct';
const ANSWER_FLAGS_KEY = 'english_topic_quiz_answer_flags';
const FLAG_REVIEWS_KEY = 'english_topic_quiz_flag_reviews';
const VOCAB_PROGRESS_KEY = 'english_topic_quiz_vocab_progress';

export const STORAGE_KEYS = {
  highscores: HIGHSCORES_KEY,
  history: HISTORY_KEY,
  draft: DRAFT_KEY,
  savedRounds: SAVED_ROUNDS_KEY,
  teacherDismissals: TEACHER_DISMISSALS_KEY,
  teacherMarkedCorrect: TEACHER_MARKED_CORRECT_KEY,
  answerFlags: ANSWER_FLAGS_KEY,
  flagReviews: FLAG_REVIEWS_KEY,
  vocabProgress: VOCAB_PROGRESS_KEY,
};

export const FAMILY_OWNER = '_family';

// ==========================================
// Highscores
// ==========================================

export function getHighscores() {
  try {
    const data = localStorage.getItem(HIGHSCORES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHighscore(name, score, maxScore, totalQuestions) {
  const highscores = getHighscores();
  highscores.push({
    name,
    score,
    maxScore,
    totalQuestions,
    percentage: Math.round((score / maxScore) * 100),
    date: new Date().toISOString()
  });
  // Sort by percentage descending, keep top 50
  highscores.sort((a, b) => b.percentage - a.percentage);
  localStorage.setItem(HIGHSCORES_KEY, JSON.stringify(highscores.slice(0, 50)));
  markDirty(name, 'highscores');
}

// ==========================================
// Student History (for analytics)
// ==========================================

export function getStudentHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// Auto-Save: Die laufende Runde steht nach jeder Antwort in der Historie (Eintrag mit `id`), damit der
// Lehrer-Bereich Ergebnisse sofort sieht – ohne die Runde zu beenden oder zu speichern.
// `answers` = nur die Antworten, die zu diesem Eintrag gehören. Punkte wie calculatePoints: difficulty.
export function upsertStudentSession(name, sessionId, answers, { complete = false } = {}) {
  if (!name || !sessionId || !answers?.length) return;
  const history = getStudentHistory();
  if (!history[name]) {
    history[name] = { sessions: [] };
  }
  const records = answers.map(toAnswerRecord);
  const score = records.reduce((sum, a) => sum + (a.isCorrect ? a.difficulty || 1 : 0), 0);
  const maxScore = records.reduce((sum, a) => sum + (a.difficulty || 1), 0);
  const now = new Date().toISOString();
  const sessions = history[name].sessions;
  const i = sessions.findIndex((s) => s.id === sessionId);
  const entry = {
    id: sessionId,
    date: i >= 0 ? sessions[i].date : now,
    updatedAt: now,
    complete,
    score,
    maxScore,
    percentage: maxScore ? Math.round((score / maxScore) * 100) : 0,
    answers: records,
  };
  if (i >= 0) sessions[i] = entry;
  else sessions.push(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  markDirty(name, 'history');
}

// Draft: nach jeder Frage speichern (Stand der laufenden Runde).
// sessionId/answersOffset: zu welchem Historien-Eintrag die Runde gehört (siehe upsertStudentSession).
export function saveDraftSession(name, answers, score, maxScore, questionIds, mode = 'normal', { sessionId, answersOffset = 0, passExam = null } = {}) {
  if (!name || !questionIds || !questionIds.length) return;
  const draft = {
    name,
    sessionId,
    answersOffset,
    passExam,
    mode: mode || 'normal',
    score,
    maxScore,
    questionIds,
    answers: (answers || []).map(a => ({
      questionId: a.questionId,
      topic: a.topic,
      topicLabel: a.topicLabel,
      category: a.category,
      isCorrect: a.isCorrect,
      userAnswer: a.userAnswer,
      correctAnswer: a.correctAnswer,
      difficulty: a.difficulty
    })),
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  markDirty(name, 'draft');
}

// Saved rounds: benannte Speicherstände (Datum, Uhrzeit, Spieler, Name)
function toAnswerRecord(a) {
  return {
    questionId: a.questionId,
    topic: a.topic,
    topicLabel: a.topicLabel,
    category: a.category,
    isCorrect: a.isCorrect,
    userAnswer: a.userAnswer,
    correctAnswer: a.correctAnswer,
    difficulty: a.difficulty,
    // Zeitpunkt der Antwort (für den Serien-Kalender); ältere Einträge haben ihn nicht.
    ...(a.at ? { at: a.at } : {}),
  };
}

export function getSavedRounds() {
  try {
    const data = localStorage.getItem(SAVED_ROUNDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addSavedRound({ roundName, playerName, questionIds, answers, score, maxScore, mode, passExam = null }) {
  if (!roundName?.trim() || !playerName || !questionIds?.length) return null;
  const rounds = getSavedRounds();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const saved = {
    id,
    roundName: roundName.trim(),
    playerName,
    savedAt: new Date().toISOString(),
    questionIds,
    answers: (answers || []).map(toAnswerRecord),
    score: score ?? 0,
    maxScore: maxScore ?? 0,
    mode: mode || 'normal',
    passExam,
  };
  rounds.unshift(saved);
  localStorage.setItem(SAVED_ROUNDS_KEY, JSON.stringify(rounds));
  markDirty(playerName, 'savedRounds');
  return id;
}

export function removeSavedRound(id) {
  const all = getSavedRounds();
  const removed = all.find(r => r.id === id);
  localStorage.setItem(SAVED_ROUNDS_KEY, JSON.stringify(all.filter(r => r.id !== id)));
  if (removed?.playerName) markDirty(removed.playerName, 'savedRounds');
}

export function getDraftSession() {
  try {
    const data = localStorage.getItem(DRAFT_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function clearDraftSession() {
  const draft = getDraftSession();
  localStorage.removeItem(DRAFT_KEY);
  if (draft?.name) markDirty(draft.name, 'draft');
}

export function clearAllData() {
  localStorage.removeItem(HIGHSCORES_KEY);
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(DRAFT_KEY);
  localStorage.removeItem(SAVED_ROUNDS_KEY);
  localStorage.removeItem(TEACHER_DISMISSALS_KEY);
  localStorage.removeItem(TEACHER_MARKED_CORRECT_KEY);
  localStorage.removeItem(ANSWER_FLAGS_KEY);
  localStorage.removeItem(FLAG_REVIEWS_KEY);
  localStorage.removeItem(VOCAB_PROGRESS_KEY);
}

// ==========================================
// Teacher dismissals (per student)
// ==========================================

export function getTeacherDismissals() {
  try {
    const data = localStorage.getItem(TEACHER_DISMISSALS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveTeacherDismissals(all) {
  localStorage.setItem(TEACHER_DISMISSALS_KEY, JSON.stringify(all));
  markDirty(FAMILY_OWNER, 'teacherDismissals');
}

export function dismissQuestionForStudent(studentName, questionId) {
  if (!studentName || !questionId) return;
  const all = getTeacherDismissals();
  if (!all[studentName]) {
    all[studentName] = { questions: {}, wrongAttempts: {} };
  }
  all[studentName].questions[questionId] = true;
  saveTeacherDismissals(all);
}

export function dismissWrongAttemptForStudent(studentName, questionId, dateIso) {
  if (!studentName || !questionId || !dateIso) return;
  const all = getTeacherDismissals();
  if (!all[studentName]) {
    all[studentName] = { questions: {}, wrongAttempts: {} };
  }
  if (!all[studentName].wrongAttempts[questionId]) {
    all[studentName].wrongAttempts[questionId] = [];
  }
  if (!all[studentName].wrongAttempts[questionId].includes(dateIso)) {
    all[studentName].wrongAttempts[questionId].push(dateIso);
  }
  saveTeacherDismissals(all);
}

// ==========================================
// Teacher "mark as correct" (count wrong attempt as correct)
// ==========================================

export function getTeacherMarkedCorrect() {
  try {
    const data = localStorage.getItem(TEACHER_MARKED_CORRECT_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveTeacherMarkedCorrect(all) {
  localStorage.setItem(TEACHER_MARKED_CORRECT_KEY, JSON.stringify(all));
  markDirty(FAMILY_OWNER, 'teacherMarkedCorrect');
}

/** Mark one or more wrong attempts as correct for this student. Structure: all[studentName][questionId] = [dateIso, ...] */
export function markAttemptsAsCorrect(studentName, questionId, dateIsos) {
  if (!studentName || !questionId || !Array.isArray(dateIsos) || dateIsos.length === 0) return;
  const all = getTeacherMarkedCorrect();
  if (!all[studentName]) all[studentName] = {};
  if (!all[studentName][questionId]) all[studentName][questionId] = [];
  const list = all[studentName][questionId];
  dateIsos.forEach(dateIso => {
    if (dateIso && !list.includes(dateIso)) list.push(dateIso);
  });
  saveTeacherMarkedCorrect(all);
}

export function unmarkAttemptCorrect(studentName, questionId, dateIso) {
  const all = getTeacherMarkedCorrect();
  const list = all[studentName]?.[questionId];
  if (!Array.isArray(list) || !list.includes(dateIso)) return;
  all[studentName][questionId] = list.filter((d) => d !== dateIso);
  saveTeacherMarkedCorrect(all);
}

// ==========================================
// „Na ja, schon fast richtig“ – vom Kind markierte Antworten und das Urteil der Eltern
// ==========================================
// answerFlags: { [Kind]: [Markierung] } – gehört dem Kind (es darf nur eigene Daten schreiben).
// flagReviews: { [flagId]: { verdict: 'correct' | 'wrong', decidedAt } } – gehört der Familie.
// Getrennt, damit sich Kind und Eltern beim Synchronisieren nichts überschreiben.
// Später wertet der Coding-Agent die Urteile aus (scripts/review-flags.mjs), um den Antwort-Check
// oder die Alternativen zu verbessern.

export function getAnswerFlags() {
  try {
    const data = localStorage.getItem(ANSWER_FLAGS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function flagAlmostRight(name, { question, userAnswer, sessionId }) {
  if (!name || !question?.id) return null;
  const sessionDate = getStudentHistory()[name]?.sessions?.find((s) => s.id === sessionId)?.date ?? null;
  const all = getAnswerFlags();
  if (!all[name]) all[name] = [];
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  all[name].push({
    id,
    questionId: question.id,
    type: question.type,
    course: question.course ?? null,
    answerLang: question.answerLang ?? null,
    prompt: question.word ?? question.question ?? null,
    heard: question.type === 'listen_card' ? question.audio?.text ?? null : null,
    userAnswer,
    correctAnswer: question.correct,
    alternativeCorrect: question.alternativeCorrect ?? [],
    sessionId: sessionId ?? null,
    sessionDate,
    flaggedAt: new Date().toISOString(),
  });
  localStorage.setItem(ANSWER_FLAGS_KEY, JSON.stringify(all));
  markDirty(name, 'answerFlags');
  return id;
}

export function getFlagReviews() {
  try {
    const data = localStorage.getItem(FLAG_REVIEWS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

/** verdict: 'correct' („doch eigentlich richtig“), 'wrong' (falsch) oder null (Urteil zurücknehmen). */
export function reviewFlag(flagId, verdict) {
  if (!flagId) return;
  const all = getFlagReviews();
  if (verdict) all[flagId] = { verdict, decidedAt: new Date().toISOString() };
  else delete all[flagId];
  localStorage.setItem(FLAG_REVIEWS_KEY, JSON.stringify(all));
  markDirty(FAMILY_OWNER, 'flagReviews');
}

// ==========================================
// Wortschatz in Runden: Fortschritt im Durchgang durch den ganzen Wortschatz (siehe utils/vocabPass.js)
// ==========================================
// { [Kind]: { [exam]: { pass, seed, done: [Karten-IDs], startedAt } } } – gehört dem Kind.

export function getVocabProgress() {
  try {
    const data = localStorage.getItem(VOCAB_PROGRESS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function setVocabProgress(name, exam, entry) {
  if (!name || !exam) return;
  const all = getVocabProgress();
  if (!all[name]) all[name] = {};
  all[name][exam] = entry;
  localStorage.setItem(VOCAB_PROGRESS_KEY, JSON.stringify(all));
  markDirty(name, 'vocabProgress');
}

/** Alle markierten Antworten mit Urteil – für den Export an den Coding-Agent. */
export function getAnswerReviewExport() {
  const reviews = getFlagReviews();
  const flags = Object.entries(getAnswerFlags()).flatMap(([student, list]) =>
    (list || []).map((f) => ({ student, ...f, verdict: reviews[f.id]?.verdict ?? null, decidedAt: reviews[f.id]?.decidedAt ?? null })),
  );
  return { kind: 'answer-review', exportedAt: new Date().toISOString(), flags };
}

// ==========================================
// Full data export helper
// ==========================================

export function getFullExportPayload() {
  return {
    highscores: getHighscores(),
    history: getStudentHistory(),
    draft: getDraftSession(),
    savedRounds: getSavedRounds(),
    teacherDismissals: getTeacherDismissals(),
    teacherMarkedCorrect: getTeacherMarkedCorrect(),
    answerFlags: getAnswerFlags(),
    flagReviews: getFlagReviews(),
    vocabProgress: getVocabProgress(),
  };
}

// ==========================================
// Full data import (merge, no data loss)
// ==========================================

/**
 * Importiert eine zuvor exportierte JSON-Datei und MISCHT sie mit den
 * vorhandenen Daten dieses Geräts (nichts wird gelöscht):
 *  - Schüler-History: pro Schüler werden neue Runden (nach Datum) ergänzt
 *  - Gespeicherte Runden / Highscores: per ID bzw. Inhalt entdoppelt
 *  - Aktuelle Runde (draft): wird übernommen, falls in der Datei vorhanden
 *  - Lehrer-Markierungen: zusammengeführt
 * Gibt eine Zusammenfassung zurück.
 */
export function importFullPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Ungültige Datei');
  }
  const known = ['highscores', 'history', 'savedRounds', 'draft', 'teacherDismissals', 'teacherMarkedCorrect'];
  if (!known.some((k) => k in payload)) {
    throw new Error('Keine bekannten Quiz-Daten in der Datei');
  }

  const summary = { students: 0, sessions: 0, savedRounds: 0, highscores: 0, draft: false };

  // Highscores – per Inhalt entdoppeln
  if (Array.isArray(payload.highscores)) {
    const existing = getHighscores();
    const seen = new Set(existing.map((h) => JSON.stringify(h)));
    payload.highscores.forEach((h) => {
      const key = JSON.stringify(h);
      if (!seen.has(key)) { existing.push(h); seen.add(key); summary.highscores++; }
    });
    existing.sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0));
    localStorage.setItem(HIGHSCORES_KEY, JSON.stringify(existing.slice(0, 50)));
    new Set(payload.highscores.map((h) => h?.name)).forEach((n) => markDirty(n, 'highscores'));
  }

  // History – pro Schüler Runden nach Datum mischen
  if (payload.history && typeof payload.history === 'object') {
    const existing = getStudentHistory();
    Object.entries(payload.history).forEach(([name, data]) => {
      const incoming = data && Array.isArray(data.sessions) ? data.sessions : [];
      if (!existing[name]) { existing[name] = { sessions: [] }; summary.students++; }
      if (!Array.isArray(existing[name].sessions)) existing[name].sessions = [];
      const dates = new Set(existing[name].sessions.map((s) => s.date));
      incoming.forEach((s) => {
        if (s && !dates.has(s.date)) { existing[name].sessions.push(s); dates.add(s.date); summary.sessions++; }
      });
      existing[name].sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(existing));
    Object.keys(payload.history).forEach((n) => markDirty(n, 'history'));
  }

  // Gespeicherte Runden – per ID entdoppeln
  if (Array.isArray(payload.savedRounds)) {
    const existing = getSavedRounds();
    const ids = new Set(existing.map((r) => r.id));
    payload.savedRounds.forEach((r) => {
      if (r && !ids.has(r.id)) { existing.push(r); ids.add(r.id); summary.savedRounds++; }
    });
    localStorage.setItem(SAVED_ROUNDS_KEY, JSON.stringify(existing));
    new Set(payload.savedRounds.map((r) => r?.playerName)).forEach((n) => markDirty(n, 'savedRounds'));
  }

  // Aktuelle Runde – übernehmen, falls in der Datei vorhanden
  if (payload.draft && typeof payload.draft === 'object') {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload.draft));
    markDirty(payload.draft.name, 'draft');
    summary.draft = true;
  }

  // Lehrer: ausgeblendete Fragen – zusammenführen
  if (payload.teacherDismissals && typeof payload.teacherDismissals === 'object') {
    const all = getTeacherDismissals();
    Object.entries(payload.teacherDismissals).forEach(([name, d]) => {
      if (!all[name]) all[name] = { questions: {}, wrongAttempts: {} };
      Object.assign(all[name].questions, d.questions || {});
      Object.entries(d.wrongAttempts || {}).forEach(([qid, list]) => {
        all[name].wrongAttempts[qid] = Array.from(new Set([...(all[name].wrongAttempts[qid] || []), ...list]));
      });
    });
    saveTeacherDismissals(all);
  }

  // Lehrer: als richtig gewertet – zusammenführen
  if (payload.teacherMarkedCorrect && typeof payload.teacherMarkedCorrect === 'object') {
    const all = getTeacherMarkedCorrect();
    Object.entries(payload.teacherMarkedCorrect).forEach(([name, qmap]) => {
      if (!all[name]) all[name] = {};
      Object.entries(qmap || {}).forEach(([qid, list]) => {
        all[name][qid] = Array.from(new Set([...(all[name][qid] || []), ...list]));
      });
    });
    saveTeacherMarkedCorrect(all);
  }

  return summary;
}
