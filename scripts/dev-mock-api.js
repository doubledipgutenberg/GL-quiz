// Test-Attrappe des Spacefast-Backends für die lokale Entwicklung (nur im Speicher).
// Aktiv mit:  MOCK_API=1 npm run dev
// Verhält sich wie functions/api/[action].ts (gleiche Routen, gleiche Antworten), damit
// Login, Sync und Lehrer-Bereich lokal testbar sind – ohne echten Space und ohne echte PINs.
const KIDS = ['Jakob', 'Clara'];
const FAMILY = '_family';

const pins = new Map(); // name -> pin
let parentPin = null;
const owners = {}; // owner -> { key: value }

const b64url = (s) => Buffer.from(s).toString('base64url');
const token = (payload) => `${b64url(JSON.stringify({ ...payload, exp: Date.now() + 12 * 3600 * 1000 }))}.mock`;

function who(req) {
  const t = (req.headers.authorization || '').replace(/^Bearer /, '');
  try {
    return JSON.parse(Buffer.from(t.split('.')[0], 'base64url').toString());
  } catch {
    return null;
  }
}

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(data));
}

async function body(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function mockApi() {
  return {
    name: 'lernquiz-mock-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res) => {
        const action = req.url.replace(/^\//, '').split('?')[0];
        const b = req.method === 'POST' || req.method === 'PUT' ? await body(req) : {};

        if (action === 'kids') {
          return send(res, 200, { kids: KIDS.map((name) => ({ name, hasPin: pins.has(name) })), parentPinSet: !!parentPin });
        }
        if (action === 'login') {
          if (!KIDS.includes(b.name)) return send(res, 404, { error: 'Unbekanntes Profil' });
          if (!/^\d{4}$/.test(b.pin || '')) return send(res, 400, { error: 'Die PIN muss aus 4 Ziffern bestehen.' });
          const firstTime = !pins.has(b.name);
          if (firstTime) pins.set(b.name, b.pin);
          else if (pins.get(b.name) !== b.pin) return send(res, 401, { error: 'Falsche PIN.', remaining: 4 });
          return send(res, 200, { token: token({ role: 'kid', name: b.name }), name: b.name, firstTime });
        }
        if (action === 'parent') {
          if (!/^\d{4,8}$/.test(b.pin || '')) return send(res, 400, { error: 'Die Eltern-PIN muss aus 4 bis 8 Ziffern bestehen.' });
          const firstTime = !parentPin;
          if (firstTime) parentPin = b.pin;
          else if (parentPin !== b.pin) return send(res, 401, { error: 'Falsche PIN.', remaining: 4 });
          return send(res, 200, { token: token({ role: 'parent' }), firstTime });
        }

        const w = who(req);
        if (!w) return send(res, 401, { error: 'Nicht angemeldet' });
        if (action === 'me') return send(res, 200, w);
        if (action === 'state' && req.method === 'GET') return send(res, 200, { owners });
        if (action === 'state' && req.method === 'PUT') {
          for (const it of b.items || []) {
            if (w.role === 'kid' && (it.owner === FAMILY || it.owner !== w.name)) return send(res, 403, { error: 'Keine Berechtigung' });
          }
          for (const it of b.items || []) {
            owners[it.owner] ||= {};
            if (it.value === null || it.value === undefined) delete owners[it.owner][it.key];
            else owners[it.owner][it.key] = it.value;
          }
          return send(res, 200, { ok: true, written: (b.items || []).length });
        }
        if (w.role !== 'parent') return send(res, 403, { error: 'Nur für Eltern' });
        if (action === 'reset-pin') {
          pins.delete(b.name);
          return send(res, 200, { ok: true });
        }
        if (action === 'clear') {
          Object.keys(owners).forEach((k) => delete owners[k]);
          return send(res, 200, { ok: true });
        }
        return send(res, 404, { error: 'Nicht gefunden' });
      });
    },
  };
}
