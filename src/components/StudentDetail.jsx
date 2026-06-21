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

  const vocabReviewIds = useMemo(() => {
    if (!analysis?.questionMistakes?.length) return [];
    const ids = new Set();
    analysis.questionMistakes.forEach((q) => {
      if (studentDismissals.questions?.[q.questionId]) return;
      const def = questionById[q.questionId];
      if (!def || def.type !== 'vocab_card') return;
      const dismissedAttempts = studentDismissals.wrongAttempts?.[q.questionId] || [];
      const visibleAttempts = (q.wrongAttempts || []).filter(
        (a) => !dismissedAttempts.includes(a.date)
      );
      if (visibleAttempts.length === 0) return;
      ids.add(q.questionId);
    });
    return Array.from(ids);
  }, [analysis, studentDismissals, questionById]);

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

      {/* Übungs-Quiz erstellen (gezielt für Schwächen) */}
      {((onCreateNormalReviewQuiz && normalReviewIds.length > 0) ||
        (onCreateVocabReviewQuiz && vocabReviewIds.length > 0)) && (
        <div className="detail-section">
          <h3>Übungs-Quiz erstellen</h3>
          <p className="admin-hint">
            Startet sofort eine Übungsrunde, die gezielt die Schwächen von {name} wiederholt –
            echte Fehler plus weitere Fragen aus denselben Themen.
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {onCreateNormalReviewQuiz && normalReviewIds.length > 0 && (
              <Button
                size="sm"
                onClick={() => onCreateNormalReviewQuiz(name, normalReviewIds)}
              >
                Schwächen üben – Grammatik & Co. ({normalReviewIds.length} Fragen)
              </Button>
            )}
            {onCreateVocabReviewQuiz && vocabReviewIds.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCreateVocabReviewQuiz(name, vocabReviewIds)}
              >
                Vokabeln wiederholen ({vocabReviewIds.length})
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Per-question mistakes */}
      {analysis.questionMistakes && analysis.questionMistakes.length > 0 && (
        <div className="detail-section">
          <h3>Falsch beantwortete Fragen</h3>
          <p className="admin-hint">
            Jede Zeile = ein konkretes Item. „Später richtig“ bedeutet, dass die Frage nach einem
            ersten Fehler mindestens einmal korrekt beantwortet wurde.
          </p>
          <div className="space-y-3">
            {analysis.questionMistakes
              .filter(q => !studentDismissals.questions?.[q.questionId])
              .map((q) => {
                const dismissedAttempts = studentDismissals.wrongAttempts?.[q.questionId] || [];
                const visibleAttempts = (q.wrongAttempts || []).filter(
                  (a) => !dismissedAttempts.includes(a.date)
                );
                if (visibleAttempts.length === 0) return null;
                const def = questionById[q.questionId];
                const primaryAttempt = visibleAttempts[visibleAttempts.length - 1];
                return (
                  <Card
                    key={q.questionId}
                    className={`max-w-[500px] ${
                      q.eventuallyCorrect ? 'border-amber-300/80' : 'border-destructive/40'
                    }`}
                  >
                    <CardContent className="py-4 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <p className="flex items-baseline justify-between text-sm font-semibold">
                            <span>{q.topicLabel}</span>
                            {def?.type === 'vocab_card' && (
                              <span className="text-xs text-muted-foreground ml-4">
                                Vokabelkarte
                              </span>
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
                              <p>
                                <strong>Antwort:</strong> „{primaryAttempt.userAnswer}“
                              </p>
                              <p>
                                <strong>Korrekt:</strong> „{primaryAttempt.correctAnswer}“
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="mistake-dismiss text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30"
                            onClick={() => {
                              markAttemptsAsCorrect(name, q.questionId, visibleAttempts.map(a => a.date));
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

                      {/* Metadaten + Datum mit Abstand unterhalb der Antwort/Korrektur */}
                      <div className="flex items-end justify-between pt-4 text-xs text-muted-foreground">
                        <div className="space-y-0.5">
                          <p>
                            Falsch: {q.wrongCount}× · Richtig: {q.correctCount}× · Versuche gesamt:{' '}
                            {q.totalAttempts}
                          </p>
                          <p>
                            Später richtig beantwortet:{' '}
                            {q.eventuallyCorrect
                              ? 'Ja (Kontext wurde später getroffen)'
                              : 'Nein, bisher nie.'}
                          </p>
                        </div>
                        {primaryAttempt && (
                          <span className="text-[11px]">
                            {new Date(primaryAttempt.date).toLocaleDateString('de-DE')}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
