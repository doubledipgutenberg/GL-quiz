import { useMemo } from 'react';
import { getRandomCharacter } from '../data/pixarCharacters';
import HighscoreTable from './HighscoreTable';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export default function ScoreBoard({ playerName, score, maxScore, answers, onRestart }) {
  const percentage = Math.round((score / maxScore) * 100);
  const grade = percentage >= 90 ? 'Fantastisch!'
    : percentage >= 75 ? 'Super!'
    : percentage >= 60 ? 'Gut gemacht!'
    : percentage >= 40 ? 'Nicht schlecht!'
    : 'Weiter üben!';
  const character = useMemo(() => getRandomCharacter(percentage >= 50), [percentage]);
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
            <img src={character.imageUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
            <div className="text-sm">
              <strong>{character.name}:</strong> &ldquo;{character.quote}&rdquo;
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

      <HighscoreTable />

      <div className="flex justify-center">
        <Button size="lg" onClick={onRestart}>
          Nochmal spielen
        </Button>
      </div>
    </div>
  );
}
