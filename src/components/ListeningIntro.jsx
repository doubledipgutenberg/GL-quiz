import { useState } from 'react';
import ListeningPlayer from './ListeningPlayer';
import { listeningAudio } from '@/data/en6/listening';

// Hörverstehen (2026-10-25, Wunsch des Nutzers): Erst wird der Text vorgelesen, danach kommen die Fragen.
// Die Fragen stehen schon VOR dem ersten Hören da (wie in der Schulaufgabe: erst lesen, dann hören).
// „Zu den Fragen“ geht erst, wenn der Text einmal ganz gehört wurde. Bei den Fragen kann man ihn noch einmal anhören.

// Fragen nach Aufgabenform gruppieren (Reihenfolge wie in der Runde, Nummern wie später im Quiz).
function groups(questions) {
  const out = [];
  questions.forEach((q, i) => {
    const last = out[out.length - 1];
    if (last && last.instruction === q.instruction) last.items.push({ q, n: i + 1 });
    else out.push({ instruction: q.instruction, items: [{ q, n: i + 1 }] });
  });
  return out;
}

function Preview({ q, n }) {
  return (
    <li className="space-y-1">
      <p>
        <span className="mr-2 font-semibold tabular-nums">{n}.</span>
        {q.question}
        {q.type === 'reading_true_false' && (
          <span className="ml-2 whitespace-nowrap text-sm text-muted-foreground">
            ☐ {q.tfLabels?.[0] || 'Right'} ☐ {q.tfLabels?.[1] || 'Wrong'}
          </span>
        )}
      </p>
      {q.type === 'multi_select' && (
        <ul className="ml-6 space-y-0.5 text-sm">
          {q.options.map((o) => (
            <li key={o}>☐ {o}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function ListeningIntro({ task, questions, onStart, onBack }) {
  const [heard, setHeard] = useState(false);
  const list = questions?.length ? questions : task.questions;
  return (
    <div className="mx-auto max-w-[620px] space-y-6">
      <div className="space-y-2">
        <span className="vx-kicker">Hörverstehen</span>
        <h2 className="vx-question">{task.title}</h2>
        <p className="text-base">{task.situation}</p>
        <p className="text-sm text-muted-foreground">
          So geht’s: <strong>1.</strong> Lies dir die Fragen durch. <strong>2.</strong> Hör dir den Text an – du kannst
          dabei weiter auf die Fragen schauen. <strong>3.</strong> Beantworte die Fragen.
        </p>
      </div>

      <section className="space-y-4 rounded-[var(--radius-md)] border border-border bg-[var(--cream-50)] p-5" aria-label="Die Fragen">
        <h3 className="text-base font-semibold">Die Fragen ({list.length})</h3>
        {groups(list).map((g) => (
          <div key={g.instruction + g.items[0].n} className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">{g.instruction}</p>
            <ol className="space-y-2">
              {g.items.map(({ q, n }) => (
                <Preview key={q.id} q={q} n={n} />
              ))}
            </ol>
          </div>
        ))}
      </section>

      <div className="space-y-3 rounded-[var(--radius-md)] border-[2.5px] border-[var(--pen)] bg-[var(--cream-50)] p-5 shadow-[3px_3px_0_var(--pen-shadow)]">
        <ListeningPlayer audio={listeningAudio(task)} onEnded={() => setHeard(true)} />
        <p className="text-sm text-muted-foreground">Nach dem Hören beantwortest du die Fragen – dort kannst du den Text noch einmal anhören.</p>
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
