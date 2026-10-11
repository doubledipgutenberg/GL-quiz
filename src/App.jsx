import { useEffect, useState } from 'react';
import useQuiz from './hooks/useQuiz';
import { getDraftSession, getSavedRounds } from './utils/storage';
import { getKidSession, setKidSession } from './lib/api';
import { pull, flush, onSyncStatus } from './utils/sync';
import KidLogin from './components/KidLogin';
import WelcomeScreen from './components/WelcomeScreen';
import QuizQuestion from './components/QuizQuestion';
import FeedbackCard from './components/FeedbackCard';
import ScoreBoard from './components/ScoreBoard';
import ProgressBar from './components/ProgressBar';
import AdminDashboard from './components/AdminDashboard';
import { COURSES, EXAMS } from './data/questions';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './components/ui/dialog';
import './App.css';

const SYNC_LABELS = {
  idle: 'Gespeichert',
  pending: 'Wird gespeichert …',
  saving: 'Wird gespeichert …',
  error: 'Nicht gespeichert – keine Verbindung',
};

// Stift des Design Systems: data-course="fr" | "en" (aus course.lang); ohne Kurs Navy (house-pen).
const langOfCourse = (courseId) => COURSES.find((c) => c.id === courseId)?.lang ?? null;
const langOfQuestion = (q) => (q ? langOfCourse(q.course || EXAMS[q.exam]?.course) : null);

function SyncBadge() {
  const [status, setStatus] = useState('idle');
  useEffect(() => onSyncStatus(setStatus), []);
  return (
    <span className={`text-xs ${status === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>
      {SYNC_LABELS[status]}
    </span>
  );
}

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSaveRound, setShowSaveRound] = useState(false);
  const [saveRoundName, setSaveRoundName] = useState('');
  const [kid, setKid] = useState(() => getKidSession());
  const [loading, setLoading] = useState(() => !!getKidSession());
  const [loadError, setLoadError] = useState('');
  const [welcomeCourseId, setWelcomeCourseId] = useState(null);
  const quiz = useQuiz();

  // data-course am <body>: so zeichnen auch Dialoge (Portale hängen im body) im Stift des Kurses.
  // Nicht am <html>: dort ist es :root, und tokens.css setzt --pen auf :root ohne Layer – das gewinnt.
  const courseLang =
    !kid || showAdmin
      ? null
      : quiz.phase === 'welcome'
        ? langOfCourse(welcomeCourseId)
        : langOfQuestion(quiz.questions[0]);
  useEffect(() => {
    const root = document.body;
    if (courseLang) root.dataset.course = courseLang;
    else delete root.dataset.course;
  }, [courseLang]);

  // Beim Start den aktuellen Stand vom Server holen (andere Geräte, Geschwister).
  useEffect(() => {
    if (!kid) return;
    let cancelled = false;
    pull(kid.name)
      .then(() => !cancelled && setLoadError(''))
      .catch(() => !cancelled && setLoadError('Keine Verbindung – du übst mit dem Stand auf diesem Gerät.'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kid?.name]);

  const handleLogin = async (session) => {
    setKidSession(session);
    setLoading(true);
    setKid(session);
  };

  const handleSwitchProfile = async () => {
    await flush();
    setKidSession(null);
    quiz.restart();
    setKid(null);
  };

  const handleCreateVocabReviewQuiz = (studentName, questionIds) => {
    setShowAdmin(false);
    quiz.startVocabReview(studentName, questionIds);
  };

  const handleCreateNormalReviewQuiz = (studentName, questionIds) => {
    setShowAdmin(false);
    quiz.startNormalReview(studentName, questionIds);
  };

  const handleSaveRoundSubmit = (e) => {
    e.preventDefault();
    const name = saveRoundName.trim();
    if (name) {
      quiz.saveCurrentRound(name);
      setSaveRoundName('');
      setShowSaveRound(false);
    }
  };

  if (!kid) {
    return (
      <div className="min-h-screen max-w-3xl mx-auto px-4 py-8 sm:px-6">
        <KidLogin onLogin={handleLogin} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen max-w-3xl mx-auto px-4 py-8 sm:px-6 text-center text-sm text-muted-foreground">
        Lade deine Daten …
      </div>
    );
  }

  if (showAdmin) {
    return (
      <div className="min-h-screen max-w-5xl mx-auto px-4 py-8 sm:px-6">
        <AdminDashboard
          onBack={() => setShowAdmin(false)}
          onCreateVocabReviewQuiz={handleCreateVocabReviewQuiz}
          onCreateNormalReviewQuiz={handleCreateNormalReviewQuiz}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-8 sm:px-6">
      {quiz.phase === 'welcome' && (
        <WelcomeScreen
          playerName={kid.name}
          onSwitchProfile={handleSwitchProfile}
          onCourseChange={setWelcomeCourseId}
          notice={loadError}
          syncBadge={<SyncBadge />}
          onStart={quiz.startQuiz}
          onAdmin={() => setShowAdmin(true)}
          onRestoreDraft={quiz.restoreDraft}
          onRestoreSavedRound={quiz.restoreSavedRound}
          hasDraft={!!getDraftSession()}
          hasSavedRounds={getSavedRounds().length > 0}
        />
      )}

      {(quiz.phase === 'quiz' || quiz.phase === 'feedback') && (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-sm text-muted-foreground font-medium">
            <SyncBadge />
            <span>{quiz.playerName}</span>
          </div>
          <ProgressBar
            current={quiz.currentIndex + 1}
            total={quiz.questions.length}
            score={quiz.score}
            progress={quiz.progress}
          />

          {quiz.phase === 'quiz' && quiz.currentQuestion && (
            <QuizQuestion
              question={quiz.currentQuestion}
              onSubmit={quiz.submitAnswer}
            />
          )}

          {quiz.phase === 'feedback' && quiz.lastAnswer && (
            <FeedbackCard
              lastAnswer={quiz.lastAnswer}
              onNext={quiz.nextQuestion}
            />
          )}
        </div>
      )}

      {quiz.phase === 'finished' && (
        <ScoreBoard
          lang={courseLang}
          playerName={quiz.playerName}
          score={quiz.score}
          maxScore={quiz.maxScore}
          answers={quiz.answers}
          onRestart={quiz.restart}
        />
      )}

      {(quiz.phase === 'quiz' || quiz.phase === 'feedback' || quiz.phase === 'finished') && (
        <footer className="mt-8 pt-6 border-t border-border flex flex-wrap gap-3 justify-center">
          {(quiz.phase === 'quiz' || quiz.phase === 'feedback') && (
            <Button variant="ghost" size="sm" onClick={() => setShowSaveRound(true)}>
              Runde speichern
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={quiz.restart}>
            Test neu starten
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowAdmin(true)}>
            Lehrer-Bereich
          </Button>
        </footer>
      )}

      <Dialog open={showSaveRound} onOpenChange={setShowSaveRound}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Runde speichern</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveRoundSubmit} className="space-y-4">
            <Input
              value={saveRoundName}
              onChange={(e) => setSaveRoundName(e.target.value)}
              placeholder="Name für diese Runde"
              maxLength={40}
              className="w-full"
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowSaveRound(false)}>
                Abbrechen
              </Button>
              <Button type="submit" disabled={!saveRoundName.trim()}>
                Speichern
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
