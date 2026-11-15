// Französisch Klasse 6 – Hörverstehen (Wunsch des Nutzers, 2026-11-15): Teil I der 1. Schulaufgabe ist
// „Hör- und Leseverstehen“ (Lernplan). Aufbau wie beim Englischen (src/data/en6/listening.js): erst hören, dann
// Fragen. Aufgabenformen mit zweisprachiger Anweisung wie im Buch („Complète. (Ergänze.)“). Texte und Fragen selbst
// formuliert, nur mit Wörtern bis Unité 2 B7 „ouf“ und der Grammatik G1–G6. Eigene Figuren (Lina, Monsieur Petit,
// Madame Roux) – keine Handlung aus dem Buch oder aus den Lesetexten in fr6/questions.js.
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
