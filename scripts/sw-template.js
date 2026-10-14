/* Service Worker der Lern-Quiz-App – Offline-Nutzung (z. B. iPad, „Zum Home-Bildschirm“).
 * Wird beim Build aus scripts/sw-template.js erzeugt (scripts/build-sw.mjs) – nicht von Hand ändern.
 *
 * - App (index.html, JS, CSS, Bilder): beim Installieren komplett zwischengespeichert, pro Build eine Version.
 * - Seitenaufruf: erst Netz (damit Updates und die Spacefast-Passwortseite ankommen), ohne Netz die
 *   gespeicherte App. Die Passwortseite wird NIE als App gespeichert (Prüfung auf APP_MARKER).
 * - Aufnahmen (audio/…m4a): nach dem Installieren im Hintergrund geladen; Schlüssel mit Inhalts-Hash,
 *   damit neu erzeugte Aufnahmen die alten ersetzen.
 * - Schriften (Google Fonts): beim ersten Laden zwischengespeichert.
 * - /api/ läuft nie über den Zwischenspeicher.
 */
/* global __SHELL__, __AUDIO__, __FONT_CSS__ -- Platzhalter, ersetzt von scripts/build-sw.mjs */
const VERSION = '__VERSION__';
const SHELL = __SHELL__;
const AUDIO = __AUDIO__; // { "audio/fr-6/fr6_oui.m4a": "<hash>", … }
const FONT_CSS = __FONT_CSS__;
const APP_MARKER = 'id="root"';

const SHELL_CACHE = `lernquiz-shell-${VERSION}`;
const AUDIO_CACHE = 'lernquiz-audio';
const FONT_CACHE = 'lernquiz-fonts';

const scopeUrl = (path) => new URL(path, self.registration.scope).href;
// Nie eine HTML-Seite als Datei speichern (z. B. die Spacefast-Passwortseite statt einer Aufnahme).
const storable = (res) => res.ok && !(res.headers.get('content-type') || '').includes('text/html');
const audioKey = (path) => `${scopeUrl(path)}?v=${AUDIO[path]}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await cache.addAll(SHELL.map((p) => new Request(scopeUrl(p), { cache: 'reload' })));
      // Sicherheitsnetz: Wenn statt der App die Passwortseite kam, nicht installieren.
      const index = await cache.match(scopeUrl('index.html'));
      if (!index || !(await index.clone().text()).includes(APP_MARKER)) {
        await caches.delete(SHELL_CACHE);
        throw new Error('index.html ist nicht die App (Passwortseite?)');
      }
      await self.skipWaiting();
    })(),
  );
});

async function fillAudio() {
  const cache = await caches.open(AUDIO_CACHE);
  const wanted = new Set(Object.keys(AUDIO).map(audioKey));
  for (const req of await cache.keys()) if (!wanted.has(req.url)) await cache.delete(req);
  const missing = [];
  for (const path of Object.keys(AUDIO)) if (!(await cache.match(audioKey(path)))) missing.push(path);
  // Höchstens 4 gleichzeitig; Fehler (z. B. offline) einfach überspringen – beim nächsten Start weiter.
  let i = 0;
  const worker = async () => {
    while (i < missing.length) {
      const path = missing[i++];
      try {
        const res = await fetch(scopeUrl(path), { cache: 'no-cache' });
        if (storable(res)) await cache.put(audioKey(path), res);
      } catch {
        /* offline – später */
      }
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
}

async function fillFonts() {
  if (!FONT_CSS) return;
  try {
    const cache = await caches.open(FONT_CACHE);
    if (await cache.match(FONT_CSS)) return;
    const css = await fetch(FONT_CSS, { mode: 'cors' });
    if (!storable(css)) return;
    const text = await css.clone().text();
    await cache.put(FONT_CSS, css);
    const urls = [...text.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map((m) => m[1]);
    for (const u of urls) {
      try {
        const r = await fetch(u, { mode: 'cors' });
        if (storable(r)) await cache.put(u, r);
      } catch {
        /* später */
      }
    }
  } catch {
    /* offline – später */
  }
}

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith('lernquiz-shell-') && key !== SHELL_CACHE) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
  // Aufnahmen und Schriften im Hintergrund nachladen, ohne die Aktivierung aufzuhalten.
  fillAudio();
  fillFonts();
});

self.addEventListener('message', (event) => {
  if (event.data === 'fill') event.waitUntil(Promise.all([fillAudio(), fillFonts()]));
});

async function fromNetworkOrApp(request) {
  try {
    const res = await fetch(request);
    return res; // auch die Passwortseite – online soll man sich anmelden können
  } catch {
    const cache = await caches.open(SHELL_CACHE);
    return (await cache.match(scopeUrl('index.html'))) || Response.error();
  }
}

async function cacheFirst(cacheName, key, request) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(key);
  if (hit) return hit;
  const res = await fetch(request);
  if (storable(res)) await cache.put(key, res.clone());
  return res;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(cacheFirst(FONT_CACHE, request.url, request));
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes('/api/')) return; // Server-Schnittstelle nie zwischenspeichern

  if (request.mode === 'navigate') {
    event.respondWith(fromNetworkOrApp(request));
    return;
  }

  const path = url.href.startsWith(self.registration.scope) ? url.href.slice(self.registration.scope.length).split('?')[0] : null;
  if (path && AUDIO[path]) {
    event.respondWith(cacheFirst(AUDIO_CACHE, audioKey(path), request));
    return;
  }
  if (path && SHELL.includes(path)) {
    event.respondWith(caches.open(SHELL_CACHE).then(async (c) => (await c.match(scopeUrl(path))) || fetch(request)));
  }
});
