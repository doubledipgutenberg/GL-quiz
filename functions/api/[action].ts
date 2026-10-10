// Backend für das Lern-Quiz auf Spacefast (Functions, env.DB = MySQL-kompatibel).
//
// Der ganze Space ist per Familien-Passwort geschützt. Darüber hinaus:
//  - Kinder-Profile (Name + 4-stellige PIN, beim ersten Login selbst festgelegt)
//  - Eltern-PIN für den Lehrer-Bereich (ebenfalls beim ersten Mal festgelegt)
//  - Speicherung der Quiz-Daten pro Kind (history, highscores, savedRounds, draft)
//    und familienweit (_family: Lehrer-Markierungen).
//
// Die DB erlaubt max. 64 KB pro Anweisung. Große JSON-Werte werden deshalb in
// Stücke geteilt und versioniert gespeichert: erst alle Stücke der neuen Version,
// dann wird der Zeiger umgestellt, dann alte Stücke gelöscht. Ein abgebrochener
// Schreibvorgang lässt so immer die alte, vollständige Version stehen.

const KIDS = ["Jakob", "Clara"];
const FAMILY = "_family";
const KID_KEYS = ["history", "highscores", "savedRounds", "draft"];
const FAMILY_KEYS = ["teacherDismissals", "teacherMarkedCorrect"];

const CHUNK_CHARS = 20000; // < 64 KB auch bei 3-Byte-Zeichen
const PBKDF2_ITER = 20000;
const KID_TOKEN_MS = 90 * 24 * 3600 * 1000;
const PARENT_TOKEN_MS = 12 * 3600 * 1000;
const MAX_FAILS = 5;
const LOCK_MS = 5 * 60 * 1000;

type Ctx = { params: Record<string, string>; env: { DB: any } };

// ---------- Hilfen ----------

const enc = new TextEncoder();

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "cache-control": "no-store" } });
}

function toHex(buf: ArrayBuffer | Uint8Array) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function b64url(bytes: Uint8Array) {
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function randomHex(bytes = 16) {
  return toHex(crypto.getRandomValues(new Uint8Array(bytes)));
}

async function hashPin(pin: string, saltHex: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(pin), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: enc.encode(saltHex), iterations: PBKDF2_ITER },
    key,
    256,
  );
  return toHex(bits);
}

function sameString(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Teilt einen String in Stücke, ohne ein UTF-16-Surrogatpaar zu zerreißen.
function splitChunks(s: string) {
  const parts: string[] = [];
  let i = 0;
  while (i < s.length) {
    let end = Math.min(i + CHUNK_CHARS, s.length);
    const c = s.charCodeAt(end - 1);
    if (end < s.length && c >= 0xd800 && c <= 0xdbff) end -= 1;
    parts.push(s.slice(i, end));
    i = end;
  }
  return parts.length ? parts : [""];
}

// ---------- Schema ----------

let ready: Promise<void> | null = null;

function ensureSchema(DB: any) {
  if (!ready) {
    ready = (async () => {
      await DB.prepare(
        "CREATE TABLE IF NOT EXISTS kids (name VARCHAR(40) NOT NULL PRIMARY KEY, pin_hash VARCHAR(100), pin_salt VARCHAR(40), fails INT NOT NULL DEFAULT 0, locked_until BIGINT NOT NULL DEFAULT 0)",
      ).run();
      await DB.prepare("CREATE TABLE IF NOT EXISTS config (k VARCHAR(40) NOT NULL PRIMARY KEY, v VARCHAR(200))").run();
      await DB.prepare(
        "CREATE TABLE IF NOT EXISTS blobs (owner VARCHAR(64) NOT NULL, k VARCHAR(40) NOT NULL, ver VARCHAR(40) NOT NULL, nchunks INT NOT NULL, updated_at VARCHAR(40), PRIMARY KEY (owner, k))",
      ).run();
      await DB.prepare(
        "CREATE TABLE IF NOT EXISTS chunks (owner VARCHAR(64) NOT NULL, k VARCHAR(40) NOT NULL, ver VARCHAR(40) NOT NULL, idx INT NOT NULL, v MEDIUMTEXT, PRIMARY KEY (owner, k, ver, idx))",
      ).run();
      for (const name of KIDS) {
        await DB.prepare("INSERT IGNORE INTO kids (name) VALUES (?)").bind(name).run();
      }
      await DB.prepare("INSERT IGNORE INTO config (k, v) VALUES ('secret', ?)").bind(randomHex(32)).run();
    })().catch((e) => {
      ready = null;
      throw e;
    });
  }
  return ready;
}

async function getConfig(DB: any, k: string): Promise<string | null> {
  const row = await DB.prepare("SELECT v FROM config WHERE k = ?").bind(k).first();
  return row ? row.v : null;
}

async function setConfig(DB: any, k: string, v: string) {
  await DB.prepare("INSERT INTO config (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)").bind(k, v).run();
}

// ---------- Tokens (HMAC-signiert) ----------

async function hmacKey(DB: any) {
  const secret = await getConfig(DB, "secret");
  if (!secret) throw new Error("secret missing");
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function signToken(DB: any, payload: Record<string, unknown>) {
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(DB), enc.encode(body));
  return `${body}.${b64url(new Uint8Array(sig))}`;
}

async function readToken(DB: any, request: Request): Promise<{ role: "kid" | "parent"; name?: string } | null> {
  const auth = request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify("HMAC", await hmacKey(DB), fromB64url(sig), enc.encode(body));
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(body)));
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    if (payload.role === "kid" && KIDS.includes(payload.name)) return { role: "kid", name: payload.name };
    if (payload.role === "parent") return { role: "parent" };
    return null;
  } catch {
    return null;
  }
}

