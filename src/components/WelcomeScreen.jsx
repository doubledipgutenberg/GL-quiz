import { useState } from 'react';
import { EXAMS, COURSES, DEFAULT_COURSE, examsForCourse, defaultExamForCourse } from '../data/questions';
import { getDraftSession, getSavedRounds, getFullExportPayload } from '../utils/storage';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SPACE_TITLE } from './KidLogin';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

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
  const [quizMode, setQuizMode] = useState('normal');
  const [courseId, setCourseId] = useState(DEFAULT_COURSE);
  const [exam, setExam] = useState(() => defaultExamForCourse(DEFAULT_COURSE));
  const [showRoundList, setShowRoundList] = useState(false);

  const course = COURSES.find((c) => c.id === courseId) || COURSES[0];
  const courseExams = examsForCourse(course.id);
  const examInfo = exam ? EXAMS[exam] : null;

  const chooseCourse = (id) => {
    setCourseId(id);
    setExam(defaultExamForCourse(id));
  };

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

  const optionClass =
    'flex items-start gap-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-accent/50 has-[:checked]:border-primary has-[:checked]:bg-accent/50';

  return (
    <div className="max-w-[400px] mx-auto space-y-8">
      <header className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Quiz Challenge</h1>
        <p className="text-sm text-muted-foreground">
          {SPACE_TITLE} · Hallo {playerName}!
        </p>
        {examInfo && (
          <p className="text-sm text-muted-foreground">
            {course.label} — {examInfo.units}
          </p>
        )}
      </header>

      {notice && <p className="text-sm text-center text-destructive">{notice}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Was übst du?</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={course.id} onValueChange={chooseCourse} className="grid gap-3">
            {COURSES.map((c) => {
              const soon = examsForCourse(c.id).length === 0;
              return (
                <label key={c.id} className={optionClass}>
                  <RadioGroupItem value={c.id} className="mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">{c.label}</span>
                    {soon && <span className="text-sm text-muted-foreground">Inhalte kommen bald</span>}
                  </div>
                </label>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {courseExams.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground text-center">
            Für {course.label} gibt es noch keine Fragen. Sobald der Stoff da ist, geht es hier los.
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Welche Schulaufgabe?</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={exam ?? ''} onValueChange={setExam} className="grid gap-3">
                {courseExams.map((ex) => (
                  <label key={ex.id} className={optionClass}>
                    <RadioGroupItem value={ex.id} className="mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold">{ex.label}</span>
                      <span className="text-sm text-muted-foreground">{ex.units}</span>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quiz-Modus</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={quizMode} onValueChange={setQuizMode} className="grid gap-3">
                <label className={optionClass}>
                  <RadioGroupItem value="normal" className="mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">Normales Quiz</span>
                    <span className="text-sm text-muted-foreground">Gemischte Fragen (Grammar, Vokabeln, Reading, Mediation)</span>
                  </div>
                </label>
                <label className={optionClass}>
                  <RadioGroupItem value="vocabulary" className="mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">Wortschatz only</span>
                    <span className="text-sm text-muted-foreground">Nur Vokabeln aus dem Stoff – alle kommen dran</span>
                  </div>
                </label>
              </RadioGroup>
            </CardContent>
          </Card>
          <div className="flex justify-center">
            <Button onClick={() => exam && onStart(playerName, quizMode, exam)} disabled={!exam}>
              Quiz starten
            </Button>
          </div>
        </>
      )}

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
