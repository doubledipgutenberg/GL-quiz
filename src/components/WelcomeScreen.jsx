import { useState } from 'react';
import { EXAMS, COURSES, DEFAULT_COURSE, examsForCourse, defaultExamForCourse, latestVocabBatch } from '../data/questions';
import { getDraftSession, getSavedRounds, getFullExportPayload } from '../utils/storage';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SPACE_TITLE } from './KidLogin';

function formatSavedAt(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day}.${month}. ${hours}:${mins}`;
}

export default function WelcomeScreen({
  playerName,
  onSwitchProfile,
  notice,
  syncBadge,
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

  const course = COURSES.find((c) => c.id === courseId) || COURSES[0];
  const courseExams = examsForCourse(course.id);
  const examInfo = exam ? EXAMS[exam] : null;

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

  // Wortschatz: Gibt es datierte Vokabel-Lieferungen, kommt noch die Frage „alle oder nur die neuen?“.
  const chooseVocabulary = () => (newBatch ? setStep(4) : start('vocabulary'));

  const showResume = hasDraft || hasSavedRounds;

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
      <div className="max-w-[400px] mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Runde fortsetzen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasAny ? (
              <p className="text-sm text-muted-foreground">Keine gespeicherten Runden.</p>
            ) : (
              <ul className="space-y-3">
                {draft && (
                  <li className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-sm">Aktuelle Runde</span>
                      <span className="text-xs text-muted-foreground">{draft.name} · {formatSavedAt(draft.updatedAt)}</span>
                    </div>
                    <Button size="sm" onClick={() => onRestoreDraft()}>Fortsetzen</Button>
                  </li>
                )}
                {savedRounds.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-sm">{r.roundName}</span>
                      <span className="text-xs text-muted-foreground">{r.playerName} · {formatSavedAt(r.savedAt)}</span>
                    </div>
                    <Button size="sm" onClick={() => onRestoreSavedRound(r)}>Fortsetzen</Button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowRoundList(false)}>
                Zurück
              </Button>
              <Button variant="link" size="sm" className="text-muted-foreground px-0" onClick={handleExport}>
                Daten exportieren (JSON)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stepButtonClass =
    'w-full flex flex-col items-start gap-0.5 rounded-lg border border-border p-4 text-left hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent';
  const titles = ['Was übst du?', 'Welche Schulaufgabe?', 'Wie willst du üben?', 'Welche Vokabeln?'];
  const choice = (key, title, subtitle, onClick, disabled = false) => (
    <button key={key} type="button" className={stepButtonClass} disabled={disabled} onClick={onClick}>
      <span className="font-semibold">{title}</span>
      {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
    </button>
  );

  return (
    <div className="max-w-[400px] mx-auto space-y-8">
      <header className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Quiz Challenge</h1>
        <p className="text-sm text-muted-foreground">
          {SPACE_TITLE} · Hallo {playerName}!
        </p>
      </header>

      {notice && <p className="text-sm text-center text-destructive">{notice}</p>}

      <Card>
        <CardHeader className="space-y-1">
          <p className="text-xs text-muted-foreground">Schritt {step}</p>
          <CardTitle>{titles[step - 1]}</CardTitle>
          {step > 1 && (
            <p className="text-sm text-muted-foreground">
              {course.label}
              {step > 2 && examInfo ? ` · ${examInfo.label}` : ''}
              {step > 3 ? ' · Wortschatz' : ''}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {step === 1 &&
              COURSES.map((c) => {
                const soon = examsForCourse(c.id).length === 0;
                return choice(c.id, c.label, soon ? 'Inhalte kommen bald' : null, () => chooseCourse(c.id), soon);
              })}

            {step === 2 && courseExams.map((ex) => choice(ex.id, ex.label, ex.units, () => chooseExam(ex.id)))}

            {step === 3 && (
              <>
                {choice('normal', 'Normales Quiz', 'Gemischte Fragen aus dem ganzen Stoff', () => start('normal'))}
                {choice(
                  'vocabulary',
                  `Wortschatz${course.audio ? ' 🔊' : ''}`,
                  course.audio ? 'Vokabeln übersetzen, schreiben und nach Gehör schreiben' : 'Nur Vokabeln aus dem Stoff',
                  chooseVocabulary,
                )}
              </>
            )}

            {step === 4 && newBatch && (
              <>
                {choice('all', 'Alle Vokabeln', 'Der ganze Wortschatz der Schulaufgabe', () => start('vocabulary'))}
                {choice(
                  'new',
                  'Nur neue Vokabeln',
                  `Die zuletzt hinzugefügten: ${newBatch.count} Wörter vom ${new Date(`${newBatch.added}T12:00:00`).toLocaleDateString('de-DE')}`,
                  () => start('newvocab'),
                )}
              </>
            )}
          </div>

          {step > 1 && (
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={() => setStep(step - 1)}>
                Zurück
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <footer className="flex flex-col items-center gap-2 pt-4">
        <div className="flex flex-wrap gap-4 justify-center">
          {showResume && (
            <Button variant="link" size="sm" className="text-muted-foreground" onClick={() => setShowRoundList(true)}>
              Letzte Runde weiterspielen
            </Button>
          )}
          <Button variant="link" size="sm" className="text-muted-foreground" onClick={onAdmin}>
            Lehrer-Bereich
          </Button>
          <Button variant="link" size="sm" className="text-muted-foreground" onClick={onSwitchProfile}>
            Profil wechseln
          </Button>
        </div>
        {syncBadge}
      </footer>
    </div>
  );
}
