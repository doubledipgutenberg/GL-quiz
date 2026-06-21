import { useState } from 'react';
import useQuiz from './hooks/useQuiz';
import { getDraftSession, getSavedRounds } from './utils/storage';
import WelcomeScreen from './components/WelcomeScreen';
import QuizQuestion from './components/QuizQuestion';
import FeedbackCard from './components/FeedbackCard';
import ScoreBoard from './components/ScoreBoard';
import ProgressBar from './components/ProgressBar';
import AdminDashboard from './components/AdminDashboard';
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

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSaveRound, setShowSaveRound] = useState(false);
  const [saveRoundName, setSaveRoundName] = useState('');
  const quiz = useQuiz();

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

  if (showAdmin) {
    return (
      <AdminDashboard
        onBack={() => setShowAdmin(false)}
        onCreateVocabReviewQuiz={handleCreateVocabReviewQuiz}
        onCreateNormalReviewQuiz={handleCreateNormalReviewQuiz}
      />
    );
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-8 sm:px-6">
      {quiz.phase === 'welcome' && (
        <WelcomeScreen
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
          <div className="flex justify-end text-sm text-muted-foreground font-medium">
            {quiz.playerName}
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
