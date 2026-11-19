// Französisch Klasse 6 – Hörverstehen (Wunsch des Nutzers, 2026-11-15): Teil I der 1. Schulaufgabe ist
// „Hör- und Leseverstehen“ (Lernplan). Aufbau wie beim Englischen (src/data/en6/listening.js): erst hören, dann
// Fragen. Aufgabenformen mit zweisprachiger Anweisung wie im Buch („Complète. (Ergänze.)“). Texte und Fragen selbst
// formuliert, nur mit Wörtern bis Unité 2 B7 „ouf“ und der Grammatik G1–G6. Eigene Figuren (Lina, Monsieur Petit,
// Madame Roux, seit 2026-11-19 auch Linas Bruder Malo und die Großmutter) – keine Handlung aus dem Buch oder aus
// den Lesetexten in fr6/questions.js. Neue Hörtexte bauen auf den vorhandenen auf (dieselben Figuren, neue Lage).
// Diese Datei hat KEINE Importe: scripts/export-audio-manifest.mjs liest sie direkt mit Node.
// Stimmen: Für Französisch gibt es nur ff_siwis. Ein zweiter Sprecher bekommt eine tiefere Tonlage (`shift`,
// siehe scripts/generate-audio.py), damit man die Sprecher auseinanderhält.

export const LISTENING_COURSE = 'fr-6';

const LINA = { voice: 'ff_siwis' };

