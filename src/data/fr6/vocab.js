// Französisch Klasse 6 – Vokabeln (Découvertes 1, Ausgabe Bayern).
// Quelle: Vokabelteil des Buchs (S. 162–168) + Vokabelheft der Kinder, geprüft vom Nutzer
// (siehe VOCAB_FR6_U1_review.md). Diese Datei hat KEINE Importe, damit
// scripts/export-audio-manifest.mjs sie direkt mit Node lesen kann.
//
// Jede Lieferung ist ein BATCH mit dem Datum, an dem sie ins Quiz kam (`added`).
// Der Modus „Neue Vokabeln“ fragt den jüngsten Batch des Kurses ab.
// Felder pro Eintrag: fr, de, optional alt (weitere richtige frz. Antworten),
// altDe (weitere richtige dt. Antworten), say (gesprochener Text, falls abweichend),
// sayEx (gesprochener Beispielsatz, falls abweichend – z. B. „BD“ liest die Sprachausgabe sonst als „boulevard“),
// sayPhonemes / sayExPhonemes (Laute direkt für Wort bzw. Satz, wenn die Aussprache sonst falsch ist –
// z. B. „sac à dos“: die Sprachausgabe springt bei „dos“ ins Englische),
// ex (kurzer Beispielsatz, eigene Formulierung – wird bei Hör-Karten nach dem Wort vorgelesen;
// die [Klammer] markiert die Lücke für den Lückentext, siehe gapOf).

export const COURSE = 'fr-6';