// ---------- Blobs (versioniert, gestückelt) ----------

async function writeBlob(DB: any, owner: string, key: string, value: unknown) {
  if (value === null || value === undefined) {
    await DB.prepare("DELETE FROM blobs WHERE owner = ? AND k = ?").bind(owner, key).run();
    await DB.prepare("DELETE FROM chunks WHERE owner = ? AND k = ?").bind(owner, key).run();
    return;
  }
  const parts = splitChunks(JSON.stringify(value));
  const ver = randomHex(12);
  for (let i = 0; i < parts.length; i++) {
    await DB.prepare("INSERT INTO chunks (owner, k, ver, idx, v) VALUES (?, ?, ?, ?, ?)")
      .bind(owner, key, ver, i, parts[i])
      .run();
  }
  await DB.prepare(
    "INSERT INTO blobs (owner, k, ver, nchunks, updated_at) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE ver = VALUES(ver), nchunks = VALUES(nchunks), updated_at = VALUES(updated_at)",
  )
    .bind(owner, key, ver, parts.length, new Date().toISOString())
    .run();
  await DB.prepare("DELETE FROM chunks WHERE owner = ? AND k = ? AND ver <> ?").bind(owner, key, ver).run();
}

async function readAllBlobs(DB: any) {
  const { results } = await DB.prepare(
    "SELECT b.owner AS owner, b.k AS k, b.nchunks AS n, c.idx AS idx, c.v AS v FROM blobs b JOIN chunks c ON c.owner = b.owner AND c.k = b.k AND c.ver = b.ver ORDER BY b.owner, b.k, c.idx",
  ).all();
  const grouped = new Map<string, { owner: string; k: string; n: number; parts: string[] }>();
  for (const r of results || []) {
    const id = `${r.owner}\u0000${r.k}`;
    if (!grouped.has(id)) grouped.set(id, { owner: r.owner, k: r.k, n: Number(r.n), parts: [] });
    grouped.get(id)!.parts.push(r.v ?? "");
  }
  const owners: Record<string, Record<string, unknown>> = {};
  for (const g of grouped.values()) {
    if (g.parts.length !== g.n) continue; // unvollständig -> überspringen
    try {
      (owners[g.owner] ||= {})[g.k] = JSON.parse(g.parts.join(""));
    } catch {
      // defekter Eintrag -> überspringen
    }
  }
  return owners;
}

// ---------- PIN-Prüfung mit Sperre ----------

function validKidPin(pin: unknown): pin is string {
  return typeof pin === "string" && /^\d{4}$/.test(pin);
}

function validParentPin(pin: unknown): pin is string {
  return typeof pin === "string" && /^\d{4,8}$/.test(pin);
}

async function kidLogin(DB: any, name: unknown, pin: unknown) {
  if (typeof name !== "string" || !KIDS.includes(name)) return json({ error: "Unbekanntes Profil" }, 404);
  if (!validKidPin(pin)) return json({ error: "Die PIN muss aus 4 Ziffern bestehen." }, 400);
  const kid = await DB.prepare("SELECT pin_hash, pin_salt, fails, locked_until FROM kids WHERE name = ?").bind(name).first();
  if (!kid) return json({ error: "Unbekanntes Profil" }, 404);
  const now = Date.now();
  if (Number(kid.locked_until) > now) {
    return json({ error: "Zu viele Versuche.", retryInSeconds: Math.ceil((Number(kid.locked_until) - now) / 1000) }, 423);
  }
  let firstTime = false;
  if (!kid.pin_hash) {
    const salt = randomHex(16);
    await DB.prepare("UPDATE kids SET pin_hash = ?, pin_salt = ?, fails = 0, locked_until = 0 WHERE name = ?")
      .bind(await hashPin(pin, salt), salt, name)
      .run();
    firstTime = true;
  } else if (!sameString(await hashPin(pin, kid.pin_salt), kid.pin_hash)) {
    const fails = Number(kid.fails) + 1;
    const locked = fails >= MAX_FAILS ? now + LOCK_MS : 0;
    await DB.prepare("UPDATE kids SET fails = ?, locked_until = ? WHERE name = ?").bind(locked ? 0 : fails, locked, name).run();
    if (locked) return json({ error: "Zu viele Versuche.", retryInSeconds: LOCK_MS / 1000 }, 423);
    return json({ error: "Falsche PIN.", remaining: MAX_FAILS - fails }, 401);
  } else {
    await DB.prepare("UPDATE kids SET fails = 0, locked_until = 0 WHERE name = ?").bind(name).run();
  }
  const token = await signToken(DB, { role: "kid", name, exp: now + KID_TOKEN_MS });
  return json({ token, name, firstTime });
}

