// Französisch Klasse 6 – Vokabeln (Découvertes 1, Ausgabe Bayern).
// Quelle: Vokabelteil des Buchs + Vokabelheft der Kinder, geprüft vom Nutzer
// (siehe VOCAB_FR6_U1_review.md). Diese Datei hat KEINE Importe, damit
// scripts/export-audio-manifest.mjs sie direkt mit Node lesen kann.
//
// Jede Lieferung ist ein BATCH mit dem Datum, an dem sie ins Quiz kam (`added`).
// Der Modus „Neue Vokabeln“ fragt den jüngsten Batch des Kurses ab.
// Felder pro Eintrag: fr, de, optional alt (weitere richtige frz. Antworten),
// altDe (weitere richtige dt. Antworten), say (gesprochener Text, falls abweichend).

export const COURSE = 'fr-6';

const BATCHES = [
  {
    exam: 'fr6-u1',
    added: '2026-10-11',
    sections: [
      {
        section: 'Au début',
        items: [
          { fr: 'Bienvenue!', de: 'Willkommen!' },
          { fr: 'Bonjour!', de: 'Guten Tag!; Grüß Gott!' },
          { fr: 'Salut! (fam.)', de: 'Hallo!; Grüß dich!; Servus!; Tschüs!' },
          { fr: 'Ça va?', de: "Wie geht's?" },
          { fr: 'oui', de: 'ja' },
          { fr: 'merci', de: 'danke' },
          { fr: 'A plus! (fam.)', de: 'Bis später!', alt: ['À plus!'], say: 'À plus !' },
          { fr: 'bien (adv.)', de: 'gut (Adv.)' },
          { fr: 'Au revoir!', de: 'Auf Wiedersehen!' },
          { fr: 'un ami / une amie', de: 'ein Freund / eine Freundin', alt: ['un copain / une copine'], say: 'un ami, une amie' },
          { fr: 'Bonjour, les amis!', de: 'Guten Tag, Freunde!' },
          { fr: "je m'appelle", de: 'ich heiße' },
          { fr: 'et', de: 'und' },
          { fr: 'toi', de: 'du (betont)' },
          { fr: 'moi', de: 'ich (betont)' },
        ],
      },
      {
        section: 'Unité 1 – Atelier A1',
        items: [
          { fr: 'Viens!', de: 'Komm! (Aufforderung)' },
          { fr: 'papa', de: 'Papa' },
          { fr: 'vite (adv.)', de: 'schnell (Adv.)' },
          { fr: 'S.P.A. (la Société Protectrice des Animaux)', de: 'die S.P.A. (französische Tierschutzgesellschaft)', say: 'la S. P. A.' },
          { fr: 'Qui est-ce?', de: 'Wer ist das?' },
          { fr: 'Attention!', de: 'Achtung!; Vorsicht!' },
          { fr: 'non', de: 'nein' },
          { fr: 'Pardon.', de: 'Entschuldigung.' },
          { fr: 'comment?', de: 'wie? (Fragewort)' },
          { fr: "Tu t'appelles comment?", de: 'Wie heißt du?' },
          { fr: "c'est", de: 'das ist' },
          { fr: 'je suis', de: 'ich bin' },
          { fr: 'voilà', de: 'da ist; da sind' },
        ],
      },
      {
        section: 'Unité 1 – Atelier B1–B5',
        items: [
          { fr: 'ici', de: 'hier; hierher' },
          { fr: 'un chat', de: 'eine Katze' },
          { fr: 'un chien', de: 'ein Hund' },
          { fr: 'mais', de: 'aber' },
          { fr: 'tu es', de: 'du bist' },
          { fr: "de / d'", de: 'aus; von', say: 'de' },
          { fr: 'aussi', de: 'auch' },
          { fr: 'super (inv.)', de: 'super; toll' },
          { fr: 'un garçon', de: 'ein Junge; ein Bub' },
          { fr: 'une fille', de: 'ein Mädchen; eine Tochter' },
          { fr: 'il est', de: 'er ist' },
          { fr: 'elle est', de: 'sie ist' },
          { fr: 'un animal', de: 'ein Tier' },
          { fr: 'Ça ne va pas.', de: 'Das geht nicht.' },
          { fr: 'une chanson', de: 'ein Lied' },
          { fr: 'fantastique', de: 'fantastisch; toll' },
          { fr: 'bizarre', de: 'komisch; merkwürdig' },
          { fr: 'un copain / une copine (fam.)', de: 'ein Freund / eine Freundin (ugs.)', alt: ['un ami / une amie'], say: 'un copain, une copine' },
          { fr: 'une dame', de: 'eine Dame; eine Frau' },
          { fr: 'un monsieur', de: 'ein Herr; ein Mann' },
          { fr: 'Strasbourg', de: 'Straßburg' },
          { fr: 'Nice', de: 'Nizza' },
        ],
      },
      {
        // Kasten „un, deux, trois …“ im Buch; im Cahier (Code secret, Lied, Intrus) abgefragt.
        section: 'Unité 1 – Zahlen 0–12',
        items: [
          { fr: 'zéro', de: 'null', altDe: ['0'] },
          { fr: 'un', de: 'eins', altDe: ['1'] },
          { fr: 'deux', de: 'zwei', altDe: ['2'] },
          { fr: 'trois', de: 'drei', altDe: ['3'] },
          { fr: 'quatre', de: 'vier', altDe: ['4'] },
          { fr: 'cinq', de: 'fünf', altDe: ['5'] },
          { fr: 'six', de: 'sechs', altDe: ['6'] },
          { fr: 'sept', de: 'sieben', altDe: ['7'] },
          { fr: 'huit', de: 'acht', altDe: ['8'] },
          { fr: 'neuf', de: 'neun', altDe: ['9'] },
          { fr: 'dix', de: 'zehn', altDe: ['10'] },
          { fr: 'onze', de: 'elf', altDe: ['11'] },
          { fr: 'douze', de: 'zwölf', altDe: ['12'] },
        ],
      },
      {
        section: 'Mon dico personnel – Tiere',
        items: [
          { fr: 'un hamster', de: 'ein Hamster' },
          { fr: 'une tortue', de: 'eine Schildkröte' },
          { fr: 'une perruche', de: 'ein Wellensittich' },
          { fr: 'un serpent', de: 'eine Schlange' },
          { fr: 'un rat', de: 'eine Ratte' },
          { fr: 'un perroquet', de: 'ein Papagei' },
          { fr: 'un canari', de: 'ein Kanarienvogel' },
          { fr: 'un cochon', de: 'ein Schwein' },
        ],
      },
    ],
  },
];

function slug(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40);
}

// Was gesprochen wird: ohne Hinweise in Klammern, „ / “ als Aufzählung.
export function speechText(entry) {
  if (entry.say) return entry.say;
  return entry.fr.replace(/\([^)]*\)/g, '').replace(/\s*\/\s*/g, ', ').replace(/…/g, '').replace(/\s+/g, ' ').trim();
}

export const FR6_VOCAB = BATCHES.flatMap((batch) =>
  batch.sections.flatMap((sec) =>
    sec.items.map((item) => ({
      ...item,
      id: `fr6_${slug(item.fr)}`,
      exam: batch.exam,
      added: batch.added,
      section: sec.section,
    })),
  ),
);

// Doppelte IDs würden Lernhistorie und Audio vermischen → sofort laut scheitern.
const seen = new Set();
for (const v of FR6_VOCAB) {
  if (seen.has(v.id)) throw new Error(`Doppelte Vokabel-ID: ${v.id}`);
  seen.add(v.id);
}
