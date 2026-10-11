import { useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { playAudio } from '@/lib/audio';
import { langOfQuestion, nextSticker, stickerTilt } from '@/data/stickers';

// Rückmeldung nach jeder Antwort – Design System: Feedback + FeedbackSticker
// (design-system/components/Feedback/README.md, …/FeedbackSticker/README.md).
// Farbe kommt vom Ergebnis (Oliv / Ocker), nie Rot; Icon + Wort tragen die Bedeutung, der Sticker ist Deko.
export default function FeedbackCard({ lastAnswer, onNext }) {
  const { isCorrect, points, question, userAnswer } = lastAnswer;
  // Einmal pro Antwort ziehen (FeedbackCard wird pro Antwort neu eingehängt).
  const [sticker] = useState(() => nextSticker(langOfQuestion(question), isCorrect));
  const [tilt] = useState(stickerTilt);

  return (
    <section className={cn('vx-feedback', isCorrect ? 'vx-feedback--correct' : 'vx-feedback--wrong')}>
      <div className="vx-feedback__head">
        <img className="vx-sticker vx-sticker--pop" style={{ '--tilt': tilt }} src={sticker.src} alt="" />
        <div>
          <span className="vx-feedback__exclaim">{sticker.exclaim}</span>
          <p className="vx-feedback__title text-[clamp(26px,7.5vw,36px)]" role="status">
            {/* Icon und Wort bleiben zusammen (schmale Karte), nur die Punkte-Pille darf umbrechen. */}
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <i className={cn('vx-ico', isCorrect ? 'vx-ico--check' : 'vx-ico--cross')} aria-hidden="true" />
              {isCorrect ? 'Richtig!' : 'Nicht ganz…'}
            </span>
            {isCorrect && (
              <span className="vx-pill">
                +{points} Punkt{points !== 1 ? 'e' : ''}
              </span>
            )}
          </p>
        </div>
      </div>

      {!isCorrect && (
        <dl className="vx-feedback__answers">
          <dt>Deine Antwort</dt>
          <dd>
            <s>{userAnswer}</s>
          </dd>
          <dt>Richtig ist</dt>
          <dd className="is-right">{question.correct}</dd>
        </dl>
      )}

      {question.explanation && <p className="vx-feedback__body">{question.explanation}</p>}

      {question.audio && (
        <Button type="button" variant="outline" size="sm" className="self-start" onClick={() => playAudio(question.audio)}>
          <i className="vx-ico vx-ico--sm vx-ico--speaker" aria-hidden="true" />
          Aussprache anhören
        </Button>
      )}

      <p className="vx-feedback__quote">„{sticker.line}“</p>

      <button type="button" className="vx-btn vx-btn--primary vx-btn--block" onClick={onNext} autoFocus>
        Weiter
      </button>
    </section>
  );
}
