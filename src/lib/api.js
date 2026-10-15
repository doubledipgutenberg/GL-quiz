// Client für das Spacefast-Backend (functions/api/[action].ts).
// Tokens liegen im localStorage dieses Geräts (Kind: 90 Tage, Eltern: 12 Stunden).

const KID_SESSION_KEY = 'lernquiz_kid_session';
const PARENT_TOKEN_KEY = 'lernquiz_parent_token';

function tokenExp(token) {
  try {
    const body = token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(body)).exp || 0;
  } catch {
    return 0;
  }
}

function isValid(token) {
  return !!token && tokenExp(token) > Date.now() + 60_000;
}

export function getKidSession() {
  try {
    const s = JSON.parse(localStorage.getItem(KID_SESSION_KEY) || 'null');
    return s && s.name && isValid(s.token) ? s : null;
  } catch {
    return null;
  }
}

export function setKidSession(session) {
  if (session) localStorage.setItem(KID_SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(KID_SESSION_KEY);
}

// ---------- Offline-Anmeldung (iPad ohne Netz, 2026-10-15) ----------
// Wer sich auf diesem Gerät einmal mit Netz angemeldet hat, kann ohne Netz das Profil wechseln:
// Gemerkt werden die Profilliste, je Kind ein Prüfwert der PIN (PBKDF2 mit Salz – nicht die PIN selbst)
// und das Kinder-Token (90 Tage), mit dem später auch seine offline geübten Antworten hochgeladen werden.
const KNOWN_KIDS_KEY = 'lernquiz_known_kids';
const KIDS_CACHE_KEY = 'lernquiz_kids_cache';
const LOCAL_MAX_FAILS = 5;
const LOCAL_LOCK_MS = 5 * 60 * 1000;

function readKnownKids() {
  try {
    return JSON.parse(localStorage.getItem(KNOWN_KIDS_KEY) || '{}') || {};
  } catch {
    return {};
  }
}

function writeKnownKids(all) {
  localStorage.setItem(KNOWN_KIDS_KEY, JSON.stringify(all));
}

const toHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

async function pinCheckValue(pin, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 100_000 },
    key,
    256,
  );
  return toHex(bits);
}

/** Nach erfolgreicher Anmeldung mit Netz: Kind auf diesem Gerät merken (für Offline-Anmeldung und Sync). */
export async function rememberKid(name, pin, token) {
  try {
    const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
    const check = await pinCheckValue(pin, salt);
    const all = readKnownKids();
    all[name] = { token, salt, check };
    writeKnownKids(all);
  } catch {
    // ohne WebCrypto (unsicherer Kontext) keine Offline-Anmeldung – online geht weiter alles
  }
}

/** Token eines auf diesem Gerät bekannten Kindes (noch gültig) – zum Hochladen seiner Antworten. */
export function getKnownKidToken(name) {
  const t = readKnownKids()[name]?.token;
  return isValid(t) ? t : null;
}

export const isKnownKid = (name) => !!getKnownKidToken(name) && !!readKnownKids()[name]?.check;

/** Offline anmelden: PIN gegen den gemerkten Prüfwert. Wirft ApiError wie der Server. */
export async function loginOffline(name, pin) {
  const all = readKnownKids();
  const entry = all[name];
  if (!entry?.check || !isValid(entry.token)) {
    throw new ApiError('Ohne Internet geht die Anmeldung nur, wenn du dich auf diesem Gerät schon einmal angemeldet hast.', 0, null);
  }
  if (entry.lockedUntil > Date.now()) {
    throw new ApiError('', 423, { retryInSeconds: Math.ceil((entry.lockedUntil - Date.now()) / 1000) });
  }
  if ((await pinCheckValue(pin, entry.salt)) !== entry.check) {
    entry.fails = (entry.fails || 0) + 1;
    if (entry.fails >= LOCAL_MAX_FAILS) {
      entry.fails = 0;
      entry.lockedUntil = Date.now() + LOCAL_LOCK_MS;
    }
    writeKnownKids(all);
    if (entry.lockedUntil > Date.now()) throw new ApiError('', 423, { retryInSeconds: Math.ceil(LOCAL_LOCK_MS / 1000) });
    throw new ApiError('Falsche PIN.', 401, { remaining: LOCAL_MAX_FAILS - entry.fails });
  }
  entry.fails = 0;
  entry.lockedUntil = 0;
  writeKnownKids(all);
  return { name, token: entry.token };
}

/** Profilliste: vom Server, ohne Netz die zuletzt geladene. Liefert { kids, offline }. */
export async function loadKids() {
  try {
    const d = await call('kids');
    localStorage.setItem(KIDS_CACHE_KEY, JSON.stringify(d.kids));
    return { kids: d.kids, offline: false };
  } catch (err) {
    let cached = null;
    try {
      cached = JSON.parse(localStorage.getItem(KIDS_CACHE_KEY) || 'null');
    } catch {
      /* nichts gemerkt */
    }
    if (err.status === 0 && Array.isArray(cached)) return { kids: cached, offline: true };
    throw err;
  }
}

export function getParentToken() {
  try {
    const t = localStorage.getItem(PARENT_TOKEN_KEY);
    return isValid(t) ? t : null;
  } catch {
    return null;
  }
}

export function setParentToken(token) {
  if (token) localStorage.setItem(PARENT_TOKEN_KEY, token);
  else localStorage.removeItem(PARENT_TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function call(action, { method = 'GET', body, token, keepalive = false } = {}) {
  let res;
  try {
    res = await fetch(`/api/${action}`, {
      method,
      keepalive,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Keine Verbindung zum Server.', 0, null);
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    // z. B. HTML-Fehlerseite der Plattform
  }
  if (!res.ok) {
    const fallback = res.status === 429 ? 'Zu viele Anfragen – bitte kurz warten.' : `Fehler ${res.status}`;
    throw new ApiError(data?.error || fallback, res.status, data);
  }
  return data;
}

export const api = {
  kids: () => call('kids'),
  login: (name, pin) => call('login', { method: 'POST', body: { name, pin } }),
  parentLogin: (pin) => call('parent', { method: 'POST', body: { pin } }),
  getState: (token) => call('state', { token }),
  putState: (items, token, keepalive = false) =>
    call('state', { method: 'PUT', body: { items }, token, keepalive }),
  resetPin: (name, token) => call('reset-pin', { method: 'POST', body: { name }, token }),
  clearAll: (token) => call('clear', { method: 'POST', body: {}, token }),
};
