import { useEffect, useState } from 'react';
import useQuiz from './hooks/useQuiz';
import { getDraftSession, getSavedRounds, flagAlmostRight } from './utils/storage';
import { getKidSession, setKidSession } from './lib/api';
import { pull, flush } from './utils/sync';
import SyncStatus from './components/SyncStatus';
import KidLogin from './components/KidLogin';
import WelcomeScreen from './components/WelcomeScreen';
import QuizQuestion from './components/QuizQuestion';
import FeedbackCard from './components/FeedbackCard';
import ScoreBoard from './components/ScoreBoard';
import ProgressBar from './components/ProgressBar';
import AdminDashboard from './components/AdminDashboard';
import { COURSES, EXAMS } from './data/questions';
import { vocabPassStatus, roundNote } from './utils/vocabPass';
import RoundBreak from './components/RoundBreak';
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

// Stift des Design Systems: data-course="fr" | "en" (aus course.lang); ohne Kurs Navy (house-pen).
const langOfCourse = (courseId) => COURSES.find((c) => c.id === courseId)?.lang ?? null;
const langOfQuestion = (q) => (q ? langOfCourse(q.course || EXAMS[q.exam]?.course) : null);

// Fortschritt in einer Wortschatz-Runde (design-system/components/RoundProgress) statt der normalen Leiste.
function RoundProgress({ quiz }) {
  const live = vocabPassStatus(quiz.playerName, quiz.passExam);
  const info = quiz.passInfo || {
    round: live.round,
    roundsTotal: live.roundsTotal,
    size: live.size,
    startCur: Math.max(0, live.cur - quiz.answers.length),
  };
  const answered = quiz.currentIndex + (quiz.phase === 'feedback' ? 1 : 0);
  const card = Math.min(info.size, info.startCur + quiz.currentIndex + 1);
  const fill = info.size ? Math.min(1, (info.startCur + answered) / info.size) : 0;
  return (
    <div className="vx-rprogress">
      <div className="vx-lights__meta">
        <span>
          Runde {info.round} von {info.roundsTotal} · Karte {card} von {info.size}
        </span>
        <b>
          {quiz.score} {quiz.score === 1 ? 'Punkt' : 'Punkte'}
        </b>
      </div>
      <div className="vx-track">
        <i style={{ width: `${Math.round(fill * 100)}%` }} />
      </div>
      <p className="vx-rprogress__note">{roundNote(info.roundsTotal - info.round)}</p>
    </div>
  );
}

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSaveRound, setShowSaveRound] = useState(false);
  const [saveRoundName, setSaveRoundName] = useState('');
  const [kid, setKid] = useState(() => getKidSession());
  const [loading, setLoading] = useState(() => !!getKidSession());
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
    // Ohne Netz zeigt die Statusanzeige links oben „Offline“; geübt wird mit dem Stand auf dem Gerät.
    pull(kid.name)
      .catch(() => {})
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
        <div className="mb-4">
          <SyncStatus />
        </div>
        <AdminDashboard
          onBack={() => setShowAdmin(false)}
          onCreateVocabReviewQuiz={handleCreateVocabReviewQuiz}
          onCreateNormalReviewQuiz={handleCreateNormalReviewQuiz}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${quiz.phase === 'welcome' ? 'max-w-5xl' : 'max-w-3xl'} mx-auto px-4 py-8 sm:px-6`}>
      {/* Speicherstatus links oben; in der Runde steht er in der Kopfzeile neben dem Namen. */}
      {(quiz.phase === 'welcome' || quiz.phase === 'finished') && (
        <div className="mb-4">
          <SyncStatus />
        </div>
      )}
      {quiz.phase === 'welcome' && (
        <WelcomeScreen
          playerName={kid.name}
          onSwitchProfile={handleSwitchProfile}
          onCourseChange={setWelcomeCourseId}
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
            <SyncStatus />
            <span>{quiz.playerName}</span>
          </div>
          {quiz.passExam ? (
            <RoundProgress quiz={quiz} />
          ) : (
            <ProgressBar
              current={quiz.currentIndex + 1}
              total={quiz.questions.length}
              score={quiz.score}
              progress={quiz.progress}
            />
          )}

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
              onFlagAlmostRight={(question, userAnswer) =>
                flagAlmostRight(quiz.playerName, { question, userAnswer, sessionId: quiz.sessionId })
              }
            />
          )}
        </div>
      )}

      {quiz.phase === 'finished' &&
        (quiz.passExam && !vocabPassStatus(quiz.playerName, quiz.passExam).complete ? (
          <RoundBreak
            lang={courseLang}
            answers={quiz.answers}
            status={vocabPassStatus(quiz.playerName, quiz.passExam)}
            onNext={() => quiz.startQuiz(quiz.playerName, 'vocabulary', quiz.passExam)}
            onPause={quiz.restart}
          />
        ) : (
          <ScoreBoard
            lang={courseLang}
            playerName={quiz.playerName}
            score={quiz.score}
            maxScore={quiz.maxScore}
            answers={quiz.answers}
            onRestart={quiz.restart}
            pass={quiz.passExam ? vocabPassStatus(quiz.playerName, quiz.passExam) : null}
            onNextRound={() => quiz.startQuiz(quiz.playerName, 'vocabulary', quiz.passExam)}
          />
        ))}


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