async function parentLogin(DB: any, pin: unknown) {
  if (!validParentPin(pin)) return json({ error: "Die Eltern-PIN muss aus 4 bis 8 Ziffern bestehen." }, 400);
  const now = Date.now();
  const lockedUntil = Number((await getConfig(DB, "parent_locked_until")) || 0);
  if (lockedUntil > now) {
    return json({ error: "Zu viele Versuche.", retryInSeconds: Math.ceil((lockedUntil - now) / 1000) }, 423);
  }
  const hash = await getConfig(DB, "parent_pin_hash");
  let firstTime = false;
  if (!hash) {
    const salt = randomHex(16);
    await setConfig(DB, "parent_pin_salt", salt);
    await setConfig(DB, "parent_pin_hash", await hashPin(pin, salt));
    firstTime = true;
  } else {
    const salt = (await getConfig(DB, "parent_pin_salt")) || "";
    if (!sameString(await hashPin(pin, salt), hash)) {
      const fails = Number((await getConfig(DB, "parent_fails")) || 0) + 1;
      if (fails >= MAX_FAILS) {
        await setConfig(DB, "parent_fails", "0");
        await setConfig(DB, "parent_locked_until", String(now + LOCK_MS));
        return json({ error: "Zu viele Versuche.", retryInSeconds: LOCK_MS / 1000 }, 423);
      }
      await setConfig(DB, "parent_fails", String(fails));
      return json({ error: "Falsche PIN.", remaining: MAX_FAILS - fails }, 401);
    }
  }
  await setConfig(DB, "parent_fails", "0");
  const token = await signToken(DB, { role: "parent", exp: now + PARENT_TOKEN_MS });
  return json({ token, firstTime });
}

// ---------- Router ----------

async function handle(request: Request, context: Ctx) {
  const DB = context.env?.DB;
  if (!DB) return json({ error: "Keine Datenbank verfügbar" }, 500);
  await ensureSchema(DB);
  const action = context.params?.action;
  const method = request.method;
  const body = method === "POST" || method === "PUT" ? await request.json().catch(() => ({})) : {};

  if (action === "kids" && method === "GET") {
    const { results } = await DB.prepare("SELECT name, pin_hash FROM kids").all();
    const byName = new Map((results || []).map((r: any) => [r.name, !!r.pin_hash]));
    const parentSet = !!(await getConfig(DB, "parent_pin_hash"));
    return json({ kids: KIDS.map((name) => ({ name, hasPin: !!byName.get(name) })), parentPinSet: parentSet });
  }
  if (action === "login" && method === "POST") return kidLogin(DB, body.name, body.pin);
  if (action === "parent" && method === "POST") return parentLogin(DB, body.pin);

  const who = await readToken(DB, request);
  if (!who) return json({ error: "Nicht angemeldet" }, 401);

  if (action === "me" && method === "GET") return json(who);

  if (action === "state" && method === "GET") {
    return json({ owners: await readAllBlobs(DB) });
  }

  if (action === "state" && method === "PUT") {
    const items = Array.isArray(body.items) ? body.items : [];
    for (const it of items) {
      const owner = it?.owner;
      const key = it?.key;
      if (typeof owner !== "string" || !owner || owner.length > 64 || typeof key !== "string") {
        return json({ error: "Ungültiger Eintrag" }, 400);
      }
      const isFamily = owner === FAMILY;
      const keyOk = isFamily ? FAMILY_KEYS.includes(key) : KID_KEYS.includes(key);
      if (!keyOk) return json({ error: `Unbekannter Schlüssel: ${key}` }, 400);
      if (who.role === "kid" && (isFamily || owner !== who.name)) {
        return json({ error: "Keine Berechtigung" }, 403);
      }
    }
    for (const it of items) await writeBlob(DB, it.owner, it.key, it.value);
    return json({ ok: true, written: items.length });
  }

  if (who.role !== "parent") return json({ error: "Nur für Eltern" }, 403);

  if (action === "reset-pin" && method === "POST") {
    if (!KIDS.includes(body.name)) return json({ error: "Unbekanntes Profil" }, 404);
    await DB.prepare("UPDATE kids SET pin_hash = NULL, pin_salt = NULL, fails = 0, locked_until = 0 WHERE name = ?")
      .bind(body.name)
      .run();
    return json({ ok: true });
  }

  if (action === "clear" && method === "POST") {
    await DB.prepare("DELETE FROM chunks").run();
    await DB.prepare("DELETE FROM blobs").run();
    return json({ ok: true });
  }

  return json({ error: "Nicht gefunden" }, 404);
}

async function safe(request: Request, context: Ctx) {
  try {
    return await handle(request, context);
  } catch (e: any) {
    return json({ error: "Serverfehler", detail: String(e?.message ?? e) }, 500);
  }
}

export const GET = safe;
export const POST = safe;
export const PUT = safe;
