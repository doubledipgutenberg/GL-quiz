import { useEffect, useMemo, useRef, useState } from 'react';
import { analyzeStudent } from '../utils/analytics';
import { checkAnswer } from '../utils/scoring';
import {
  getTeacherDismissals,
  dismissQuestionForStudent,
  getTeacherMarkedCorrect,
  markAttemptsAsCorrect,
  unmarkAttemptCorrect,
  getAnswerFlags,
  getFlagReviews,
  reviewFlag,
} from '../utils/storage';
import { courseOfQuestion } from '../utils/courseOf';
import questions, { getVocabularyQuestions, latestVocabBatch } from '../data/questions';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

// Überschrift einer auf-/zuklappbaren Liste.
function ListToggle({ open, onToggle, children }) {
  return (
    <button type="button" className="flex items-baseline gap-2 text-left" onClick={onToggle} aria-expanded={open}>
      <span className="inline-block w-3 text-xs text-muted-foreground">{open ? '▾' : '▸'}</span>
      <span>{children}</span>
    </button>
  );
}

export default function StudentDetail({ name, courseId, courseLabel, sessions, onBack, onCreateVocabReviewQuiz, onCreateNormalReviewQuiz }) {
  const [dismissals, setDismissals] = useState(() => getTeacherDismissals());
  const [markedCorrect, setMarkedCorrect] = useState(() => getTeacherMarkedCorrect());
  const [flagReviews, setFlagReviews] = useState(() => getFlagReviews());
  // Auf-/zugeklappte Listen: key → true/false; ohne Eintrag gilt der Standard der Liste.
  const [openLists, setOpenLists] = useState({});
  // Übungshinweise mit Seitenzahlen stammen aus dem Arbeitsheft von Klasse 5 – nur dort zeigen.
  const showBookHints = !courseId || courseId === 'en-5';

  const studentDismissals = useMemo(
    () => dismissals[name] || { questions: {}, wrongAttempts: {} },
    [dismissals, name],
  );
  const studentMarkedCorrect = useMemo(() => markedCorrect[name] || {}, [markedCorrect, name]);

  const analysis = useMemo(
    () => analyzeStudent(sessions, studentDismissals, studentMarkedCorrect, courseId),
    [sessions, studentDismissals, studentMarkedCorrect, courseId],
  );

  // Verlauf: beim Öffnen ans Ende scrollen, damit die neuesten Runden sichtbar sind.
  const trendScrollRef = useRef(null);
  const trendCount = analysis?.scoreTrend?.length || 0;
  useEffect(() => {
    const el = trendScrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [trendCount]);

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
    { key: 'always', label: 'Immer richtig',    hint: '100 % richtig',        test: (r) => r === 1 },
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
  // Ergebnis: { missed, fresh } – gemischt und begrenzt wird erst beim Klick (siehe startNormalReview).
  const NORMAL_REVIEW_MAX = 20;
  const normalReview = useMemo(() => {
    const empty = { missed: [], fresh: [] };
    if (!analysis) return empty;
    const weakTopics = new Set(
      analysis.topicResults
        .filter((t) => t.strength !== 'strong' && t.topic !== 'vocabulary')
        .map((t) => t.topic)
    );
    if (weakTopics.size === 0) return empty;

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
    const fresh = [];
    questions.forEach((q) => {
      if (q.type === 'vocab_card' || q.category === 'vocabulary') return;
      if (!weakTopics.has(q.topic)) return;
      if (playedExams.size > 0 && q.exam && !playedExams.has(q.exam)) return;
      if (!ids.has(q.id)) fresh.push(q.id);
    });
    return { missed: Array.from(ids), fresh };
  }, [analysis, studentDismissals, questionById, playedExams]);

  const normalReviewCount = Math.min(normalReview.missed.length + normalReview.fresh.length, NORMAL_REVIEW_MAX);

  // Echte Fehler zuerst, dann mit frischen Fragen auffüllen; jeweils gemischt.
  const startNormalReview = () => {
    const shuffled = (list) => {
      const a = [...list];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    const ids = [...shuffled(normalReview.missed), ...shuffled(normalReview.fresh)].slice(0, NORMAL_REVIEW_MAX);
    onCreateNormalReviewQuiz(name, ids);
  };

  if (!analysis) {
    return (
      <div className="student-detail">
        {onBack && <button className="btn btn-back" onClick={onBack}>Zurück</button>}
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

  // Alle beantworteten Vokabelkarten (auch die immer richtigen) mit Zählern aus den Runden.
  const vocabAnswered = new Map();
  sessions.forEach((session) => (session.answers || []).forEach((ans) => {
    const def = questionById[ans?.questionId];
    if (def?.category !== 'vocabulary') return;
    const e = vocabAnswered.get(ans.questionId) || { def, correct: 0, total: 0 };
    e.total += 1;
    if (ans.isCorrect) e.correct += 1;
    vocabAnswered.set(ans.questionId, e);
  }));
  const vocabMistakeById = new Map(vocabMistakes.map((m) => [m.q.questionId, m]));

  // Vokabel-Karten in 6 Stufen nach Erfolgsquote (am schwersten zuerst), jede Stufe mit kumulativen
  // IDs (diese Stufe + alle schwierigeren darüber). `onlyAdded` filtert auf einen Vokabel-Batch –
  // „Neue Vokabeln“ ist nur ein Ausschnitt des gesamten Wortschatzes, dieselben Antworten.
  const buildVocabTiers = (onlyAdded) => {
    const buckets = VOCAB_TIER_DEFS.map((d) => ({ ...d, items: [] }));
    vocabAnswered.forEach((entry, id) => {
      if (onlyAdded && entry.def.added !== onlyAdded) return;
      if (studentDismissals.questions?.[id]) return;
      const m = vocabMistakeById.get(id);
      if (m) {
        const total = m.q.totalAttempts || (m.q.wrongCount + m.q.correctCount) || 1;
        const rate = total > 0 ? m.q.correctCount / total : 0;
        let i = VOCAB_TIER_DEFS.findIndex((d) => d.key !== 'always' && d.test(rate));
        if (i === -1) i = buckets.length - 2;
        buckets[i].items.push(m);
      } else {
        buckets[buckets.length - 1].items.push({ id, ...entry });
      }
    });
    let cum = [];
    return buckets.map((b) => {
      cum = cum.concat(b.items.map((it) => it.q?.questionId ?? it.id));
      return { ...b, cumulativeIds: [...cum] };
    });
  };

  const newBatch = latestVocabBatch(courseId);
  const vocabSections = [
    ...(newBatch
      ? [{
          key: 'new',
          title: 'Neue Vokabeln',
          subtitle: `Nur die zuletzt hinzugefügten (${newBatch.count} Wörter vom ${new Date(`${newBatch.added}T12:00:00`).toLocaleDateString('de-DE')}) – dieselben Antworten wie im gesamten Wortschatz.`,
          tiers: buildVocabTiers(newBatch.added),
        }]
      : []),
    { key: 'all', title: 'Gesamter Wortschatz', subtitle: 'Alle Vokabeln dieses Fachs, auch aus „Neue Vokabeln“.', tiers: buildVocabTiers(null) },
  ];

  const isOpen = (key, fallback) => openLists[key] ?? fallback;
  const toggle = (key, fallback) => setOpenLists((o) => ({ ...o, [key]: !(o[key] ?? fallback) }));

  const cardKind = (def) =>
    def?.type === 'listen_card'
      ? 'Hör-Karte'
      : def?.type === 'vocab_card'
        ? 'Vokabelkarte'
        : def?.category === 'vocabulary' && def?.type === 'fill_gap'
          ? 'Lückentext'
          : null;
  const cardPrompt = (def) =>
    def?.type === 'listen_card' ? '🔊 gehört' : def?.type === 'vocab_card' ? def?.word : def?.question;

  // „Na ja, schon fast richtig“: vom Kind gemeldete Antworten dieses Fachs, offen bzw. entschieden.
  const flags = (getAnswerFlags()[name] || []).filter((f) => !courseId || courseOfQuestion(f.questionId) === courseId);
  // Was der heutige Antwort-Check ohnehin als richtig wertet (z. B. „fast, beinahe“), muss niemand mehr prüfen.
  const autoCorrect = (f) => {
    const def = questionById[f.questionId];
    return !!def && checkAnswer(def, f.userAnswer);
  };
  const openFlags = flags.filter((f) => !flagReviews[f.id] && !autoCorrect(f));
  const decidedFlags = flags.filter((f) => flagReviews[f.id] || autoCorrect(f));

  // Urteil speichern; „doch richtig“ zählt den Versuch auch in der Auswertung als richtig.
  const decideFlag = (flag, verdict) => {
    const previous = flagReviews[flag.id]?.verdict;
    reviewFlag(flag.id, verdict);
    if (flag.sessionDate) {
      if (verdict === 'correct') markAttemptsAsCorrect(name, flag.questionId, [flag.sessionDate]);
      else if (previous === 'correct') unmarkAttemptCorrect(name, flag.questionId, flag.sessionDate);
    }
    setFlagReviews(getFlagReviews());
    setMarkedCorrect(getTeacherMarkedCorrect());
  };

  const FLAG_KINDS = {
    listen_card: 'Hör-Karte',
    vocab_card: 'Vokabelkarte',
    fill_gap: 'Lückentext',
    translate: 'Übersetzung',
    word_order: 'Satzbau',
    picture_vocab: 'Bild-Vokabel',
  };
  const flagKind = (flag) => FLAG_KINDS[flag.type] || 'Quiz-Frage';

  const renderFlag = (flag) => {
    const verdict = flagReviews[flag.id]?.verdict ?? (autoCorrect(flag) ? 'auto' : null);
    return (
      <Card key={flag.id} className="w-full max-w-[560px] border-[2.5px] border-[var(--lamp-300)]">
        <CardContent className="p-4 sm:p-6 space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
            <span className="font-semibold">{flagKind(flag)}</span>
            <span className="text-xs text-muted-foreground">{new Date(flag.flaggedAt).toLocaleDateString('de-DE')}</span>
          </div>
          <p className="text-base font-semibold">{flag.heard ? `🔊 gehört: „${flag.heard}“` : flag.prompt}</p>
          <div className="space-y-0.5 text-sm">
            <p>
              <strong>Antwort:</strong> „{flag.userAnswer}“
            </p>
            <p>
              <strong>Erwartet:</strong> „{flag.correctAnswer}“
              {flag.alternativeCorrect?.length > 0 && (
                <span className="text-muted-foreground"> (auch: {flag.alternativeCorrect.join(', ')})</span>
              )}
            </p>
          </div>
          {verdict ? (
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`vx-pill ${verdict === 'wrong' ? 'border-[var(--ochre-600)] text-[var(--ochre-600)]' : 'border-[var(--olive-600)] text-[var(--olive-600)]'}`}
              >
                {verdict === 'auto' ? 'Automatisch richtig (neuer Antwort-Check)' : verdict === 'correct' ? 'Doch richtig' : 'Falsch'}
              </span>
              {verdict !== 'auto' && (
                <button type="button" className="vx-btn vx-btn--link" onClick={() => decideFlag(flag, null)}>
                  Urteil zurücknehmen
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="vx-btn vx-btn--sm border-[var(--olive-600)] bg-[var(--olive-100)] text-[var(--olive-600)] shadow-[3px_3px_0_var(--olive-600)]"
                onClick={() => decideFlag(flag, 'correct')}
              >
                <i className="vx-ico vx-ico--sm vx-ico--check" aria-hidden="true" />
                Doch richtig
              </button>
              <button
                type="button"
                className="vx-btn vx-btn--sm border-[var(--ochre-600)] bg-[var(--ochre-100)] text-[var(--ochre-600)] shadow-[3px_3px_0_var(--ochre-600)]"
                onClick={() => decideFlag(flag, 'wrong')}
              >
                <i className="vx-ico vx-ico--sm vx-ico--cross" aria-hidden="true" />
                Falsch
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderCorrectRow = (it) => (
    <li key={it.id} className="flex flex-wrap items-baseline justify-between gap-2 rounded-md border border-emerald-200 bg-emerald-50/50 px-3 py-2 text-sm dark:border-emerald-900 dark:bg-emerald-950/20">
      <span>
        <span className="font-medium">{cardPrompt(it.def)}</span>
        <span className="text-muted-foreground"> → {it.def.correct}</span>
      </span>
      <span className="text-xs text-muted-foreground">
        {cardKind(it.def)} · {it.correct}× richtig
      </span>
    </li>
  );

  const renderMistakeCard = ({ q, visibleAttempts, def }) => {
    const primaryAttempt = visibleAttempts[visibleAttempts.length - 1];
    return (
      <Card
        key={q.questionId}
        className={`w-full max-w-[500px] ${q.eventuallyCorrect ? 'border-amber-300/80' : 'border-destructive/40'}`}
      >
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="flex items-baseline justify-between text-sm font-semibold">
                <span>{q.topicLabel}</span>
                {cardKind(def) && (
                  <span className="text-xs text-muted-foreground ml-4">{cardKind(def)}</span>
                )}
              </p>
              {def && (
                <div className="text-sm text-foreground/90">
                  {cardKind(def) ? (
                    <p className="text-base font-semibold">{cardPrompt(def)}</p>
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
              {/* Wie bei „Na ja, schon fast richtig“: die Antwort(en) zählen in der Auswertung als richtig. */}
              <button
                type="button"
                className="vx-btn vx-btn--sm mt-1 border-[var(--olive-600)] bg-[var(--olive-100)] text-[var(--olive-600)] shadow-[3px_3px_0_var(--olive-600)]"
                onClick={() => {
                  markAttemptsAsCorrect(name, q.questionId, visibleAttempts.map((a) => a.date));
                  setMarkedCorrect(getTeacherMarkedCorrect());
                }}
              >
                <i className="vx-ico vx-ico--sm vx-ico--check" aria-hidden="true" />
                Doch richtig
              </button>
            </div>
            <div className="flex items-center gap-1">
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

          <div className="flex flex-wrap items-end justify-between gap-2 pt-2 text-xs text-muted-foreground">
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
        {onBack && <button className="btn btn-back" onClick={onBack}>Zurück</button>}
        <h2>{name} — {courseLabel || 'Detailansicht'}</h2>
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
          <div className="trend-head">
            <h3>Verlauf</h3>
            <div className="trend-legend" aria-hidden="true">
              <span><i className="trend-swatch trend-swatch--quiz" />Quiz</span>
              <span><i className="trend-swatch trend-swatch--vocab" />Wortschatz</span>
            </div>
          </div>
          {/* Viele Runden: innerhalb der Karte waagerecht scrollen, beim Öffnen stehen die neuesten rechts im Blick. */}
          <div className="trend-scroll" ref={trendScrollRef}>
            <div className="trend-chart">
              {analysis.scoreTrend.map((entry, i) => {
                const kindLabel = entry.kind === 'vocab' ? 'Wortschatz' : 'Quiz';
                const newDay = i === 0 || entry.day !== analysis.scoreTrend[i - 1].day;
                return (
                  <div
                    key={i}
                    className="trend-bar-container"
                    title={`${kindLabel} · ${entry.date} · ${entry.percentage} % (${entry.correct}/${entry.total})`}
                    aria-label={`${kindLabel} am ${entry.date}: ${entry.percentage} Prozent`}
                  >
                    <div className={`trend-bar trend-bar--${entry.kind}`} style={{ height: `${Math.max(entry.percentage, 14)}%` }}>
                      <span className="trend-value">{entry.percentage}%</span>
                    </div>
                    <span className="trend-date">{newDay ? entry.day : ''}</span>
                  </div>
                );
              })}
            </div>
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
              {showBookHints && topic.strength !== 'strong' && topic.practice && (
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
                  {showBookHints && rec.practice && <p className="rec-practice">{rec.practice}</p>}
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
            <h3>
              <ListToggle open={isOpen('grammar', true)} onToggle={() => toggle('grammar', true)}>
                Falsch beantwortet: Grammatik, Reading &amp; Mediation ({nonVocabMistakes.length})
              </ListToggle>
            </h3>
            {onCreateNormalReviewQuiz && normalReviewCount > 0 && (
              <Button size="sm" onClick={startNormalReview}>
                Schwächen üben ({normalReviewCount})
              </Button>
            )}
          </div>
          <p className="admin-hint">
            Jede Karte = ein konkretes Item. „Später richtig“ bedeutet, dass die Frage nach einem
            ersten Fehler mindestens einmal korrekt beantwortet wurde. „Doch richtig“ zählt die Antwort in der
            Auswertung als richtig.
          </p>
          {isOpen('grammar', true) && <div className="space-y-3">{nonVocabMistakes.map(renderMistakeCard)}</div>}
        </div>
      )}

      {/* Zur Prüfung: vom Kind als „fast richtig“ gemeldete Antworten */}
      {flags.length > 0 && (
        <div className="detail-section">
          <h3>Zur Prüfung: „Na ja, schon fast richtig“ ({openFlags.length})</h3>
          <p className="admin-hint">
            Antworten, die {name} selbst als „fast richtig“ gemeldet hat. „Doch richtig“ zählt in der Auswertung als
            richtig. Die Urteile wertet später der Coding-Agent aus, um den Antwort-Check zu verbessern
            („Antwort-Review exportieren“ auf der Startseite des Lehrer-Bereichs).
          </p>
          {openFlags.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Alles geprüft.</p>
          ) : (
            <div className="space-y-3">{openFlags.map(renderFlag)}</div>
          )}
          {decidedFlags.length > 0 && (
            <div className="mt-4 space-y-3">
              <ListToggle open={isOpen('flags-decided', false)} onToggle={() => toggle('flags-decided', false)}>
                <span className="text-sm font-semibold">Schon entschieden</span>{' '}
                <span className="text-xs text-muted-foreground">({decidedFlags.length})</span>
              </ListToggle>
              {isOpen('flags-decided', false) && <div className="space-y-3">{decidedFlags.map(renderFlag)}</div>}
            </div>
          )}
        </div>
      )}

      {/* Vokabeln: „Neue Vokabeln“ (Ausschnitt) und „Gesamter Wortschatz“, je 6 Stufen nach Erfolgsquote */}
      {vocabAnswered.size > 0 &&
        vocabSections.map((section) => (
          <div key={section.key} className="detail-section">
            <h3>{section.title}</h3>
            <p className="admin-hint">
              {section.subtitle} Stufen nach Erfolgsquote – am schwersten zuerst. Der Button je Stufe erstellt ein
              Wiederholungs-Quiz mit dieser Stufe <strong>und allen schwierigeren darüber</strong>.
            </p>
            <div className="space-y-4">
              {section.tiers.map((tier) => {
                const listKey = `${section.key}-${tier.key}`;
                const fallback = tier.key !== 'always' && tier.items.length > 0;
                return (
                  <div key={tier.key} className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-1">
                      <ListToggle open={isOpen(listKey, fallback)} onToggle={() => toggle(listKey, fallback)}>
                        <span className="text-sm font-semibold">{tier.label}</span>{' '}
                        <span className="text-xs text-muted-foreground">
                          ({tier.hint}) · {tier.items.length} Karte{tier.items.length === 1 ? '' : 'n'}
                        </span>
                      </ListToggle>
                      {onCreateVocabReviewQuiz && tier.items.length > 0 && (
                        <Button size="sm" onClick={() => onCreateVocabReviewQuiz(name, tier.cumulativeIds)}>
                          {tier.key === 'always' ? 'Alle wiederholen' : 'Wiederholen: ab hier'} ({tier.cumulativeIds.length})
                        </Button>
                      )}
                    </div>
                    {isOpen(listKey, fallback) &&
                      (tier.items.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">Keine Karten auf dieser Stufe.</p>
                      ) : tier.key === 'always' ? (
                        <ul className="space-y-1.5">{tier.items.map(renderCorrectRow)}</ul>
                      ) : (
                        <div className="space-y-3">{tier.items.map(renderMistakeCard)}</div>
                      ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