const BATCHES = [
  {
    exam: 'fr6-u1',
    added: '2026-10-11',
    sections: [
      {
        section: 'Au début',
        items: [
          { fr: 'Bienvenue!', de: 'Willkommen!', ex: '[Bienvenue] à Paris !' },
          { fr: 'Bonjour!', de: 'Guten Tag!; Grüß Gott!', ex: '[Bonjour], Léo !' },
          { fr: 'Salut! (fam.)', de: 'Hallo!; Grüß dich!; Servus!; Tschüs!', ex: '[Salut], Marie ! Ça va ?' },
          { fr: 'Ça va?', de: "Wie geht's?", ex: 'Salut, Léo ! [Ça va] ?' },
          { fr: 'oui', de: 'ja', ex: '[Oui], ça va bien.' },
          { fr: 'merci', de: 'danke', ex: 'Ça va bien, [merci].' },
          { fr: 'A plus! (fam.)', de: 'Bis später!', alt: ['À plus!'], say: 'À plus !', ex: 'Au revoir, Marie ! [À plus|A plus] !' },
          { fr: 'bien (adv.)', de: 'gut (Adv.)', ex: 'Oui, ça va [bien] !' },
          { fr: 'Au revoir!', de: 'Auf Wiedersehen!', ex: '[Au revoir], monsieur !' },
          { fr: 'un ami / une amie', de: 'ein Freund / eine Freundin', alt: ['un copain / une copine'], say: 'un ami, une amie', ex: 'Voilà Léo, [un ami].' },
          { fr: 'Bonjour, les amis!', de: 'Guten Tag, Freunde!', ex: 'Bonjour, [les amis] ! Ça va ?' },
          { fr: "je m'appelle", de: 'ich heiße', ex: "Bonjour, [je m'appelle] Clara." },
          { fr: 'et', de: 'und', ex: 'Voilà Léo [et] Marie.' },
          { fr: 'toi', de: 'du (betont)', ex: "Je m'appelle Léo. Et [toi] ?" },
          { fr: 'moi', de: 'ich (betont)', ex: '[Moi], je suis de Paris.' },
        ],
      },
      {
        section: 'Unité 1 – Atelier A1',
        items: [
          { fr: 'Viens!', de: 'Komm! (Aufforderung)', ex: '[Viens], Malabar ! Vite !' },
          { fr: 'papa', de: 'Papa', ex: 'Voilà [papa] !' },
          { fr: 'vite (adv.)', de: 'schnell (Adv.)', ex: '[Vite], Malabar, viens !' },
          { fr: 'S.P.A. (la Société Protectrice des Animaux)', de: 'die S.P.A. (französische Tierschutzgesellschaft)', say: 'la S. P. A.', ex: 'Malabar est un chien de la [S.P.A.|SPA]' },
          { fr: 'Qui est-ce?', de: 'Wer ist das?', ex: "[Qui est-ce] ? C'est Malabar." },
          { fr: 'Attention!', de: 'Achtung!; Vorsicht!', ex: '[Attention], Malabar !' },
          { fr: 'non', de: 'nein', ex: '[Non], je suis de Nice.' },
          { fr: 'Pardon.', de: 'Entschuldigung.', ex: 'Oh, [pardon], monsieur !' },
          { fr: 'comment?', de: 'wie? (Fragewort)', ex: "Tu t'appelles [comment] ?" },
          { fr: "Tu t'appelles comment?", de: 'Wie heißt du?', ex: "Salut ! [Tu t'appelles comment] ?" },
          { fr: "c'est", de: 'das ist', ex: "[C'est] Marie, une copine." },
          { fr: 'je suis', de: 'ich bin', ex: '[Je suis] de Paris.' },
          { fr: 'voilà', de: 'da ist; da sind', ex: '[Voilà] Malabar !' },
        ],
      },
      {
        section: 'Unité 1 – Atelier B1–B5',
        items: [
          { fr: 'ici', de: 'hier; hierher', ex: "Tu es d'[ici] ?" },
          { fr: 'un chat', de: 'eine Katze', ex: 'Filou est [un chat].' },
          { fr: 'un chien', de: 'ein Hund', ex: 'Malabar est [un chien].' },
          { fr: 'mais', de: 'aber', ex: 'Malabar est bizarre, [mais] il est super.' },
          { fr: 'tu es', de: 'du bist', ex: '[Tu es] de Toulouse ?' },
          { fr: "de / d'", de: 'aus; von', say: 'de', ex: 'Je suis [de] Strasbourg.' },
          { fr: 'aussi', de: 'auch', ex: 'Moi [aussi], je suis de Paris.' },
          { fr: 'super (inv.)', de: 'super; toll', ex: 'Malabar est [super] !' },
          { fr: 'un garçon', de: 'ein Junge; ein Bub', ex: 'Léo est [un garçon].' },
          { fr: 'une fille', de: 'ein Mädchen; eine Tochter', ex: 'Marie est [une fille].' },
          { fr: 'il est', de: 'er ist', ex: 'Voilà Léo. [Il est] de Paris.' },
          { fr: 'elle est', de: 'sie ist', ex: 'Voilà Marie. [Elle est] de Nice.' },
          { fr: 'un animal', de: 'ein Tier', ex: 'Malabar est [un animal] super.' },
          { fr: 'Ça ne va pas.', de: 'Das geht nicht.', ex: 'Oh non, [ça ne va pas].' },
          { fr: 'une chanson', de: 'ein Lied', ex: "C'est [une chanson] super !" },
          { fr: 'fantastique', de: 'fantastisch; toll', ex: 'Malabar est [fantastique] !' },
          { fr: 'bizarre', de: 'komisch; merkwürdig', ex: 'Filou est [bizarre] !' },
          { fr: 'un copain / une copine (fam.)', de: 'ein Freund / eine Freundin (ugs.)', alt: ['un ami / une amie'], say: 'un copain, une copine', ex: 'Voilà Marie, [une copine].' },
          { fr: 'une dame', de: 'eine Dame; eine Frau', ex: "Qui est-ce ? C'est [une dame] de Paris." },
          { fr: 'un monsieur', de: 'ein Herr; ein Mann', ex: 'Voilà [un monsieur] et un chien.' },
          { fr: 'Strasbourg', de: 'Straßburg', ex: 'Léa est de [Strasbourg].' },
          { fr: 'Nice', de: 'Nizza', ex: 'Marie est de [Nice].' },
        ],
      },
      {
        // Kasten „un, deux, trois …“ im Buch; im Cahier (Code secret, Lied, Intrus) abgefragt.
        section: 'Unité 1 – Zahlen 0–12',
        items: [
          { fr: 'zéro', de: 'null', altDe: ['0'], ex: "Le code, c'est [zéro], zéro, un." },
          { fr: 'un', de: 'eins', altDe: ['1'], ex: '[Un] chien et un chat.' },
          { fr: 'deux', de: 'zwei', altDe: ['2'], ex: 'Voilà [deux] chats !' },
          { fr: 'trois', de: 'drei', altDe: ['3'], ex: 'Un, deux, [trois], viens !' },
          { fr: 'quatre', de: 'vier', altDe: ['4'], ex: 'Voilà [quatre] chiens !' },
          { fr: 'cinq', de: 'fünf', altDe: ['5'], ex: "Le code, c'est [cinq], neuf, sept." },
          { fr: 'six', de: 'sechs', altDe: ['6'], ex: 'Voilà [six] garçons.' },
          { fr: 'sept', de: 'sieben', altDe: ['7'], ex: 'Voilà [sept] filles.' },
          { fr: 'huit', de: 'acht', altDe: ['8'], ex: "Le code, c'est [huit], un, deux." },
          { fr: 'neuf', de: 'neun', altDe: ['9'], ex: '[Neuf], dix, onze, douze !' },
          { fr: 'dix', de: 'zehn', altDe: ['10'], ex: 'Voilà [dix] copains !' },
          { fr: 'onze', de: 'elf', altDe: ['11'], ex: 'Voilà [onze] chats !' },
          { fr: 'douze', de: 'zwölf', altDe: ['12'], ex: 'Voilà [douze] chiens !' },
        ],
      },
      {
        section: 'Mon dico personnel – Tiere',
        items: [
          { fr: 'un hamster', de: 'ein Hamster', ex: 'Voilà [un hamster] !' },
          { fr: 'une tortue', de: 'eine Schildkröte', ex: "C'est [une tortue]. Elle est super." },
          { fr: 'une perruche', de: 'ein Wellensittich', ex: 'Voilà [une perruche] fantastique !' },
          { fr: 'un serpent', de: 'eine Schlange', ex: 'Attention, [un serpent] !' },
          { fr: 'un rat', de: 'eine Ratte', ex: "C'est [un rat] ? Oh non !" },
          { fr: 'un perroquet', de: 'ein Papagei', ex: 'Coco est [un perroquet].' },
          { fr: 'un canari', de: 'ein Kanarienvogel', ex: 'Voilà [un canari].' },
          { fr: 'un cochon', de: 'ein Schwein', ex: "C'est [un cochon] ! Il est super." },
        ],
      },
    ],
  },
  {
    // Buch S. 167–168 + Vokabelheft (Fotos vom 19.10.), Umfang laut Nutzer „bis A2 travailler“ (dans = A3).
    exam: 'fr6-u1',
    added: '2026-10-19',
    sections: [
      {
        // Stand am 11.10. nur im Buch, jetzt auch im Heft.
        section: 'Unité 1 – Atelier B6',
        items: [
          { fr: 'madame …', de: 'Frau …', say: 'madame', ex: 'Bonjour, [madame] ! Ça va ?' },
          { fr: 'mademoiselle …', de: 'Fräulein …', say: 'mademoiselle', ex: 'Merci, [mademoiselle] !' },
          { fr: 'Bof!', de: 'Na ja. (ugs.); Ach. (ugs.)', altDe: ['Naja'], say: 'Bof !', ex: 'Ça va ? – [Bof] …' },
        ],
      },
      {
        section: 'Unité 2 – Copain, copine',
        items: [
          { fr: 'un magasin', de: 'ein Geschäft; ein Laden', ex: 'Marie cherche [un magasin].' },
          { fr: 'un journal', de: 'eine Zeitung', ex: 'Le monsieur regarde [un journal].' },
          { fr: 'une BD', de: 'ein Comic', say: 'une bédé', ex: 'Marie regarde [une BD] avec Léo.', sayEx: 'Marie regarde une bédé avec Léo.' },
          { fr: 'une affiche', de: 'ein Plakat; ein Poster', ex: 'Voilà [une affiche] de Malabar.' },
          { fr: "Qu'est-ce que c'est?", de: 'Was ist das?', ex: "[Qu'est-ce que c'est] ? – C'est un livre." },
          { fr: 'à (Paris)', de: 'in; nach (Paris)', say: 'à', ex: 'Je suis [à] Paris.' },
          { fr: 'une maison', de: 'ein Haus', ex: "C'est [une maison] à Nice." },
          { fr: 'une maison de la presse', de: 'ein Zeitschriften- und Schreibwarengeschäft', altDe: ['Zeitschriftengeschäft', 'Schreibwarengeschäft'], ex: 'Marie arrive à [la maison de la presse].' },
          { fr: 'Que fait Léo?', de: 'Was macht Léo?', ex: '[Que fait] Léo ? – Il regarde une BD.', sayEx: 'Que fait Léo ? – Il regarde une bédé.' },
          { fr: 'regarder qc', de: 'etwas ansehen; etwas betrachten', alt: ['regarder'], altDe: ['ansehen', 'betrachten'], say: 'regarder', ex: 'Marie [regarde] une affiche.' },
        ],
      },
      {
        section: 'Unité 2 – Verben und mehr',
        items: [
          { fr: 'parler', de: 'sprechen', ex: 'Marie [parle] avec Léo.' },
          { fr: 'avec', de: 'mit', ex: 'Je suis ici [avec] Malabar.' },
          { fr: 'arriver', de: 'kommen; ankommen', ex: 'Voilà Léo ! Il [arrive].' },
          { fr: 'chercher qn/qc', de: 'jemanden/etwas suchen', alt: ['chercher'], altDe: ['suchen', 'jemanden suchen'], say: 'chercher', ex: 'Léo [cherche] Malabar.' },
        ],
      },
      {
        section: 'Unité 2 – Atelier A1',
        items: [
          { fr: 'français', de: 'französisch', ex: "C'est un livre [français]." },
          { fr: 'en français', de: 'auf Französisch', ex: 'Marie parle [en français].' },
          { fr: 'un sac à dos', de: 'ein Rucksack', sayPhonemes: 'sˈak a dˈo', ex: 'Marie cherche [un sac à dos].', sayExPhonemes: 'maʁˈi ʃˈɛʁʃ œ̃ sˈak a dˈo.' },
          { fr: 'un livre', de: 'ein Buch', ex: 'Léo regarde [un livre].' },
          { fr: 'un crayon', de: 'ein Bleistift', ex: 'Voilà [un crayon] et une gomme.' },
          { fr: 'un cahier', de: 'ein Heft', ex: 'Voilà [un cahier] et un livre.' },
          { fr: 'un stylo', de: 'ein Füller; ein Kuli', ex: 'Léo cherche [un stylo].' },
          { fr: 'une gomme', de: 'ein Radiergummi', ex: "Qu'est-ce que c'est ? – C'est [une gomme]." },
          { fr: 'un truc (fam.)', de: 'ein Ding; eine Sache', say: 'un truc', ex: 'Marie trouve [un truc] ici.' },
        ],
      },
      {
        section: 'Unité 2 – Atelier A2',
        items: [
          { fr: 'écouter qn/qc', de: 'jemandem zuhören; etwas anhören', alt: ['écouter'], altDe: ['zuhören', 'anhören'], say: 'écouter', ex: 'Léo [écoute] Marie.' },
          { fr: 'trouver qn/qc', de: 'jemanden/etwas finden', alt: ['trouver'], altDe: ['finden', 'jemanden finden'], say: 'trouver', ex: 'Marie [trouve] Malabar !' },
          { fr: 'porter qc', de: 'etwas tragen', alt: ['porter'], altDe: ['tragen'], say: 'porter', ex: 'Le monsieur [porte] un journal.' },
          { fr: 'travailler', de: 'arbeiten', ex: 'Le monsieur [travaille] à Paris.' },
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

// Was gesprochen wird: ohne Hinweise in Klammern, „ / “ als Aufzählung.
// Wort-Audio OHNE Artikel (Wunsch des Nutzers, 2026-10-20): voller Fokus auf den reinen Begriff („magasin“,
// nicht „un magasin“). Der Artikel steht auf der Karte und kommt im Beispielsatz vor. „un“ allein (Zahl) bleibt.
const ARTICLE = /^(?:un|une|le|la|les|des|du)\s+|^l['’]\s*/i;
// Nur bei Nomen, die mit Artikel beginnen („un ami, une amie“ → „ami, amie“) – Wendungen wie
// „Bonjour, les amis!“ bleiben unverändert.
const withoutArticle = (text) =>
  ARTICLE.test(text) ? text.split(/,\s*/).map((part) => part.replace(ARTICLE, '')).join(', ') : text;

export function speechText(entry) {
  const text = entry.say || entry.fr.replace(/\([^)]*\)/g, '').replace(/\s*\/\s*/g, ', ').replace(/…/g, '').replace(/\s+/g, ' ').trim();
  return withoutArticle(text);
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
