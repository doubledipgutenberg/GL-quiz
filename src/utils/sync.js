// Abgleich zwischen localStorage (Arbeitskopie im Browser) und dem Spacefast-Backend.
//
// - pull(kidName): lädt alle Daten vom Server und schreibt sie in den localStorage.
//   Lokale, noch nicht hochgeladene Änderungen werden dabei NICHT überschrieben.
// - Jede Änderung (markDirty aus storage.js) wird gesammelt und nach kurzer Pause
//   hochgeladen. Mit Eltern-Token darf alles geschrieben werden, mit Kinder-Token
//   nur die eigenen Daten.
// - Offline (2026-10-14): Die Liste offener Änderungen steht im localStorage (übersteht Neuladen ohne
//   Netz). War das Gerät offline oder gab es beim Start noch offene Änderungen, wird VOR dem Hochladen der
//   Server-Stand geholt und zusammengeführt (Runden per ID, Markierungen per ID, Durchgang, Highscores …),
//   damit ein iPad, das offline geübt hat, keine Runden von anderen Geräten überschreibt.

import { api, getKidSession, getParentToken } from '../lib/api';
import { onDirty } from './dirty';
import { STORAGE_KEYS, FAMILY_OWNER } from './storage';

const FAMILY_KEYS = ['teacherDismissals', 'teacherMarkedCorrect', 'flagReviews'];
const DEBOUNCE_MS = 1500;
const RETRY_MS = 10000;
const KEEPALIVE_MAX_BYTES = 60000;

const PENDING_KEY = 'lernquiz_sync_pending';
const LAST_SYNC_KEY = 'lernquiz_sync_last'; // Zeitpunkt der letzten erfolgreichen Übertragung (für die Statusanzeige)
const pending = new Map(); // "owner\u0000key" -> { owner, key }
let needsMerge = false; // vor dem nächsten Hochladen erst den Server-Stand holen und zusammenführen
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

function markSynced() {
  try {
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  } catch {
    /* egal */
  }
}

/** Für die Statusanzeige: Zustand, Zahl offener Änderungen, letzte erfolgreiche Übertragung. */
export function getSyncInfo() {
  let lastSyncedAt = null;
  try {
    lastSyncedAt = localStorage.getItem(LAST_SYNC_KEY);
  } catch {
    /* egal */
  }
  return { status, pendingCount: pending.size, lastSyncedAt };
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

// Offene Änderungen dauerhaft merken, damit sie ein Neuladen ohne Netz überstehen.
function savePending() {
  writeJson(PENDING_KEY, pending.size ? [...pending.values()].map(({ owner, key }) => [owner, key]) : null);
}

function addPending(owner, key) {
  pending.set(pid(owner, key), { owner, key });
  savePending();
}

// ---------- Zusammenführen (Server-Stand + lokale, noch nicht hochgeladene Änderungen) ----------

const byKey = (list, keyOf, pick) => {
  const map = new Map();
  for (const item of list || []) {
    if (!item) continue;
    const k = keyOf(item);
    map.set(k, map.has(k) ? pick(map.get(k), item) : item);
  }
  return [...map.values()];
};

// Runden: per ID (ältere ohne ID per Datum); bei doppelter Runde die mit mehr Antworten.
function mergeHistory(server, local) {
  const sessions = byKey(
    [...(server?.sessions || []), ...(local?.sessions || [])],
    (s) => s.id || `date:${s.date}`,
    (a, b) => ((b.answers?.length || 0) >= (a.answers?.length || 0) ? b : a),
  ).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return { ...(server || {}), ...(local || {}), sessions };
}

// Durchgang je Schulaufgabe: höherer Durchgang gewinnt; gleicher Durchgang → erledigte Karten vereinen.
function mergeProgress(server, local) {
  const out = { ...(server || {}) };
  for (const [exam, l] of Object.entries(local || {})) {
    const s = out[exam];
    if (!s || (l.pass || 1) > (s.pass || 1)) out[exam] = l;
    else if ((l.pass || 1) === (s.pass || 1)) out[exam] = { ...s, done: [...new Set([...(s.done || []), ...(l.done || [])])] };
  }
  return out;
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
    case 'answerFlags': {
      const list = readJson(STORAGE_KEYS.answerFlags, {})[owner];
      return Array.isArray(list) && list.length ? list : null;
    }
    case 'vocabProgress':
      return readJson(STORAGE_KEYS.vocabProgress, {})[owner] ?? null;
    case 'teacherDismissals':
    case 'teacherMarkedCorrect':
    case 'flagReviews':
      return readJson(STORAGE_KEYS[key], {});
    default:
      return null;
  }
}

function schedule(ms) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    // Nichts offen, aber offline: nur prüfen, ob der Server wieder erreichbar ist.
    if (!pending.size && status === 'error') retrySync(getKidSession()?.name);
    else flush();
  }, ms);
}

/** Erneut versuchen (Statusanzeige, Netz wieder da): Server-Stand holen, dann Offenes übertragen. */
export async function retrySync(kidName) {
  try {
    await pull(kidName);
  } catch {
    return; // weiterhin offline – pull() hat den Status gesetzt und plant den nächsten Versuch
  }
  await flush();
}

