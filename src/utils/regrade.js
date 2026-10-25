// Alte Antworten mit dem aktuellen Antwort-Check neu bewerten (2026-10-25, Wunsch des Nutzers).
// Gespeichert ist das Urteil vom Zeitpunkt der Antwort. Wird der Check später großzügiger (z. B. „fast, beinahe“
// statt „fast; beinahe“, oder Auswahlfragen mit Komma in der richtigen Option), zählt der Lehrer-Bereich solche
// Antworten nachträglich als richtig. Nur falsch → richtig, nie umgekehrt; gespeicherte Daten bleiben unverändert.
import allQuestions, { getVocabularyQuestions } from '../data/questions';
import { checkAnswer } from './scoring';

let byId = null;
const definitions = () => (byId ??= new Map([...allQuestions, ...getVocabularyQuestions()].map((q) => [q.id, q])));

/** Frage/Karte zu einer ID (aktueller Stand). */
export const questionDefinition = (id) => definitions().get(id) || null;

/** Eine gespeicherte Antwort: richtig nach heutigem Check? */
export function regradeAnswer(answer) {
  if (!answer || answer.isCorrect || answer.userAnswer == null || answer.userAnswer === '') return answer;
  const def = questionDefinition(answer.questionId);
  if (!def || !checkAnswer(def, answer.userAnswer)) return answer;
  return { ...answer, isCorrect: true, regraded: true };
}

/** Historie aller Kinder neu bewerten (für die Auswertung im Lehrer-Bereich). */
export function regradeHistory(history) {
  return Object.fromEntries(
    Object.entries(history || {}).map(([name, data]) => [
      name,
      { ...data, sessions: (data?.sessions || []).map((s) => ({ ...s, answers: (s.answers || []).map(regradeAnswer) })) },
    ]),
  );
}
