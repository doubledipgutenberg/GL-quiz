// Wertet den „Antwort-Review“ aus (Lehrer-Bereich → „Antwort-Review exportieren“).
//   node scripts/review-flags.mjs ~/Downloads/antwort-review-2026-10-12.json
//
// Kinder melden im Wortschatz falsch gewertete Antworten als „Na ja, schon fast richtig“; die Eltern
// urteilen im Lehrer-Bereich „Doch richtig“ oder „Falsch“. Dieses Skript prüft jedes Urteil gegen den
// AKTUELLEN Antwort-Check (src/utils/scoring.js) und die aktuellen Fragen/Vokabeln:
//   ❗ „Doch richtig“, aber weiterhin abgelehnt  → Alternative ergänzen (alt/altDe/alternativeCorrect)
//                                                  oder eine allgemeine Regel im Matcher anpassen
//   ⚠️ „Falsch“, aber inzwischen akzeptiert      → der Check ist zu großzügig geworden
//   ✓  passt
// Danach Änderungen machen, Skript erneut laufen lassen, bis keine ❗/⚠️ mehr übrig sind.
import { readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const file = process.argv[2];
if (!file) {
  console.error('Aufruf: node scripts/review-flags.mjs <antwort-review-….json>');
  process.exit(1);
}
const data = JSON.parse(readFileSync(file, 'utf8'));
const flags = Array.isArray(data.flags) ? data.flags : [];

// Fragen und Antwort-Check der App laden (gebündelt, weil die App-Dateien Imports ohne Endung nutzen).
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(tmpdir(), `review-flags-${process.pid}.mjs`);
await build({
  stdin: {
    contents:
      "export { default as questions, getVocabularyQuestions } from './src/data/questions.js';\n" +
      "export { checkAnswer } from './src/utils/scoring.js';\n",
    resolveDir: root,
    loader: 'js',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: out,
  alias: { '@': join(root, 'src') },
  loader: { '.svg': 'empty', '.png': 'empty', '.jpg': 'empty' },
  logLevel: 'error',
});
const { questions, getVocabularyQuestions, checkAnswer } = await import(pathToFileURL(out).href);
rmSync(out, { force: true });

const byId = new Map([...questions, ...getVocabularyQuestions()].map((q) => [q.id, q]));

// Hinweise, woran es liegt – damit der Agent zwischen Einzelfall (Alternative) und Regel unterscheiden kann.
const fold = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9äöüß ]+/g, ' ').replace(/\s+/g, ' ').trim();
function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
function hints(q, answer) {
  const options = [q.correct, ...(q.alternativeCorrect || [])].flatMap((o) => String(o).split(/[;,]/)).map((o) => o.trim()).filter(Boolean);
  const out = [];
  if (options.some((o) => o === String(answer).trim())) out.push('stimmt exakt mit einer Option überein');
  else if (options.some((o) => fold(o) === fold(answer))) out.push('unterscheidet sich nur in Akzenten/Satzzeichen/Groß-Klein');
  const best = Math.min(...options.map((o) => distance(fold(o), fold(answer))));
  if (best > 0 && best <= 2) out.push(`Tippfehler-Abstand ${best}`);
  if (options.some((o) => fold(answer).includes(fold(o)) || fold(o).includes(fold(answer)))) out.push('Teil der erwarteten Antwort bzw. enthält sie');
  return out;
}

const rows = { todo: [], warn: [], ok: [], open: [], gone: [] };
for (const f of flags) {
  const q = byId.get(f.questionId);
  if (!f.verdict) {
    rows.open.push(f);
    continue;
  }
  if (!q) {
    rows.gone.push(f);
    continue;
  }
  const accepted = checkAnswer(q, f.userAnswer);
  const entry = { f, q, accepted, hints: hints(q, f.userAnswer) };
  if (f.verdict === 'correct' && !accepted) rows.todo.push(entry);
  else if (f.verdict === 'wrong' && accepted) rows.warn.push(entry);
  else rows.ok.push(entry);
}

const line = ({ f, q, hints: h }) =>
  `- \`${f.questionId}\` (${f.student}, ${f.answerLang || q.answerLang || '–'}): „${f.userAnswer}“ – erwartet „${q.correct}“` +
  (q.alternativeCorrect?.length ? ` (auch: ${q.alternativeCorrect.join(' | ')})` : '') +
  (h.length ? `\n  Hinweis: ${h.join('; ')}` : '');

console.log(`# Antwort-Review – ${flags.length} Meldungen (Export ${data.exportedAt || '?'})\n`);
console.log(`## ❗ „Doch richtig“, aber weiterhin abgelehnt (${rows.todo.length})`);
console.log(rows.todo.map(line).join('\n') || '–');
console.log(`\n## ⚠️ „Falsch“, aber inzwischen akzeptiert (${rows.warn.length})`);
console.log(rows.warn.map(line).join('\n') || '–');
console.log(`\n## ✓ Passt (${rows.ok.length})`);
console.log(`\n## Noch ohne Urteil (${rows.open.length})`);
console.log(rows.open.map((f) => `- \`${f.questionId}\` (${f.student}): „${f.userAnswer}“ – erwartet „${f.correctAnswer}“`).join('\n') || '–');
if (rows.gone.length) {
  console.log(`\n## Frage gibt es nicht mehr (${rows.gone.length})`);
  console.log(rows.gone.map((f) => `- \`${f.questionId}\``).join('\n'));
}
