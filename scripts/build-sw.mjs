// Erzeugt dist/sw.js (Offline-Nutzung) aus scripts/sw-template.js – läuft nach `vite build` (npm run build).
// Liste der App-Dateien und der Aufnahmen (mit Inhalts-Hash) kommt aus dist/.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else files.push(relative(dist, full).split(sep).join('/'));
  }
};
walk(dist);

const hash = (path) => createHash('sha1').update(readFileSync(join(dist, path))).digest('hex').slice(0, 12);
const shell = files.filter((f) => !f.startsWith('audio/') && f !== 'sw.js').sort();
const audio = Object.fromEntries(files.filter((f) => f.startsWith('audio/') && f.endsWith('.m4a')).sort().map((f) => [f, hash(f)]));
const fontCss = (readFileSync(join(dist, 'index.html'), 'utf8').match(/href="(https:\/\/fonts\.googleapis\.com\/css2[^"]+)"/) || [])[1] || '';
const version = createHash('sha1')
  .update(shell.map((f) => `${f}:${hash(f)}`).join('\n'))
  .update(JSON.stringify(audio))
  .digest('hex')
  .slice(0, 12);

// Nur die Zuweisungen ersetzen (die Platzhalter stehen auch im /* global */-Kommentar der Vorlage).
const values = {
  VERSION: JSON.stringify(version),
  SHELL: JSON.stringify(shell),
  AUDIO: JSON.stringify(audio),
  FONT_CSS: JSON.stringify(fontCss.replace(/&amp;/g, '&')),
};
let sw = readFileSync(new URL('./sw-template.js', import.meta.url), 'utf8');
for (const [name, value] of Object.entries(values)) {
  const assignment = new RegExp(`^const ${name} = '?__${name}__'?;`, 'm');
  if (!assignment.test(sw)) throw new Error(`sw-template.js: Zuweisung für ${name} fehlt`);
  sw = sw.replace(assignment, () => `const ${name} = ${value};`);
}
// Kein Platzhalter darf im Code übrig bleiben, sonst startet der Service Worker nicht.
const code = sw.replace(/\/\*[\s\S]*?\*\//g, '');
if (/__[A-Z_]+__/.test(code)) throw new Error('sw.js: Platzhalter nicht ersetzt');
writeFileSync(join(dist, 'sw.js'), sw);
console.log(`sw.js: Version ${version} · ${shell.length} App-Dateien · ${Object.keys(audio).length} Aufnahmen`);
