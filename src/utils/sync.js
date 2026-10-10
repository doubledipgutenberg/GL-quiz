// Abgleich zwischen localStorage (Arbeitskopie im Browser) und dem Spacefast-Backend.
//
// - pull(kidName): lädt alle Daten vom Server und schreibt sie in den localStorage.
//   Lokale, noch nicht hochgeladene Änderungen werden dabei NICHT überschrieben.
// - Jede Änderung (markDirty aus storage.js) wird gesammelt und nach kurzer Pause
//   hochgeladen. Mit Eltern-Token darf alles geschrieben werden, mit Kinder-Token
//   nur die eigenen Daten.

import { api, getKidSession, getParentToken } from '../lib/api';
import { onDirty } from './dirty';
import { STORAGE_KEYS, FAMILY_OWNER } from './storage';

const FAMILY_KEYS = ['teacherDismissals', 'teacherMarkedCorrect'];
const DEBOUNCE_MS = 1500;
const RETRY_MS = 10000;
const KEEPALIVE_MAX_BYTES = 60000;

const pending = new Map(); // "owner\u0000key" -> { owner, key }
let timer = null;
let flushing = null;
let status = 'idle'; // idle | pending | saving | error
const statusListeners = new Set();

const pid = (owner, key) => `${owner}\u0000${key}`;

// Benachrichtigung erst nach dem aktuellen Render: Änderungen können aus einem
// React-Reducer heraus gemeldet werden (z. B. Quiz-Neustart löscht den Entwurf).
function setStatus(next) {
  status = next;
  queueMicrotask(() => statusListeners.forEach((fn) => fn(status)));
}

export function onSyncStatus(fn) {
  statusListeners.add(fn);
  fn(status);
  return () => statusListeners.delete(fn);
}

function readJson(lsKey, fallback) {
  try {
    const v = localStorage.getItem(lsKey);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(lsKey, value) {
  if (value === null || value === undefined) localStorage.removeItem(lsKey);
  else localStorage.setItem(lsKey, JSON.stringify(value));
}

// Aktueller lokaler Wert für (owner, key) – so, wie er auf dem Server landen soll.
function localValue(owner, key) {
  switch (key) {
    case 'history':
      return readJson(STORAGE_KEYS.history, {})[owner] ?? null;
    case 'highscores': {
      const list = readJson(STORAGE_KEYS.highscores, []).filter((h) => h?.name === owner);
      return list.length ? list : null;
    }
    case 'savedRounds': {
      const list = readJson(STORAGE_KEYS.savedRounds, []).filter((r) => r?.playerName === owner);
      return list.length ? list : null;
    }
    case 'draft': {
      const d = readJson(STORAGE_KEYS.draft, null);
      return d && d.name === owner ? d : null;
    }
    case 'teacherDismissals':
    case 'teacherMarkedCorrect':
      return readJson(STORAGE_KEYS[key], {});
    default:
      return null;
  }
}

function schedule(ms) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    flush();
  }, ms);
}

onDirty((owner, key) => {
  pending.set(pid(owner, key), { owner, key });
  setStatus('pending');
  schedule(DEBOUNCE_MS);
});

/** Lädt alle anstehenden Änderungen hoch, die mit den vorhandenen Tokens erlaubt sind. */
export async function flush({ keepalive = false } = {}) {
  clearTimeout(timer);
  if (flushing) await flushing;
  const kid = getKidSession();
  const parent = getParentToken();
  const token = parent || kid?.token;
  if (!token || pending.size === 0) {
    if (status !== 'error') setStatus('idle');
    return;
  }

  const batch = [];
  for (const [id, { owner, key }] of pending) {
    const allowed = parent || (kid && owner === kid.name && !FAMILY_KEYS.includes(key) && owner !== FAMILY_OWNER);
    if (allowed) batch.push({ id, owner, key });
  }
  if (batch.length === 0) {
    setStatus('idle');
    return;
  }

  const items = batch.map(({ owner, key }) => ({ owner, key, value: localValue(owner, key) }));
  batch.forEach(({ id }) => pending.delete(id));
  const size = JSON.stringify(items).length;

  setStatus('saving');
  flushing = api
    .putState(items, token, keepalive && size < KEEPALIVE_MAX_BYTES)
    .then(() => setStatus(pending.size ? 'pending' : 'idle'))
    .catch(() => {
      batch.forEach(({ id, owner, key }) => {
        if (!pending.has(id)) pending.set(id, { owner, key });
      });
      setStatus('error');
      schedule(RETRY_MS);
    })
    .finally(() => {
      flushing = null;
    });
  await flushing;
}

export function hasPendingChanges() {
  return pending.size > 0;
}

/** Schreibt den Server-Stand in den localStorage, ohne lokale ungesicherte Änderungen zu verlieren. */
export function hydrate(owners, kidName) {
  const isPending = (owner, key) => pending.has(pid(owner, key));
  const serverOwners = owners || {};

  // History: alle Kinder (für Lehrer-Bereich und Wiederholungen)
  const localHistory = readJson(STORAGE_KEYS.history, {});
  const history = {};
  for (const [owner, data] of Object.entries(serverOwners)) {
    if (owner !== FAMILY_OWNER && data?.history) history[owner] = data.history;
  }
  for (const owner of Object.keys(localHistory)) {
    if (isPending(owner, 'history')) history[owner] = localHistory[owner];
  }
  writeJson(STORAGE_KEYS.history, history);

  // Highscores: alle Kinder
  const localScores = readJson(STORAGE_KEYS.highscores, []);
  const scoreOwners = new Set([
    ...Object.keys(serverOwners),
    ...localScores.map((h) => h?.name),
  ]);
  const highscores = [];
  for (const owner of scoreOwners) {
    if (!owner || owner === FAMILY_OWNER) continue;
    if (isPending(owner, 'highscores')) highscores.push(...localScores.filter((h) => h?.name === owner));
    else if (Array.isArray(serverOwners[owner]?.highscores)) highscores.push(...serverOwners[owner].highscores);
  }
  highscores.sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0));
  writeJson(STORAGE_KEYS.highscores, highscores.slice(0, 50));

  // Gespeicherte Runden + laufende Runde: nur die des angemeldeten Kindes
  if (kidName) {
    if (!isPending(kidName, 'savedRounds')) writeJson(STORAGE_KEYS.savedRounds, serverOwners[kidName]?.savedRounds || []);
    if (!isPending(kidName, 'draft')) writeJson(STORAGE_KEYS.draft, serverOwners[kidName]?.draft || null);
  }

  // Lehrer-Markierungen (familienweit)
  const family = serverOwners[FAMILY_OWNER] || {};
  for (const key of FAMILY_KEYS) {
    if (!isPending(FAMILY_OWNER, key)) writeJson(STORAGE_KEYS[key], family[key] || {});
  }
}

/** Server-Stand holen und einspielen. Wirft bei Verbindungsproblemen. */
export async function pull(kidName) {
  const token = getParentToken() || getKidSession()?.token;
  if (!token) return;
  const { owners } = await api.getState(token);
  hydrate(owners, kidName);
}

// Beim Verlassen/Verstecken der Seite sofort hochladen.
if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush({ keepalive: true });
  });
  window.addEventListener('pagehide', () => flush({ keepalive: true }));
}
