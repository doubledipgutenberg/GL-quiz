// Französisch Klasse 6 – 1. Schulaufgabe (20.11.): Unité 1 „Bonjour, Paris!“ + Unité 2 „Copain, copine“.
// Grammatik/Redemittel aus dem Vokabelteil (Merke-Kasten être, Vis-à-vis-Kästen) und – ab „Unité 2“ unten –
// aus dem Lernplan der Lehrerin und dem grammatischen Beiheft G1–G6 (S. 5–12, Fotos vom 15.11.).
// Sätze angelehnt an die Beispielsätze des Buchs, aber selbst formuliert.
// answerLang 'fr' → Akzent-Tasten + strenger Akzent-Check.

const EXAM = 'fr6-u1';

const T = {
  etre: ['fr_etre', 'être (alle Formen)'],
  article: ['fr_article', 'un / une'],
  sappeler: ['fr_sappeler', "je m'appelle / tu t'appelles"],
  moitoi: ['fr_moi_toi', 'moi / toi'],
  cest: ['fr_cest', "c'est / Qui est-ce?"],
  de: ['fr_de', 'de (aus)'],
  salut: ['fr_situations', 'Begrüßen & Verabschieden'],
  reading: ['fr_reading', 'Leseverstehen'],
  ilelle: ['fr_il_elle', 'il oder elle?'],
  petites: ['fr_petites', 'Kleine Unterschiede (Oui/Qui, et/es/est)'],
  nombres: ['fr_nombres', 'Zahlen 0–12'],
  sons: ['fr_sons', 'Nasallaute schreiben (on, an/en, in/ain)'],
  ecrire: ['fr_ecrire', 'Fragen stellen (Interview)'],
  intrus: ['fr_intrus', 'Cherche l’intrus'],
  mots: ['fr_mots', 'Wortarten, Akzente & Zeichen'],
  lire: ['fr_lire', 'Schilder & Aufschriften verstehen'],
  // Unité 2 (Lernplan zur 1. Schulaufgabe)
  defini: ['fr_article_defini', "le / la / l'"],
  pronoms: ['fr_pronoms', 'Personalpronomen (on, nous, vous, ils/elles)'],
  verbesEr: ['fr_verbes_er', 'Verben auf -er'],
  apostrophe: ['fr_apostrophe', "Apostroph: l', j', qu'"],
  questions: ['fr_questions', 'Fragen mit und ohne Fragewort'],
  parler: ['fr_parler', 'Sagen, wo du wohnst und was du magst'],
};

const q = (id, [topic, topicLabel], category, rest) => ({
  id: `fr6-u1-${id}`,
  exam: EXAM,
  topic,
  topicLabel,
  category,
  difficulty: 1,
  // Aussagen zum Lesetext stehen auf Deutsch → deutsche Knöpfe statt True/False.
  ...(rest.type === 'reading_true_false' ? { tfLabels: ['Richtig', 'Falsch'] } : {}),
  ...rest,
});

const readingText =
  'Léo : Salut ! Je m’appelle Léo. Et toi ?\n' +
  'Marie : Moi, je m’appelle Marie.\n' +
  'Léo : Tu es de Paris ?\n' +
  'Marie : Non, je suis de Nice. Et toi ?\n' +
  'Léo : Moi, je suis de Paris. Voilà Malabar ! C’est un chien.\n' +
  'Marie : Oh, il est super !';

const readingText2 =
  'Nathan : Salut ! Ça va ?\n' +
  'Manon : Ça va bien, merci. Et toi ?\n' +
  'Nathan : Ça va. Je m’appelle Nathan. Tu es d’ici ?\n' +
  'Manon : Non, je suis de Nice. Et voilà Coco !\n' +
  'Nathan : Qui est-ce ?\n' +
  'Manon : C’est un perroquet. Il est bizarre, mais il est fantastique !\n' +
  'Nathan : Attention, voilà Filou ! C’est un chat …\n' +
  'Manon : Oh non ! Vite, Coco ! Au revoir, Nathan !';

// Steckbriefe wie im Bilan „Ecouter et lire“ (eigene Personen).
const profilesText =
  'Inès – Ville : Toulouse – Copine : Camille – Animal : un hamster\n' +
  'Lucas – Ville : Brest – Copine : Emma – Animal : deux chats\n' +
  'Chloé – Ville : Strasbourg – Copine : Sarah – Animal : –\n' +
  'Hugo – Ville : Nice – Copine : Léa – Animal : un perroquet';

// Unité 2: wohnen, mögen, Geschwister – eigene Personen, nur Wörter bis B7 „ouf“.
const readingText3 =
  'Zoé : Salut ! Je m’appelle Zoé. Et toi ?\n' +
  'Théo : Moi, c’est Théo. J’habite rue Lepic. Et toi, tu habites où ?\n' +
  'Zoé : Moi aussi, j’habite rue Lepic ! Qu’est-ce que tu aimes, Théo ?\n' +
  'Théo : J’aime le rugby et la musique.\n' +
  'Zoé : Le rugby ? Bof … Je déteste le rugby ! Moi, j’aime le judo.\n' +
  'Théo : Tiens ! Voilà Jade et Noé. Ils sont sympas ?\n' +
  'Zoé : Oui ! Ils sont frère et sœur.\n' +
  'Jade : Salut ! On regarde le judo à l’école ?\n' +
  'Noé : D’accord ! Euh … Zut ! Où est le cartable ?\n' +
  'Jade : Il est là, devant la maison.\n' +
  'Noé : Ouf !';

