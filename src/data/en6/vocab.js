// Englisch Klasse 6 – Vokabeln (Band 2 des Englisch-Lehrwerks; der Name steht nirgends im Repo).
// Quelle: Vokabelteil des Buchs (S. 195–198) + Vokabelheft der Kinder (siehe VOCAB_EN6_U1_review.md).
// Diese Datei hat KEINE Importe, damit scripts/export-audio-manifest.mjs sie direkt mit Node lesen kann.
//
// Aufbau wie src/data/fr6/vocab.js: Jede Lieferung ist ein BATCH mit dem Datum, an dem sie ins Quiz
// kam (`added`). „Nur neue Vokabeln“ filtert den Wortschatz auf den jüngsten Batch.
// Felder pro Eintrag: en, de, optional alt (weitere richtige engl. Antworten),
// altDe (weitere richtige dt. Antworten), say (gesprochener Text, falls abweichend).

export const COURSE = 'en-6';

const BATCHES = [
  {
    exam: 'en6-u1',
    added: '2026-10-11',
    sections: [
      {
        section: 'Unit 1 – Check-in',
        items: [
          { en: 'embarrassing', de: 'peinlich' },
          { en: 'to end up', de: 'enden; landen' },
          { en: 'yearbook', de: 'Jahrbuch' },
          { en: 'real', de: 'echt; richtig; wirklich' },
          { en: 'show-off', de: 'Angeber/-in', say: 'show-off' },
          { en: 'art', de: 'Kunst' },
          { en: 'what a …', de: 'was für ein/-e …; welch ein/-e …', alt: ['what a'], say: 'what a' },
          { en: 'home town', de: 'Heimatstadt', alt: ['hometown'] },
          { en: 'likes and dislikes', de: 'Vorlieben und Abneigungen' },
          { en: 'huge', de: 'riesig; riesengroß; gewaltig' },
          { en: 'field', de: 'Feld; Wiese; Weide; Acker' },
          { en: 'hill', de: 'Berg; Hügel' },
          { en: 'outdoors', de: 'draußen; im Freien' },
          { en: 'indoors', de: 'drinnen; im Haus' },
          { en: 'to hang out (with) (infml)', de: 'rumhängen (mit); sich herumtreiben (mit); sich treffen (mit)', alt: ['to hang out with'], say: 'to hang out with' },
          { en: 'mall', de: 'Einkaufszentrum', alt: ['shopping mall'] },
          { en: 'eagle', de: 'Adler' },
          { en: 'feeling', de: 'Gefühl' },
          { en: 'embarrassed', de: 'verlegen' },
          { en: 'nervous', de: 'nervös; aufgeregt' },
          { en: 'proud (of)', de: 'stolz (auf)', say: 'proud of' },
          { en: 'report', de: 'Bericht; Meldung' },
          { en: 'during (+ noun)', de: 'während (+ Nomen)', say: 'during' },
        ],
      },
      {
        section: 'Unit 1 – Station 1',
        items: [
          { en: 'actually', de: 'tatsächlich; wirklich; eigentlich' },
          { en: 'barrel', de: 'Fass; Tonne' },
          { en: 'race', de: 'Wettlauf; Rennen' },
          { en: 'daughter', de: 'Tochter' },
          { en: 'wheelchair', de: 'Rollstuhl' },
          { en: 'to teach', de: 'unterrichten; lehren; beibringen' },
          { en: 'to tease sb', de: 'jmdn. aufziehen; jmdn. hänseln; jmdn. ärgern', alt: ['to tease'], say: 'to tease somebody' },
          { en: 'latest', de: 'neueste/-r/-s' },
          { en: 'movie (AE)', de: 'Film', alt: ['film'], say: 'movie' },
          { en: 'movie theater (AE)', de: 'Kino (amerik.)', alt: ['cinema'], say: 'movie theater' },
          { en: "There's nothing more exciting than …", de: 'Es gibt nichts Spannenderes als …', alt: ['There is nothing more exciting than'], say: "There's nothing more exciting than" },
          { en: 'bird', de: 'Vogel' },
          { en: 'air', de: 'Luft' },
          { en: 'a bit', de: 'ein bisschen; ein wenig' },
          { en: 'worried', de: 'beunruhigt; besorgt' },
          { en: 'to move (house)', de: 'umziehen', say: 'to move house' },
          { en: 'to worry', de: 'sich Sorgen machen' },
          { en: 'plan', de: 'Plan; Entwurf' },
          { en: 'life (pl lives)', de: 'Leben', alt: ['lives'], say: 'life, lives' },
          { en: 'to have to', de: 'müssen' },
          { en: 'to tell', de: 'erkennen; wissen' },
          { en: 'to point', de: 'zeigen' },
          { en: 'bench', de: 'Bank; Sitzbank' },
          { en: 'to grow up', de: 'aufwachsen; erwachsen werden' },
        ],
      },
      {
        // Kasten „Numbers“ (S. 197), im Heft am 09.10. eingetragen.
        section: 'Unit 1 – Numbers',
        items: [
          { en: 'one thousand', de: 'eintausend', alt: ['a thousand'], altDe: ['tausend', '1000', '1.000'] },
          { en: 'ten thousand', de: 'zehntausend', altDe: ['10000', '10.000'] },
          { en: 'one hundred thousand', de: 'hunderttausend', alt: ['a hundred thousand'], altDe: ['einhunderttausend', '100000', '100.000'] },
          { en: 'one million', de: 'eine Million', alt: ['a million'], altDe: ['1000000', '1.000.000'] },
          // Kein '1,5' als Alternative: Komma trennt im Antwort-Check Alternativen.
          { en: 'one point five', de: 'eins Komma fünf' },
        ],
      },
      {
        // Kasten „City and country“ (S. 197).
        section: 'Unit 1 – City and country',
        items: [
          { en: 'noise', de: 'Lärm' },
          { en: 'pollution', de: 'Verschmutzung' },
          { en: 'traffic jam', de: 'Stau' },
          { en: 'shopping mall', de: 'Einkaufszentrum', alt: ['mall'] },
          { en: 'event', de: 'Veranstaltung' },
          { en: 'public transport', de: 'öffentlicher Nahverkehr' },
          { en: 'cheap', de: 'billig' },
          { en: 'expensive', de: 'teuer' },
          { en: 'far away', de: 'weit entfernt' },
          { en: 'space', de: 'Platz' },
          { en: 'pet', de: 'Haustier' },
          { en: 'outdoor activity', de: 'Freiluftaktivität' },
        ],
      },
      {
        section: 'Unit 1 – Station 2 (bis „to fix“)',
        items: [
          { en: 'youth', de: 'Jugend' },
          { en: 'close', de: 'nahe' },
          { en: 'almost', de: 'fast; beinahe' },
          { en: 'judge', de: 'Juror/-in; Richter/-in' },
          { en: 'point', de: 'Punkt; Komma (bei Zahlenangaben)' },
          { en: 'second', de: 'Sekunde' },
          { en: 'turn', de: 'Wendung; Drehung' },
          { en: 'poor', de: 'arm' },
          { en: 'to get', de: 'werden' },
          { en: 'to fall off', de: 'herunterfallen; hinunterfallen' },
          { en: 'mad', de: 'verrückt; wütend' },
          { en: 'What a shame!', de: 'Wie schade!' },
          { en: 'to train', de: 'trainieren' },
          { en: 'to fix', de: 'reparieren; befestigen' },
        ],
      },
    ],
  },
];

function slug(s) {
  return s
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40);
}

// Was gesprochen wird: ohne Hinweise in Klammern und ohne „…“.
export function speechText(entry) {
  if (entry.say) return entry.say;
  return entry.en.replace(/\([^)]*\)/g, '').replace(/…/g, '').replace(/\s+/g, ' ').trim();
}

export const EN6_VOCAB = BATCHES.flatMap((batch) =>
  batch.sections.flatMap((sec) =>
    sec.items.map((item) => ({
      ...item,
      id: `en6_${slug(item.en)}`,
      exam: batch.exam,
      added: batch.added,
      section: sec.section,
    })),
  ),
);

// Doppelte IDs würden Lernhistorie und Audio vermischen → sofort laut scheitern.
const seen = new Set();
for (const v of EN6_VOCAB) {
  if (seen.has(v.id)) throw new Error(`Doppelte Vokabel-ID: ${v.id}`);
  seen.add(v.id);
}
