// Analytics engine for the admin dashboard
// Detects weaknesses and generates recommendations

import { VOCAB_LIST } from '../data/vocabList';

const VOCAB_IDS = new Set(VOCAB_LIST.map(v => v.id));

/** Wie viele Vokabeln aus der Liste hat der Schüler mind. 1x richtig beantwortet? (beide Richtungen zählen) */
export function getVocabMastery(sessions) {
  if (!sessions || sessions.length === 0) return { total: VOCAB_LIST.length, mastered: 0 };
  const masteredIds = new Set();
  sessions.forEach(session => {
    (session.answers || []).forEach(a => {
      if (!a.isCorrect) return;
      const baseId = a.questionId.replace(/_en$|_de$|_second$/, '');
      if (VOCAB_IDS.has(baseId)) masteredIds.add(baseId);
    });
  });
  return { total: VOCAB_LIST.length, mastered: masteredIds.size };
}

const TOPIC_RECOMMENDATIONS = {
  article_a_an: { label: "a/an (Unbestimmter Artikel)", bookRef: "G8", practice: "WB p.26/24" },
  have_got: { label: "have got", bookRef: "G10-12", practice: "WB p.27/28" },
  who_what_whose: { label: "who/what/whose", bookRef: "G13", practice: "WB p.28/1" },
  can_cant: { label: "can/can't", bookRef: "G14", practice: "WB p.29/2-4" },
  imperative: { label: "Imperativ", bookRef: "G15", practice: "WB p.33/8" },
  s_genitive: { label: "s-Genitiv", bookRef: "G16", practice: "WB p.39/21-23" },
  of_possessive: { label: "Besitzform mit of", bookRef: "G17", practice: "Buch p.84/1" },
  this_that: { label: "this/that/these/those", bookRef: "G18", practice: "Buch p.131/2" },
  simple_present: { label: "Simple Present", bookRef: "G19", practice: "Buch p.132/4" },
  word_order: { label: "Satzstellung", bookRef: "G21", practice: "Buch p.133/6+7" },
  frequency_adverbs: { label: "Häufigkeitsadverbien", bookRef: "G22", practice: "Buch p.134/1" },
  telling_time: { label: "Uhrzeit", bookRef: "Uhrzeit", practice: "Buch p.65/1+3" },
  vocabulary: { label: "Wortschatz", bookRef: "Vokabeln p.209-221", practice: "WB Vokabelübungen" },
  reading: { label: "Leseverstehen", bookRef: "Reading", practice: "Buch p.34/1, 55/10, 63/2" },
  mediation: { label: "Sprachmittlung", bookRef: "Mediation", practice: "WB p.35/13, eigene Texte schreiben" },
};

