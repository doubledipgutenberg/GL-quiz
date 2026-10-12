import RoundsTrack from './RoundsTrack';
import { ROUND_SIZE, runden } from '../utils/vocabPass';

// Übersicht vor einer Wortschatz-Runde (design-system/components/ReviewPlan): wie viel vom ganzen Wortschatz noch
// übrig ist, in Runden à 50. In der App heißen die 50er-Einheiten immer „Runde“, nie „Session“.
export default function ReviewPlan({ status, onStart, onBack }) {
  const { complete, roundsLeft, remaining, total, round, roundsTotal, cur, size } = status;
  const last = roundsLeft === 1;
  const startLabel = complete
    ? 'Neuer Durchgang'
    : cur > 0
      ? `Weitermachen · noch ${size - cur} Karten`
      : last
        ? 'Letzte Runde starten'
        : `Runde ${round} starten`;

  return (
    <section className="vx-card vx-plan">
      <div className="vx-plan__head">
        <div>
          <span className="vx-kicker">{complete ? 'Wortschatz' : 'Nur noch'}</span>
          <h2 className="vx-display">{complete ? 'Geschafft!' : runden(roundsLeft)}</h2>
        </div>
      </div>

      <p className="vx-plan__count">
        {complete ? (
          <>
            Alle <b>{total}</b> Karten einmal geübt – der nächste Durchgang mischt neu.
          </>
        ) : (
          <>
            <b>{remaining}</b> von {total} Karten übrig · {last ? 'dann bist du durch!' : `je ${ROUND_SIZE} Karten`}
          </>
        )}
      </p>

      <RoundsTrack status={status} />
      {!complete && (
        <div className="vx-rounds__meta">
          <span>
            Runde <b>{round}</b> von {roundsTotal}
          </span>
          <span>{cur > 0 ? `${cur} / ${size} geschafft` : `${size} Karten`}</span>
        </div>
      )}

      <div className="vx-plan__actions">
        <button type="button" className="vx-btn vx-btn--primary vx-btn--block" onClick={onStart} autoFocus>
          {startLabel}
        </button>
        <button type="button" className="vx-btn vx-btn--link" onClick={onBack}>
          Zurück
        </button>
      </div>
    </section>
  );
}
