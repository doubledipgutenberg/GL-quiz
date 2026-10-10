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
