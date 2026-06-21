import { Progress } from './ui/progress';

export default function ProgressBar({ current, total, score, progress }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground font-medium">
        <span>Frage {current} von {total}</span>
        <span>{score} Punkte</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
