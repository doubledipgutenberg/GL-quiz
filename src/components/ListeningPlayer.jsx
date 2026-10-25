import { useEffect, useRef, useState } from 'react';
import { stopAudio } from '@/lib/audio';

// Abspieler für Hörtexte (Hörverstehen, 2026-10-25): Abspielen/Pause, Fortschritt, Zeit. Eigenes <audio>-Element,
// damit ein langer Text pausiert und fortgesetzt werden kann; andere Wiedergaben werden vorher beendet.
// Die Aufnahme liegt wie die Vokabeln unter public/audio/<kurs>/<id>.m4a (offline im Service Worker).
const fmt = (t) => (Number.isFinite(t) ? `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}` : '–:––');

export default function ListeningPlayer({ audio, compact = false, onEnded }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);
  const src = `${import.meta.env.BASE_URL}audio/${audio.course}/${audio.id}.m4a`;

  useEffect(() => {
    const el = ref.current;
    return () => el?.pause();
  }, []);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      stopAudio();
      el.play().catch(() => {});
    } else el.pause();
  };

  const label = playing ? 'Pause' : time > 0 ? 'Weiter anhören' : compact ? 'Hörtext noch einmal anhören' : 'Text anhören';

  return (
    <div className={compact ? 'flex flex-wrap items-center gap-3' : 'space-y-3'}>
      <audio
        ref={ref}
        src={src}
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={(e) => {
          setPlaying(false);
          e.currentTarget.currentTime = 0;
          setTime(0);
          onEnded?.();
        }}
        onError={() => {
          setFailed(true);
          onEnded?.();
        }}
      />
      <button
        type="button"
        className={compact ? 'vx-btn vx-btn--sm' : 'vx-btn vx-btn--primary vx-btn--block'}
        onClick={toggle}
        disabled={failed}
        aria-pressed={playing}
      >
        <i className="vx-ico vx-ico--sm vx-ico--speaker" aria-hidden="true" />
        {label}
      </button>
      <div className={compact ? 'flex min-w-[140px] flex-1 items-center gap-2' : 'flex items-center gap-3'}>
        <div className="vx-track flex-1" aria-hidden="true">
          <i style={{ width: `${duration ? Math.min(100, (time / duration) * 100) : 0}%` }} />
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {fmt(time)} / {fmt(duration)}
        </span>
      </div>
      {failed && <p className="text-sm text-muted-foreground">Die Aufnahme fehlt gerade – bitte einmal mit Internet öffnen.</p>}
    </div>
  );
}
