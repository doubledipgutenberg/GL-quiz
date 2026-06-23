// localStorage helpers for persisting quiz data

const HIGHSCORES_KEY = 'english_topic_quiz_highscores';
const HISTORY_KEY = 'english_topic_quiz_history';
const DRAFT_KEY = 'english_topic_quiz_draft';
const SAVED_ROUNDS_KEY = 'english_topic_quiz_saved_rounds';
const TEACHER_DISMISSALS_KEY = 'english_topic_quiz_teacher_dismissals';
const TEACHER_MARKED_CORRECT_KEY = 'english_topic_quiz_teacher_marked_correct';

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

export function saveStudentSession(name, answers, score, maxScore) {
  const history = getStudentHistory();
  if (!history[name]) {
    history[name] = { sessions: [] };
  }
  history[name].sessions.push({
    date: new Date().toISOString(),
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
    answers: answers.map(a => ({
      questionId: a.questionId,
      topic: a.topic,
      topicLabel: a.topicLabel,
      category: a.category,
      isCorrect: a.isCorrect,
      userAnswer: a.userAnswer,
      correctAnswer: a.correctAnswer,
      difficulty: a.difficulty
    }))
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// Draft: nach jeder Frage speichern (Stand der laufenden Runde)
export function saveDraftSession(name, answers, score, maxScore, questionIds, mode = 'normal') {
  if (!name || !questionIds || !questionIds.length) return;
  const draft = {
    name,
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
    difficulty: a.difficulty
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

export function addSavedRound({ roundName, playerName, questionIds, answers, score, maxScore, mode }) {
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
    mode: mode || 'normal'
  };
  rounds.unshift(saved);
  localStorage.setItem(SAVED_ROUNDS_KEY, JSON.stringify(rounds));
  return id;
}

export function removeSavedRound(id) {
  const rounds = getSavedRounds().filter(r => r.id !== id);
  localStorage.setItem(SAVED_ROUNDS_KEY, JSON.stringify(rounds));
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
  localStorage.removeItem(DRAFT_KEY);
}

export function clearAllData() {
  localStorage.removeItem(HIGHSCORES_KEY);
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(DRAFT_KEY);
  localStorage.removeItem(SAVED_ROUNDS_KEY);
  localStorage.removeItem(TEACHER_DISMISSALS_KEY);
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
  }

  // Gespeicherte Runden – per ID entdoppeln
  if (Array.isArray(payload.savedRounds)) {
    const existing = getSavedRounds();
    const ids = new Set(existing.map((r) => r.id));
    payload.savedRounds.forEach((r) => {
      if (r && !ids.has(r.id)) { existing.push(r); ids.add(r.id); summary.savedRounds++; }
    });
    localStorage.setItem(SAVED_ROUNDS_KEY, JSON.stringify(existing));
  }

  // Aktuelle Runde – übernehmen, falls in der Datei vorhanden
  if (payload.draft && typeof payload.draft === 'object') {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload.draft));
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
