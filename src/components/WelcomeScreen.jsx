import { useEffect, useState } from 'react';
import { EXAMS, COURSES, DEFAULT_COURSE, examsForCourse, defaultExamForCourse, latestVocabBatch } from '../data/questions';
import { getDraftSession, getSavedRounds, getFullExportPayload, getStudentHistory } from '../utils/storage';
import StreakCalendar from './StreakCalendar';
import ReviewPlan from './ReviewPlan';
import { SPACE_TITLE } from './KidLogin';
import { vocabPassStatus, passText, ROUND_SIZE } from '../utils/vocabPass';
import parisScene from '../../design-system/assets/Illustrations/paris-scene.svg';
import londonScene from '../../design-system/assets/Illustrations/london-scene.svg';

// Design System „Clara & Jakob lernen Sprachen“: Klassen .vx-* aus design-system/components/bundle.css
// (Masthead, CourseCard, Choice, StreetSign, Button). Farben nur über den Stift (data-course).

function formatSavedAt(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day}.${month}. ${hours}:${mins}`;
}

// Jede Sprache lebt in ihrer Stadt: Französisch → Paris, Englisch → London.
const CITY = {
  fr: { subject: 'Französisch', kicker: 'Vivre à', city: 'Paris', scene: parisScene, sign: 'vx-sign--paris' },
  en: { subject: 'Englisch', kicker: 'Living in', city: 'London', scene: londonScene, sign: 'vx-sign--london' },
};

// Sprachen in der Reihenfolge von COURSES – eine Karte pro Sprache.
const LANGS = [...new Set(COURSES.map((c) => c.lang))];

// Straßenschild: Name = Titel der Unit (nach „ – “) bzw. die Units, kleine Zeile = Schulaufgabe.
function signText(ex) {
  const [head, title] = ex.label.split(' – ');
  return title ? { name: title, top: head } : { name: ex.units, top: ex.label };
}

function Icon({ name, small = false }) {
  return <i className={`vx-ico vx-ico--${name}${small ? ' vx-ico--sm' : ''}`} aria-hidden="true" />;
}

function Choice({ icon, title, sub, progress, onClick, disabled = false }) {
  return (
    <button type="button" className="vx-choice" onClick={onClick} disabled={disabled}>
      <span className="vx-choice__ico">
        <Icon name={icon} />
      </span>
      <span className="vx-choice__txt">
        <span className="vx-choice__title">{title}</span>
        {sub && <span className="vx-choice__sub">{sub}</span>}
        {progress != null && (
          <span className="vx-track mt-1 block" aria-hidden="true">
            <i style={{ width: `${Math.round(progress * 100)}%` }} />
          </span>
        )}
      </span>
      {!disabled && <Icon name="arrow-right" />}
    </button>
  );
}

function StepHead({ step, title }) {
  return (
    <div>
      <span className="vx-label">Schritt {step}</span>
      <p className="vx-question">{title}</p>
    </div>
  );
}

export default function WelcomeScreen({
  playerName,
  onSwitchProfile,
  onCourseChange,
  onStart,
  onAdmin,
  onRestoreDraft,
  onRestoreSavedRound,
  hasDraft,
  hasSavedRounds,
}) {
  const [courseId, setCourseId] = useState(DEFAULT_COURSE);
  const [exam, setExam] = useState(() => defaultExamForCourse(DEFAULT_COURSE));
  const [showRoundList, setShowRoundList] = useState(false);
  const [step, setStep] = useState(1);
  // ReviewPlan: Übersicht vor einer Runde „Alle Vokabeln“ – ein eigener Schritt, „Zurück“ = ein Schritt zurück.
  const [showPlan, setShowPlan] = useState(false);

  const course = COURSES.find((c) => c.id === courseId) || COURSES[0];
  const courseExams = examsForCourse(course.id);
  const examInfo = exam ? EXAMS[exam] : null;
  const city = CITY[course.lang] || CITY.en;

  // Vor der Kurswahl zeichnet alles im Navy-Stift, danach im Stift des Kurses (data-course in App.jsx).
  useEffect(() => {
    onCourseChange?.(step >= 2 ? course.id : null);
  }, [step, course.id, onCourseChange]);

  // „Neue Vokabeln“ ist nur ein Filter auf den Wortschatz (jüngster Batch nach Datum).
  const newBatch = latestVocabBatch(course.id);

  // Schritt für Schritt, immer nur eine Frage sichtbar: Fach → Schulaufgabe → Modus
  // → (nur Wortschatz) alle oder neue Vokabeln. Die letzte Wahl startet das Quiz.
  const chooseCourse = (id) => {
    setCourseId(id);
    setExam(defaultExamForCourse(id));
    setStep(2);
  };

  const chooseExam = (id) => {
    setExam(id);
    setStep(3);
  };

  const start = (mode) => exam && onStart(playerName, mode, exam);

  // Stand im Wortschatz-Durchgang (Runden à 50 Karten) der gewählten Schulaufgabe.
  const pass = step >= 3 && exam ? vocabPassStatus(playerName, exam) : null;
  const passProgress = pass && !pass.complete && pass.total ? pass.done / pass.total : null;

  // Wortschatz: Gibt es datierte Vokabel-Lieferungen, kommt noch die Frage „alle oder nur die neuen?“.
  const chooseVocabulary = () => (newBatch ? setStep(4) : setShowPlan(true));

  const showResume = hasDraft || hasSavedRounds;

  const masthead = (
    <header className="vx-mast">
      <div className="vx-awning vx-awning--house" />
      <div className="vx-mast__name">
        <span className="vx-kicker">Clara &amp; Jakob lernen</span>
        <h1 className="vx-display">Sprachen</h1>
      </div>
      <span className="vx-label">
        {SPACE_TITLE} · Hallo {playerName}!
      </span>
    </header>
  );

  if (showRoundList) {
    const draft = getDraftSession();
    const savedRounds = getSavedRounds();
    const hasAny = !!draft || savedRounds.length > 0;

    const handleExport = () => {
      try {
        const payload = getFullExportPayload();
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const ts = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `english-topic-quiz-data-${ts}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    };
    return (
      <div className="max-w-[420px] mx-auto space-y-8">
        {masthead}
        <div className="vx-stack">
          <p className="vx-question">Runde fortsetzen</p>
          {!hasAny ? (
            <p className="vx-choice__sub">Keine gespeicherten Runden.</p>
          ) : (
            <>
              {draft && (
                <Choice
                  icon="repeat"
                  title="Aktuelle Runde"
                  sub={`${draft.name} · ${formatSavedAt(draft.updatedAt)}`}
                  onClick={() => onRestoreDraft()}
                />
              )}
              {savedRounds.map((r) => (
                <Choice
                  key={r.id}
                  icon="repeat"
                  title={r.roundName}
                  sub={`${r.playerName} · ${formatSavedAt(r.savedAt)}`}
                  onClick={() => onRestoreSavedRound(r)}
                />
              ))}
            </>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <button type="button" className="vx-btn vx-btn--sm" onClick={() => setShowRoundList(false)}>
              Zurück
            </button>
            <button type="button" className="vx-btn vx-btn--link" onClick={handleExport}>
              Daten exportieren (JSON)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const titles = ['Was übst du?', 'Welche Schulaufgabe?', 'Wie willst du üben?', 'Welche Vokabeln?'];
  const sign = examInfo ? signText(examInfo) : null;

  // Handy: eine Spalte (420px). Desktop (ab md): breiter, Karten und Auswahl nebeneinander.
  return (
    <div className="max-w-[420px] md:max-w-4xl mx-auto space-y-8">
      {masthead}

      {/* Übungs-Serie des Kindes – nur auf der ersten Seite */}
      {step === 1 && <StreakCalendar sessions={getStudentHistory()[playerName]?.sessions || []} />}

      {showPlan && pass ? (
        <div className="mx-auto max-w-[420px]">
          <ReviewPlan status={pass} onStart={() => start('vocabulary')} onBack={() => setShowPlan(false)} />
        </div>
      ) : (
        <div className="vx-stack">
          <StepHead step={step} title={titles[step - 1]} />

          {/* Schritt 1: eine Karte pro Stadt – Paris (Französisch), London (Englisch) – mit je einem
              Button pro Klasse (z. B. London: Klasse 6 und Klasse 5). */}
          {step === 1 && (
            <div className="grid gap-6 md:grid-cols-2">
              {LANGS.map((lang) => {
                const k = CITY[lang] || CITY.en;
                const grades = COURSES.filter((c) => c.lang === lang);
                return (
                  <div
                    key={lang}
                    className="vx-course w-full cursor-default active:transform-none active:shadow-[3px_3px_0_var(--pen-shadow)]"
                    data-course={lang}
                  >
                    <div className="vx-awning" />
                    <div className="vx-course__plate">
                      <img src={k.scene} alt="" />
                    </div>
                    <div className="vx-course__body">
                      <div>
                        <span className="vx-kicker">{k.kicker}</span>
                        <h3 className="vx-display">{k.city}</h3>
                      </div>
                      <div className="vx-row" style={{ gap: 8 }}>
                        <span className="vx-pill vx-pill--solid">{k.subject}</span>
                        {grades.some((c) => c.audio) && <span className="vx-choice__sub">Wortschatz mit Aussprache</span>}
                      </div>
                      <div className="vx-row" style={{ gap: 10 }}>
                        {grades.map((c) => {
                          const soon = examsForCourse(c.id).length === 0;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              className="vx-btn vx-btn--sm"
                              disabled={soon}
                              onClick={() => chooseCourse(c.id)}
                            >
                              Klasse {c.grade}
                              {soon ? ' · bald' : <Icon name="arrow-right" small />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Schritt 2: Schulaufgabe */}
          {step === 2 && (
            <>
              <div className="vx-row" style={{ gap: 8 }}>
                <span className="vx-pill vx-pill--solid">{city.subject}</span>
                <span className="vx-pill">Klasse {course.grade}</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {courseExams.map((ex) => (
                  <Choice key={ex.id} icon="signpost" title={ex.label} sub={ex.units} onClick={() => chooseExam(ex.id)} />
                ))}
              </div>
            </>
          )}

          {/* Ab Schritt 3: die gewählte Schulaufgabe als Straßenschild der Stadt */}
          {step >= 3 && sign && (
            <div className="flex justify-center py-2">
              <div className={`vx-sign ${city.sign}`}>
                <span className="vx-sign__name">{sign.name}</span>
                <span className="vx-sign__top">
                  {sign.top} · {city.subject} {course.grade}
                </span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-3 md:grid-cols-2">
              <Choice icon="grammar" title="Normales Quiz" sub="Gemischte Fragen aus dem ganzen Stoff" onClick={() => start('normal')} />
              <Choice
                icon="book"
                title="Wortschatz"
                sub={
                  newBatch
                    ? course.audio
                      ? 'Vokabeln übersetzen, schreiben, Lückentext und nach Gehör'
                      : 'Nur Vokabeln aus dem Stoff'
                    : passText(pass)
                }
                progress={newBatch ? null : passProgress}
                onClick={chooseVocabulary}
              />
            </div>
          )}

          {step === 4 && newBatch && (
            <div className="grid gap-3 md:grid-cols-2">
              <Choice
                icon="book"
                title={`Alle Vokabeln – in Runden à ${ROUND_SIZE}`}
                sub={passText(pass) || 'Der ganze Wortschatz der Schulaufgabe'}
                progress={passProgress}
                onClick={() => setShowPlan(true)}
              />
              <Choice
                icon="repeat"
                title="Nur neue Vokabeln"
                sub={`Die zuletzt hinzugefügten: ${newBatch.count} Wörter vom ${new Date(`${newBatch.added}T12:00:00`).toLocaleDateString('de-DE')}`}
                onClick={() => start('newvocab')}
              />
            </div>
          )}

          {step > 1 && (
            <div className="pt-2">
              <button type="button" className="vx-btn vx-btn--sm" onClick={() => setStep(step - 1)}>
                Zurück
              </button>
            </div>
          )}
        </div>
      )}

      <footer className="flex flex-col items-center gap-2 pt-4">
        <div className="flex flex-wrap gap-4 justify-center">
          {showResume && (
            <button type="button" className="vx-btn vx-btn--link" onClick={() => setShowRoundList(true)}>
              Letzte Runde weiterspielen
            </button>
          )}
          <button type="button" className="vx-btn vx-btn--link" onClick={onAdmin}>
            Lehrer-Bereich
          </button>
          <button type="button" className="vx-btn vx-btn--link" onClick={onSwitchProfile}>
            Profil wechseln
          </button>
        </div>
      </footer>
    </div>
  );
}