const TASKS = [
  {
    id: 'fr6-l1',
    exam: 'fr6-u1',
    title: 'Au magasin',
    situation:
      'Lina braucht Sachen für die Schule. Sie ist in einem Schreibwarengeschäft in Paris und spricht mit dem ' +
      'Verkäufer, Monsieur Petit.',
    speakers: { Lina: LINA, 'Monsieur Petit': { voice: 'ff_siwis', shift: 0.84 } },
    lines: [
      ['Monsieur Petit', 'Bonjour, mademoiselle !'],
      ['Lina', 'Bonjour, monsieur ! Je cherche un cartable pour l’école.'],
      ['Monsieur Petit', 'Un cartable ? Voilà un cartable. Il est super, non ?'],
      ['Lina', 'Euh … il est bizarre. Et le cartable là, dans le carton ?'],
      ['Monsieur Petit', 'Ah oui ! Voilà.'],
      ['Lina', 'Oh, il est fantastique ! Merci, monsieur.'],
      // Gesprochene Fassung ohne „s“: Die Sprachausgabe bindet sonst „cherches‿aussi“ mit z.
      ['Monsieur Petit', 'Et qu’est-ce que tu cherches aussi ?', 'Et qu’est-ce que tu cherche aussi ?'],
      ['Lina', 'Je cherche une trousse, un classeur et une gomme.'],
      ['Monsieur Petit', 'Voilà une trousse et un classeur. Et une gomme … Zut ! Où est la gomme ?'],
      ['Lina', 'Tiens ! Elle est là, devant le journal.'],
      ['Monsieur Petit', 'Ouf ! Merci.'],
      ['Lina', 'Et qu’est-ce que c’est ?'],
      // „BD“ liest die Sprachausgabe sonst als „boulevard“.
      ['Monsieur Petit', 'C’est une BD. Tu aimes la BD ?', 'C’est une bédé. Tu aimes la bédé ?'],
      ['Lina', 'Bof … Moi, j’aime le sport. Et vous, monsieur, vous habitez à Paris ?'],
      ['Monsieur Petit', 'Oui ! J’habite ici, et je travaille ici. Et toi, tu habites où ?', 'Oui ! J’habite ici, et je travaille ici. Et toi, tu habite où ?'],
      ['Lina', 'J’habite rue Custine. Alors, au revoir, monsieur !'],
      ['Monsieur Petit', 'Au revoir, mademoiselle !'],
    ],
    questions: [
      { kind: 'rw', text: 'Lina cherche un cartable.', right: true, why: 'Vrai – « Je cherche un cartable pour l’école. »' },
      { kind: 'rw', text: 'Pour Lina, le premier cartable est super.', right: false, why: 'Faux – Lina sagt: « Il est bizarre. »' },
      { kind: 'rw', text: 'La gomme est devant le journal.', right: true, why: 'Vrai – « Elle est là, devant le journal. »' },
      { kind: 'rw', text: 'Lina aime la BD.', right: false, why: 'Faux – « Bof … Moi, j’aime le sport. »' },
      { kind: 'rw', text: 'Monsieur Petit travaille dans le magasin.', right: true, why: 'Vrai – « J’habite ici, et je travaille ici. »' },
      {
        kind: 'tick',
        text: 'Was sucht Lina außer dem Schulranzen?',
        options: [
          ['ein Federmäppchen', true],
          ['einen Ordner', true],
          ['ein Heft', false],
          ['einen Radiergummi', true],
          ['einen Füller', false],
        ],
      },
      { kind: 'grid', text: 'Le cartable fantastique est dans ___.', answer: 'le carton', alt: ['un carton'] },
      { kind: 'grid', text: 'Lina aime ___.', answer: 'le sport' },
      { kind: 'answer', text: 'Warum ruft Monsieur Petit „Zut !“?', answer: 'Er findet den Radiergummi nicht.', keywords: [['radiergummi', 'radierer', 'gomme']] },
      { kind: 'answer', text: 'Wo wohnt Monsieur Petit?', answer: 'Hier – beim Geschäft in Paris.', keywords: [['hier', 'ici', 'geschäft', 'laden', 'magasin', 'paris']] },
    ],
  },
  {
    id: 'fr6-l2',
    exam: 'fr6-u1',
    // Baut auf fr6-l1 auf: Lina (rue Custine) interviewt ihre Nachbarin.
    title: 'L’interview',
    situation: 'Für die Schülerzeitung macht Lina ein Interview mit ihrer Nachbarin, Madame Roux.',
    speakers: { Lina: LINA, 'Madame Roux': { voice: 'ff_siwis', shift: 0.9 } },
    lines: [
      ['Lina', 'Bonjour, madame ! C’est pour le journal de l’école. Vous êtes d’accord ?'],
      ['Madame Roux', 'Bonjour, Lina ! Oui, d’accord. Viens !'],
      ['Lina', 'Merci ! Alors … vous êtes de Paris, madame ?'],
      ['Madame Roux', 'Non, je suis de Strasbourg. Mais j’habite ici, rue Custine.'],
      ['Lina', 'Et vous travaillez ?'],
      ['Madame Roux', 'Oui, je travaille dans une école, à Paris.'],
      ['Lina', 'Qu’est-ce que vous aimez ?'],
      ['Madame Roux', 'J’aime le sport : le rugby et le judo !'],
      ['Lina', 'Le judo ? Super ! Et la musique ?'],
      ['Madame Roux', 'La musique ? Bof … Je déteste ça ! Et toi, Lina, qu’est-ce que tu aimes ?'],
      ['Lina', 'Moi ? J’aime la musique ! Euh … qui est-ce ?'],
      ['Madame Roux', 'C’est Pirate. C’est un chien. Il est sympa !'],
      ['Lina', 'Salut, Pirate ! Merci, madame. Au revoir !'],
      ['Madame Roux', 'Au revoir, Lina !'],
    ],
    questions: [
      { kind: 'rw', text: 'Madame Roux est de Paris.', right: false, why: 'Faux – « Je suis de Strasbourg. »' },
      { kind: 'rw', text: 'Madame Roux habite rue Custine.', right: true, why: 'Vrai – « J’habite ici, rue Custine. »' },
      { kind: 'rw', text: 'Madame Roux travaille dans un magasin.', right: false, why: 'Faux – « Je travaille dans une école. »' },
      { kind: 'rw', text: 'Pirate est un chien.', right: true, why: 'Vrai – « C’est un chien. Il est sympa ! »' },
      {
        kind: 'tick',
        text: 'Was erfährst du über Madame Roux?',
        options: [
          ['Sie kommt aus Straßburg.', true],
          ['Sie mag Musik.', false],
          ['Sie mag Rugby.', true],
          ['Sie arbeitet in einer Schule.', true],
          ['Sie hat eine Katze.', false],
        ],
      },
      { kind: 'grid', text: 'Madame Roux aime le rugby et ___.', answer: 'le judo' },
      { kind: 'grid', text: 'Lina aime ___.', answer: 'la musique' },
      { kind: 'answer', text: 'Wofür macht Lina das Interview?', answer: 'Für die Schülerzeitung.', keywords: [['schülerzeitung', 'zeitung', 'journal', 'schule', 'école']] },
      { kind: 'answer', text: 'Was mag Madame Roux überhaupt nicht?', answer: 'Musik.', keywords: [['musik', 'musique']] },
    ],
  },
  {
    id: 'fr6-l3',
    exam: 'fr6-u1',
    // Wunsch des Nutzers (2026-11-19). Baut auf fr6-l1 und fr6-l2 auf: Pirate, der Hund von Madame Roux, ist weg;
    // Lina hilft suchen und fragt Monsieur Petit in seinem Geschäft.
    title: 'Où est Pirate ?',
    situation: 'Lina trifft ihre Nachbarin Madame Roux auf der Straße. Madame Roux ist ganz aufgeregt.',
    speakers: { Lina: LINA, 'Madame Roux': { voice: 'ff_siwis', shift: 0.9 }, 'Monsieur Petit': { voice: 'ff_siwis', shift: 0.84 } },
    lines: [
      ['Madame Roux', 'Lina ! Catastrophe !'],
      ['Lina', 'Bonjour, madame ! Ça va ?'],
      ['Madame Roux', 'Non, ça ne va pas ! Je cherche Pirate !'],
      ['Lina', 'Pirate ? Il est dans la maison, non ?'],
      ['Madame Roux', 'Non, il est dans la rue. Je cherche, je cherche … Zut !'],
      ['Lina', 'D’accord. Je cherche avec vous, madame. Pirate ! Pirate ! Viens !'],
      ['Madame Roux', 'Merci, Lina. Tu es sympa.'],
      ['Lina', 'Tiens, voilà le magasin de Monsieur Petit. On entre ?'],
      ['Madame Roux', 'Oui, d’accord.'],
      ['Monsieur Petit', 'Bonjour, madame ! Bonjour, mademoiselle !'],
      ['Lina', 'Bonjour, monsieur ! Nous cherchons Pirate, le chien de Madame Roux.'],
      ['Monsieur Petit', 'Un chien ? Ici ? Non, pardon. Mais regardez, là, dans la rue ! Devant l’école … C’est un chien, non ?'],
      ['Madame Roux', 'Oui ! C’est Pirate ! Merci, monsieur ! Vite, Lina !'],
      ['Lina', 'Pirate ! Viens ! … Tiens, il porte un truc. Qu’est-ce que c’est ?'],
      // „t-shirt“ liest die Sprachausgabe sonst englisch (wie in fr6/vocab.js: tiʃˈœʁt).
      ['Madame Roux', 'Euh … c’est un t-shirt. Ah ! C’est le t-shirt pour le judo ! Je cherche ça aussi !', 'Euh … c’est un ticheurte. Ah ! C’est le ticheurte pour le judo ! Je cherche ça aussi !'],
      ['Lina', 'Et Pirate trouve le t-shirt ici, à l’école ?', 'Et Pirate trouve le ticheurte ici, à l’école ?'],
      ['Madame Roux', 'Oui ! Je travaille ici, dans l’école. Pirate, tu es fantastique !'],
      ['Lina', 'Ouf ! Au revoir, madame ! À plus, Pirate !'],
      ['Madame Roux', 'Au revoir, Lina ! Et merci !'],
    ],
    questions: [
      { kind: 'rw', text: 'Madame Roux cherche un chat.', right: false, why: 'Faux – Sie sucht Pirate, « le chien de Madame Roux ».' },
      { kind: 'rw', text: 'Pirate est dans la maison.', right: false, why: 'Faux – « Non, il est dans la rue. »' },
      { kind: 'rw', text: 'Lina et Madame Roux entrent dans le magasin de Monsieur Petit.', right: true, why: 'Vrai – « On entre ? – Oui, d’accord. »' },
      { kind: 'rw', text: 'Pirate est dans le magasin.', right: false, why: 'Faux – « Un chien ? Ici ? Non, pardon. »' },
      { kind: 'rw', text: 'Madame Roux travaille dans l’école.', right: true, why: 'Vrai – « Je travaille ici, dans l’école. »' },
      {
        kind: 'tick',
        text: 'Was stimmt?',
        options: [
          ['Lina hilft Madame Roux beim Suchen.', true],
          ['Pirate ist im Geschäft von Monsieur Petit.', false],
          ['Monsieur Petit sieht Pirate vor der Schule.', true],
          ['Pirate trägt etwas im Maul.', true],
          ['Madame Roux sucht auch ein Buch.', false],
        ],
      },
      { kind: 'grid', text: 'Pirate est devant ___.', answer: 'l’école' },
      { kind: 'grid', text: 'Pirate porte ___.', answer: 'un t-shirt', alt: ['le t-shirt'] },
      { kind: 'answer', text: 'Warum ruft Madame Roux „Catastrophe !“?', answer: 'Sie findet ihren Hund Pirate nicht.', keywords: [['pirate', 'hund', 'chien']] },
      { kind: 'answer', text: 'Wofür braucht Madame Roux das T-Shirt?', answer: 'Fürs Judo.', keywords: [['judo']] },
    ],
  },
  {
    id: 'fr6-l4',
    exam: 'fr6-u1',
    // Wunsch des Nutzers (2026-11-19). Baut auf fr6-l1 auf: Lina mag Sport, Comics eher nicht. Neu: Linas Bruder Malo
    // und die Großmutter, die in den Ferien kommt. Drei Stimmen: Malo höher (shift > 1), Großmutter tiefer.
    title: 'Grand-mère arrive',
    situation: 'Linas Großmutter kommt in den Ferien nach Paris. Lina und ihr Bruder Malo warten vor dem Haus.',
    speakers: { Lina: LINA, Malo: { voice: 'ff_siwis', shift: 1.12 }, 'Grand-mère': { voice: 'ff_siwis', shift: 0.86 } },
    lines: [
      ['Malo', 'Lina ! Viens vite ! Grand-mère arrive !'],
      ['Lina', 'Super ! … Bonjour, grand-mère ! Bienvenue à Paris !'],
      ['Grand-mère', 'Bonjour, Lina ! Bonjour, Malo ! Ouf, je suis là !'],
      ['Malo', 'Ça va, grand-mère ?'],
      ['Grand-mère', 'Oui, ça va bien, merci. Mais attention : les cartons !'],
      ['Lina', 'Les cartons ? Un, deux, trois, quatre, cinq, six, sept … Sept cartons !'],
      ['Grand-mère', 'Non, huit ! Regarde, là, devant la maison.'],
      ['Malo', 'Huit cartons ? Qu’est-ce que c’est ?'],
      // „BD“ liest die Sprachausgabe sonst als „boulevard“.
      ['Grand-mère', 'Ça ? C’est pour vous ! Tiens, Malo, voilà une BD.', 'Ça ? C’est pour vous ! Tiens, Malo, voilà une bédé.'],
      ['Malo', 'Une BD ! Fantastique ! J’aime la BD. Merci, grand-mère !', 'Une bédé ! Fantastique ! J’aime la bédé. Merci, grand-mère !'],
      ['Grand-mère', 'Et pour toi, Lina, voilà une BD aussi.', 'Et pour toi, Lina, voilà une bédé aussi.'],
      ['Lina', 'Euh … merci, grand-mère. Mais moi, la BD … bof.', 'Euh … merci, grand-mère. Mais moi, la bédé … bof.'],
      ['Grand-mère', 'Zut ! Et le rugby, tu aimes ?'],
      ['Lina', 'Oui ! J’aime le sport !'],
      ['Grand-mère', 'Alors, voilà une affiche de rugby !'],
      ['Lina', 'Oh, elle est super ! Merci ! Et la BD, c’est pour Malo.', 'Oh, elle est super ! Merci ! Et la bédé, c’est pour Malo.'],
      ['Malo', 'Deux BD ! Super ! … Euh … regardez ! Le carton, là … il arrive !', 'Deux bédés ! Super ! … Euh … regardez ! Le carton, là … il arrive !'],
      ['Lina', 'Attention ! Qu’est-ce que c’est ?'],
      // Ohne „s“ gesprochen: Die Sprachausgabe hängt sonst ein „z“ an („vacances‿aussi“).
      ['Grand-mère', 'Ah ! C’est Turbo, une tortue. Elle est en vacances aussi !', 'Ah ! C’est Turbo, une tortue. Elle est en vacance aussi !'],
      ['Malo', 'Turbo ? Pour une tortue ? C’est bizarre !'],
      ['Grand-mère', 'Mais non ! Regarde : elle arrive vite !'],
      ['Lina', 'Vite ? Euh … bof !'],
      ['Malo', 'Bienvenue à Paris, Turbo !'],
    ],
    questions: [
      { kind: 'rw', text: 'Grand-mère arrive avec sept cartons.', right: false, why: 'Faux – « Non, huit ! »' },
      { kind: 'rw', text: 'Malo aime la BD.', right: true, why: 'Vrai – « J’aime la BD. »' },
      { kind: 'rw', text: 'Lina aime la BD.', right: false, why: 'Faux – « Mais moi, la BD … bof. »' },
      { kind: 'rw', text: 'L’affiche est pour Malo.', right: false, why: 'Faux – Das Rugby-Plakat ist für Lina.' },
      { kind: 'rw', text: 'Turbo est une tortue.', right: true, why: 'Vrai – « C’est Turbo, une tortue. »' },
      {
        kind: 'tick',
        text: 'Was bringt die Großmutter mit?',
        options: [
          ['ein Rugby-Plakat', true],
          ['ein T-Shirt', false],
          ['zwei Comics', true],
          ['ein Buch', false],
          ['eine Schildkröte', true],
        ],
      },
      { kind: 'grid', text: 'Grand-mère arrive avec ___ cartons.', answer: 'huit', alt: ['8'] },
      { kind: 'grid', text: 'Malo regarde : le carton ___ !', answer: 'arrive' },
      {
        kind: 'answer',
        text: 'Warum findet Malo den Namen „Turbo“ komisch?',
        answer: 'Turbo ist eine Schildkröte – und Schildkröten sind langsam.',
        keywords: [['schildkröte', 'schildkröten', 'tortue', 'langsam']],
      },
      { kind: 'answer', text: 'Was macht Lina mit ihrem Comic?', answer: 'Sie gibt ihn Malo.', keywords: [['malo', 'bruder']] },
    ],
  },
];