onDirty((owner, key) => {
  addPending(owner, key);
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

  // Nach Offline-Zeit erst den Server-Stand holen und zusammenführen, dann hochladen.
  if (needsMerge) {
    try {
      const { owners } = await api.getState(token);
      hydrate(owners, kid?.name);
      needsMerge = false;
    } catch {
      setStatus('error');
      schedule(RETRY_MS);
      return;
    }
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
  savePending();
  const size = JSON.stringify(items).length;

  setStatus('saving');
  flushing = api
    .putState(items, token, keepalive && size < KEEPALIVE_MAX_BYTES)
    .then(() => {
      markSynced();
      setStatus(pending.size ? 'pending' : 'idle');
    })
    .catch(() => {
      batch.forEach(({ id, owner, key }) => {
        if (!pending.has(id)) pending.set(id, { owner, key });
      });
      savePending();
      needsMerge = true; // vielleicht offline: vor dem nächsten Versuch zusammenführen
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
    if (isPending(owner, 'history')) history[owner] = mergeHistory(history[owner], localHistory[owner]);
  }
  writeJson(STORAGE_KEYS.history, history);

  // „Fast richtig“-Markierungen: alle Kinder (für den Lehrer-Bereich)
  const localFlags = readJson(STORAGE_KEYS.answerFlags, {});
  const flags = {};
  for (const [owner, data] of Object.entries(serverOwners)) {
    if (owner !== FAMILY_OWNER && Array.isArray(data?.answerFlags)) flags[owner] = data.answerFlags;
  }
  for (const owner of Object.keys(localFlags)) {
    if (isPending(owner, 'answerFlags')) flags[owner] = byKey([...(flags[owner] || []), ...localFlags[owner]], (f) => f.id, (a, b) => b);
  }
  writeJson(STORAGE_KEYS.answerFlags, flags);

  // Fortschritt im Wortschatz-Durchgang (Runden à 50 Karten): alle Kinder
  const localProgress = readJson(STORAGE_KEYS.vocabProgress, {});
  const progress = {};
  for (const [owner, data] of Object.entries(serverOwners)) {
    if (owner !== FAMILY_OWNER && data?.vocabProgress) progress[owner] = data.vocabProgress;
  }
  for (const owner of Object.keys(localProgress)) {
    if (isPending(owner, 'vocabProgress')) progress[owner] = mergeProgress(progress[owner], localProgress[owner]);
  }
  writeJson(STORAGE_KEYS.vocabProgress, progress);

  // Highscores: alle Kinder
  const localScores = readJson(STORAGE_KEYS.highscores, []);
  const scoreOwners = new Set([
    ...Object.keys(serverOwners),
    ...localScores.map((h) => h?.name),
  ]);
  const highscores = [];
  for (const owner of scoreOwners) {
    if (!owner || owner === FAMILY_OWNER) continue;
    const server = Array.isArray(serverOwners[owner]?.highscores) ? serverOwners[owner].highscores : [];
    if (isPending(owner, 'highscores')) {
      const local = localScores.filter((h) => h?.name === owner);
      highscores.push(...byKey([...server, ...local], (h) => `${h.date}|${h.score}`, (a) => a));
    } else highscores.push(...server);
  }
  highscores.sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0));
  writeJson(STORAGE_KEYS.highscores, highscores.slice(0, 50));

  // Gespeicherte Runden + laufende Runde: nur die des angemeldeten Kindes
  if (kidName) {
    const serverRounds = serverOwners[kidName]?.savedRounds || [];
    if (!isPending(kidName, 'savedRounds')) writeJson(STORAGE_KEYS.savedRounds, serverRounds);
    else {
      const localRounds = readJson(STORAGE_KEYS.savedRounds, []);
      writeJson(STORAGE_KEYS.savedRounds, byKey([...serverRounds, ...localRounds], (r) => r.id, (a, b) => b));
    }
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
  try {
    const { owners } = await api.getState(token);
    hydrate(owners, kidName);
    markSynced();
    if (status === 'error' && !pending.size) setStatus('idle');
  } catch (err) {
    // Keine Verbindung: Statusanzeige auf „Offline“, später zusammenführen.
    if (err?.status !== 401) {
      needsMerge = true;
      setStatus('error');
      schedule(RETRY_MS);
    }
    throw err;
  }
}

// Beim Start: offene Änderungen aus einer früheren (Offline-)Sitzung wieder aufnehmen.
if (typeof window !== 'undefined') {
  for (const [owner, key] of readJson(PENDING_KEY, [])) pending.set(pid(owner, key), { owner, key });
  if (pending.size) {
    needsMerge = true;
    status = 'pending';
    schedule(DEBOUNCE_MS);
  }
  // Netz wieder da → sofort abgleichen und übertragen.
  window.addEventListener('online', () => retrySync(getKidSession()?.name));
}

// Beim Verlassen/Verstecken der Seite sofort hochladen.
if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush({ keepalive: true });
  });
  window.addEventListener('pagehide', () => flush({ keepalive: true }));
}
