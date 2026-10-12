import { useState } from 'react';
import RoundsTrack from './RoundsTrack';
import { nextSticker } from '../data/stickers';
import { runden } from '../utils/vocabPass';

// Bildschirm nach jeder Wortschatz-Runde (design-system/components/RoundBreak): Belohnung, Einladung zur Pause
// und was noch übrig ist – in Karten und Runden. Ist alles geschafft, zeigt App.jsx stattdessen die ScoreBoard.
export default function RoundBreak({ lang, answers, status, onNext, onPause }) {
  const [sticker] = useState(() => nextSticker(lang, true));
  const correct = answers.filter((a) => a.isCorrect).length;
  const { remaining, roundsLeft, roundsDone, roundsTotal } = status;
  const karten = `${remaining} ${remaining === 1 ? 'Karte' : 'Karten'}`;

  return (
    <section className="vx-card vx-break mx-auto max-w-[420px]">
      <img src={sticker.src} alt="" />
      <div>
        <span className="vx-kicker">Runde geschafft –</span>
        <h2 className="vx-display">Pause!</h2>
      </div>
      <div className="vx-break__stats">
        <span className="vx-stat">
          <i className="vx-ico vx-ico--sm vx-ico--book" aria-hidden="true" />
          {answers.length} Karten
        </span>
        <span className="vx-stat vx-stat--lamp">
          <i className="vx-ico vx-ico--sm vx-ico--check" aria-hidden="true" />
          {correct} richtig
        </span>
      </div>
      <p className="vx-break__left">
        Noch <b>{karten}</b>
        {roundsLeft === 1 ? ' – nur noch 1 Runde!' : roundsLeft === 2 ? ' – nur 2 Runden, dann bist du durch.' : ` – noch ${runden(roundsLeft)}.`}
      </p>
      <RoundsTrack status={status} currentFill={0} />
      <div className="vx-rounds__meta">
        <span>
          {roundsDone} von {roundsTotal} Runden
        </span>
        <span>{karten} übrig</span>
      </div>
      <div className="vx-break__actions">
        <button type="button" className="vx-btn vx-btn--primary" onClick={onNext} autoFocus>
          Nächste Runde
        </button>
        <button type="button" className="vx-btn" onClick={onPause}>
          Pause machen
        </button>
      </div>
      <p className="vx-break__saved">
        <i className="vx-ico vx-ico--sm vx-ico--check" aria-hidden="true" />
        Dein Stand ist gespeichert.
      </p>
    </section>
  );
}
