import { useReducer, useCallback, useEffect, useRef } from 'react';
import questions, { EXAMS, getVocabularyQuestions, getNewVocabularyQuestions, DEFAULT_EXAM } from '../data/questions';
import { checkAnswer, calculatePoints, getMaxPoints } from '../utils/scoring';
import { planVocabRound, markVocabDone, vocabPassStatus } from '../utils/vocabPass';
import { spreadByWord } from '../utils/spreadCards';
import { saveHighscore, upsertStudentSession, saveDraftSession, clearDraftSession, getDraftSession, addSavedRound, getStudentHistory } from '../utils/storage';

// Shuffle array (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const QUESTIONS_PER_SESSION = 15;

// Jede Runde hat eine ID; unter ihr wird sie nach jeder Antwort in der Historie gespeichert (Auto-Save).
const newSessionId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// Antwortoptionen bei jeder Runde neu mischen – sonst steht die richtige Antwort immer an derselben Stelle.
function withShuffledOptions(list) {
  return list.map((q) => (q.type === 'multiple_choice' && Array.isArray(q.options) ? { ...q, options: shuffle(q.options) } : q));
}

const initialState = {
  phase: 'welcome',
  playerName: '',
  mode: 'normal',           // 'normal' | 'vocabulary'
  exam: DEFAULT_EXAM,       // 'sa2' | 'sa4'
  questions: [],
  sessionId: null,
  answersOffset: 0,         // Antworten davor gehören zu einem früheren Historien-Eintrag
  passExam: null,           // Runde im Wortschatz-Durchgang dieser Schulaufgabe (utils/vocabPass.js)
  passInfo: null,           // { round, roundsTotal, size, startCur } beim Start der Runde (für RoundProgress)
  currentIndex: 0,
  score: 0,
  answers: [],
  lastAnswer: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'START_QUIZ': {
      const mode = action.mode || 'normal';
      const exam = action.exam || DEFAULT_EXAM;
      // Vokabel-Modi: alle Karten der Auswahl (inkl. Hör-Karten), gemischt (kein 15er-Limit)
      if (mode === 'vocabulary' || mode === 'newvocab') {
        // „Alle Vokabeln“: die Karten der nächsten Runde kommen vorgeplant (action.questions, à 50).
        const pool =
          action.questions ??
          (mode === 'newvocab' ? getNewVocabularyQuestions(EXAMS[exam]?.course) : getVocabularyQuestions(exam));
        if (pool.length === 0) return state;
        // Gemischt, aber dasselbe Wort nie direkt hintereinander (utils/spreadCards.js).
        const shuffled = withShuffledOptions(spreadByWord(shuffle(pool)));
        return {
          ...state,
          phase: 'quiz',
          playerName: action.name,
          mode,
          exam,
          questions: shuffled,
          sessionId: newSessionId(),
          answersOffset: 0,
          passExam: action.passExam ?? null,
          passInfo: action.passInfo ?? null,
          currentIndex: 0,
          score: 0,
          answers: [],
          lastAnswer: null,
        };
      }

      // Normal-Modus: nur Fragen der gewählten Schulaufgabe; noch nicht gesehene zuerst,
      // aufgefüllt mit bereits gesehenen, damit die Runde voll wird.
      const examPool = questions.filter((q) => q.exam === exam);
      let candidatePool = shuffle(examPool);
      try {
        const history = getStudentHistory();
        const student = history[action.name];
        if (student?.sessions?.length) {
          const seenIds = new Set();
          student.sessions.forEach((s) => {
            (s.answers || []).forEach((a) => {
              if (a?.questionId) seenIds.add(a.questionId);
            });
          });
          const unseen = shuffle(examPool.filter((q) => !seenIds.has(q.id)));
          const seen = shuffle(examPool.filter((q) => seenIds.has(q.id)));
          candidatePool = [...unseen, ...seen];
        }
      } catch {
        // wenn History kaputt ist, einfach gesamten Fragenpool verwenden
      }

      const shuffled = withShuffledOptions(shuffle(candidatePool.slice(0, QUESTIONS_PER_SESSION)));
      return {
        ...state,
        phase: 'quiz',
        playerName: action.name,
        mode,
        exam,
        questions: shuffled,
        sessionId: newSessionId(),
        answersOffset: 0,
        passExam: null,
        passInfo: null,
        currentIndex: 0,
        score: 0,
        answers: [],
        lastAnswer: null,
      };
    }
    case 'SUBMIT_ANSWER': {
      const question = state.questions[state.currentIndex];
      const isCorrect = checkAnswer(question, action.answer);
      const points = calculatePoints(question, isCorrect);
      const answerRecord = {
        questionId: question.id,
        topic: question.topic,
        topicLabel: question.topicLabel,
        category: question.category,
        isCorrect,
        userAnswer: action.answer,
        correctAnswer: question.correct,
        difficulty: question.difficulty,
        at: new Date().toISOString(),
      };
      return {
        ...state,
        phase: 'feedback',
        score: state.score + points,
        answers: [...state.answers, answerRecord],
        lastAnswer: { isCorrect, points, question, userAnswer: action.answer },
      };
    }
    case 'NEXT_QUESTION': {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.questions.length) {
        // Runde fertig – gespeichert wird im Effect (Historie laufend, Highscore einmal am Ende).
        return { ...state, phase: 'finished' };
      }
      return {
        ...state,
        phase: 'quiz',
        currentIndex: nextIndex,
        lastAnswer: null,
      };
    }
    case 'RESTART':
      clearDraftSession();
      return { ...initialState, phase: 'welcome' };
    case 'RESTORE_DRAFT':
    case 'RESTORE_SAVED': {
      const draft = action.payload;
      if (!draft || !draft.questionIds || !draft.name) return state;
      const mode = draft.mode || 'normal';
      // Union-Pool: löst jede Frage-ID auf – normale Fragen UND generierte Vokabelkarten.
      const pool = [...questions, ...getVocabularyQuestions()];
      const byId = Object.fromEntries(pool.map(q => [q.id, q]));
      const restoredQuestions = draft.questionIds.map(id => byId[id]).filter(Boolean);
      if (restoredQuestions.length === 0) return state;
      const nextIndex = draft.answers.length;
      if (nextIndex >= restoredQuestions.length) return state;
      // Historien-Eintrag: Die aktuelle Runde (Draft) läuft unter ihrer ID weiter. Gespeicherte Runden und
      // Wiederholungs-Quizze bekommen eine neue ID; ihre bisherigen Antworten stehen schon in der Historie.
      const continues = action.type === 'RESTORE_DRAFT' && draft.sessionId;
      const sessionId = continues ? draft.sessionId : newSessionId();
      const answersOffset = continues
        ? draft.answersOffset || 0
        : action.type === 'RESTORE_DRAFT'
          ? 0 // alter Draft ohne ID: seine Antworten stehen noch nicht in der Historie
          : draft.answers.length;
      return {
        ...state,
        phase: 'quiz',
        playerName: draft.name,
        mode,
        sessionId,
        answersOffset,
        passExam: draft.passExam ?? null,
        passInfo: draft.passInfo ?? null,
        questions: withShuffledOptions(restoredQuestions),
        currentIndex: nextIndex,
        score: draft.score,
        answers: draft.answers,
        lastAnswer: null,
      };
    }
    default:
      return state;
  }
}

