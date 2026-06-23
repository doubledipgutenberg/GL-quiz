import { useMemo, useState, useEffect } from 'react';
import { analyzeStudent } from '../utils/analytics';
import { getTeacherDismissals, dismissQuestionForStudent, getTeacherMarkedCorrect, markAttemptsAsCorrect } from '../utils/storage';
import { Check } from 'lucide-react';
import questions, { getVocabularyQuestions } from '../data/questions';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

export default function StudentDetail({ name, sessions, onBack, onCreateVocabReviewQuiz, onCreateNormalReviewQuiz }) {
  const [dismissals, setDismissals] = useState({});
  const [markedCorrect, setMarkedCorrect] = useState({});

  useEffect(() => {
    setDismissals(getTeacherDismissals());
    setMarkedCorrect(getTeacherMarkedCorrect());
  }, []);

  const studentDismissals = dismissals[name] || { questions: {}, wrongAttempts: {} };
  const studentMarkedCorrect = markedCorrect[name] || {};

  const analysis = useMemo(
    () => analyzeStudent(sessions, studentDismissals, studentMarkedCorrect),
    [sessions, studentDismissals, studentMarkedCorrect],
  );

  const questionById = useMemo(() => {
    const map = {};
    questions.forEach((q) => { map[q.id] = q; });
    try {
      getVocabularyQuestions().forEach((q) => {
        if (!map[q.id]) map[q.id] = q;
      });
    } catch {
      // ignore
    }
    return map;
  }, []);

  // Falsch beantwortete VOKABELN, nach Erfolgsquote in 5 Stufen (am schwersten zuerst).
  // Jede Stufe trägt ihre kumulativen IDs: diese Stufe + alle schwierigeren darüber.
  const VOCAB_TIER_DEFS = [
    { key: 'never',  label: 'Nie richtig',      hint: '0 % richtig',          test: (r) => r === 0 },
    { key: 'rare',   label: 'Selten richtig',   hint: 'bis 33 % richtig',     test: (r) => r > 0 && r <= 1 / 3 },
    { key: 'some',   label: 'Manchmal richtig', hint: '34–50 % richtig',      test: (r) => r > 1 / 3 && r <= 0.5 },
    { key: 'often',  label: 'Oft richtig',      hint: '51–75 % richtig',      test: (r) => r > 0.5 && r <= 0.75 },
    { key: 'mostly', label: 'Meistens richtig', hint: '76–99 % richtig',      test: (r) => r > 0.75 && r < 1 },
  ];

  // Welche Schulaufgabe(n) hat der Schüler tatsächlich gespielt?
  const playedExams = useMemo(() => {
    const set = new Set();
    sessions.forEach((s) => (s.answers || []).forEach((a) => {
      const def = questionById[a.questionId];
      if (def?.exam) set.add(def.exam);
    }));
    return set;
  }, [sessions, questionById]);

  // Übungs-Quiz für SCHWÄCHEN (normale, nicht-Vokabel-Fragen):
  // schwache/mittlere Themen -> echte Fehler + frische Fragen aus denselben Themen.
  const NORMAL_REVIEW_MAX = 20;
  const normalReviewIds = useMemo(() => {
    if (!analysis) return [];
    const weakTopics = new Set(
      analysis.topicResults
        .filter((t) => t.strength !== 'strong' && t.topic !== 'vocabulary')
        .map((t) => t.topic)
    );
    if (weakTopics.size === 0) return [];

    const ids = new Set();
    // 1) Genau die normalen Fragen, die der Schüler falsch hatte (nicht ausgeblendet)
    (analysis.questionMistakes || []).forEach((q) => {
      if (studentDismissals.questions?.[q.questionId]) return;
      const def = questionById[q.questionId];
      if (!def || def.type === 'vocab_card' || def.category === 'vocabulary') return;
      if (!weakTopics.has(def.topic)) return;
      const dismissedAttempts = studentDismissals.wrongAttempts?.[q.questionId] || [];
      const visibleAttempts = (q.wrongAttempts || []).filter(
        (a) => !dismissedAttempts.includes(a.date)
      );
      if (visibleAttempts.length === 0) return;
      ids.add(q.questionId);
    });
    // 2) Zusätzliche frische Fragen aus denselben Schwäche-Themen (nur gespielte Schulaufgaben)
    questions.forEach((q) => {
      if (q.type === 'vocab_card' || q.category === 'vocabulary') return;
      if (!weakTopics.has(q.topic)) return;
      if (playedExams.size > 0 && q.exam && !playedExams.has(q.exam)) return;
      ids.add(q.id);
    });

    // Mischen und begrenzen
    const arr = Array.from(ids);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, NORMAL_REVIEW_MAX);
  }, [analysis, studentDismissals, questionById, playedExams]);

  if (!analysis) {
    return (
      <div className="student-detail">
        <button className="btn btn-back" onClick={onBack}>Zurück</button>
        <p>Keine Daten für {name}.</p>
      </div>
    );
  }

  const visibleMistakes = (analysis.questionMistakes || [])
    .filter((q) => !studentDismissals.questions?.[q.questionId])
    .map((q) => {
      const dismissedAttempts = studentDismissals.wrongAttempts?.[q.questionId] || [];
      const visibleAttempts = (q.wrongAttempts || []).filter((a) => !dismissedAttempts.includes(a.date));
      return { q, visibleAttempts, def: questionById[q.questionId] };
    })
    .filter((m) => m.visibleAttempts.length > 0);

  // Trennung nach KATEGORIE (nicht Typ): alle Vokabel-Items (vocab_card, fill_gap, picture …)
  // gehen in den Vokabel-Bereich; Grammatik/Reading/Mediation in den anderen.
  const vocabMistakes = visibleMistakes.filter((m) => m.def?.category === 'vocabulary');
  const nonVocabMistakes = visibleMistakes.filter((m) => m.def?.category !== 'vocabulary');

  // Vokabel-Karten in 5 Stufen nach Erfolgsquote (am schwersten zuerst),
  // jede Stufe mit kumulativen IDs (diese Stufe + alle schwierigeren darüber).
  const vocabTierGroups = (() => {
    const buckets = VOCAB_TIER_DEFS.map((d) => ({ ...d, items: [] }));
    vocabMistakes.forEach((m) => {
      const total = m.q.totalAttempts || (m.q.wrongCount + m.q.correctCount) || 1;
      const rate = total > 0 ? m.q.correctCount / total : 0;
      let i = VOCAB_TIER_DEFS.findIndex((d) => d.test(rate));
      if (i === -1) i = buckets.length - 1;
      buckets[i].items.push(m);
    });
    let cum = [];
    return buckets.map((b) => {
      cum = cum.concat(b.items.map((m) => m.q.questionId));
      return { ...b, cumulativeIds: [...cum] };
    });
  })();

  const renderMistakeCard = ({ q, visibleAttempts, def }) => {
    const primaryAttempt = visibleAttempts[visibleAttempts.length - 1];
    return (
      <Card
        key={q.questionId}
        className={`max-w-[500px] ${q.eventuallyCorrect ? 'border-amber-300/80' : 'border-destructive/40'}`}
      >
        <CardContent className="py-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="flex items-baseline justify-between text-sm font-semibold">
                <span>{q.topicLabel}</span>
                {def?.type === 'vocab_card' && (
                  <span className="text-xs text-muted-foreground ml-4">Vokabelkarte</span>
                )}
              </p>
              {def && (
                <div className="text-sm text-foreground/90">
                  {def.type === 'vocab_card' ? (
                    <p className="text-base font-semibold">{def.word}</p>
                  ) : (
                    <p>{def.question}</p>
                  )}
                </div>
              )}
              {primaryAttempt && (
                <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                  <p><strong>Antwort:</strong> „{primaryAttempt.userAnswer}“</p>
                  <p><strong>Korrekt:</strong> „{primaryAttempt.correctAnswer}“</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="mistake-dismiss text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30"
                onClick={() => {
                  markAttemptsAsCorrect(name, q.questionId, visibleAttempts.map((a) => a.date));
                  setMarkedCorrect(getTeacherMarkedCorrect());
                }}
                aria-label="Als richtig werten"
              >
                <Check className="size-5" />
              </button>
              <button
                type="button"
                className="mistake-dismiss"
                onClick={() => {
                  dismissQuestionForStudent(name, q.questionId);
                  setDismissals(getTeacherDismissals());
                }}
                aria-label="Frage ausblenden"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex items-end justify-between pt-4 text-xs text-muted-foreground">
            <div className="space-y-0.5">
              <p>Falsch: {q.wrongCount}× · Richtig: {q.correctCount}× · Versuche gesamt: {q.totalAttempts}</p>
              <p>
                Später richtig beantwortet:{' '}
                {q.eventuallyCorrect ? 'Ja (Kontext wurde später getroffen)' : 'Nein, bisher nie.'}
              </p>
            </div>
            {primaryAttempt && (
              <span className="text-[11px]">{new Date(primaryAttempt.date).toLocaleDateString('de-DE')}</span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="student-detail">
      <div className="detail-header">
        <button className="btn btn-back" onClick={onBack}>Zurück</button>
        <h2>{name} — Detailansicht</h2>
      </div>

      {/* Overview stats */}
      <div className="detail-stats">
        <div className="stat-card">
          <span className="stat-number">{analysis.totalSessions}</span>
          <span className="stat-label">Versuche</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{analysis.overallPercentage}%</span>
          <span className="stat-label">Durchschnitt</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{analysis.totalCorrect}/{analysis.totalQuestions}</span>
          <span className="stat-label">Richtig gesamt</span>
        </div>
        <div className="stat-card stat-vocab">
          <span className="stat-number">{analysis.vocabMastery?.mastered ?? 0} / {analysis.vocabMastery?.total ?? 0}</span>
          <span className="stat-label">Vokabeln gekonnt</span>
        </div>
      </div>

      {/* Score Trend */}
      {analysis.scoreTrend.length > 1 && (
        <div className="detail-section">
          <h3>Verlauf</h3>
          <div className="trend-chart">
            {analysis.scoreTrend.map((entry, i) => (
              <div key={i} className="trend-bar-container">
                <div className="trend-bar" style={{ height: `${entry.percentage}%` }}>
                  <span className="trend-value">{entry.percentage}%</span>
                </div>
                <span className="trend-date">{entry.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="detail-section">
        <h3>Nach Kategorie</h3>
        <div className="category-bars">
          {analysis.categoryResults.map(cat => (
            <div key={cat.category} className="category-bar-row">
              <span className="cat-label">{cat.label}</span>
              <div className="cat-bar-bg">
                <div
                  className={`cat-bar-fill ${cat.percentage >= 80 ? 'bar-good' : cat.percentage >= 50 ? 'bar-ok' : 'bar-bad'}`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
              <span className="cat-pct">{cat.percentage}% ({cat.correct}/{cat.total})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Details */}
      <div className="detail-section">
        <h3>Nach Thema (sortiert nach Schwäche)</h3>
        <div className="topic-detail-list">
          {analysis.topicResults.map(topic => (
            <div key={topic.topic} className={`topic-detail-item topic-${topic.strength}`}>
              <div className="topic-detail-header">
                <span className={`strength-dot strength-${topic.strength}`} />
                <strong>{topic.label}</strong>
                <span className="topic-pct">{topic.percentage}% ({topic.correct}/{topic.total})</span>
              </div>
              {topic.strength !== 'strong' && topic.practice && (
                <div className="topic-practice">
                  Übe: {topic.practice} ({topic.bookRef})
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div className="detail-section">
          <h3>Empfehlungen</h3>
          <div className="recommendations">
            {analysis.recommendations.map((rec, i) => (
              <div key={i} className={`rec-item rec-${rec.priority}`}>
                <span className={`rec-dot rec-dot-${rec.priority}`} aria-hidden="true" />
                <div>
                  <p>{rec.text}</p>
                  {rec.practice && <p className="rec-practice">{rec.practice}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Falsch beantwortet — A) Grammatik / Reading / Mediation */}
      {nonVocabMistakes.length > 0 && (
        <div className="detail-section">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3>Falsch beantwortet: Grammatik, Reading &amp; Mediation</h3>
            {onCreateNormalReviewQuiz && normalReviewIds.length > 0 && (
              <Button size="sm" onClick={() => onCreateNormalReviewQuiz(name, normalReviewIds)}>
                Schwächen üben ({normalReviewIds.length})
              </Button>
            )}
          </div>
          <p className="admin-hint">
            Jede Karte = ein konkretes Item. „Später richtig“ bedeutet, dass die Frage nach einem
            ersten Fehler mindestens einmal korrekt beantwortet wurde.
          </p>
          <div className="space-y-3">
            {nonVocabMistakes.map(renderMistakeCard)}
          </div>
        </div>
      )}

      {/* Falsch beantwortet — B) Vokabeln, in 5 Stufen nach Erfolgsquote */}
      {vocabMistakes.length > 0 && (
        <div className="detail-section">
          <h3>Falsch beantwortet: Vokabeln (nach Schwierigkeit)</h3>
          <p className="admin-hint">
            5 Stufen nach Erfolgsquote – am schwersten zuerst. Der Button je Stufe erstellt ein
            Wiederholungs-Quiz mit dieser Stufe <strong>und allen schwierigeren darüber</strong>.
          </p>
          <div className="space-y-6">
            {vocabTierGroups.map((tier) => (
              <div key={tier.key} className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-1">
                  <div>
                    <span className="text-sm font-semibold">{tier.label}</span>{' '}
                    <span className="text-xs text-muted-foreground">
                      ({tier.hint}) · {tier.items.length} Vokabel{tier.items.length === 1 ? '' : 'n'}
                    </span>
                  </div>
                  {onCreateVocabReviewQuiz && tier.items.length > 0 && (
                    <Button
                      size="sm"
                      onClick={() => onCreateVocabReviewQuiz(name, tier.cumulativeIds)}
                    >
                      Wiederholen: ab hier ({tier.cumulativeIds.length})
                    </Button>
                  )}
                </div>
                {tier.items.length > 0 ? (
                  <div className="space-y-3">
                    {tier.items.map(renderMistakeCard)}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">Keine Vokabeln auf dieser Stufe.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
