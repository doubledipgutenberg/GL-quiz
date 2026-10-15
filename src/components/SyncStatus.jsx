import { useEffect, useRef, useState } from 'react';
import { onSyncStatus, getSyncInfo, retrySync } from '../utils/sync';
import { getKidSession } from '../lib/api';

// Kleine Statusanzeige links oben (statt eines großen Hinweistexts): Punkt + Wort, antippen zeigt Details.
// Farben aus dem Design System: Oliv = gesichert, Lampengelb = wird übertragen, Ocker = offline (nie Rot).
const STATES = {
  saved: { label: 'Gespeichert', dot: 'var(--olive-600)' },
  saving: { label: 'Speichert …', dot: 'var(--lamp-300)' },
  offline: { label: 'Offline', dot: 'var(--ochre-600)' },
};

function stateOf(status) {
  if (status === 'error' || (typeof navigator !== 'undefined' && navigator.onLine === false)) return 'offline';
  if (status === 'pending' || status === 'saving') return 'saving';
  return 'saved';
}

function formatTime(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  const today = new Date().toDateString() === d.toDateString();
  const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  return today ? `heute, ${time} Uhr` : `${d.toLocaleDateString('de-DE')}, ${time} Uhr`;
}

// Beim Service Worker nachfragen, was für offline auf diesem Gerät liegt (nur im veröffentlichten Build).
function askOfflineReadiness() {
  const sw = typeof navigator !== 'undefined' ? navigator.serviceWorker?.controller : null;
  if (!sw) return Promise.resolve(null);
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => resolve(null), 3000);
    channel.port1.onmessage = (e) => {
      clearTimeout(timer);
      resolve(e.data);
    };
    sw.postMessage('status', [channel.port2]);
  });
}

function readinessText(r) {
  if (r === undefined) return 'wird geprüft …';
  if (!r?.app) return 'noch nicht – App einmal mit Internet öffnen und kurz warten';
  if (r.audioCached < r.audioTotal) return `ja – Aufnahmen werden noch geladen (${r.audioCached} von ${r.audioTotal})`;
  return `ja – App und alle ${r.audioTotal} Aufnahmen auf diesem Gerät`;
}

export default function SyncStatus() {
  const [, setTick] = useState(0);
  const [open, setOpen] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [readiness, setReadiness] = useState(undefined);
  const ref = useRef(null);

  // Offline-Bereitschaft bei jedem Öffnen neu abfragen.
  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    askOfflineReadiness().then((r) => !cancelled && setReadiness(r));
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Neu zeichnen bei Statuswechsel und wenn das Gerät on-/offline geht.
  useEffect(() => {
    const rerender = () => setTick((t) => t + 1);
    const off = onSyncStatus(rerender);
    window.addEventListener('online', rerender);
    window.addEventListener('offline', rerender);
    return () => {
      off();
      window.removeEventListener('online', rerender);
      window.removeEventListener('offline', rerender);
    };
  }, []);

  // Schließen bei Tipp daneben oder Escape.
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (e.type === 'keydown' ? e.key === 'Escape' : !ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  const info = getSyncInfo();
  const state = stateOf(info.status);
  const { label, dot } = STATES[state];
  const last = formatTime(info.lastSyncedAt);

  const retry = async () => {
    setRetrying(true);
    await retrySync(getKidSession()?.name);
    setRetrying(false);
  };

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => {
          setReadiness(undefined);
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-label={`Speicherstatus: ${label}`}
        className="inline-flex items-center gap-1.5 rounded-full border-[2px] border-[var(--pen)] bg-[var(--cream-50)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)]"
      >
        <span className="inline-block size-2 rounded-full" style={{ background: dot }} aria-hidden="true" />
        {label}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Speicherstatus"
          className="absolute left-0 top-full z-50 mt-2 w-[min(300px,calc(100vw-2rem))] space-y-2 rounded-[var(--radius-md)] border-[2.5px] border-[var(--pen)] bg-[var(--cream-50)] p-4 text-sm text-[var(--ink)] shadow-[3px_3px_0_var(--pen-shadow)]"
        >
          {state === 'offline' && (
            <>
              <p className="font-semibold">Gerade offline</p>
              <p>
                Keine Verbindung zum Server. Du übst mit dem Stand auf diesem Gerät – deine Antworten sind hier sicher
                gespeichert und werden automatisch übertragen, sobald wieder Internet da ist.
              </p>
            </>
          )}
          {state === 'saving' && (
            <>
              <p className="font-semibold">Wird übertragen …</p>
              <p>Deine letzten Antworten werden gerade auf den Server übertragen.</p>
            </>
          )}
          {state === 'saved' && (
            <>
              <p className="font-semibold">Alles gespeichert</p>
              <p>Deine Antworten sind auf diesem Gerät und auf dem Server gesichert.</p>
            </>
          )}
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs text-[var(--ink-muted)]">
            <dt>Noch zu übertragen</dt>
            <dd>{info.pendingCount ? 'ja – deine letzten Antworten' : 'nichts'}</dd>
            <dt>Zuletzt übertragen</dt>
            <dd>{last || 'auf diesem Gerät noch nie'}</dd>
            <dt>Offline nutzbar</dt>
            <dd>{readinessText(readiness)}</dd>
          </dl>
          {state === 'offline' && (
            <button type="button" className="vx-btn vx-btn--sm" onClick={retry} disabled={retrying}>
              {retrying ? 'Versuche …' : 'Jetzt erneut versuchen'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