// Hinweis: In Freitext-Antworten (answerLang 'fr') keine Kommas in `correct` –
// Komma und Semikolon trennen dort Alternativen. Weitere Lösungen → alternativeCorrect.
const questionsFR6 = [
  // ---------- être ----------
  q('etre-1', T.etre, 'grammar', {
    type: 'multiple_choice', question: 'Je ___ de Paris.', options: ['suis', 'es', 'est'], correct: 'suis',
    hint: 'je → ?', explanation: 'je suis = ich bin',
  }),
  q('etre-2', T.etre, 'grammar', {
    type: 'multiple_choice', question: 'Tu ___ de Toulouse ?', options: ['suis', 'es', 'est'], correct: 'es',
    hint: 'tu → ?', explanation: 'tu es = du bist',
  }),
  q('etre-3', T.etre, 'grammar', {
    type: 'multiple_choice', question: 'Léo ___ de Paris.', options: ['suis', 'es', 'est'], correct: 'est',
    hint: 'Léo = il', explanation: 'il est = er ist (Léo est …)',
  }),
  q('etre-4', T.etre, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Marie ___ de Nice. (être)', correct: 'est',
    hint: 'Marie = elle', explanation: 'elle est = sie ist → Marie est de Nice.',
  }),
  q('etre-5', T.etre, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Moi, je ___ Clara. (être)', correct: 'suis',
    hint: 'je → ?', explanation: 'je suis = ich bin',
  }),

  // ---------- un / une ----------
  q('art-1', T.article, 'grammar', {
    type: 'multiple_choice', question: '___ chat', options: ['un', 'une'], correct: 'un',
    hint: 'le chat', explanation: 'un chat – männlich',
  }),
  q('art-2', T.article, 'grammar', {
    type: 'multiple_choice', question: '___ fille', options: ['un', 'une'], correct: 'une',
    hint: 'la fille', explanation: 'une fille – weiblich',
  }),
  q('art-3', T.article, 'grammar', {
    type: 'multiple_choice', question: '___ chanson', options: ['un', 'une'], correct: 'une',
    hint: 'la chanson', explanation: 'une chanson – weiblich (auch wenn es im Deutschen „das Lied“ heißt)',
  }),
  q('art-4', T.article, 'grammar', {
    type: 'multiple_choice', question: '___ garçon', options: ['un', 'une'], correct: 'un',
    hint: 'le garçon', explanation: 'un garçon – männlich',
  }),
  q('art-5', T.article, 'grammar', {
    type: 'multiple_choice', question: '___ dame', options: ['un', 'une'], correct: 'une',
    hint: 'la dame', explanation: 'une dame – weiblich',
  }),

  // ---------- s'appeler ----------
  q('app-1', T.sappeler, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Salut ! Je ___ Léo.', correct: "m'appelle",
    hint: 'ich heiße = je …', explanation: "je m'appelle = ich heiße",
  }),
  q('app-2', T.sappeler, 'grammar', {
    type: 'multiple_choice', question: 'Tu ___ comment ?', options: ["t'appelles", "m'appelle", 'appelle'], correct: "t'appelles",
    hint: 'du heißt = tu …', explanation: "Tu t'appelles comment ? = Wie heißt du?",
  }),
  q('app-3', T.sappeler, 'grammar', {
    type: 'word_order', answerLang: 'fr', difficulty: 2, question: 'Bringe die Wörter in die richtige Reihenfolge:',
    words: ['comment', 'Tu', "t'appelles"], correct: "Tu t'appelles comment",
    hint: 'Wie heißt du?', explanation: "Tu t'appelles comment ? = Wie heißt du?",
  }),

  // ---------- moi / toi ----------
  q('moi-1', T.moitoi, 'grammar', {
    type: 'multiple_choice', question: "Je m'appelle Manon. Et ___ ?", options: ['toi', 'moi', 'tu'], correct: 'toi',
    hint: 'Und du?', explanation: 'Et toi ? = Und du? (betontes „du“)',
  }),
  q('moi-2', T.moitoi, 'grammar', {
    type: 'multiple_choice', question: "___, je m'appelle Lucas.", options: ['Moi', 'Toi', 'Je'], correct: 'Moi',
    hint: 'Ich (betont) …', explanation: "Moi, je m'appelle Lucas. – betontes „ich“",
  }),

  // ---------- c'est / Qui est-ce? ----------
  q('cest-1', T.cest, 'grammar', {
    type: 'multiple_choice', question: '– Qui est-ce ? – ___ Malabar.', options: ["C'est", 'Je suis', 'Tu es'], correct: "C'est",
    hint: 'Das ist …', explanation: "C'est Malabar. = Das ist Malabar.",
  }),
  q('cest-2', T.cest, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 2, question: 'Schreib auf Französisch: „Wer ist das?“',
    correct: 'Qui est-ce?', hint: 'Wer ist das? = Qui …', explanation: 'Qui est-ce ? = Wer ist das?',
  }),
  q('cest-3', T.cest, 'grammar', {
    type: 'multiple_choice', question: 'Da ist Malabar! = ___ Malabar !', options: ['Voilà', "C'est", 'Ici'], correct: 'Voilà',
    hint: 'da ist / da sind', explanation: 'Voilà Malabar ! = Da ist Malabar!',
  }),

  // ---------- de ----------
  q('de-1', T.de, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', question: 'Marie est ___ Strasbourg.', correct: 'de',
    hint: 'aus = ?', explanation: 'être de … = aus … sein',
  }),
  q('de-2', T.de, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 2, question: 'Schreib auf Französisch: „Ich bin aus Paris.“',
    correct: 'Je suis de Paris.', hint: 'je suis + de + Stadt', explanation: 'Je suis de Paris. = Ich bin aus Paris.',
  }),

  // ---------- Begrüßen & Verabschieden (Vis-à-vis) ----------
  q('sal-1', T.salut, 'grammar', {
    type: 'multiple_choice', question: 'Du triffst deinen Freund Léo. Was sagst du?',
    options: ['Salut, Léo !', 'Bonjour, monsieur !', 'Au revoir !'], correct: 'Salut, Léo !',
    hint: 'Unter Freunden …', explanation: 'Freunde begrüßen sich mit „Salut !“.',
  }),
  q('sal-2', T.salut, 'grammar', {
    type: 'multiple_choice', question: 'Du begrüßt eine erwachsene Frau, die du nicht gut kennst.',
    options: ['Bonjour, madame !', 'Salut !', 'A plus !'], correct: 'Bonjour, madame !',
    hint: 'Erwachsene begrüßt man höflich …', explanation: 'Erwachsene begrüßt man mit „Bonjour, madame/monsieur !“.',
  }),
  q('sal-3', T.salut, 'grammar', {
    type: 'multiple_choice', question: 'Du verabschiedest dich von einem Lehrer.',
    options: ['Au revoir, monsieur !', 'Salut !', 'Ça va ?'], correct: 'Au revoir, monsieur !',
    hint: 'Von Erwachsenen verabschiedet man sich …', explanation: 'Von Erwachsenen eher mit „Au revoir !“.',
  }),
  q('sal-4', T.salut, 'grammar', {
    type: 'multiple_choice', question: '– Ça va ? – ___',
    options: ['Oui, ça va, merci.', "Je m'appelle Léo.", "C'est Malabar."], correct: 'Oui, ça va, merci.',
    hint: 'Wie geht’s?', explanation: 'Ça va, merci. = Danke, mir geht’s gut.',
  }),
  q('sal-5', T.salut, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 2, question: 'Schreib auf Französisch: „Das geht nicht.“',
    correct: 'Ça ne va pas.', hint: 'Ça … pas.', explanation: 'Ça ne va pas. = Das geht nicht.',
  }),

  // ---------- Leseverstehen ----------
  q('read-1', T.reading, 'reading', {
    type: 'reading_true_false', difficulty: 2, text: readingText,
    question: 'Marie ist aus Paris.', correct: 'false',
    hint: 'Woher ist Marie?', explanation: '„Non, je suis de Nice.“ – Marie ist aus Nizza.',
  }),
  q('read-2', T.reading, 'reading', {
    type: 'reading_true_false', difficulty: 2, text: readingText,
    question: 'Léo ist aus Paris.', correct: 'true',
    hint: 'Was sagt Léo am Ende?', explanation: '„Moi, je suis de Paris.“',
  }),
  q('read-3', T.reading, 'reading', {
    type: 'reading_true_false', difficulty: 2, text: readingText,
    question: 'Malabar ist eine Katze.', correct: 'false',
    hint: 'Was ist Malabar?', explanation: '„C’est un chien.“ – Malabar ist ein Hund.',
  }),
  q('read-4', T.reading, 'reading', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, text: readingText,
    question: 'Marie : Non, je suis de ___.', correct: 'Nice',
    hint: 'Woher kommt Marie?', explanation: '„Non, je suis de Nice.“',
  }),

  // ===== Ergänzt nach dem Cahier d'activités (Unité 1, S. 7–17) =====

  // ---------- Dialog ergänzen (Cahier Nr. 2) ----------
  q('dia-1', T.salut, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', question: '– Ça va ? – Ça va ___, merci.', correct: 'bien',
    hint: 'gut = ?', explanation: 'Ça va bien, merci. = Mir geht’s gut, danke.',
  }),
  q('dia-2', T.sappeler, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: "Tu t'___ comment ?", correct: 'appelles',
    hint: 'tu t’appel…', explanation: "Tu t'appelles comment ? – mit zwei l und -es am Ende",
  }),
  q('dia-3', T.sappeler, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', question: "Moi, ___ m'appelle Clara.", correct: 'je',
    hint: 'ich = ?', explanation: "Moi, je m'appelle Clara.",
  }),

  // ---------- Interview: die passende Frage schreiben (Cahier Nr. 11) ----------
  q('ecr-1', T.ecrire, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 2,
    question: 'Ein Reporter interviewt Marie. Sie antwortet: „Je m’appelle Marie.“ – Was hat er gefragt?',
    correct: "Tu t'appelles comment?", alternativeCorrect: ["Comment tu t'appelles?"],
    hint: 'Wie heißt du?', explanation: "Tu t'appelles comment ? = Wie heißt du?",
  }),
  q('ecr-2', T.ecrire, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 2,
    question: 'Marie antwortet: „Ça va bien, merci.“ – Was hat der Reporter gefragt?',
    correct: 'Ça va?', alternativeCorrect: ['Ça va bien?'],
    hint: 'Wie geht’s?', explanation: 'Ça va ? = Wie geht’s? (Achtung: Ç mit Cédille)',
  }),
  q('ecr-3', T.ecrire, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 2,
    question: 'Marie antwortet: „Oui, je suis de Paris.“ – Was hat der Reporter gefragt?',
    correct: 'Tu es de Paris?',
    hint: 'Bist du aus Paris?', explanation: 'Tu es de Paris ? = Bist du aus Paris?',
  }),
  q('ecr-4', T.ecrire, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 2,
    question: 'Marie antwortet: „Moustique ? C’est un chien.“ – Was hat der Reporter gefragt?',
    correct: 'Qui est-ce?', alternativeCorrect: ['Moustique qui est-ce?'],
    hint: 'Wer ist das?', explanation: 'Qui est-ce ? = Wer ist das?',
  }),

  // ---------- il oder elle? (Cahier Nr. 10, Bilan 4) ----------
  q('ie-1', T.ilelle, 'grammar', {
    type: 'multiple_choice', question: 'Gabriel est de Nice. → ___ est de Nice.', options: ['Il', 'Elle'], correct: 'Il',
    hint: 'Gabriel ist ein Junge.', explanation: 'Junge → il',
  }),
  q('ie-2', T.ilelle, 'grammar', {
    type: 'multiple_choice', question: 'Clara est super. → ___ est super.', options: ['Il', 'Elle'], correct: 'Elle',
    hint: 'Clara ist ein Mädchen.', explanation: 'Mädchen → elle',
  }),
  q('ie-3', T.ilelle, 'grammar', {
    type: 'multiple_choice', question: 'Voilà Malabar. ___ est fantastique !', options: ['Il', 'Elle'], correct: 'Il',
    hint: 'un chien', explanation: 'Malabar ist un chien → il',
  }),
  q('ie-4', T.ilelle, 'grammar', {
    type: 'multiple_choice', difficulty: 2, question: 'Voilà une tortue. ___ est bizarre.', options: ['Il', 'Elle'], correct: 'Elle',
    hint: 'une tortue → weiblich', explanation: 'Auch bei Tieren zählt das Geschlecht des Wortes: une tortue → elle',
  }),
  q('ie-5', T.ilelle, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Jakob est de Paris ? – Oui, ___ est de Paris.', correct: 'il',
    hint: 'Jakob = er', explanation: 'il est = er ist',
  }),
  q('ie-6', T.etre, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Léa : Non, je ___ de Strasbourg. (être)', correct: 'suis',
    hint: 'je → ?', explanation: 'je suis = ich bin',
  }),
  q('ie-7', T.etre, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Bonjour Filou, tu ___ bizarre ! (être)', correct: 'es',
    hint: 'tu → ?', explanation: 'tu es = du bist',
  }),

  // ---------- Bilan 4: un/une + Pronomen + être ----------
  q('bil-1', T.article, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', question: 'Attention ! Voilà ___ animal.', correct: 'un',
    hint: 'un animal', explanation: 'un animal – männlich',
  }),
  q('bil-2', T.article, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', question: "C'est Caroline, ___ copine.", correct: 'une',
    hint: 'eine Freundin', explanation: 'une copine – weiblich (un copain – männlich)',
  }),
  q('bil-3', T.article, 'grammar', {
    type: 'multiple_choice', question: '___ perroquet', options: ['un', 'une'], correct: 'un',
    hint: 'le perroquet', explanation: 'un perroquet – männlich',
  }),
  q('bil-4', T.article, 'grammar', {
    type: 'multiple_choice', question: '___ perruche', options: ['un', 'une'], correct: 'une',
    hint: 'la perruche', explanation: 'une perruche – weiblich',
  }),
  q('bil-5', T.article, 'grammar', {
    type: 'multiple_choice', question: '___ monsieur', options: ['un', 'une'], correct: 'un',
    hint: 'ein Herr', explanation: 'un monsieur – männlich',
  }),

  // ---------- Kleine Unterschiede: Oui/Qui, et/es/est (Cahier Nr. 9) ----------
  q('pet-1', T.petites, 'grammar', {
    type: 'multiple_choice', question: '– Ça va, toi ? – ___, ça va bien.', options: ['Oui', 'Qui'], correct: 'Oui',
    hint: 'ja', explanation: 'Oui = ja · Qui = wer',
  }),
  q('pet-2', T.petites, 'grammar', {
    type: 'multiple_choice', question: '___ est-ce ? – C’est Jakob.', options: ['Oui', 'Qui'], correct: 'Qui',
    hint: 'Wer ist das?', explanation: 'Qui est-ce ? = Wer ist das?',
  }),
  q('pet-3', T.petites, 'grammar', {
    type: 'multiple_choice', question: 'Voilà Clara ___ Jakob.', options: ['et', 'es', 'est'], correct: 'et',
    hint: 'und', explanation: 'et = und',
  }),
  q('pet-4', T.petites, 'grammar', {
    type: 'multiple_choice', question: 'Tu ___ de Toulouse ?', options: ['et', 'es', 'est'], correct: 'es',
    hint: 'du bist', explanation: 'tu es = du bist',
  }),
  q('pet-5', T.petites, 'grammar', {
    type: 'multiple_choice', question: 'Moustique ___ super !', options: ['et', 'es', 'est'], correct: 'est',
    hint: 'er ist', explanation: 'il est → Moustique est super !',
  }),
  q('pet-6', T.petites, 'grammar', {
    type: 'multiple_choice', difficulty: 2, question: 'Toi, tu ___ fantastique ___ Malabar ___ super !',
    options: ['es – et – est', 'est – et – es', 'et – es – est'], correct: 'es – et – est',
    hint: 'du bist … und … er ist', explanation: 'Toi, tu es fantastique et Malabar est super !',
  }),

  // ---------- Zahlen 0–12 (Cahier Nr. 12, 13) ----------
  q('nb-1', T.nombres, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 2,
    question: 'Code secret: Schreib die Zahlen in Worten: 5 – 9 – 7 – 1', correct: 'cinq neuf sept un',
    hint: 'cinq …', explanation: 'cinq – neuf – sept – un',
  }),
  q('nb-2', T.nombres, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 2,
    question: 'Code secret: Schreib die Zahlen in Worten: 6 – 4 – 3 – 8', correct: 'six quatre trois huit',
    hint: 'six …', explanation: 'six – quatre – trois – huit',
  }),
  q('nb-3', T.nombres, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 2,
    question: 'Code secret: Schreib die Zahlen in Worten: 2 – 10 – 12 – 11', correct: 'deux dix douze onze',
    hint: 'deux …', explanation: 'deux – dix – douze – onze',
  }),
  q('nb-4', T.nombres, 'grammar', {
    type: 'multiple_choice', question: 'Wie schreibt man 9?', options: ['neuf', 'neuv', 'nef'], correct: 'neuf',
    hint: 'Am Ende steht ein f.', explanation: 'neuf – mit f am Ende (gesprochen wie „nöff“)',
  }),
  q('nb-5', T.nombres, 'grammar', {
    type: 'multiple_choice', question: 'Wie schreibt man 4?', options: ['quatre', 'quatr', 'catre'], correct: 'quatre',
    hint: 'qu… und ein -e am Ende', explanation: 'quatre – mit qu und -e am Ende',
  }),
  q('nb-6', T.nombres, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', question: 'deux + trois = ___', correct: 'cinq',
    hint: '2 + 3', explanation: 'deux + trois = cinq (5)',
  }),
  q('nb-7', T.nombres, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', question: 'six + six = ___', correct: 'douze',
    hint: '6 + 6', explanation: 'six + six = douze (12)',
  }),
  q('nb-8', T.nombres, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', question: 'dix + un = ___', correct: 'onze',
    hint: '10 + 1', explanation: 'dix + un = onze (11)',
  }),
  q('nb-9', T.nombres, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'huit – huit = ___', correct: 'zéro',
    hint: '8 – 8 · Akzent nicht vergessen!', explanation: 'huit – huit = zéro (0) – mit accent aigu: é',
  }),
  q('nb-10', T.nombres, 'grammar', {
    type: 'multiple_choice', difficulty: 2,
    question: 'Moustique bellt den Code: „ouah ouah ouah – ouah – ouah ouah ouah ouah ouah ouah“. Welcher Code ist es?',
    options: ['trois – un – six', 'trois – deux – six', 'deux – un – sept'], correct: 'trois – un – six',
    hint: 'Zähl die „ouah“ in jeder Gruppe.', explanation: '3 – 1 – 6 = trois – un – six',
  }),

  // ---------- Nasallaute schreiben (Cahier Nr. 5) ----------
  q('son-1', T.sons, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', question: 'Laut [ɔ̃]: Attenti___ !', correct: 'on', alternativeCorrect: ['attention'],
    hint: 'wie in bonjour', explanation: 'Attention ! – [ɔ̃] schreibt man hier „on“',
  }),
  q('son-2', T.sons, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', question: 'Laut [ɔ̃]: un garç___', correct: 'on', alternativeCorrect: ['garçon', 'un garçon'],
    hint: 'wie in non', explanation: 'un garçon – [ɔ̃] = „on“',
  }),
  q('son-3', T.sons, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Laut [ɑ̃]: comm___ ?', correct: 'ent', alternativeCorrect: ['comment'],
    hint: '3 Buchstaben – das t hört man nicht', explanation: 'comment – [ɑ̃] = „en“, das t ist stumm',
  }),
  q('son-4', T.sons, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Laut [ɛ̃]: un cop___', correct: 'ain', alternativeCorrect: ['copain', 'un copain'],
    hint: '3 Buchstaben', explanation: 'un copain – [ɛ̃] = „ain“',
  }),
  q('son-5', T.sons, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Laut [ɛ̃]: un chi___', correct: 'en', alternativeCorrect: ['chien', 'un chien'],
    hint: '2 Buchstaben', explanation: 'un chien – [ɛ̃] = „en“ (nach i)',
  }),
  q('son-6', T.sons, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Laut [ɛ̃]: Vi___ ! (Komm!)', correct: 'ens', alternativeCorrect: ['viens'],
    hint: '3 Buchstaben – das s hört man nicht', explanation: 'Viens ! – „ens“, das s ist stumm',
  }),
  q('son-7', T.sons, 'grammar', {
    type: 'multiple_choice', difficulty: 2, question: 'Welches Wort hat ZWEI Nasallaute?',
    options: ['une chanson', 'un chat', 'bonjour'], correct: 'une chanson',
    hint: 'Sprich die Wörter laut.', explanation: 'une ch-an-s-on: [ɑ̃] und [ɔ̃]',
  }),

  // ---------- Cherche l’intrus (Cahier Nr. 13) ----------
  q('int-1', T.intrus, 'grammar', {
    type: 'multiple_choice', question: 'Welches Wort passt nicht dazu?', options: ['un chat', 'un chien', 'un hamster', 'une chanson'], correct: 'une chanson',
    hint: 'Drei davon sind Tiere.', explanation: 'une chanson (ein Lied) ist kein Tier.',
  }),
  q('int-2', T.intrus, 'grammar', {
    type: 'multiple_choice', question: 'Welches Wort passt nicht dazu?', options: ['deux', 'onze', 'six', 'mais'], correct: 'mais',
    hint: 'Drei davon sind Zahlen.', explanation: 'mais = aber – keine Zahl.',
  }),
  q('int-3', T.intrus, 'grammar', {
    type: 'multiple_choice', question: 'Welches Wort passt nicht dazu?', options: ['un garçon', 'une dame', 'un monsieur', 'un serpent'], correct: 'un serpent',
    hint: 'Drei davon sind Menschen.', explanation: 'un serpent (eine Schlange) ist kein Mensch.',
  }),
  q('int-4', T.intrus, 'grammar', {
    type: 'multiple_choice', question: 'Welches Wort passt nicht dazu?', options: ['je', 'tu', 'elle', 'et'], correct: 'et',
    hint: 'Drei davon sind Personalpronomen.', explanation: 'et = und – kein Personalpronomen.',
  }),

  // ---------- Wortarten, Akzente & Zeichen (En plus 1, 2) ----------
  q('mot-1', T.mots, 'grammar', {
    type: 'multiple_choice', question: 'Was für ein Wort ist „suis“?', options: ['Verb', 'Nomen', 'Personalpronomen', 'Artikel'], correct: 'Verb',
    hint: 'je suis = ich bin', explanation: 'suis kommt vom Verb être.',
  }),
  q('mot-2', T.mots, 'grammar', {
    type: 'multiple_choice', question: 'Was für ein Wort ist „elle“?', options: ['Personalpronomen', 'Artikel', 'Nomen', 'Verb'], correct: 'Personalpronomen',
    hint: 'elle = sie', explanation: 'elle (sie) ist ein Personalpronomen wie je, tu, il.',
  }),
  q('mot-3', T.mots, 'grammar', {
    type: 'multiple_choice', question: 'Was für ein Wort ist „une“?', options: ['Artikel', 'Personalpronomen', 'Verb', 'Nomen'], correct: 'Artikel',
    hint: 'une fille', explanation: 'une ist der unbestimmte Artikel (weiblich).',
  }),
  q('mot-4', T.mots, 'grammar', {
    type: 'multiple_choice', question: 'Welches Wort hat eine Cédille (ç)?', options: ['un garçon', 'voilà', 'zéro'], correct: 'un garçon',
    hint: 'Das Häkchen unter dem c', explanation: 'garçon – auch: Ça va ?',
  }),
  q('mot-5', T.mots, 'grammar', {
    type: 'multiple_choice', question: 'Welches Wort hat einen accent grave (à, è)?', options: ['voilà', 'zéro', 'Léo'], correct: 'voilà',
    hint: 'Der Strich geht nach links unten: à', explanation: 'voilà – accent grave · zéro, Léo – accent aigu (é)',
  }),
  q('mot-6', T.mots, 'grammar', {
    type: 'multiple_choice', question: 'Welches Wort hat einen accent aigu (é)?', options: ['zéro', 'voilà', 'garçon'], correct: 'zéro',
    hint: 'Der Strich geht nach rechts oben: é', explanation: 'zéro – accent aigu',
  }),
  q('mot-7', T.mots, 'grammar', {
    type: 'multiple_choice', question: 'Wo steht ein Apostroph?', options: ["c'est", 'ça va', 'voilà'], correct: "c'est",
    hint: 'ce + est → …', explanation: "c'est = ce + est – das e fällt weg, dafür steht der Apostroph.",
  }),

  // ---------- Schilder & Aufschriften verstehen (Cahier Nr. 1, Bilan 2) ----------
  q('lir-1', T.lire, 'reading', {
    type: 'multiple_choice', question: 'Wo kannst du einen Film ansehen?', options: ['un cinéma', 'un marché', 'un bureau de poste'], correct: 'un cinéma',
    hint: 'Kino', explanation: 'un cinéma = ein Kino',
  }),
  q('lir-2', T.lire, 'reading', {
    type: 'multiple_choice', question: 'Wo kaufst du Tomaten und Salat?', options: ['un marché', 'un théâtre', 'une gendarmerie'], correct: 'un marché',
    hint: 'Markt', explanation: 'un marché = ein Markt',
  }),
  q('lir-3', T.lire, 'reading', {
    type: 'multiple_choice', question: 'Was ist „une gendarmerie“?', options: ['eine Polizeiwache', 'ein Bahnhof', 'eine Bäckerei'], correct: 'eine Polizeiwache',
    hint: 'Gendarm …', explanation: 'une gendarmerie = eine Polizeiwache',
  }),
  q('lir-4', T.lire, 'reading', {
    type: 'multiple_choice', question: 'Was ist „une médiathèque“?', options: ['eine Bücherei / Mediathek', 'eine Apotheke', 'ein Krankenhaus'], correct: 'eine Bücherei / Mediathek',
    hint: 'Medien …', explanation: 'une médiathèque = eine Mediathek (Bücherei mit Büchern, Filmen, Musik)',
  }),
  q('lir-5', T.lire, 'reading', {
    type: 'multiple_choice', question: 'Wo kannst du Briefmarken kaufen?', options: ['un bureau de poste', 'un office de tourisme', 'une crêperie'], correct: 'un bureau de poste',
    hint: 'Post', explanation: 'un bureau de poste = ein Postamt',
  }),
  q('lir-6', T.lire, 'reading', {
    type: 'multiple_choice', question: 'Was gibt es in „une crêperie“?', options: ['Crêpes (Pfannkuchen)', 'Briefe', 'Kinofilme'], correct: 'Crêpes (Pfannkuchen)',
    hint: 'crêpe …', explanation: 'une crêperie = ein Crêpes-Restaurant',
  }),

  // ---------- Was sagst du, wenn …? (Buch, Bilan 1 „Parler“) ----------
  ...[
    ['par-1', 'Du heißt Clara und willst das sagen.', "Je m'appelle Clara.", ["Moi je m'appelle Clara.", "C'est Clara."], "Je m'appelle …"],
    ['par-2', 'Du willst sagen, dass du aus Paris kommst.', 'Je suis de Paris.', [], 'Je suis de …'],
    ['par-3', 'Du willst fragen, ob jemand aus Paris kommt.', 'Tu es de Paris?', [], 'Tu … … Paris ?'],
    ['par-4', 'Du willst fragen, wer das ist.', 'Qui est-ce?', [], 'Qui … ?'],
    ['par-5', 'Du willst fragen, wie es jemandem geht.', 'Ça va?', [], 'Ça … ?'],
    ['par-6', 'Du begrüßt einen Herrn.', 'Bonjour monsieur!', ['Bonjour!'], 'Bon…, …!', 'Bonjour, monsieur ! (oder einfach: Bonjour !)'],
    ['par-7', 'Du begrüßt einen Freund.', 'Salut!', [], 'S…!'],
    ['par-8', 'Du verabschiedest dich.', 'Au revoir!', ['Salut!', 'A plus!', 'À plus!'], '…!'],
    ['par-9', 'Du stellst jemanden vor: „Da ist Léo!“', 'Voilà Léo!', ["C'est Léo!"], 'V…'],
    ['par-10', 'Du entschuldigst dich.', 'Pardon!', ['Oh pardon!'], '(Oh) P…!'],
    ['par-11', 'Du warnst jemanden.', 'Attention!', [], 'Att…!'],
    ['par-12', 'Du bedankst dich.', 'Merci!', [], 'M…!'],
  ].map(([id, question, correct, alternativeCorrect, hint, explanation]) =>
    q(id, T.salut, 'grammar', {
      type: 'translate', answerLang: 'fr', difficulty: 2,
      question: `${question} Was sagst du auf Französisch?`, correct, alternativeCorrect, hint,
      explanation: explanation || [correct, ...alternativeCorrect].join(' · '),
    }),
  ),

  // ---------- C'est un … Il est … (Buch, Bilan 3B) ----------
  q('cil-1', T.ilelle, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 3,
    question: 'Schreib auf Französisch: „Das ist ein Mädchen. Sie ist fantastisch!“',
    correct: "C'est une fille. Elle est fantastique!",
    hint: "C'est une … Elle est …", explanation: "C'est une fille. Elle est fantastique ! – une fille → elle",
  }),
  q('cil-2', T.ilelle, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 3,
    question: 'Schreib auf Französisch: „Das ist eine Katze. Sie ist super!“',
    correct: "C'est un chat. Il est super!",
    hint: 'Achtung: Katze heißt un chat!', explanation: "C'est un chat. Il est super ! – un chat ist männlich → il (auch wenn es im Deutschen „sie“ ist)",
  }),
  q('cil-3', T.ilelle, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 3,
    question: 'Schreib auf Französisch: „Das ist ein Junge. Er ist komisch!“',
    correct: "C'est un garçon. Il est bizarre!",
    hint: "C'est un … Il est …", explanation: "C'est un garçon. Il est bizarre !",
  }),
  q('cil-4', T.ilelle, 'grammar', {
    type: 'multiple_choice', difficulty: 2, question: "C'est une tortue. ___ est super !", options: ['Elle', 'Il', "C'"], correct: 'Elle',
    hint: 'une tortue', explanation: 'une tortue → elle',
  }),

  // ---------- Namen der Zeichen (Buch, L’alphabet) ----------
  q('sig-1', T.mots, 'grammar', {
    type: 'multiple_choice', question: 'Wie heißt das Zeichen „-“ in „Qui est-ce ?“', options: ["le trait d'union", "l'apostrophe", 'la cédille'], correct: "le trait d'union",
    hint: 'Es verbindet zwei Wörter.', explanation: "trait d'union = Bindestrich",
  }),
  q('sig-2', T.mots, 'grammar', {
    type: 'multiple_choice', question: 'Wie sagt man auf Französisch „é“?', options: ['e accent aigu', 'e accent grave', 'e accent circonflexe'], correct: 'e accent aigu',
    hint: 'Strich nach rechts oben', explanation: 'é = e accent aigu · è = e accent grave · ê = e accent circonflexe',
  }),
  q('sig-3', T.mots, 'grammar', {
    type: 'multiple_choice', question: 'Wie sagt man auf Französisch „ç“?', options: ['c cédille', 'c accent', 'c tréma'], correct: 'c cédille',
    hint: 'garçon, ça va', explanation: 'ç = c cédille',
  }),

  // ---------- Steckbriefe: Wer spricht? (Buch, Bilan 2) ----------
  q('pro-1', T.reading, 'reading', {
    type: 'multiple_choice', difficulty: 2, text: profilesText,
    question: '„Salut ! Je suis de Brest. Voilà Emma, une copine.“ – Wer spricht?', options: ['Lucas', 'Inès', 'Hugo', 'Chloé'], correct: 'Lucas',
    hint: 'Ville : Brest', explanation: 'Lucas ist aus Brest, seine Freundin heißt Emma.',
  }),
  q('pro-2', T.reading, 'reading', {
    type: 'multiple_choice', difficulty: 2, text: profilesText,
    question: '„Bonjour ! Je suis de Nice. Et voilà un animal fantastique : c’est un perroquet !“ – Wer spricht?', options: ['Hugo', 'Lucas', 'Chloé', 'Inès'], correct: 'Hugo',
    hint: 'Wer hat einen Papagei?', explanation: 'Hugo: Nice, un perroquet.',
  }),
  q('pro-3', T.reading, 'reading', {
    type: 'reading_true_false', difficulty: 2, text: profilesText,
    question: 'Chloé hat kein Tier.', correct: 'true',
    hint: 'Animal : –', explanation: 'Bei Chloé steht „Animal : –“.',
  }),
  q('pro-4', T.reading, 'reading', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, text: profilesText,
    question: 'Inès : Salut ! Je suis de ___.', correct: 'Toulouse',
    hint: 'Ville', explanation: 'Inès est de Toulouse.',
  }),

  // ---------- Leseverstehen 2 ----------
  q('read2-1', T.reading, 'reading', {
    type: 'reading_true_false', difficulty: 2, text: readingText2,
    question: 'Manon ist von hier.', correct: 'false',
    hint: '„Tu es d’ici ?“ – was antwortet Manon?', explanation: '„Non, je suis de Nice.“',
  }),
  q('read2-2', T.reading, 'reading', {
    type: 'reading_true_false', difficulty: 2, text: readingText2,
    question: 'Coco ist ein Papagei.', correct: 'true',
    hint: 'C’est un …', explanation: '„C’est un perroquet.“ = Das ist ein Papagei.',
  }),
  q('read2-3', T.reading, 'reading', {
    type: 'reading_true_false', difficulty: 2, text: readingText2,
    question: 'Nathan geht es nicht gut.', correct: 'false',
    hint: 'Was sagt Nathan auf „Et toi ?“', explanation: 'Nathan sagt „Ça va.“ – es geht ihm gut.',
  }),
  q('read2-4', T.reading, 'reading', {
    type: 'multiple_choice', difficulty: 2, text: readingText2,
    question: 'Warum ruft Manon „Vite, Coco !“?', options: ['Weil eine Katze kommt.', 'Weil es regnet.', 'Weil Nathan geht.'], correct: 'Weil eine Katze kommt.',
    hint: 'Wer ist Filou?', explanation: '„Attention, voilà Filou ! C’est un chat …“ – Katze und Papagei, das geht nicht gut!',
  }),

  // ===== Unité 2 – nach dem Lernplan zur 1. Schulaufgabe (Beiheft G3–G6, S. 7–12) =====

  // ---------- le / la / l' (G3) ----------
  q('def-1', T.defini, 'grammar', {
    type: 'multiple_choice', question: '___ chien', options: ['le', 'la', "l'"], correct: 'le',
    hint: 'un chien', explanation: 'le chien – maskulin (un → le)',
  }),
  q('def-2', T.defini, 'grammar', {
    type: 'multiple_choice', question: '___ rue', options: ['le', 'la', "l'"], correct: 'la',
    hint: 'une rue', explanation: 'la rue – feminin (une → la)',
  }),
  q('def-3', T.defini, 'grammar', {
    type: 'multiple_choice', question: '___ école', options: ['le', 'la', "l'"], correct: "l'",
    hint: 'Womit fängt „école“ an?', explanation: "l'école – vor Vokal steht l', egal ob männlich oder weiblich (une école).",
  }),
  q('def-4', T.defini, 'grammar', {
    type: 'multiple_choice', question: '___ journal', options: ['le', 'la', "l'"], correct: 'le',
    hint: 'un journal', explanation: 'le journal – maskulin (die Zeitung, aber un journal)',
  }),
  q('def-5', T.defini, 'grammar', {
    type: 'multiple_choice', question: '___ ami', options: ['le', 'la', "l'"], correct: "l'",
    hint: 'a, e, i, o, u am Anfang?', explanation: "l'ami – vor Vokal wird le zu l'.",
  }),
  q('def-6', T.defini, 'grammar', {
    type: 'multiple_choice', question: 'Voilà ___ maison de Léo.', options: ['le', 'la', "l'"], correct: 'la',
    hint: 'une maison', explanation: 'la maison – feminin. „das Haus“, aber im Französischen gibt es kein Neutrum.',
  }),
  q('def-7', T.defini, 'grammar', {
    type: 'multiple_choice', question: 'Marie regarde ___ affiche.', options: ['le', 'la', "l'"], correct: "l'",
    hint: 'une affiche – aber Vokal am Anfang!', explanation: "l'affiche – une affiche ist weiblich, vor Vokal trotzdem l'.",
  }),
  q('def-8', T.defini, 'grammar', {
    type: 'multiple_choice', question: 'une BD → ___ BD', options: ['le', 'la', "l'"], correct: 'la',
    hint: 'une → ?', explanation: 'une BD → la BD',
  }),
  q('def-9', T.defini, 'grammar', {
    type: 'multiple_choice', question: 'Welcher Satz ist richtig?',
    options: ["C'est l'amie de Léo.", "C'est la amie de Léo.", "C'est le amie de Léo."], correct: "C'est l'amie de Léo.",
    hint: 'amie beginnt mit Vokal', explanation: "l'amie – vor Vokal nur l' mit Apostroph.",
  }),
  q('def-10', T.defini, 'grammar', {
    type: 'multiple_choice', question: 'der Hund – die Katze – das Haus. Wie viele Geschlechter haben französische Nomen?',
    options: ['zwei: maskulin und feminin', 'drei: maskulin, feminin und neutrum', 'nur eins'], correct: 'zwei: maskulin und feminin',
    hint: 'le … oder la …', explanation: 'Im Französischen gibt es nur maskulin (le) und feminin (la): le chien, le chat, la maison.',
  }),
  q('def-11', T.defini, 'grammar', {
    type: 'multiple_choice', question: 'die Katze = ___ chat', options: ['le', 'la', "l'"], correct: 'le',
    hint: 'un chat', explanation: 'le chat – das Geschlecht kann anders sein als im Deutschen.',
  }),

  // ---------- être – alle Formen (G4) ----------
  q('etre-6', T.etre, 'grammar', {
    type: 'multiple_choice', question: 'Nous ___ de Paris.', options: ['sommes', 'êtes', 'sont'], correct: 'sommes',
    hint: 'nous → ?', explanation: 'nous sommes = wir sind',
  }),
  q('etre-7', T.etre, 'grammar', {
    type: 'multiple_choice', question: 'Vous ___ de Toulouse, madame ?', options: ['êtes', 'sommes', 'est'], correct: 'êtes',
    hint: 'vous → ?', explanation: 'vous êtes – hier die höfliche Anrede: „Sind Sie aus Toulouse?“',
  }),
  q('etre-8', T.etre, 'grammar', {
    type: 'multiple_choice', question: 'Marie et Léo ___ dans la maison de la presse.', options: ['sont', 'est', 'sommes'], correct: 'sont',
    hint: 'Marie et Léo = ils', explanation: 'ils sont = sie sind',
  }),
  q('etre-9', T.etre, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'On ___ à Paris ! (être)', correct: 'est',
    hint: 'on wie il und elle', explanation: 'on est = man ist / wir sind',
  }),
  q('etre-10', T.etre, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Marie et moi, nous ___ de Nice. (être)', correct: 'sommes',
    hint: 'nous → ?', explanation: 'nous sommes = wir sind',
  }),
  q('etre-11', T.etre, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Léo et Marie, vous ___ où ? (être)', correct: 'êtes',
    hint: 'vous → ? (mit Akzent!)', explanation: 'vous êtes = ihr seid',
  }),
  q('etre-12', T.etre, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Manon et Clara ? Elles ___ sympas ! (être)', correct: 'sont',
    hint: 'elles → ?', explanation: 'elles sont = sie sind',
  }),
  q('etre-13', T.etre, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 2, question: 'Schreib auf Französisch: „Wir sind aus Paris.“',
    correct: 'Nous sommes de Paris.', alternativeCorrect: ['On est de Paris.'],
    hint: 'nous + être + de', explanation: 'Nous sommes de Paris. (auch: On est de Paris.)',
  }),
  q('etre-14', T.etre, 'grammar', {
    type: 'multiple_choice', question: 'ihr seid / Sie sind = ?', options: ['vous êtes', 'vous sommes', 'nous êtes'], correct: 'vous êtes',
    hint: 'vous …', explanation: 'vous êtes = ihr seid / Sie sind',
  }),

  // ---------- Personalpronomen (G4) ----------
  q('pp-1', T.pronoms, 'grammar', {
    type: 'multiple_choice', question: 'Paul et Hugo ? ___ sont de Brest.', options: ['Ils', 'Elles', 'Nous'], correct: 'Ils',
    hint: 'zwei Jungen', explanation: 'ils = sie (Plural, männlich)',
  }),
  q('pp-2', T.pronoms, 'grammar', {
    type: 'multiple_choice', question: 'Manon et Clara ? ___ sont super.', options: ['Elles', 'Ils', 'Vous'], correct: 'Elles',
    hint: 'zwei Mädchen', explanation: 'elles = sie (Plural, weiblich)',
  }),
  q('pp-3', T.pronoms, 'grammar', {
    type: 'multiple_choice', question: 'Où sont Marie et Léo ? – ___ sont dans la rue.', options: ['Ils', 'Elles', 'On'], correct: 'Ils',
    hint: 'ein Mädchen und ein Junge', explanation: 'Gemischte Gruppe → ils.',
  }),
  q('pp-4', T.pronoms, 'grammar', {
    type: 'multiple_choice', question: 'Où sont la gomme et la BD ? – ___ sont dans le cartable.', options: ['Elles', 'Ils', 'On'], correct: 'Elles',
    hint: 'la gomme, la BD', explanation: 'Zwei feminine Nomen → elles (auch bei Sachen).',
  }),
  q('pp-5', T.pronoms, 'grammar', {
    type: 'multiple_choice', question: 'Où sont le livre et le cahier ? – ___ sont là.', options: ['Ils', 'Elles', 'Vous'], correct: 'Ils',
    hint: 'le livre, le cahier', explanation: 'Zwei maskuline Nomen → ils.',
  }),
  q('pp-6', T.pronoms, 'grammar', {
    type: 'multiple_choice', question: 'Du sprichst eine Verkäuferin höflich an: „___ habitez à Paris, madame ?“', options: ['Vous', 'Tu', 'Nous'], correct: 'Vous',
    hint: 'höfliche Anrede = „Sie“', explanation: 'vous = Sie (höflich, auch für eine Person)',
  }),
  q('pp-7', T.pronoms, 'grammar', {
    type: 'multiple_choice', question: 'Du fragst zwei Freunde: „___ cherchez Malabar ?“', options: ['Vous', 'Tu', 'Ils'], correct: 'Vous',
    hint: 'mehrere Personen = „ihr“', explanation: 'vous = ihr (mehrere Personen)',
  }),
  q('pp-8', T.pronoms, 'grammar', {
    type: 'multiple_choice', question: 'Was bedeutet „on“?', options: ['man – und umgangssprachlich auch „wir“', 'nur „er“', '„ihr“'],
    correct: 'man – und umgangssprachlich auch „wir“',
    hint: 'On est copains.', explanation: 'on = man; in der Umgangssprache oft für „wir“.',
  }),
  q('pp-9', T.pronoms, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Léo et moi, ___ sommes de Paris.', correct: 'nous',
    hint: 'Léo und ich = wir', explanation: 'nous sommes = wir sind',
  }),
  q('pp-10', T.pronoms, 'grammar', {
    type: 'multiple_choice', question: 'Welche Aussage stimmt?',
    options: ['ils steht auch für gemischte Gruppen.', 'elles steht für gemischte Gruppen.', 'ils steht nur für Personen, nicht für Sachen.'],
    correct: 'ils steht auch für gemischte Gruppen.',
    hint: 'Marie et Léo → ?', explanation: 'ils = maskulin Plural und gemischte Gruppen; elles = nur feminin Plural.',
  }),
  q('pp-11', T.pronoms, 'grammar', {
    type: 'multiple_choice', question: 'Deutsch sagt „sie“, Englisch „they“. Was sagt man im Französischen?',
    options: ['ils oder elles – je nach Geschlecht', 'immer ils', 'immer elles'], correct: 'ils oder elles – je nach Geschlecht',
    hint: 'Jungen / Mädchen', explanation: 'Im Französischen musst du zwischen ils und elles unterscheiden.',
  }),

  // ---------- Verben auf -er (G5) ----------
  q('er-1', T.verbesEr, 'grammar', {
    type: 'multiple_choice', question: 'Nous ___ un livre.', options: ['cherchons', 'cherchez', 'cherchent'], correct: 'cherchons',
    hint: 'nous → -ons', explanation: 'nous cherchons = wir suchen',
  }),
  q('er-2', T.verbesEr, 'grammar', {
    type: 'multiple_choice', question: 'Vous ___ la BD ?', options: ['regardez', 'regardons', 'regardent'], correct: 'regardez',
    hint: 'vous → -ez', explanation: 'vous regardez = ihr seht an / Sie sehen an',
  }),
  q('er-3', T.verbesEr, 'grammar', {
    type: 'multiple_choice', question: 'Tu ___ le rugby ?', options: ['aimes', 'aime', 'aimez'], correct: 'aimes',
    hint: 'tu → -es', explanation: 'tu aimes = du magst',
  }),
  q('er-4', T.verbesEr, 'grammar', {
    type: 'multiple_choice', question: 'Ils ___ rue Lepic.', options: ['habitent', 'habitez', 'habitons'], correct: 'habitent',
    hint: 'ils → -ent', explanation: 'ils habitent = sie wohnen',
  }),
  q('er-5', T.verbesEr, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Tu ___ un t-shirt ? (porter)', correct: 'portes',
    hint: 'tu → -es', explanation: 'tu portes = du trägst',
  }),
  q('er-6', T.verbesEr, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Marie ___ avec un monsieur. (parler)', correct: 'parle',
    hint: 'elle → -e', explanation: 'elle parle = sie spricht',
  }),
  q('er-7', T.verbesEr, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Nous ___ la musique. (écouter)', correct: 'écoutons',
    hint: 'nous → -ons', explanation: 'nous écoutons = wir hören',
  }),
  q('er-8', T.verbesEr, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Vous ___ où ? (travailler)', correct: 'travaillez',
    hint: 'vous → -ez', explanation: 'vous travaillez = ihr arbeitet / Sie arbeiten',
  }),
  q('er-9', T.verbesEr, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: "Léo et Marie ___ devant l'école. (arriver)", correct: 'arrivent',
    hint: 'ils → -ent', explanation: 'ils arrivent = sie kommen an',
  }),
  q('er-10', T.verbesEr, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'On ___ Malabar ? (chercher)', correct: 'cherche',
    hint: 'on wie il/elle → -e', explanation: 'on cherche = man sucht / wir suchen',
  }),
  q('er-11', T.verbesEr, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Elles ___ le sport. (détester)', correct: 'détestent',
    hint: 'elles → -ent', explanation: 'elles détestent = sie verabscheuen',
  }),
  q('er-12', T.verbesEr, 'grammar', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, question: 'Ah, je ___ le livre ! (trouver)', correct: 'trouve',
    hint: 'je → -e', explanation: 'je trouve = ich finde',
  }),
  q('er-13', T.verbesEr, 'grammar', {
    type: 'multiple_choice', question: 'Welche Endungen haben die Verben auf -er (je, tu, il, nous, vous, ils)?',
    options: ['-e, -es, -e, -ons, -ez, -ent', '-e, -es, -t, -ons, -ez, -ent', '-s, -s, -t, -ons, -ez, -ont'], correct: '-e, -es, -e, -ons, -ez, -ent',
    hint: 'je cherche, tu cherches …', explanation: 'je cherche, tu cherches, il cherche, nous cherchons, vous cherchez, ils cherchent',
  }),
  q('er-14', T.verbesEr, 'grammar', {
    type: 'multiple_choice', question: 'Welche Endungen hört man beim Sprechen?', options: ['nur -ons und -ez', 'alle', 'nur -es und -ent'], correct: 'nur -ons und -ez',
    hint: 'regarde, regardes, regardent klingen gleich', explanation: 'Nur -ons [ɔ̃] und -ez [e] werden ausgesprochen.',
  }),
  q('er-15', T.verbesEr, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 3, question: 'Schreib auf Französisch: „Wir wohnen in Paris.“',
    correct: 'Nous habitons à Paris.', alternativeCorrect: ['On habite à Paris.'],
    hint: 'habiter + à', explanation: 'Nous habitons à Paris. (auch: On habite à Paris.)',
  }),
  q('er-16', T.verbesEr, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 3, question: 'Schreib auf Französisch: „Sie (Léo und Marie) suchen Malabar.“',
    correct: 'Ils cherchent Malabar.', hint: 'gemischte Gruppe → ils', explanation: 'Ils cherchent Malabar.',
  }),

  // ---------- Apostroph (G3, G5) ----------
  q('apo-1', T.apostrophe, 'grammar', {
    type: 'multiple_choice', question: 'je + arrive = ?', options: ["j'arrive", 'je arrive'], correct: "j'arrive",
    hint: 'arrive beginnt mit Vokal', explanation: "Vor Vokal wird je zu j'.",
  }),
  q('apo-2', T.apostrophe, 'grammar', {
    type: 'multiple_choice', question: 'je + écoute = ?', options: ["j'écoute", 'je écoute'], correct: "j'écoute",
    hint: 'é ist auch ein Vokal', explanation: "j'écoute – vor Vokal wird je zu j'.",
  }),
  q('apo-3', T.apostrophe, 'grammar', {
    type: 'multiple_choice', question: 'je + regarde = ?', options: ['je regarde', "j'regarde"], correct: 'je regarde',
    hint: 'r ist ein Konsonant', explanation: "Kein Apostroph – j' nur vor Vokal oder stummem h.",
  }),
  q('apo-4', T.apostrophe, 'grammar', {
    type: 'multiple_choice', question: 'la + musique = ?', options: ['la musique', "l'musique"], correct: 'la musique',
    hint: 'm ist ein Konsonant', explanation: "la musique – l' nur vor Vokal.",
  }),
  q('apo-5', T.apostrophe, 'grammar', {
    type: 'multiple_choice', question: 'Warum schreibt man „j’habite“ und nicht „je habite“?',
    options: ['Das h spricht man nicht – das Wort beginnt wie mit einem Vokal.', 'Weil habiter ein unregelmäßiges Verb ist.', 'Weil es kürzer ist.'],
    correct: 'Das h spricht man nicht – das Wort beginnt wie mit einem Vokal.',
    hint: 'stummes h', explanation: "Vor Vokal oder stummem h wird je zu j'.",
  }),
  q('apo-6', T.apostrophe, 'grammar', {
    type: 'multiple_choice', question: 'Welcher Satz ist richtig?',
    options: ["C'est l'école de Marie.", "Ce est la école de Marie.", "C'est la école de Marie."], correct: "C'est l'école de Marie.",
    hint: 'ce + est, la + école', explanation: "ce + est → c'est, la + école → l'école",
  }),
  q('apo-7', T.apostrophe, 'grammar', {
    type: 'multiple_choice', question: "Qu'est-ce ___ elle regarde ?", options: ["qu'", 'que'], correct: "qu'",
    hint: 'elle beginnt mit Vokal', explanation: "que + elle → qu'elle: Qu'est-ce qu'elle regarde ?",
  }),
  q('apo-8', T.apostrophe, 'grammar', {
    type: 'multiple_choice', question: 'Welche Aussage stimmt?',
    options: ["j' steht vor einem Verb mit Vokal am Anfang.", 'le steht vor femininen Nomen.', 'une steht vor maskulinen Nomen.'],
    correct: "j' steht vor einem Verb mit Vokal am Anfang.",
    hint: "j'aime, j'arrive …", explanation: "j' steht vor Vokal (j'aime). le = maskulin, une = feminin.",
  }),

  // ---------- Fragen mit und ohne Fragewort (G6) ----------
  q('qu-1', T.questions, 'grammar', {
    type: 'multiple_choice', question: '– ___ est Malabar ? – Il est dans la rue.', options: ['Où', 'Qui', 'Comment'], correct: 'Où',
    hint: 'Wo?', explanation: 'Où est Malabar ? = Wo ist Malabar?',
  }),
  q('qu-2', T.questions, 'grammar', {
    type: 'multiple_choice', question: '– ___ tu cherches ? – Un stylo.', options: ["Qu'est-ce que", 'Où', 'Qui'], correct: "Qu'est-ce que",
    hint: 'Was?', explanation: "Qu'est-ce que tu cherches ? = Was suchst du?",
  }),
  q('qu-3', T.questions, 'grammar', {
    type: 'multiple_choice', question: "– ___ ? – C'est Hugo, un copain.", options: ['Qui est-ce', "Qu'est-ce que c'est", 'Que fait Hugo'], correct: 'Qui est-ce',
    hint: 'nach einer Person fragen', explanation: 'Qui est-ce ? = Wer ist das?',
  }),
  q('qu-4', T.questions, 'grammar', {
    type: 'multiple_choice', question: "– ___ ? – C'est une affiche.", options: ["Qu'est-ce que c'est", 'Qui est-ce', 'Tu habites où'], correct: "Qu'est-ce que c'est",
    hint: 'nach einer Sache fragen', explanation: "Qu'est-ce que c'est ? = Was ist das?",
  }),
  q('qu-5', T.questions, 'grammar', {
    type: 'multiple_choice', question: '– Tu habites ___ ? – Rue Lepic.', options: ['où', 'comment', 'qui'], correct: 'où',
    hint: 'Wo wohnst du?', explanation: 'Tu habites où ? = Wo wohnst du?',
  }),
  q('qu-6', T.questions, 'grammar', {
    type: 'multiple_choice', question: '– Que fait Marie ? – ___', options: ['Elle écoute la musique.', 'Elle est de Nice.', 'Oui, ça va.'], correct: 'Elle écoute la musique.',
    hint: 'Was macht Marie?', explanation: 'Que fait … ? fragt, was jemand macht.',
  }),
  q('qu-7', T.questions, 'grammar', {
    type: 'multiple_choice', question: 'Wie wird „Malabar est dans le magasin.“ zu einer Frage ohne Fragewort?',
    options: ['Malabar est dans le magasin ? – die Stimme geht am Satzende hoch', 'Est Malabar dans le magasin ?', "Qu'est-ce que Malabar est dans le magasin ?"],
    correct: 'Malabar est dans le magasin ? – die Stimme geht am Satzende hoch',
    hint: 'Intonation', explanation: 'Ohne Fragewort: gleicher Satz, Fragezeichen, Stimme am Ende nach oben.',
  }),
  q('qu-8', T.questions, 'grammar', {
    type: 'multiple_choice', question: 'Welche Frage hat KEIN Fragewort?', options: ['Tu aimes le judo ?', 'Tu habites où ?', 'Qui est-ce ?'], correct: 'Tu aimes le judo ?',
    hint: 'où, qui … sind Fragewörter', explanation: 'Tu aimes le judo ? – Frage nur durch die Satzmelodie.',
  }),
  q('qu-9', T.questions, 'grammar', {
    type: 'word_order', answerLang: 'fr', difficulty: 2, question: 'Bringe die Wörter in die richtige Reihenfolge:',
    words: ['regardent', "Qu'est-ce", "qu'ils"], correct: "Qu'est-ce qu'ils regardent",
    hint: 'Was sehen sie an?', explanation: "Qu'est-ce qu'ils regardent ? = Was sehen sie an?",
  }),
  q('qu-10', T.questions, 'grammar', {
    type: 'word_order', answerLang: 'fr', difficulty: 2, question: 'Bringe die Wörter in die richtige Reihenfolge:',
    words: ['est', 'chien', 'Où', 'le'], correct: 'Où est le chien',
    hint: 'Wo ist der Hund?', explanation: 'Où est le chien ? = Wo ist der Hund?',
  }),
  q('qu-11', T.questions, 'grammar', {
    type: 'word_order', answerLang: 'fr', difficulty: 2, question: 'Bringe die Wörter in die richtige Reihenfolge:',
    words: ['Marie', 'fait', 'Que'], correct: 'Que fait Marie',
    hint: 'Was macht Marie?', explanation: 'Que fait Marie ? = Was macht Marie?',
  }),
  q('qu-12', T.questions, 'grammar', {
    type: 'word_order', answerLang: 'fr', difficulty: 2, question: 'Bringe die Wörter in die richtige Reihenfolge:',
    words: ['aimes', 'que', 'tu', "Qu'est-ce"], correct: "Qu'est-ce que tu aimes",
    hint: 'Was magst du?', explanation: "Qu'est-ce que tu aimes ? = Was magst du?",
  }),
  q('qu-13', T.questions, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 3, question: 'Schreib auf Französisch: „Was suchst du?“',
    correct: "Qu'est-ce que tu cherches?", hint: "Qu'est-ce que + tu …", explanation: "Qu'est-ce que tu cherches ? = Was suchst du?",
  }),
  q('qu-14', T.questions, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 2, question: 'Schreib auf Französisch: „Wo wohnst du?“',
    correct: 'Tu habites où?', hint: 'Tu habites …', explanation: 'Tu habites où ? = Wo wohnst du?',
  }),
  q('qu-15', T.questions, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 3, question: 'Schreib auf Französisch, ohne Fragewort: „Suchst du das Buch?“',
    correct: 'Tu cherches le livre?', hint: 'Aussagesatz + Fragezeichen', explanation: 'Tu cherches le livre ? – Frage durch die Satzmelodie.',
  }),
  q('qu-16', T.questions, 'grammar', {
    type: 'multiple_choice', question: 'Antwort: „J’aime le judo.“ – Welche Frage passt?',
    options: ["Qu'est-ce que tu aimes ?", 'Tu habites où ?', "Qu'est-ce que c'est ?"], correct: "Qu'est-ce que tu aimes ?",
    hint: 'Was magst du?', explanation: "Qu'est-ce que tu aimes ? – J'aime le judo.",
  }),
  q('qu-17', T.questions, 'grammar', {
    type: 'multiple_choice', question: 'Antwort: „Il est devant la maison.“ – Welche Frage passt?',
    options: ['Où est Malabar ?', 'Que fait Malabar ?', 'Qui est-ce ?'], correct: 'Où est Malabar ?',
    hint: 'devant = vor (örtlich)', explanation: 'Où est Malabar ? – Il est devant la maison.',
  }),

  // ---------- Sagen, wo du wohnst und was du magst (Vokabelseiten S. 170, Portfolio S. 27) ----------
  q('vie-1', T.parler, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 2, question: 'Schreib auf Französisch: „Ich wohne in Paris.“',
    correct: "J'habite à Paris.", hint: "j'habite + à", explanation: "J'habite à Paris. – j' vor stummem h",
  }),
  q('vie-2', T.parler, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 2, question: 'Du magst Judo. Sag es auf Französisch.',
    correct: "J'aime le judo.", hint: "j'aime + le …", explanation: "J'aime le judo. – mit Artikel!",
  }),
  q('vie-3', T.parler, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 3, question: 'Du magst Rugby überhaupt nicht. Sag es auf Französisch.',
    correct: 'Je déteste le rugby.', hint: 'détester', explanation: 'Je déteste le rugby.',
  }),
  q('vie-4', T.parler, 'grammar', {
    type: 'translate', answerLang: 'fr', difficulty: 2, question: 'Frag deine Freundin, was sie mag.',
    correct: "Qu'est-ce que tu aimes?", hint: "Qu'est-ce que …", explanation: "Qu'est-ce que tu aimes ? = Was magst du?",
  }),
  q('vie-5', T.parler, 'grammar', {
    type: 'multiple_choice', question: 'Welcher Satz ist richtig?', options: ["J'aime le sport.", "J'aime sport.", 'Je aime le sport.'], correct: "J'aime le sport.",
    hint: 'Artikel und Apostroph', explanation: "Deutsch: Ich mag Sport. Französisch: J'aime le sport. – mit Artikel.",
  }),
  q('vie-6', T.parler, 'grammar', {
    type: 'multiple_choice', question: 'Ein Freund fragt: „On regarde la BD ?“ Du bist einverstanden. Was sagst du?',
    options: ["D'accord !", 'Zut !', 'Chut !'], correct: "D'accord !",
    hint: 'einverstanden', explanation: "D'accord ! = Einverstanden! / O.k.!",
  }),
  q('vie-7', T.parler, 'grammar', {
    type: 'multiple_choice', question: 'Du hast deinen Schlüssel gesucht und endlich gefunden. Was sagst du?',
    options: ['Ouf !', 'Chut !', 'Zut !'], correct: 'Ouf !',
    hint: 'erleichtert', explanation: 'Ouf ! = Uff! (erleichtert)',
  }),
  q('vie-8', T.parler, 'grammar', {
    type: 'multiple_choice', question: 'Dein Heft fällt in eine Pfütze. Was rufst du?',
    options: ['Zut !', "D'accord !", 'Super !'], correct: 'Zut !',
    hint: 'Mist!', explanation: 'Zut ! = Mist! (umgangssprachlich)',
  }),
  q('vie-9', T.parler, 'grammar', {
    type: 'multiple_choice', question: 'Deine Freundin wohnt in Nizza. Was sagt sie?',
    options: ["J'habite à Nice.", "J'habite Nice.", 'Je habite à Nice.'], correct: "J'habite à Nice.",
    hint: 'habiter à + Stadt', explanation: "J'habite à Nice. – mit à vor der Stadt.",
  }),
  q('vie-10', T.parler, 'grammar', {
    type: 'multiple_choice', question: 'Wie verabschiedest du dich am Ende des Gesprächs von Hugo?',
    options: ['Alors, au revoir, Hugo !', 'Alors, bonjour, Hugo !', "D'accord, Hugo ?"], correct: 'Alors, au revoir, Hugo !',
    hint: 'alors = nun, dann', explanation: 'Alors, au revoir ! = Dann auf Wiedersehen!',
  }),

  // ---------- Wortarten (S. 12) ----------
  q('mot-8', T.mots, 'grammar', {
    type: 'multiple_choice', question: 'Wie nennt man un, une, le, la in der Grammatik?', options: ['Artikel', 'Personalpronomen', 'Verben'], correct: 'Artikel',
    hint: 'Begleiter der Nomen', explanation: 'un/une = unbestimmter Artikel, le/la/l’ = bestimmter Artikel',
  }),
  q('mot-9', T.mots, 'grammar', {
    type: 'multiple_choice', question: 'Wie nennt man je, tu, il, elle, on, nous, vous, ils, elles?', options: ['Personalpronomen', 'Artikel', 'Nomen'], correct: 'Personalpronomen',
    hint: 'persönliche Fürwörter', explanation: 'je, tu, il … = Personalpronomen',
  }),

  // ---------- Leseverstehen 3 (Unité 2) ----------
  q('read3-1', T.reading, 'reading', {
    type: 'reading_true_false', difficulty: 2, text: readingText3,
    question: 'Théo wohnt in der Rue Lepic.', correct: 'true',
    hint: 'J’habite …', explanation: '„J’habite rue Lepic.“',
  }),
  q('read3-2', T.reading, 'reading', {
    type: 'reading_true_false', difficulty: 2, text: readingText3,
    question: 'Zoé wohnt in einer anderen Straße als Théo.', correct: 'false',
    hint: 'Moi aussi …', explanation: '„Moi aussi, j’habite rue Lepic !“ – dieselbe Straße.',
  }),
  q('read3-3', T.reading, 'reading', {
    type: 'reading_true_false', difficulty: 2, text: readingText3,
    question: 'Zoé mag Rugby.', correct: 'false',
    hint: 'Je déteste …', explanation: '„Je déteste le rugby !“ – Zoé mag Judo.',
  }),
  q('read3-4', T.reading, 'reading', {
    type: 'reading_true_false', difficulty: 2, text: readingText3,
    question: 'Jade und Noé sind Geschwister.', correct: 'true',
    hint: 'frère et sœur', explanation: '„Ils sont frère et sœur.“',
  }),
  q('read3-5', T.reading, 'reading', {
    type: 'multiple_choice', difficulty: 2, text: readingText3,
    question: 'Was mag Théo?', options: ['Rugby und Musik', 'Judo und Musik', 'Rugby und Judo'], correct: 'Rugby und Musik',
    hint: 'J’aime …', explanation: '„J’aime le rugby et la musique.“',
  }),
  q('read3-6', T.reading, 'reading', {
    type: 'multiple_choice', difficulty: 2, text: readingText3,
    question: 'Was schlägt Jade vor?', options: ['In der Schule Judo anschauen', 'Rugby spielen', 'Musik hören'], correct: 'In der Schule Judo anschauen',
    hint: 'On regarde …', explanation: '„On regarde le judo à l’école ?“',
  }),
  q('read3-7', T.reading, 'reading', {
    type: 'multiple_choice', difficulty: 2, text: readingText3,
    question: 'Warum sagt Noé am Ende „Ouf !“?', options: ['Seine Schultasche ist wieder da.', 'Er mag kein Judo.', 'Jade ist nicht einverstanden.'],
    correct: 'Seine Schultasche ist wieder da.',
    hint: 'Où est le cartable ?', explanation: 'Noé sucht seinen Schulranzen – „Il est là, devant la maison.“ – Ouf !',
  }),
  q('read3-8', T.reading, 'reading', {
    type: 'fill_gap', answerLang: 'fr', difficulty: 2, text: readingText3,
    question: 'Zoé : Moi, j’aime ___.', correct: 'le judo',
    hint: 'Was mag Zoé?', explanation: '„Moi, j’aime le judo.“',
  }),
];

export default questionsFR6;
