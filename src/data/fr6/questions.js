// Französisch Klasse 6 – Unité 1 „Bonjour, Paris!“ (Au début + Ateliers A1–B5).
// Grammatik/Redemittel aus dem Vokabelteil (Merke-Kasten être, Vis-à-vis-Kästen),
// Sätze angelehnt an die Beispielsätze des Buchs, aber selbst formuliert.
// answerLang 'fr' → Akzent-Tasten + strenger Akzent-Check.

const EXAM = 'fr6-u1';

const T = {
  etre: ['fr_etre', 'être (je suis, tu es, il/elle est)'],
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
];

export default questionsFR6;
