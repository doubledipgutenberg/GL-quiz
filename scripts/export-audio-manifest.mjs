// Schreibt das Audio-Manifest eines Kurses (Eingabe für scripts/generate-audio.py).
//   node scripts/export-audio-manifest.mjs fr-6 /pfad/manifest.json
// Liest die Vokabel-Datei des Kurses direkt (sie hat absichtlich keine Importe).
import { writeFileSync } from 'node:fs';

const SOURCES = {
  'fr-6': { module: '../src/data/fr6/vocab.js', list: 'FR6_VOCAB', lang: 'fr' },
  'en-6': { module: '../src/data/en6/vocab.js', list: 'EN6_VOCAB', lang: 'en' },
};

const [course, out] = process.argv.slice(2);
const src = SOURCES[course];
if (!src || !out) {
  console.error(`Aufruf: node scripts/export-audio-manifest.mjs <${Object.keys(SOURCES).join('|')}> <manifest.json>`);
  process.exit(1);
}

const mod = await import(new URL(src.module, import.meta.url));
// Pro Vokabel das Wort, dazu – falls gepflegt – der Beispielsatz für die Hör-Karte (<id>_ex).
// sayEx = gesprochener Satz, falls er abweichen soll (z. B. „BD“ liest die Sprachausgabe sonst als „boulevard“);
// sayExPhonemes = Laute des Satzes direkt (wie sayPhonemes beim Wort, z. B. „sac à dos“ sonst mit englischem „DOS“).
const items = mod[src.list].flatMap((v) => [
  { id: v.id, text: mod.speechText(v), lang: src.lang, kind: 'word', ...(v.sayPhonemes ? { phonemes: v.sayPhonemes } : {}) },
  ...(v.ex
    ? [{ id: `${v.id}_ex`, text: v.sayEx || mod.exampleText(v), lang: src.lang, kind: 'sentence', ...(v.sayExPhonemes ? { phonemes: v.sayExPhonemes } : {}) }]
    : []),
]);
writeFileSync(out, JSON.stringify({ course, items }, null, 2));
console.log(`${course}: ${items.length} Einträge → ${out}`);
