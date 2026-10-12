import { useMemo, useState } from 'react';
import { nextSticker } from '../data/stickers';
import HighscoreTable from './HighscoreTable';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { passText } from '../utils/vocabPass';

// pass: Stand im Wortschatz-Durchgang (Runden à 50), onNextRound startet die nächste Runde.
export default function ScoreBoard({ playerName, score, maxScore, answers, onRestart, lang, pass, onNextRound }) {
  const percentage = Math.round((score / maxScore) * 100);
  const grade = percentage >= 90 ? 'Fantastisch!'
    : percentage >= 75 ? 'Super!'
    : percentage >= 60 ? 'Gut gemacht!'
    : percentage >= 40 ? 'Nicht schlecht!'
    : 'Weiter üben!';
  // Sticker aus dem Design System statt Film-Figur: ab 50 % ein Richtig-Sticker, sonst ein aufmunternder.
  const [sticker] = useState(() => nextSticker(lang, percentage >= 50));
  const correctCount = answers.filter((a) => a.isCorrect).length;

  const topicMap = useMemo(() => {
    const map = {};
    answers.forEach((a) => {
      if (!map[a.topicLabel]) map[a.topicLabel] = { correct: 0, total: 0 };
      map[a.topicLabel].total++;
      if (a.isCorrect) map[a.topicLabel].correct++;
    });
    return Object.entries(map);
  }, [answers]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Quiz beendet</CardTitle>
          <p className="text-muted-foreground">{playerName}, dein Ergebnis:</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary text-2xl font-bold">
              {percentage}%
            </div>
            <p className="text-sm text-muted-foreground">
              {score} von {maxScore} Punkten ({correctCount}/{answers.length} Fragen richtig)
            </p>
            <p className="font-semibold">{grade}</p>
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-border p-4">

            <img src={sticker.src} alt="" className="h-24 w-auto shrink-0" />

            <div className="text-sm">

              <strong className="block">{sticker.exclaim}</strong>

              „{sticker.line}“

            </div>

          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Deine Ergebnisse nach Thema:</h3>
            <ul className="space-y-2">
              {topicMap.map(([label, stats]) => {
                const pct = Math.round((stats.correct / stats.total) * 100);
                return (
                  <li
                    key={label}
                    className={cn(
                      'flex justify-between rounded-md px-3 py-2 text-sm',
                      pct >= 80 && 'bg-green-500/10 text-green-800 dark:text-green-200',
                      pct >= 50 && pct < 80 && 'bg-muted',
                      pct < 50 && 'bg-destructive/10 text-destructive'
                    )}
                  >
                    <span>{label}</span>
                    <span>{stats.correct}/{stats.total} ({pct}%)</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </CardContent>
      </Card>

      {pass && (
        <div className="vx-card text-center">
          <p className="vx-hand">{pass.complete ? 'Ganzer Wortschatz geschafft!' : 'Pause machen ist okay.'}</p>
          <p className="vx-choice__sub">
            {pass.complete
              ? `Du hast alle ${pass.total} Karten einmal geübt. Die nächste Runde startet einen neuen Durchgang.`
              : passText(pass)}
          </p>
          {!pass.complete && (
            <span className="vx-track block" aria-hidden="true">
              <i style={{ width: `${Math.round((pass.done / pass.total) * 100)}%` }} />
            </span>
          )}
        </div>
      )}

      <HighscoreTable />

      <div className="flex flex-wrap justify-center gap-3">
        {pass && onNextRound && (
          <button type="button" className="vx-btn vx-btn--primary" onClick={onNextRound}>
            {pass.complete ? 'Neuer Durchgang' : 'Nächste Runde'}
          </button>
        )}
        <Button size="lg" variant={pass ? 'outline' : 'default'} onClick={onRestart}>
          {pass ? 'Zur Startseite' : 'Nochmal spielen'}
        </Button>
      </div>
    </div>
  );
}
