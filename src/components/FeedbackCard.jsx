import { useMemo } from 'react';
import { getRandomCharacter } from '../data/pixarCharacters';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export default function FeedbackCard({ lastAnswer, onNext }) {
  const { isCorrect, points, question, userAnswer } = lastAnswer;
  const character = useMemo(() => getRandomCharacter(isCorrect), [isCorrect]);

  return (
    <Card className={cn(isCorrect ? 'border-green-600/50' : 'border-destructive/50')}>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-1">
          {isCorrect ? (
            <p className="text-lg font-semibold text-green-700 dark:text-green-400">
              Richtig! +{points} Punkt{points !== 1 ? 'e' : ''}!
            </p>
          ) : (
            <p className="text-lg font-semibold text-destructive">Nicht ganz...</p>
          )}
        </div>

        <div className="space-y-3 pt-2">
          {!isCorrect && (
            <div className="text-sm space-y-1">
              <p><strong>Deine Antwort:</strong> {userAnswer}</p>
              <p><strong>Richtige Antwort:</strong> {question.correct}</p>
            </div>
          )}
          <p className="text-sm text-muted-foreground">{question.explanation}</p>
        </div>

        <blockquote className="border-l-4 border-primary pl-4 text-sm text-muted-foreground italic">
          &ldquo;{character.quote}&rdquo;
        </blockquote>

        <Button className="w-full mt-8" onClick={onNext} autoFocus>
          Weiter
        </Button>
      </CardContent>
    </Card>
  );
}
