import { useState } from 'react';
import ListeningPlayer from './ListeningPlayer';
import { listeningAudio } from '@/data/en6/listening';

// Hörverstehen (2026-10-25, Wunsch des Nutzers): Erst wird der Text vorgelesen, danach kommen die Fragen.
// „Zu den Fragen“ geht erst, wenn der Text einmal ganz gehört wurde (wie in der Schulaufgabe). Bei den Fragen
// kann man ihn noch einmal anhören.
export default function ListeningIntro({ task, onStart, onBack }) {
  const [heard, setHeard] = useState(false);
  return (
    <div className="mx-auto max-w-[560px] space-y-6">
      <div className="space-y-2">
        <span className="vx-kicker">Hörverstehen</span>
        <h2 className="vx-question">{task.title}</h2>
        <p className="text-base">{task.situation}</p>
      </div>
      <div className="space-y-3 rounded-[var(--radius-md)] border-[2.5px] border-[var(--pen)] bg-[var(--cream-50)] p-5 shadow-[3px_3px_0_var(--pen-shadow)]">
        <ListeningPlayer audio={listeningAudio(task)} onEnded={() => setHeard(true)} />
        <p className="text-sm text-muted-foreground">
          Hör dir den Text in Ruhe an. Danach kommen {task.questions.length} Fragen – dort kannst du ihn noch einmal
          anhören.
        </p>
      </div>
      <button type="button" className="vx-btn vx-btn--primary vx-btn--block" disabled={!heard} onClick={onStart}>
        {heard ? 'Zu den Fragen' : 'Erst den Text anhören'}
      </button>
      <button type="button" className="vx-btn vx-btn--link" onClick={onBack}>
        Zurück
      </button>
    </div>
  );
}
