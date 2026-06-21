import { useReducer, useCallback, useEffect } from 'react';
import questions, { getVocabularyQuestions, DEFAULT_EXAM } from '../data/questions';
import { checkAnswer, calculatePoints, getMaxPoints } from '../utils/scoring';
import { saveHighscore, saveStudentSession, saveDraftSession, clearDraftSession, getDraftSession, addSavedRound, getSavedRounds, getStudentHistory } from '../utils/storage';

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

const initialState = {
  phase: 'welcome',
  playerName: '',
  mode: 'normal',           // 'normal' | 'vocabulary'
  exam: DEFAULT_EXAM,       // 'sa2' | 'sa4'
  questions: [],
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
      if (mode === 'vocabulary') {
        const pool = getVocabularyQuestions(exam);
        const shuffled = shuffle(pool);
        return {
          ...state,
          phase: 'quiz',
          playerName: action.name,
          mode,
          exam,
          questions: shuffled,
          currentIndex: 0,
          score: 0,
          answers: [],
          lastAnswer: null,
        };
      }

      // Normal-Modus: nach Möglichkeit keine Wiederholung von Fragen für denselben Schüler
      let candidatePool = questions.filter((q) => q.exam === exam);
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
          const unseen = questions.filter((q) => !seenIds.has(q.id));
          if (unseen.length > 0) {
            candidatePool = unseen;
          }
        }
      } catch {
        // wenn History kaputt ist, einfach gesamten Fragenpool verwenden
      }

      const shuffled = shuffle(candidatePool).slice(0, QUESTIONS_PER_SESSION);
      return {
        ...state,
        phase: 'quiz',
        playerName: action.name,
        mode,
        exam,
        questions: shuffled,
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
        // Quiz finished — save data
        const maxScore = getMaxPoints(state.questions);
        saveHighscore(state.playerName, state.score, maxScore, state.questions.length);
        saveStudentSession(state.playerName, state.answers, state.score, maxScore);
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
      const pool = mode === 'vocabulary' ? getVocabularyQuestions() : questions;
      const byId = Object.fromEntries(pool.map(q => [q.id, q]));
      const restoredQuestions = draft.questionIds.map(id => byId[id]).filter(Boolean);
      if (restoredQuestions.length === 0) return state;
      const nextIndex = draft.answers.length;
      if (nextIndex >= restoredQuestions.length) return state;
      return {
        ...state,
        phase: 'quiz',
        playerName: draft.name,
        mode,
        questions: restoredQuestions,
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
      saveDraftSession(state.playerName, state.answers, state.score, maxScore, state.questions.map(q => q.id), state.mode);
    }
  }, [state.phase, state.playerName, state.answers, state.score, state.questions, state.mode]);

  const startQuiz = useCallback((name, mode = 'normal', exam = DEFAULT_EXAM) => {
    dispatch({ type: 'START_QUIZ', name, mode, exam });
  }, []);

  const startVocabReview = useCallback((playerName, questionIds) => {
    if (!playerName || !Array.isArray(questionIds) || questionIds.length === 0) return;
    const pool = getVocabularyQuestions();
    const byId = Object.fromEntries(pool.map(q => [q.id, q]));
    const restoredQuestions = questionIds.map(id => byId[id]).filter(Boolean);
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
      mode: state.mode
    });
    // Save partial student session for Lehrer-Analytics when Runde aktiv gespeichert wird
    saveStudentSession(state.playerName, state.answers, state.score, maxScore);
    return true;
  }, [state.playerName, state.questions, state.answers, state.score, state.mode]);

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