export function analyzeStudent(sessions, dismissals = { questions: {}, wrongAttempts: {} }, markedCorrect = {}) {
  if (!sessions || sessions.length === 0) return null;

  const dismissedQuestions = dismissals?.questions || {};
  const dismissedAttempts = dismissals?.wrongAttempts || {};
  // markedCorrect[questionId] = [dateIso, ...] — treat these wrong attempts as correct

  // Aggregate answers across all sessions
  const topicStats = {};
  const categoryStats = {};
  const questionStats = {}; // per questionId: track wrong/correct over time
  let totalCorrect = 0;
  let totalQuestions = 0;

  sessions.forEach(session => {
    const sessionTime = new Date(session.date).getTime();
    (session.answers || []).forEach(answer => {
      if (!answer) return;
      const isWrong = !answer.isCorrect;
      if (isWrong) {
        if (dismissedQuestions[answer.questionId]) return;
        const list = dismissedAttempts[answer.questionId];
        if (Array.isArray(list) && list.includes(session.date)) return;
      }

      const markedCorrectDates = markedCorrect[answer.questionId];
      const treatAsCorrect = answer.isCorrect || (Array.isArray(markedCorrectDates) && markedCorrectDates.includes(session.date));

      // Per topic
      if (!topicStats[answer.topic]) {
        topicStats[answer.topic] = { correct: 0, total: 0, label: answer.topicLabel };
      }
      topicStats[answer.topic].total++;
      if (treatAsCorrect) topicStats[answer.topic].correct++;

      // Per category
      if (!categoryStats[answer.category]) {
        categoryStats[answer.category] = { correct: 0, total: 0 };
      }
      categoryStats[answer.category].total++;
      if (treatAsCorrect) categoryStats[answer.category].correct++;

      // Per question (for Lehrer-Auswertung)
      if (!questionStats[answer.questionId]) {
        questionStats[answer.questionId] = {
          questionId: answer.questionId,
          topic: answer.topic,
          topicLabel: answer.topicLabel,
          category: answer.category,
          wrongCount: 0,
          correctCount: 0,
          totalAttempts: 0,
          firstWrongTime: null,
          lastCorrectTime: null,
          wrongAttempts: [],
        };
      }
      const qs = questionStats[answer.questionId];
      qs.totalAttempts++;

      if (treatAsCorrect) {
        qs.correctCount++;
        qs.lastCorrectTime = sessionTime;
      } else {
        qs.wrongCount++;
        if (qs.firstWrongTime == null || sessionTime < qs.firstWrongTime) {
          qs.firstWrongTime = sessionTime;
        }
        qs.wrongAttempts.push({
          date: session.date,
          userAnswer: answer.userAnswer,
          correctAnswer: answer.correctAnswer,
        });
      }

      totalCorrect += treatAsCorrect ? 1 : 0;
      totalQuestions++;
    });
  });

  // Calculate percentages and identify weaknesses
  const topicResults = Object.entries(topicStats).map(([topic, stats]) => {
    const percentage = Math.round((stats.correct / stats.total) * 100);
    const rec = TOPIC_RECOMMENDATIONS[topic] || { label: topic, bookRef: "", practice: "" };
    return {
      topic,
      label: rec.label,
      correct: stats.correct,
      total: stats.total,
      percentage,
      strength: percentage >= 80 ? 'strong' : percentage >= 50 ? 'medium' : 'weak',
      bookRef: rec.bookRef,
      practice: rec.practice,
    };
  });

  // Sort by percentage ascending (weakest first)
  topicResults.sort((a, b) => a.percentage - b.percentage);

  const weaknesses = topicResults.filter(t => t.strength === 'weak');
  const mediums = topicResults.filter(t => t.strength === 'medium');
  const strengths = topicResults.filter(t => t.strength === 'strong');

  // Category breakdown
  const categoryResults = Object.entries(categoryStats).map(([cat, stats]) => ({
    category: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    correct: stats.correct,
    total: stats.total,
    percentage: Math.round((stats.correct / stats.total) * 100),
  }));

  // Score trend (last sessions)
  const scoreTrend = sessions.map(s => ({
    date: new Date(s.date).toLocaleDateString('de-DE'),
    percentage: s.percentage,
  }));

  // Generate recommendations
  const recommendations = [];
  weaknesses.forEach(w => {
    recommendations.push({
      priority: 'high',
      text: `${w.label}: Nur ${w.percentage}% richtig. Unbedingt üben!`,
      practice: w.practice,
      bookRef: w.bookRef,
    });
  });
  mediums.forEach(m => {
    recommendations.push({
      priority: 'medium',
      text: `${m.label}: ${m.percentage}% richtig. Noch etwas üben.`,
      practice: m.practice,
      bookRef: m.bookRef,
    });
  });

  const vocabMastery = getVocabMastery(sessions);

  // Per-question mistake overview for Lehrer-Bereich
  const questionMistakes = Object.values(questionStats)
    .filter(q => q.wrongCount > 0)
    .map(q => {
      const eventuallyCorrect =
        q.correctCount > 0 &&
        q.lastCorrectTime != null &&
        q.firstWrongTime != null &&
        q.lastCorrectTime > q.firstWrongTime;
      return {
        questionId: q.questionId,
        topic: q.topic,
        topicLabel: q.topicLabel,
        category: q.category,
        wrongCount: q.wrongCount,
        correctCount: q.correctCount,
        totalAttempts: q.totalAttempts,
        eventuallyCorrect,
        wrongAttempts: q.wrongAttempts,
      };
    })
    // Sort: still never-correct first, then most wrong
    .sort((a, b) => {
      if (a.eventuallyCorrect !== b.eventuallyCorrect) {
        return a.eventuallyCorrect ? 1 : -1;
      }
      return b.wrongCount - a.wrongCount;
    });

  return {
    totalSessions: sessions.length,
    totalCorrect,
    totalQuestions,
    overallPercentage: Math.round((totalCorrect / totalQuestions) * 100),
    topicResults,
    categoryResults,
    weaknesses,
    mediums,
    strengths,
    scoreTrend,
    recommendations,
    lastPlayed: sessions[sessions.length - 1].date,
    vocabMastery,
    questionMistakes,
  };
}

export function getAllStudentOverview(history) {
  const overview = [];
  Object.entries(history).forEach(([name, data]) => {
    const analysis = analyzeStudent(data.sessions);
    if (analysis) {
      overview.push({
        name,
        ...analysis,
      });
    }
  });
  return overview.sort((a, b) => a.name.localeCompare(b.name));
}
