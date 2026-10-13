// Englisch Klasse 6 – Vokabeln (Band 2 des Englisch-Lehrwerks; der Name steht nirgends im Repo).
// Quelle: Vokabelteil des Buchs (S. 195–198) + Vokabelheft der Kinder (siehe VOCAB_EN6_U1_review.md).
// Diese Datei hat KEINE Importe, damit scripts/export-audio-manifest.mjs sie direkt mit Node lesen kann.
//
// Aufbau wie src/data/fr6/vocab.js: Jede Lieferung ist ein BATCH mit dem Datum, an dem sie ins Quiz
// kam (`added`). „Nur neue Vokabeln“ filtert den Wortschatz auf den jüngsten Batch.
// Felder pro Eintrag: en, de, optional alt (weitere richtige engl. Antworten),
// altDe (weitere richtige dt. Antworten), say (gesprochener Text, falls abweichend), sayPhonemes (Laute
// direkt, wenn Kokoro falsch ausspricht – z. B. „what a“ sonst mit Buchstaben-A /eɪ/),
// ex (kurzer Beispielsatz, eigene Formulierung – wird bei Hör-Karten nach dem Wort vorgelesen;
// die [Klammer] markiert die Lücke für den Lückentext, siehe gapOf).

export const COURSE = 'en-6';

