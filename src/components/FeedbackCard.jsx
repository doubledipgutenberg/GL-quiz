import { useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { playAudio } from '@/lib/audio';
import { langOfQuestion, nextSticker, stickerTilt } from '@/data/stickers';
import { requiredMeanings, countCorrectMeanings, tooShort } from '@/utils/scoring';

// Rückmeldung nach jeder Antwort – Design System: Feedback + FeedbackSticker
// (design-system/components/Feedback/README.md, …/FeedbackSticker/README.md).
// Farbe kommt vom Ergebnis (Oliv / Ocker), nie Rot; Icon + Wort tragen die Bedeutung, der Sticker ist Deko.
export default function FeedbackCard({ lastAnswer, onNext, onFlagAlmostRight }) {
  const { isCorrect, points, question, userAnswer } = lastAnswer;
  // Lesbar anzeigen: Richtig/Falsch-Fragen mit ihrer Beschriftung („Right“/„Wrong“), Ankreuzen als Liste.
  const tfLabel = (v) =>
    v === 'true' ? question.tfLabels?.[0] || 'True' : v === 'false' ? question.tfLabels?.[1] || 'False' : v;
  const show = (v) =>
    question.type === 'reading_true_false'
      ? tfLabel(v)
      : question.type === 'multi_select'
        ? String(v).split(' | ').join(' · ')
        : v;
  // Das Kind kann eine als falsch gewertete Antwort zur Prüfung melden („fast richtig“) – im Wortschatz und
  // (seit 2026-10-25) auch im normalen Quiz, bei allen Fragen mit eigener Eingabe (nicht bei Auswahl/Richtig-Falsch).
  const canFlag =
    !isCorrect && !['multiple_choice', 'reading_true_false', 'multi_select'].includes(question.type) && !!onFlagAlmostRight;
  const [flagged, setFlagged] = useState(false);
  // Mehrere Bedeutungen verlangt, aber nur eine genannt → freundlicher Hinweis statt nur „falsch“.
  const required = requiredMeanings(question);
  const onlySome = !isCorrect && required >= 2 && countCorrectMeanings(question, userAnswer) > 0;
  // Längere offene Frage zu knapp beantwortet → sagen, warum.
  const short = !isCorrect && tooShort(question, userAnswer);
  // AE-Karte richtig, aber mit dem britischen Wort beantwortet („autumn“) → das amerikanische nennen.
  const aeWord = question.ae ? String(question.correct).replace(/\s*\(AE\)\s*/g, '').trim() : '';
  const plain = (x) => String(x).toLowerCase().replace(/[’']/g, "'").replace(/[.!?…]/g, '').replace(/^(to|the|a|an)\s+/, '').trim();
  const usedBritish = isCorrect && !!aeWord && plain(userAnswer) !== plain(aeWord);
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
            <s>{show(userAnswer)}</s>
          </dd>
          {/* Längere offene Frage: Musterantwort als Beispiel, in normaler Schriftgröße (sonst riesig). */}
          <dt>{question.multiline ? 'Zum Beispiel' : 'Richtig ist'}</dt>
          <dd className={cn('is-right', question.multiline && 'is-right--long')}>
            {show(question.correct)}
            {question.ae && !/\bAE\b/.test(String(question.correct)) ? ' (AE)' : ''}
          </dd>
        </dl>
      )}

      {usedBritish && (
        <p className="vx-feedback__body">
          Richtig – auf amerikanischem Englisch heißt es <strong>„{aeWord}“</strong>.
        </p>
      )}

      {onlySome && (
        <p className="vx-feedback__body">
          Das stimmt schon zum Teil – hier sind aber <strong>mindestens zwei</strong> Bedeutungen gefragt.
        </p>
      )}

      {short && (
        <p className="vx-feedback__body">
          Deine Antwort ist zu kurz – hier sind <strong>ein bis zwei Sätze</strong> gefragt (mindestens{' '}
          {question.minWords} Wörter).
        </p>
      )}

      {canFlag &&
        (flagged ? (
          <p className="vx-feedback__body">Gemerkt! Deine Antwort wird noch einmal geprüft.</p>
        ) : (
          <button
            type="button"
            className="vx-btn vx-btn--link self-start"
            onClick={() => {
              onFlagAlmostRight(question, userAnswer);
              setFlagged(true);
            }}
          >
            Na ja, schon fast richtig
          </button>
        ))}

      {question.explanation && !(question.multiline && !isCorrect) && (
        <p className="vx-feedback__body">{question.explanation}</p>
      )}

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
