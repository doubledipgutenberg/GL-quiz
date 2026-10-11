// Ordnet jede Frage (per ID) ihrem Kurs zu (Fach + Klasse) und filtert die Lernhistorie danach.
// Damit zeigt der Lehrer-Bereich jedes Fach getrennt.
import questions, { COURSES, EXAMS, examsForCourse, getVocabularyQuestions } from '../data/questions';

// Ältere Einträge ohne Kursangabe (z. B. Vokabeln der 2. Schulaufgabe) gehören zu Englisch 5.
export const LEGACY_COURSE = 'en-5';

let byId = null;

function lookup() {
  if (!byId) {
    byId = new Map();
    const add = (q) => {
      const course = q.course || EXAMS[q.exam]?.course;
      if (course) byId.set(q.id, course);
    };
    questions.forEach(add);
    getVocabularyQuestions().forEach(add);
  }
  return byId;
}

export function courseOfQuestion(questionId) {
  return lookup().get(questionId) || LEGACY_COURSE;
}

/** Nur die Runden/Antworten eines Kurses; Schüler ohne Runden in diesem Kurs fallen weg. */
export function filterHistoryByCourse(history, courseId) {
  const out = {};
  for (const [name, data] of Object.entries(history || {})) {
    const sessions = (data?.sessions || [])
      .map((s) => ({ ...s, answers: (s.answers || []).filter((a) => courseOfQuestion(a?.questionId) === courseId) }))
      .filter((s) => s.answers.length > 0);
    if (sessions.length) out[name] = { ...data, sessions };
  }
  return out;
}

/** Kurse für die Reiter: alle mit Inhalten oder mit vorhandenen Ergebnissen. */
export function coursesForDashboard(history) {
  const withData = new Set();
  for (const data of Object.values(history || {})) {
    for (const s of data?.sessions || []) {
      for (const a of s.answers || []) withData.add(courseOfQuestion(a?.questionId));
    }
  }
  return COURSES.filter((c) => withData.has(c.id) || examsForCourse(c.id).length > 0).map((c) => ({
    ...c,
    hasData: withData.has(c.id),
  }));
}