const BATCHES = [
  {
    exam: 'en6-u1',
    added: '2026-10-11',
    sections: [
      {
        section: 'Unit 1 – Check-in',
        items: [
          { en: 'embarrassing', de: 'peinlich', ex: 'Oh no, this photo is so [embarrassing]!' },
          { en: 'to end up', de: 'enden; landen', ex: 'Our ball [ended up] in the river.' },
          { en: 'yearbook', de: 'Jahrbuch', ex: "There's a funny photo of me in the [yearbook]." },
          { en: 'real', de: 'echt; richtig; wirklich', ex: 'Is that a [real] eagle?' },
          { en: 'show-off', de: 'Angeber/-in', say: 'show-off', ex: "Don't be such a [show-off]!" },
          { en: 'art', de: 'Kunst', ex: '[Art] is my favourite subject.' },
          { en: 'what a …', de: 'was für ein/-e …; welch ein/-e …', alt: ['what a'], say: 'what a', sayPhonemes: 'wˈɒt ə', ex: '[What a] nice surprise!' },
          { en: 'home town', de: 'Heimatstadt', alt: ['hometown'], ex: 'My [home town] is small but nice.' },
          { en: 'likes and dislikes', de: 'Vorlieben und Abneigungen', ex: 'Tell me about your [likes and dislikes].' },
          { en: 'huge', de: 'riesig; riesengroß; gewaltig', ex: 'Their new house is [huge]!' },
          { en: 'field', de: 'Feld; Wiese; Weide; Acker', ex: 'There are three horses in the [field].' },
          { en: 'hill', de: 'Berg; Hügel', ex: 'We walked up the [hill].' },
          { en: 'outdoors', de: 'draußen; im Freien', ex: 'In summer we often eat [outdoors].' },
          { en: 'indoors', de: 'drinnen; im Haus', ex: "It's raining, so let's play [indoors]." },
          { en: 'to hang out (with) (infml)', de: 'rumhängen (mit); sich herumtreiben (mit); sich treffen (mit)', alt: ['to hang out with'], say: 'to hang out with', ex: 'I like [to hang out] with my friends at the weekend.' },
          { en: 'mall', de: 'Einkaufszentrum', alt: ['shopping mall'], ex: "Let's meet at the [mall]." },
          { en: 'eagle', de: 'Adler', ex: 'The [eagle] is flying over the hill.' },
          { en: 'feeling', de: 'Gefühl', ex: 'I have a good [feeling] about the race.' },
          { en: 'embarrassed', de: 'verlegen', ex: 'I was so [embarrassed] when I fell.' },
          { en: 'nervous', de: 'nervös; aufgeregt', ex: "I'm always [nervous] before a test." },
          { en: 'proud (of)', de: 'stolz (auf)', say: 'proud of', ex: 'My mum is [proud] of me.' },
          { en: 'report', de: 'Bericht; Meldung', ex: 'We have to write a [report] about our trip.' },
          { en: 'during (+ noun)', de: 'während (+ Nomen)', say: 'during', ex: "Please don't talk [during] the film." },
        ],
      },
      {
        section: 'Unit 1 – Station 1',
        items: [
          { en: 'actually', de: 'tatsächlich; wirklich; eigentlich', ex: "[Actually], I don't like pizza." },
          { en: 'barrel', de: 'Fass; Tonne', ex: 'The [barrel] is full of apples.' },
          { en: 'race', de: 'Wettlauf; Rennen', ex: 'Who won the [race]?' },
          { en: 'daughter', de: 'Tochter', ex: 'Mrs Smith has two [daughters].' },
          { en: 'wheelchair', de: 'Rollstuhl', ex: 'My grandpa is in a [wheelchair].' },
          { en: 'to teach', de: 'unterrichten; lehren; beibringen', ex: 'Can you [teach] me to swim?' },
          { en: 'to tease sb', de: 'jmdn. aufziehen; jmdn. hänseln; jmdn. ärgern', alt: ['to tease'], say: 'to tease somebody', ex: 'Please stop [teasing] your little brother!' },
          { en: 'latest', de: 'neueste/-r/-s', ex: 'Have you heard their [latest] song?' },
          { en: 'movie (AE)', de: 'Film', alt: ['film'], say: 'movie', ex: "Let's watch a [movie] tonight." },
          { en: 'movie theater (AE)', de: 'Kino (amerik.)', alt: ['cinema'], say: 'movie theater', ex: 'We went to the [movie theater] on Saturday.' },
          { en: "There's nothing more exciting than …", de: 'Es gibt nichts Spannenderes als …', alt: ['There is nothing more exciting than'], say: "There's nothing more exciting than", ex: "[There's nothing more exciting than] a horse race." },
          { en: 'bird', de: 'Vogel', ex: 'A little [bird] is sitting on the bench.' },
          { en: 'air', de: 'Luft', ex: 'The [air] in the mountains is so fresh.' },
          { en: 'a bit', de: 'ein bisschen; ein wenig', ex: "I'm [a bit] tired today." },
          { en: 'worried', de: 'beunruhigt; besorgt', ex: "Mum is [worried] because it's late." },
          { en: 'to move (house)', de: 'umziehen', say: 'to move house', ex: "We're going [to move] house next year." },
          { en: 'to worry', de: 'sich Sorgen machen', ex: "Don't [worry], everything is OK." },
          { en: 'plan', de: 'Plan; Entwurf', ex: 'What are your [plans] for the holidays?' },
          { en: 'life (pl lives)', de: 'Leben', alt: ['lives'], say: 'life, lives', ex: 'I love my [life] in the country.' },
          { en: 'to have to', de: 'müssen', ex: 'I [have to] do my homework now.' },
          { en: 'to tell', de: 'erkennen; wissen', ex: 'Can you [tell] which twin is Lucy?' },
          { en: 'to point', de: 'zeigen', ex: "It isn't nice [to point] at people." },
          { en: 'bench', de: 'Bank; Sitzbank', ex: "Let's sit on that [bench]." },
          { en: 'to grow up', de: 'aufwachsen; erwachsen werden', ex: 'I [grew up] in a small town.' },
        ],
      },
      {
        // Kasten „Numbers“ (S. 197), im Heft am 09.10. eingetragen.
        section: 'Unit 1 – Numbers',
        items: [
          { en: 'one thousand', de: 'eintausend', alt: ['a thousand'], altDe: ['tausend', '1000', '1.000'], ex: '[One thousand] people came to the concert.' },
          { en: 'ten thousand', de: 'zehntausend', altDe: ['10000', '10.000'], ex: '[Ten thousand] fans watched the match.' },
          { en: 'one hundred thousand', de: 'hunderttausend', alt: ['a hundred thousand'], altDe: ['einhunderttausend', '100000', '100.000'], ex: '[One hundred thousand] people live in this city.' },
          { en: 'one million', de: 'eine Million', alt: ['a million'], altDe: ['1000000', '1.000.000'], ex: '[One million] people visit this museum every year.' },
          // Kein '1,5' als Alternative: Komma trennt im Antwort-Check Alternativen.
          { en: 'one point five', de: 'eins Komma fünf', ex: 'The bottle has [one point five] litres of water.' },
        ],
      },
      {
        // Kasten „City and country“ (S. 197).
        section: 'Unit 1 – City and country',
        items: [
          { en: 'noise', de: 'Lärm', ex: "What's that [noise]?" },
          { en: 'pollution', de: 'Verschmutzung', ex: 'Cars cause a lot of [pollution].' },
          { en: 'traffic jam', de: 'Stau', ex: 'We were late because of a [traffic jam].' },
          { en: 'shopping mall', de: 'Einkaufszentrum', alt: ['mall'], ex: 'The new [shopping mall] has fifty shops.' },
          { en: 'event', de: 'Veranstaltung', ex: 'The school party is a big [event].' },
          { en: 'public transport', de: 'öffentlicher Nahverkehr', ex: 'In the city I always use [public transport].' },
          { en: 'cheap', de: 'billig', ex: 'This T-shirt was really [cheap].' },
          { en: 'expensive', de: 'teuer', ex: 'The new phone is too [expensive].' },
          { en: 'far away', de: 'weit entfernt', ex: 'My grandma lives [far away].' },
          { en: 'space', de: 'Platz', ex: "There isn't enough [space] in my room." },
          { en: 'pet', de: 'Haustier', ex: 'Have you got a [pet]?' },
          { en: 'outdoor activity', de: 'Freiluftaktivität', ex: 'Hiking is my favourite [outdoor activity].' },
        ],
      },
      {
        section: 'Unit 1 – Station 2 (bis „to fix“)',
        items: [
          { en: 'youth', de: 'Jugend', ex: 'My grandpa often talks about his [youth].' },
          { en: 'close', de: 'nahe', ex: 'Our school is [close] to the park.' },
          { en: 'almost', de: 'fast; beinahe', ex: "It's [almost] eight o'clock!" },
          { en: 'judge', de: 'Juror/-in; Richter/-in', ex: 'The [judges] liked her song.' },
          { en: 'point', de: 'Punkt; Komma (bei Zahlenangaben)', ex: 'Our team got ten [points].' },
          { en: 'second', de: 'Sekunde', ex: 'Wait a [second]!' },
          { en: 'turn', de: 'Wendung; Drehung', ex: 'The horse made a fast [turn].' },
          { en: 'poor', de: 'arm', ex: 'The [poor] dog is wet and cold.' },
          { en: 'to get', de: 'werden', ex: 'I always [get] tired after school.' },
          { en: 'to fall off', de: 'herunterfallen; hinunterfallen', ex: "Be careful, don't [fall off] your bike!" },
          { en: 'mad', de: 'verrückt; wütend', ex: 'Dad was [mad] because I was late.' },
          { en: 'What a shame!', de: 'Wie schade!', ex: "You can't come? [What a shame!]" },
          { en: 'to train', de: 'trainieren', ex: 'Our team [trains] every Tuesday.' },
          { en: 'to fix', de: 'reparieren; befestigen', ex: 'Can you [fix] my bike, please?' },
        ],
      },
    ],
  },
  {
    exam: 'en6-u1',
    added: '2026-10-12',
    sections: [
      {
        // Vokabelheft, Eintrag vom 12.10. – die Wörter nach „to fix“.
        section: 'Unit 1 – Heft 12.10.',
        items: [
          { en: 'positive', de: 'positiv', ex: 'Her answer was [positive].' },
          { en: 'negative', de: 'negativ; verneint', ex: "Don't be so [negative], we can win!" },
          { en: 'up', de: 'hinauf; (nach) oben', ex: 'The cat ran [up] the tree.' },
          { en: 'watch', de: 'Armbanduhr', ex: 'My new [watch] was a present from my grandma.' },
          { en: 'to be interested (in)', de: 'interessiert sein (an); sich interessieren (für)', alt: ['to be interested in'], say: 'to be interested in', ex: 'Are you [interested] in horses?' },
          { en: 'I see.', de: 'Ich verstehe; Aha; Ach so!', ex: 'Oh, [I see]! Now I understand.' },
          { en: 'I mean', de: 'ich meine', ex: '[I mean], he is really nice.' },
          { en: 'both', de: 'beide', ex: '[Both] of my brothers play football.' },
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

// Beispielsatz `ex`: Die Lücke für den Lückentext steht in [eckigen Klammern], Alternativen mit |:
//   'Our ball [ended up] in the river.'  ·  'Malabar est un chien de la [S.P.A.|SPA]'
const GAP = /\[([^\]]+)\]/;

/** Beispielsatz zum Vorlesen (ohne Klammern und Alternativen). */
export function exampleText(entry) {
  return (entry.ex || '').replace(/\[([^\]|]*)(\|[^\]]*)?\]/g, '$1');
}

/** Lückentext aus dem Beispielsatz: { sentence: '… ___ …', answer, alternatives } oder null. */
export function gapOf(entry) {
  const m = (entry.ex || '').match(GAP);
  if (!m) return null;
  const [answer, ...alternatives] = m[1].split('|');
  return { sentence: entry.ex.replace(GAP, '___').replace(/\[([^\]|]*)(\|[^\]]*)?\]/g, '$1'), answer, alternatives };
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