export default function useQuiz() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.phase === 'finished') {
      clearDraftSession();
      return;
    }
    if ((state.phase === 'quiz' || state.phase === 'feedback') && state.playerName && state.questions.length > 0) {
      const maxScore = getMaxPoints(state.questions);
      saveDraftSession(state.playerName, state.answers, state.score, maxScore, state.questions.map(q => q.id), state.mode, {
        sessionId: state.sessionId,
        answersOffset: state.answersOffset,
        passExam: state.passExam,
        passInfo: state.passInfo,
      });
    }
  }, [state.phase, state.playerName, state.answers, state.score, state.questions, state.mode, state.sessionId, state.answersOffset, state.passExam, state.passInfo]);

  // Wortschatz-Durchgang: jede beantwortete Karte zählt sofort als erledigt (auch wenn die Runde abbricht).
  useEffect(() => {
    if (!state.passExam || !state.playerName || state.answers.length === 0) return;
    markVocabDone(state.playerName, state.passExam, state.answers.map((a) => a.questionId));
  }, [state.answers, state.passExam, state.playerName]);

  // Auto-Save der Ergebnisse: nach jeder Antwort den Historien-Eintrag der Runde aktualisieren.
  useEffect(() => {
    if (!state.playerName || !state.sessionId) return;
    const own = state.answers.slice(state.answersOffset);
    if (own.length === 0) return;
    upsertStudentSession(state.playerName, state.sessionId, own, { complete: state.phase === 'finished' });
  }, [state.answers, state.phase, state.playerName, state.sessionId, state.answersOffset]);

  // Highscore einmal pro fertiger Runde.
  const highscoreSaved = useRef(null);
  useEffect(() => {
    if (state.phase !== 'finished' || !state.sessionId || highscoreSaved.current === state.sessionId) return;
    highscoreSaved.current = state.sessionId;
    saveHighscore(state.playerName, state.score, getMaxPoints(state.questions), state.questions.length);
  }, [state.phase, state.sessionId, state.playerName, state.score, state.questions]);

  const startQuiz = useCallback((name, mode = 'normal', exam = DEFAULT_EXAM) => {
    // „Alle Vokabeln“ = nächste Runde (50 Karten) im Wortschatz-Durchgang dieser Schulaufgabe.
    if (mode === 'vocabulary') {
      const questions = planVocabRound(name, exam);
      if (questions.length > 0) {
        const st = vocabPassStatus(name, exam);
        const passInfo = { round: st.round, roundsTotal: st.roundsTotal, size: st.size, startCur: st.cur };
        dispatch({ type: 'START_QUIZ', name, mode, exam, questions, passExam: exam, passInfo });
        return;
      }
    }
    dispatch({ type: 'START_QUIZ', name, mode, exam });
  }, []);

  const startVocabReview = useCallback((playerName, questionIds) => {
    if (!playerName || !Array.isArray(questionIds) || questionIds.length === 0) return;
    // Union-Pool: Vokabel-Fehler können vocab_card ODER normale Fragen (fill_gap/picture) sein.
    const pool = [...questions, ...getVocabularyQuestions()];
    const byId = Object.fromEntries(pool.map(q => [q.id, q]));
    const restoredQuestions = spreadByWord(questionIds.map(id => byId[id]).filter(Boolean));
    if (restoredQuestions.length === 0) return;
    const maxScore = getMaxPoints(restoredQuestions);
    dispatch({
      type: 'RESTORE_SAVED',
      payload: {
        name: playerName,
        playerName,
        questionIds: restoredQuestions.map(q => q.id),
        answers: [],
        score: 0,
        maxScore,
        mode: 'vocabulary',
      },
    });
  }, []);

  // Übungs-Quiz aus normalen (nicht-Vokabel-)Fragen, z.B. gezielt für Schwächen.
  const startNormalReview = useCallback((playerName, questionIds) => {
    if (!playerName || !Array.isArray(questionIds) || questionIds.length === 0) return;
    const byId = Object.fromEntries(questions.map((q) => [q.id, q]));
    const restoredQuestions = questionIds.map((id) => byId[id]).filter(Boolean);
    if (restoredQuestions.length === 0) return;
    const maxScore = getMaxPoints(restoredQuestions);
    dispatch({
      type: 'RESTORE_SAVED',
      payload: {
        name: playerName,
        playerName,
        questionIds: restoredQuestions.map((q) => q.id),
        answers: [],
        score: 0,
        maxScore,
        mode: 'normal',
      },
    });
  }, []);

  const submitAnswer = useCallback((answer) => {
    dispatch({ type: 'SUBMIT_ANSWER', answer });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  const restoreDraft = useCallback(() => {
    const draft = getDraftSession();
    if (draft && draft.questionIds && draft.name) {
      dispatch({ type: 'RESTORE_DRAFT', payload: draft });
    }
  }, []);

  const restoreSavedRound = useCallback((saved) => {
    if (!saved || !saved.questionIds?.length || !saved.playerName) return;
    dispatch({ type: 'RESTORE_SAVED', payload: { ...saved, name: saved.playerName } });
  }, []);

  const saveCurrentRound = useCallback((roundName) => {
    if (!roundName?.trim() || !state.playerName || !state.questions?.length) return false;
    const maxScore = getMaxPoints(state.questions);
    addSavedRound({
      roundName: roundName.trim(),
      playerName: state.playerName,
      questionIds: state.questions.map(q => q.id),
      answers: state.answers,
      score: state.score,
      maxScore,
      mode: state.mode,
      passExam: state.passExam,
    });
    // Die Ergebnisse stehen durch den Auto-Save schon in der Historie – hier nichts doppelt speichern.
    return true;
  }, [state.playerName, state.questions, state.answers, state.score, state.mode, state.passExam]);

  const currentQuestion = state.questions[state.currentIndex] || null;
  const maxScore = getMaxPoints(state.questions);
  const progress = state.questions.length > 0
    ? Math.round(((state.currentIndex + (state.phase === 'feedback' ? 1 : 0)) / state.questions.length) * 100)
    : 0;

  return {
    ...state,
    currentQuestion,
    maxScore,
    progress,
    startQuiz,
    startVocabReview,
    startNormalReview,
    submitAnswer,
    nextQuestion,
    restart,
    restoreDraft,
    restoreSavedRound,
    saveCurrentRound,
  };
}
