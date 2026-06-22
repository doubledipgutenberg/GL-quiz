import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

export default function QuizQuestion({ question, onSubmit }) {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer.trim());
      setAnswer('');
      setShowHint(false);
    }
  };

  const handleOptionClick = (option) => {
    onSubmit(option);
    setAnswer('');
    setShowHint(false);
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {question.type !== 'vocab_card' && (
          <div className="flex items-center justify-between gap-2">
            <span className={cn(
              'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border',
              question.category === 'grammar' && 'bg-muted text-muted-foreground border-border',
              question.category === 'vocabulary' && 'bg-muted text-muted-foreground border-border',
              question.category === 'reading' && 'bg-muted text-muted-foreground border-border',
              question.category === 'mediation' && 'bg-muted text-muted-foreground border-border'
            )}>
              {question.topicLabel}
            </span>
            <span className="flex gap-0.5" aria-label={`Schwierigkeit: ${question.difficulty} von 3`}>
              {[1, 2, 3].map((d) => (
                <span key={d} className={cn('h-1.5 w-1.5 rounded-full', d <= question.difficulty ? 'bg-foreground' : 'bg-muted')} />
              ))}
            </span>
          </div>
        )}

        {question.text && (
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm">{question.text}</p>
          </div>
        )}

        {question.type === 'picture_vocab' && question.imageUrl && (
          <div className="flex justify-center">
            <img src={question.imageUrl} alt="" className="max-h-48 rounded-lg object-contain" />
          </div>
        )}

        {question.type === 'vocab_card' && (
          <div className="rounded-xl border border-border bg-muted/30 p-8 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {question.instruction}
              {(() => {
                const raw = String(question.correct || '');
                const tokens = raw
                  .split(/[,/]/)
                  .map((s) => s.trim())
                  .filter(Boolean);
                // Zähle nur „echte“ Begriffe, nicht Flexionsendungen wie -r/-s/-in
                const terms = tokens.filter((tok, idx) => {
                  if (idx === 0) return true;
                  const simple = tok.replace(/\s+/g, '');
                  return !/^-\w{1,3}$/.test(simple);
                });
                return terms.length > 1
                  ? ` · Hinweis: Es gibt ${terms.length} Begriffe.`
                  : '';
              })()}
            </p>
            <p className="text-3xl font-bold tracking-tight">{question.word}</p>
          </div>
        )}

        {question.type !== 'vocab_card' && (
          <h2 className="text-lg font-semibold leading-tight">{question.question}</h2>
        )}

        {question.type === 'word_order' && (
          <div className="flex flex-wrap gap-2">
            {question.words.map((word, i) => (
              <span key={i} className="inline-flex items-center rounded-md border border-border bg-muted px-3 py-1.5 text-sm">
                {word}
              </span>
            ))}
          </div>
        )}

        {question.type === 'multiple_choice' && question.options && (
          <div className="grid gap-2">
            {question.options.map((option, i) => (
              <Button
                key={i}
                variant="outline"
                className="h-auto justify-start py-3 text-left font-normal"
                onClick={() => handleOptionClick(option)}
              >
                {String.fromCharCode(65 + i)}) {option}
              </Button>
            ))}
          </div>
        )}

        {question.type === 'reading_true_false' && (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="py-6" onClick={() => handleOptionClick('true')}>
              True
            </Button>
            <Button variant="outline" className="py-6" onClick={() => handleOptionClick('false')}>
              False
            </Button>
          </div>
        )}

        {!['multiple_choice', 'reading_true_false'].includes(question.type) && (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Deine Antwort..."
              autoFocus
              autoComplete="off"
              className="flex-1"
            />
            <Button type="submit" disabled={!answer.trim()}>
              Antworten
            </Button>
          </form>
        )}

        {question.type !== 'vocab_card' && (
          <div className="pt-2">
            {!showHint ? (
              <Button variant="ghost" size="sm" onClick={() => setShowHint(true)}>
                Tipp anzeigen
              </Button>
            ) : (
              <div className="rounded-lg border border-border bg-muted/50 p-3 text-sm">
                <strong>Tipp:</strong> {question.hint}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
