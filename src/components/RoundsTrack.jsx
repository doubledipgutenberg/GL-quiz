// Runden-Leiste des Wortschatz-Durchgangs (Design System: ReviewPlan / RoundBreak, Klassen .vx-rounds).
// Eine Pille pro Runde: erledigt = gefüllt, laufende = gelb gefüllt bis --fill, kommende = gestrichelt.
export default function RoundsTrack({ status, currentFill = null }) {
  const { roundsTotal, roundsDone, round, cur, size, complete } = status;
  const fill = currentFill ?? (size ? cur / size : 0);
  return (
    <ol className="vx-rounds" aria-label={`Runde ${round} von ${roundsTotal}`}>
      {Array.from({ length: roundsTotal }, (_, i) => {
        if (complete || i < roundsDone) return <li key={i} className="is-done" />;
        if (i === roundsDone) return <li key={i} className="is-current" style={{ '--fill': `${Math.round(fill * 100)}%` }} />;
        return <li key={i} />;
      })}
    </ol>
  );
}
