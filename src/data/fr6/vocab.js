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
// tip (Tipp zum Lückentext, erst nach Tippen sichtbar; seit 2026-11-16 Pflicht zu jedem ex): inhaltlicher Kontext auf
// Französisch, eine Andeutung – nie das gesuchte Wort, nie die Übersetzung, keine direkte Beschreibung des Worts.

export const COURSE = 'fr-6';

const BATCHES = [
  {
    exam: 'fr6-u1',
    added: '2026-10-11',
    sections: [
      {
        section: 'Au début',
        items: [
          { fr: 'Bienvenue!', de: 'Willkommen!', ex: '[Bienvenue] à Paris !', tip: 'Une copine de Nice arrive à Paris. Marie est là pour elle.' },
          { fr: 'Bonjour!', de: 'Guten Tag!; Grüß Gott!', ex: '[Bonjour], Léo !', tip: "Marie arrive à l'école. Voilà Léo !" },
          { fr: 'Salut! (fam.)', de: 'Hallo!; Grüß dich!; Servus!; Tschüs!', ex: '[Salut], Marie ! Ça va ?', tip: 'Léo et Marie sont copains. Léo arrive.' },
          { fr: 'Ça va?', de: "Wie geht's?", ex: 'Salut, Léo ! [Ça va] ?', tip: 'Et Léo dit : « Oui, bien, merci ! »' },
          { fr: 'oui', de: 'ja', ex: '[Oui], ça va bien.', tip: 'Léo : « Ça va, Marie ? »' },
          { fr: 'merci', de: 'danke', ex: 'Ça va bien, [merci].', tip: 'Léo est sympa : « Ça va, Marie ? »' },
          { fr: 'A plus! (fam.)', de: 'Bis später!', alt: ['À plus!'], say: 'À plus !', ex: 'Au revoir, Marie ! [À plus|A plus] !', tip: 'Marie et Léo sont copains. Le cinéma, avec Léo ? Oui, à huit heures !' },
          { fr: 'bien (adv.)', de: 'gut (Adv.)', ex: 'Oui, ça va [bien] !', tip: "Pour Léo, c'est super : Malabar est là, Marie est là !" },
          { fr: 'Au revoir!', de: 'Auf Wiedersehen!', ex: '[Au revoir], monsieur !', tip: 'Marie a un livre. Elle est à la porte du magasin… et dans la rue !' },
          { fr: 'un ami / une amie', de: 'ein Freund / eine Freundin', alt: ['un copain / une copine'], say: 'un ami, une amie', ex: 'Voilà Léo, [un ami].', tip: 'Léo et Marie aiment le judo et la musique. Léo est sympa avec Marie.' },
          { fr: 'Bonjour, les amis!', de: 'Guten Tag, Freunde!', ex: 'Bonjour, [les amis] ! Ça va ?', tip: "Marie arrive. Voilà Léo, Clara et Paul de l'école. Marie aime Léo, Clara et Paul." },
          { fr: "je m'appelle", de: 'ich heiße', ex: "Bonjour, [je m'appelle] Clara.", tip: "Une fille arrive à l'école. Léo : « Qui est-ce ? »" },
          { fr: 'et', de: 'und', ex: 'Voilà Léo [et] Marie.', tip: 'Léo, Marie : deux copains.' },
          { fr: 'toi', de: 'du (betont)', ex: "Je m'appelle Léo. Et [toi] ?", tip: 'Léo parle avec une fille. Et la fille ? Qui est-ce ?' },
          { fr: 'moi', de: 'ich (betont)', ex: '[Moi], je suis de Paris.', tip: 'Léo est de Nice. Marie est de Strasbourg. Et Clara ?' },
        ],
      },
      {
        section: 'Unité 1 – Atelier A1',
        items: [
          { fr: 'Viens!', de: 'Komm! (Aufforderung)', ex: '[Viens], Malabar ! Vite !', tip: 'Léo est dans la rue. Malabar ? Il est devant le magasin. Ici, Malabar, ici !' },
          { fr: 'papa', de: 'Papa', ex: 'Voilà [papa] !', tip: 'Léo est à la maison avec la grand-mère, la sœur et le frère. Et voilà un monsieur : il travaille à Paris.' },
          { fr: 'vite (adv.)', de: 'schnell (Adv.)', ex: '[Vite], Malabar, viens !', tip: "Zut ! L'école, c'est dans une minute !" },
          { fr: 'S.P.A. (la Société Protectrice des Animaux)', de: 'die S.P.A. (französische Tierschutzgesellschaft)', say: 'la S. P. A.', ex: 'Malabar est un chien de la [S.P.A.|SPA]', tip: 'Malabar habite dans une maison avec dix chiens et onze chats. Et voilà Léo : il cherche un chien !' },
          { fr: 'Qui est-ce?', de: 'Wer ist das?', ex: "[Qui est-ce] ? C'est Malabar.", tip: 'Marie arrive. Un chien est devant la maison de Léo. Marie regarde Léo : « Euh … ? »' },
          { fr: 'Attention!', de: 'Achtung!; Vorsicht!', ex: '[Attention], Malabar !', tip: 'Malabar est dans la rue, et un bus arrive vite !' },
          { fr: 'non', de: 'nein', ex: '[Non], je suis de Nice.', tip: 'Léo : « Tu es de Paris, Marie ? »' },
          { fr: 'Pardon.', de: 'Entschuldigung.', ex: 'Oh, [pardon], monsieur !', tip: 'Dans le magasin, Marie arrive vite … et boum ! Voilà le monsieur.' },
          { fr: 'comment?', de: 'wie? (Fragewort)', ex: "Tu t'appelles [comment] ?", tip: "Léo parle avec une fille de l'école. Qui est-ce ? Clara ? Léa ? Zoé ?" },
          { fr: "Tu t'appelles comment?", de: 'Wie heißt du?', ex: "Salut ! [Tu t'appelles comment] ?", tip: "Un garçon arrive à l'école. Léo regarde le garçon : Paul ? Max ? Tom ?" },
          { fr: "c'est", de: 'das ist', ex: "[C'est] Marie, une copine.", tip: 'Léo est avec une fille. Le frère de Léo regarde la fille : qui est-ce ?' },
          { fr: 'je suis', de: 'ich bin', ex: '[Je suis] de Paris.', tip: 'Marie parle avec un garçon de Nice. Marie habite à Paris.' },
          { fr: 'voilà', de: 'da ist; da sind', ex: '[Voilà] Malabar !', tip: 'Léo cherche Malabar … et oh ! Il est là, devant la maison !' },
        ],
      },
      {
        section: 'Unité 1 – Atelier B1–B5',
        items: [
          { fr: 'ici', de: 'hier; hierher', ex: "Tu es d'[ici] ?", tip: 'Léo et une fille sont dans une rue de Paris. Elle habite à Paris aussi ?' },
          { fr: 'un chat', de: 'eine Katze', ex: 'Filou est [un chat].', tip: 'Filou : « Miaou ! »' },
          { fr: 'un chien', de: 'ein Hund', ex: 'Malabar est [un chien].', tip: 'Malabar : « Ouaf, ouaf ! »' },
          { fr: 'mais', de: 'aber', ex: 'Malabar est bizarre, [mais] il est super.', tip: 'Bizarre : bof … Super : oui !' },
          { fr: 'tu es', de: 'du bist', ex: '[Tu es] de Toulouse ?', tip: 'Léo parle avec une fille : Toulouse ? Nice ? Paris ?' },
          { fr: "de / d'", de: 'aus; von', say: 'de', ex: 'Je suis [de] Strasbourg.', tip: 'Tu habites où ? – À Strasbourg !' },
          { fr: 'aussi', de: 'auch', ex: 'Moi [aussi], je suis de Paris.', tip: 'Léo est de Paris. Et Marie ? Paris !' },
          { fr: 'super (inv.)', de: 'super; toll', ex: 'Malabar est [super] !', tip: 'Malabar trouve le cahier de Léo. Bravo, Malabar !' },
          { fr: 'un garçon', de: 'ein Junge; ein Bub', ex: 'Léo est [un garçon].', tip: 'Voilà Marie, une fille. Et Léo ?' },
          { fr: 'une fille', de: 'ein Mädchen; eine Tochter', ex: 'Marie est [une fille].', tip: 'Voilà Léo, un garçon. Et Marie ?' },
          { fr: 'il est', de: 'er ist', ex: 'Voilà Léo. [Il est] de Paris.', tip: 'On parle de Léo, un garçon.' },
          { fr: 'elle est', de: 'sie ist', ex: 'Voilà Marie. [Elle est] de Nice.', tip: 'On parle de Marie, une fille.' },
          { fr: 'un animal', de: 'ein Tier', ex: 'Malabar est [un animal] super.', tip: 'Malabar, Filou, Coco : un chien, un chat, un perroquet …' },
          { fr: 'Ça ne va pas.', de: 'Das geht nicht.', ex: 'Oh non, [ça ne va pas].', tip: 'Zut ! Le stylo et le livre de Léo sont dans la rue. Catastrophe !' },
          { fr: 'une chanson', de: 'ein Lied', ex: "C'est [une chanson] super !", tip: 'Marie écoute la musique : « La la la … »' },
          { fr: 'fantastique', de: 'fantastisch; toll', ex: 'Malabar est [fantastique] !', tip: 'Malabar trouve le sac à dos de Marie dans la rue. Wow ! Bravo !' },
          { fr: 'bizarre', de: 'komisch; merkwürdig', ex: 'Filou est [bizarre] !', tip: 'Filou regarde un serpent et … il aime le serpent ! Hmm …' },
          { fr: 'un copain / une copine (fam.)', de: 'ein Freund / eine Freundin (ugs.)', alt: ['un ami / une amie'], say: 'un copain, une copine', ex: 'Voilà Marie, [une copine].', tip: "Marie et Léo : l'école, le judo, la musique … avec Léo, c'est super !" },
          { fr: 'une dame', de: 'eine Dame; eine Frau', ex: "Qui est-ce ? C'est [une dame] de Paris.", tip: 'Elle a 60 ans. Elle travaille dans un magasin à Paris.' },
          { fr: 'un monsieur', de: 'ein Herr; ein Mann', ex: 'Voilà [un monsieur] et un chien.', tip: 'Il a 50 ans, il porte un journal et il travaille dans un magasin. Et le chien ? Il est là aussi.' },
          { fr: 'Strasbourg', de: 'Straßburg', ex: 'Léa est de [Strasbourg].', tip: "Léa habite en France, tout près de l'Allemagne." },
          { fr: 'Nice', de: 'Nizza', ex: 'Marie est de [Nice].', tip: "La Méditerranée, c'est là, devant la maison de Marie !" },
        ],
      },
      {
        // Kasten „un, deux, trois …“ im Buch; im Cahier (Code secret, Lied, Intrus) abgefragt.
        section: 'Unité 1 – Zahlen 0–12',
        items: [
          { fr: 'zéro', de: 'null', altDe: ['0'], ex: "Le code, c'est [zéro], zéro, un.", tip: "Comme James Bond : 007 ! Mais à la fin, c'est un." },
          { fr: 'un', de: 'eins', altDe: ['1'], ex: '[Un] chien et un chat.', tip: 'Voilà Malabar et Filou.' },
          { fr: 'deux', de: 'zwei', altDe: ['2'], ex: 'Voilà [deux] chats !', tip: 'Voilà Filou et un copain de Filou.' },
          { fr: 'trois', de: 'drei', altDe: ['3'], ex: 'Un, deux, [trois], viens !', tip: 'Léo joue avec Malabar. Il compte … et Malabar arrive vite !' },
          { fr: 'quatre', de: 'vier', altDe: ['4'], ex: 'Voilà [quatre] chiens !', tip: 'Voilà Malabar et trois copains de Malabar.' },
          { fr: 'cinq', de: 'fünf', altDe: ['5'], ex: "Le code, c'est [cinq], neuf, sept.", tip: 'Une main : ✋' },
          { fr: 'six', de: 'sechs', altDe: ['6'], ex: 'Voilà [six] garçons.', tip: 'Voilà Léo, Paul, Max, Tom, Noé et Hugo.' },
          { fr: 'sept', de: 'sieben', altDe: ['7'], ex: 'Voilà [sept] filles.', tip: 'Voilà Marie, Léa, Clara, Zoé, Jade, Lina et Emma.' },
          { fr: 'huit', de: 'acht', altDe: ['8'], ex: "Le code, c'est [huit], un, deux.", tip: '✋ + ✌️ + ☝️' },
          { fr: 'neuf', de: 'neun', altDe: ['9'], ex: '[Neuf], dix, onze, douze !', tip: 'Léo compte les chats : …, sept, huit, …' },
          { fr: 'dix', de: 'zehn', altDe: ['10'], ex: 'Voilà [dix] copains !', tip: "Voilà Léo et neuf copains de l'école." },
          { fr: 'onze', de: 'elf', altDe: ['11'], ex: 'Voilà [onze] chats !', tip: 'Voilà Filou et dix copains de Filou.' },
          { fr: 'douze', de: 'zwölf', altDe: ['12'], ex: 'Voilà [douze] chiens !', tip: 'Voilà Malabar et onze copains de Malabar.' },
        ],
      },
      {
        section: 'Mon dico personnel – Tiere',
        items: [
          { fr: 'un hamster', de: 'ein Hamster', ex: 'Voilà [un hamster] !', tip: "Léo a un animal dans une cage. Il s'appelle Pépito et il adore les carottes." },
          { fr: 'une tortue', de: 'eine Schildkröte', ex: "C'est [une tortue]. Elle est super.", tip: "Elle s'appelle Lola. Elle porte la maison sur le dos !" },
          { fr: 'une perruche', de: 'ein Wellensittich', ex: 'Voilà [une perruche] fantastique !', tip: "Elle s'appelle Kiwi. Elle est dans une cage, verte comme un kiwi." },
          { fr: 'un serpent', de: 'eine Schlange', ex: 'Attention, [un serpent] !', tip: 'Sssssss !' },
          { fr: 'un rat', de: 'eine Ratte', ex: "C'est [un rat] ? Oh non !", tip: 'Comme Rémy, dans le film de Disney à Paris …' },
          { fr: 'un perroquet', de: 'ein Papagei', ex: 'Coco est [un perroquet].', tip: 'Coco parle : « Bonjour ! Bonjour ! »' },
          { fr: 'un canari', de: 'ein Kanarienvogel', ex: 'Voilà [un canari].', tip: 'Il est jaune 💛 et il chante dans une cage : cui-cui !' },
          { fr: 'un cochon', de: 'ein Schwein', ex: "C'est [un cochon] ! Il est super.", tip: 'Il dit : « Groin, groin ! »' },
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
          { fr: 'madame …', de: 'Frau …', say: 'madame', ex: 'Bonjour, [madame] ! Ça va ?', tip: 'Marie arrive au magasin. Voilà la grand-mère de Léo.' },
          { fr: 'mademoiselle …', de: 'Fräulein …', say: 'mademoiselle', ex: 'Merci, [mademoiselle] !', tip: 'Une fille travaille dans le magasin. Elle trouve le stylo de Léo.' },
          { fr: 'Bof!', de: 'Na ja. (ugs.); Ach. (ugs.)', altDe: ['Naja'], say: 'Bof !', ex: 'Ça va ? – [Bof] …', tip: 'Léo : 😐' },
        ],
      },
      {
        section: 'Unité 2 – Copain, copine',
        items: [
          { fr: 'un magasin', de: 'ein Geschäft; ein Laden', ex: 'Marie cherche [un magasin].', tip: 'Marie cherche un stylo et un cahier. Où ?' },
          { fr: 'un journal', de: 'eine Zeitung', ex: 'Le monsieur regarde [un journal].', tip: 'Le monsieur est au café. Page un : le sport. Page deux : Paris …' },
          { fr: 'une BD', de: 'ein Comic', say: 'une bédé', ex: 'Marie regarde [une BD] avec Léo.', tip: 'Astérix, Tintin, Lucky Luke …', sayEx: 'Marie regarde une bédé avec Léo.' },
          { fr: 'une affiche', de: 'ein Plakat; ein Poster', ex: 'Voilà [une affiche] de Malabar.', tip: 'Dans la rue, voilà une grande photo de Malabar au mur.' },
          { fr: "Qu'est-ce que c'est?", de: 'Was ist das?', ex: "[Qu'est-ce que c'est] ? – C'est un livre.", tip: 'Léo trouve un truc dans le sac de Marie : un livre ? un cahier ?' },
          { fr: 'à (Paris)', de: 'in; nach (Paris)', say: 'à', ex: 'Je suis [à] Paris.', tip: 'Où est Marie ? – Paris.' },
          { fr: 'une maison', de: 'ein Haus', ex: "C'est [une maison] à Nice.", tip: 'Marie habite là, avec la grand-mère.' },
          { fr: 'une maison de la presse', de: 'ein Zeitschriften- und Schreibwarengeschäft', altDe: ['Zeitschriftengeschäft', 'Schreibwarengeschäft'], ex: 'Marie arrive à [la maison de la presse].', tip: 'Marie cherche un journal, une BD et un stylo.' },
          { fr: 'Que fait Léo?', de: 'Was macht Léo?', ex: '[Que fait] Léo ? – Il regarde une BD.', tip: 'Marie cherche Léo : il travaille ? il parle ? il écoute ?', sayEx: 'Que fait Léo ? – Il regarde une bédé.' },
          { fr: 'regarder qc', de: 'etwas ansehen; etwas betrachten', alt: ['regarder'], altDe: ['ansehen', 'betrachten'], say: 'regarder', ex: 'Marie [regarde] une affiche.', tip: 'Marie : 👀' },
        ],
      },
      {
        section: 'Unité 2 – Verben und mehr',
        items: [
          { fr: 'parler', de: 'sprechen', ex: 'Marie [parle] avec Léo.', tip: 'Marie : « Salut ! » Léo : « Salut, ça va ? » Marie : « Oui ! »' },
          { fr: 'avec', de: 'mit', ex: 'Je suis ici [avec] Malabar.', tip: 'Léo est ici. Malabar est ici aussi.' },
          { fr: 'arriver', de: 'kommen; ankommen', ex: 'Voilà Léo ! Il [arrive].', tip: "Marie est à l'école. Léo est dans la rue … et voilà, il est là !" },
          { fr: 'chercher qn/qc', de: 'jemanden/etwas suchen', alt: ['chercher'], altDe: ['suchen', 'jemanden suchen'], say: 'chercher', ex: 'Léo [cherche] Malabar.', tip: 'Où est Malabar ? Dans la rue ? Dans le magasin ?' },
        ],
      },
      {
        section: 'Unité 2 – Atelier A1',
        items: [
          { fr: 'français', de: 'französisch', ex: "C'est un livre [français].", tip: 'Dans le livre : « Bonjour ! Merci ! Au revoir ! »' },
          { fr: 'en français', de: 'auf Französisch', ex: 'Marie parle [en français].', tip: 'Marie dit : « Bonjour ! Ça va ? Merci ! »' },
          { fr: 'un sac à dos', de: 'ein Rucksack', sayPhonemes: 'sˈak a dˈo', ex: 'Marie cherche [un sac à dos].', tip: 'Marie est en vacances. Le t-shirt, la BD, la musique : tout est dedans.', sayExPhonemes: 'maʁˈi ʃˈɛʁʃ œ̃ sˈak a dˈo.' },
          { fr: 'un livre', de: 'ein Buch', ex: 'Léo regarde [un livre].', tip: 'Harry Potter, page un, page deux …' },
          { fr: 'un crayon', de: 'ein Bleistift', ex: 'Voilà [un crayon] et une gomme.', tip: 'Léo fait un dessin de Filou. Zut, le dessin est bizarre … vite, la gomme !' },
          { fr: 'un cahier', de: 'ein Heft', ex: 'Voilà [un cahier] et un livre.', tip: "À l'école, Léo écrit les mots de français dedans." },
          { fr: 'un stylo', de: 'ein Füller; ein Kuli', ex: 'Léo cherche [un stylo].', tip: 'Léo écrit une carte à la grand-mère … mais avec quoi ?' },
          { fr: 'une gomme', de: 'ein Radiergummi', ex: "Qu'est-ce que c'est ? – C'est [une gomme].", tip: 'Zut ! Une erreur dans le cahier … Léo cherche un truc dans la trousse.' },
          { fr: 'un truc (fam.)', de: 'ein Ding; eine Sache', say: 'un truc', ex: 'Marie trouve [un truc] ici.', tip: "Marie regarde : qu'est-ce que c'est ? Un crayon ? Un livre ? Euh …" },
        ],
      },
      {
        section: 'Unité 2 – Atelier A2',
        items: [
          { fr: 'écouter qn/qc', de: 'jemandem zuhören; etwas anhören', alt: ['écouter'], altDe: ['zuhören', 'anhören'], say: 'écouter', ex: 'Léo [écoute] Marie.', tip: 'Marie parle, et Léo est là : 👂' },
          { fr: 'trouver qn/qc', de: 'jemanden/etwas finden', alt: ['trouver'], altDe: ['finden', 'jemanden finden'], say: 'trouver', ex: 'Marie [trouve] Malabar !', tip: 'Où est Malabar ? … Ah, voilà Malabar, dans la rue !' },
          { fr: 'porter qc', de: 'etwas tragen', alt: ['porter'], altDe: ['tragen'], say: 'porter', ex: 'Le monsieur [porte] un journal.', tip: 'Le monsieur arrive. Le journal ? Il est dans la main du monsieur.' },
          { fr: 'travailler', de: 'arbeiten', ex: 'Le monsieur [travaille] à Paris.', tip: "Le monsieur arrive au magasin à huit heures. Le magasin, c'est son job !" },
        ],
      },
    ],
  },
  {
    // Buch S. 168–169 (Fotos vom 08.11.), Umfang laut Nutzer „bis une catastrophe“ (Atelier A3, vor B2).
    // Nicht als Karte: Latière, Malou (Namen, Übersetzung gleich), un ami / une amie (schon in „Au début“).
    exam: 'fr6-u1',
    added: '2026-11-08',
    sections: [
      {
        section: 'Unité 2 – Atelier A3',
        items: [
          // „in“ allein ist mehrdeutig: „à“ (wie in „à Paris“) gilt bei dieser Karte auch.
          { fr: 'dans', de: 'in', alt: ['à'], ex: 'Malabar est [dans] le magasin.', tip: 'Malabar entre au magasin … et il est là, avec les journaux.' },
          { fr: 'une rue', de: 'eine Straße', ex: "C'est [une rue] de Paris.", tip: 'Les voitures, les magasins, les maisons … à Paris !' },
          { fr: 'dans la rue', de: 'auf der Straße', ex: 'Le chien est [dans la rue].', tip: 'Le chien est devant les maisons, avec les voitures et les bus.' },
          { fr: 'entrer', de: 'eintreten; hereinkommen', ex: 'Marie [entre] dans la maison de la presse.', tip: 'Marie est devant la porte … et maintenant, elle est dedans.' },
          { fr: 'euh …', de: 'äh …', say: 'euh', ex: '[Euh] … je cherche un stylo.', tip: 'Léo cherche les mots : hmm … 🤔' },
          { fr: 'là', de: 'da; dort', ex: 'Malabar ? Il est [là] !', tip: 'Malabar ? Regarde : devant la maison !' },
          // Die Sprachausgabe verschluckt sonst das t am Ende („chu“).
          { fr: 'Chut!', de: 'Pst!', say: 'Chut !', sayPhonemes: 'ʃˈyt', sayExPhonemes: 'ʃˈyt ! leˈo tʁavˈaj.', ex: '[Chut] ! Léo travaille.', tip: "Léo travaille pour l'école. Malabar, la musique : stop !" },
          { fr: 'pour', de: 'für', ex: "C'est un livre [pour] Marie.", tip: "C'est l'anniversaire de Marie : voilà un cadeau 🎁 !" },
          { fr: 'une école', de: 'eine Schule', ex: 'Marie cherche [une école] à Paris.', tip: 'Marie habite à Paris. Où est sa nouvelle classe ?' },
          { fr: 'en vacances', de: 'in den Ferien', ex: 'Super ! On est [en vacances] !', tip: "Bye-bye l'école ! Voilà la plage ☀️" },
          { fr: 'Tiens!', de: 'Sieh mal!; Schau mal!', say: 'Tiens !', ex: '[Tiens] ! Voilà Malabar !', tip: 'Marie montre Malabar à Léo : 👉' },
          { fr: 'une grand-mère', de: 'eine Großmutter', altDe: ['eine Oma'], ex: "C'est [la grand-mère] de Léo.", tip: 'Elle a 75 ans, elle habite à Nice, et elle aime Léo !' },
          { fr: 'il dit / elle dit', de: 'er sagt / sie sagt', say: 'il dit, elle dit', ex: 'Marie arrive et [elle dit] bonjour.', tip: 'Marie arrive : « Bonjour ! »' },
          { fr: 'un carton', de: 'ein Karton', ex: 'Le chat est dans [un carton].', tip: 'Le nouveau t-shirt de Léo arrive par la poste … et Filou entre dedans !' },
          { fr: 'Zut! (fam.)', de: 'Mist!; Verdammt!', say: 'Zut !', ex: '[Zut] ! Malabar est dans la rue !', tip: 'Léo : 😬' },
          { fr: 'une catastrophe', de: 'eine Katastrophe', ex: "Oh non, c'est [une catastrophe] !", tip: 'Le chat, le chien, le cahier, le livre : tout est dans la rue !' },
        ],
      },
      {
        // Kasten „A l'école“ (S. 169): im Buch nur Bilder, Übersetzung vom Nutzer freigegeben.
        section: "Unité 2 – A l'école",
        items: [
          { fr: 'un cartable', de: 'eine Schultasche; ein Schulranzen', altDe: ['ein Ranzen'], ex: 'Voilà [un cartable] pour Léo.', tip: "Léo a six ans : c'est l'école ! Les cahiers et les livres sont dedans." },
          { fr: 'une trousse', de: 'ein Federmäppchen', altDe: ['ein Mäppchen', 'eine Federmappe'], ex: 'Le stylo est dans [la trousse].', tip: 'Le stylo, le crayon, la gomme … tout est dedans, dans le cartable.' },
          { fr: 'une feuille', de: 'ein Blatt (Papier)', ex: 'Voilà [une feuille] et un crayon.', tip: 'Léo dessine Malabar sur du papier blanc.' },
          { fr: 'un classeur', de: 'ein Ordner', ex: "C'est [un classeur] pour l'école.", tip: 'Les feuilles de français et de maths : tout est dedans.' },
        ],
      },
    ],
  },
  {
    // Buch S. 169–170 (Fotos vom 15.11.), Umfang laut Nutzer „bis B7 ouf“ (le rock = B7).
    // Nicht als Karte: rue Nollet, rue Truffaut (Straßennamen, Übersetzung gleich).
    exam: 'fr6-u1',
    added: '2026-11-15',
    sections: [
      {
        section: 'Unité 2 – Atelier B2',
        items: [
          { fr: 'être', de: 'sein', ex: 'Marie et Léo [sont] à Paris.', tip: 'Marie est à Paris. Léo est à Paris.' },
          { fr: 'devant', de: 'vor (örtlich)', ex: 'Malabar est [devant] la maison.', tip: 'Malabar est dans la rue, à la porte de la maison.' },
          { fr: 'habiter', de: 'wohnen', ex: 'Marie [habite] à Nice.', tip: 'La maison de Marie est à Nice.' },
          { fr: 'où', de: 'wo; wohin', ex: '[Où] est Malabar ?', tip: 'Léo cherche Malabar : dans la rue ? dans le magasin ? à la maison ?' },
          // Die Sprachausgabe liest „t-shirt“ sonst englisch.
          { fr: 'un t-shirt', de: 'ein T-Shirt', sayPhonemes: 'tiʃˈœʁt', sayExPhonemes: 'leˈo pˈɔʁt œ̃ tiʃˈœʁt.', ex: 'Léo porte [un t-shirt].', tip: '☀️ Il fait chaud. Léo porte un truc avec Mickey.' },
          { fr: 'aimer qn/qc', de: 'jemanden/etwas lieben; jemanden/etwas mögen', alt: ['aimer'], altDe: ['lieben', 'mögen', 'jemanden lieben', 'etwas mögen'], say: 'aimer', ex: 'Léo [aime] Malabar.', tip: 'Léo et Malabar : ❤️' },
          { fr: 'le rugby', de: 'das Rugby (Ballspiel)', ex: '[Le rugby], c\'est super !', tip: "Le ballon est ovale, et la France joue contre l'Angleterre !" },
          { fr: 'le judo', de: 'das Judo', ex: 'Marie regarde [le judo] avec Léo.', tip: 'Un sport du Japon : on porte un kimono blanc.' },
          { fr: "Qu'est-ce que …?", de: 'Was …?', say: "Qu'est-ce que", ex: "[Qu'est-ce que] Léo cherche ?", tip: 'Marie : « Léo cherche … un livre ? un stylo ? Malabar ? »' },
          { fr: 'le sport', de: 'der Sport', ex: 'Pour Léo, [le sport], c\'est fantastique.', tip: 'Le judo, le rugby, le tennis : Léo aime tout !' },
          { fr: 'la musique', de: 'die Musik', ex: 'Super ! Marie écoute [la musique].', tip: 'Marie a son casque 🎧 : la la la !' },
          { fr: 'un frère', de: 'ein Bruder', ex: 'Tu es [le frère] de Marie ?', tip: 'Un garçon habite avec Marie et avec le papa de Marie.' },
          { fr: 'une sœur', de: 'eine Schwester', ex: 'Elle est [la sœur] de Léo ?', tip: 'Une fille habite avec Léo et avec le papa de Léo.' },
          { fr: 'sympa', de: 'nett', altDe: ['sympathisch'], ex: 'Malabar est [sympa] !', tip: 'Malabar aime Léo, Marie, Filou … Malabar aime tout le monde !' },
          // „hassen“ steht nicht im Buch, ist aber die Übersetzung, die Kinder schreiben.
          { fr: 'détester qn/qc', de: 'jemanden/etwas verabscheuen', alt: ['détester'], altDe: ['verabscheuen', 'hassen', 'etwas hassen'], say: 'détester', ex: 'Malabar [déteste] le chat.', tip: 'Malabar et Filou ? Grrr !' },
          { fr: 'ça', de: 'das', ex: "[Ça], c'est Malabar !", tip: 'Léo regarde le chien, là, dans la rue : 👉' },
          { fr: "d'accord", de: 'einverstanden; o.k.', altDe: ['okay', 'ok'], ex: "On regarde le rugby ? – [D'accord] !", tip: 'Marie aime le rugby : 👍' },
          { fr: 'alors', de: 'nun; jetzt; dann', ex: '[Alors], Léo, ça va ?', tip: "Léo arrive de l'école. Marie est curieuse : « Et ? »" },
          { fr: 'ouf', de: 'Uff!', say: 'Ouf !', ex: '[Ouf] ! Malabar est là !', tip: 'Léo cherche Malabar, cherche, cherche … et voilà Malabar ! 😮‍💨' },
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
    .replace(/œ/g, 'oe') // „sœur“ → fr6_une_soeur (nicht „s_ur“)
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
