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