// Anweisungen zweisprachig wie im Buch.
const SECTIONS = {
  rw: 'Vrai ou faux ? (Richtig oder falsch?)',
  grid: 'Complète. (Ergänze auf Französisch.)',
  tick: 'Coche les bonnes réponses. (Kreuze alle richtigen Antworten an.)',
  answer: 'Réponds en allemand. (Antworte auf Deutsch – Stichworte genügen.)',
};

/** Text zum Mitlesen (Lehrer-Bereich, Ersatzstimme) – mit Sprechernamen. */
export function listeningText(task) {
  return task.lines.map(([who, text]) => `${who}: ${text}`).join('\n');
}

/** Abschnitte fürs Audio: jede Zeile mit Stimme (und Tonlage) ihres Sprechers. */
export function listeningSegments(task) {
  return task.lines.map(([who, text, spoken]) => ({ ...task.speakers[who], text: spoken || text }));
}

/** Audio-Angabe für den Player (public/audio/fr-6/<id>.m4a). */
export const listeningAudio = (task) => ({ course: LISTENING_COURSE, id: task.id, text: listeningText(task), lang: 'fr' });

function buildQuestions(task) {
  return task.questions.map((q, i) => {
    const base = {
      id: `${task.id}-${String(i + 1).padStart(2, '0')}`,
      exam: task.exam,
      course: LISTENING_COURSE,
      topic: 'fr_listening',
      topicLabel: 'Hörverstehen',
      category: 'listening',
      listening: task.id,
      difficulty: q.kind === 'answer' ? 2 : 1,
      instruction: SECTIONS[q.kind],
    };
    if (q.kind === 'rw') {
      return {
        ...base,
        type: 'reading_true_false',
        question: q.text,
        correct: q.right ? 'true' : 'false',
        tfLabels: ['Vrai', 'Faux'],
        explanation: q.why || (q.right ? 'Vrai.' : 'Faux.'),
      };
    }
    if (q.kind === 'grid') {
      return {
        ...base,
        type: 'fill_gap',
        answerLang: 'fr',
        question: q.text,
        correct: q.answer,
        alternativeCorrect: q.alt || [],
        explanation: q.text.replace('___', q.answer),
      };
    }
    if (q.kind === 'tick') {
      const correctOptions = q.options.filter(([, ok]) => ok).map(([o]) => o);
      return {
        ...base,
        type: 'multi_select',
        question: q.text,
        options: q.options.map(([o]) => o),
        correctOptions,
        correct: correctOptions.join(' | '),
        explanation: `Richtig: ${correctOptions.join(' · ')}`,
      };
    }
    return {
      ...base,
      type: 'short_answer',
      question: q.text,
      correct: q.answer,
      alternativeCorrect: q.alt || [],
      keywords: q.keywords,
      explanation: `Zum Beispiel: ${q.answer}`,
    };
  });
}

export const FR6_LISTENING = TASKS.map((t) => ({ ...t, audio: listeningAudio(t), questions: buildQuestions(t) }));
export const FR6_LISTENING_QUESTIONS = FR6_LISTENING.flatMap((t) => t.questions);
