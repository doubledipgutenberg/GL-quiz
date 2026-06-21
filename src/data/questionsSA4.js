// 4. Schulaufgabe — Green Line 1: Unit 5 (ab Station 2), Unit 6 (ab Station 3),
// Across Cultures 2, Focus 2.
// Grammatik (G30–G36 + Saying the date), Leseverstehen, Mediation.
// Vokabeln kommen aus vocabListSA4.js. Alle Fragen werden mit exam:'sa4' getaggt.

const readingText =
  "Last Saturday it was Mia's birthday. She was twelve years old. In the morning, " +
  "her friends came to her house. They played games in the garden and listened to music. " +
  "At one o'clock they had lunch. Mia's dad made pizza and a big chocolate cake. " +
  "After lunch, they watched a funny film. Mia got a new bike and some books. " +
  "In the evening, everyone went home. Mia was very happy. It was a great party!";

const questionsSA4 = [
  // ==========================================
  // GRAMMAR G30: much / many / a lot of
  // ==========================================
  {
    id: "s4-g30-1", topic: "quantifiers", topicLabel: "much/many/a lot of", category: "grammar",
    type: "multiple_choice", difficulty: 1,
    question: "How ___ money do you need?",
    options: ["much", "many"], correct: "much",
    hint: "Kann man 'money' zählen?",
    explanation: "'money' ist nicht zählbar → much.",
  },
  {
    id: "s4-g30-2", topic: "quantifiers", topicLabel: "much/many/a lot of", category: "grammar",
    type: "multiple_choice", difficulty: 1,
    question: "How ___ apples are there?",
    options: ["much", "many"], correct: "many",
    hint: "'apples' ist Plural – zählbar.",
    explanation: "Zählbare Dinge im Plural → many.",
  },
  {
    id: "s4-g30-3", topic: "quantifiers", topicLabel: "much/many/a lot of", category: "grammar",
    type: "multiple_choice", difficulty: 1,
    question: "There aren't ___ people at the party.",
    options: ["much", "many"], correct: "many",
    hint: "'people' ist zählbar (Plural).",
    explanation: "people = zählbar → many.",
  },
  {
    id: "s4-g30-4", topic: "quantifiers", topicLabel: "much/many/a lot of", category: "grammar",
    type: "multiple_choice", difficulty: 2,
    question: "I've got ___ homework today.",
    options: ["many", "a lot of"], correct: "a lot of",
    hint: "Im Aussagesatz (positiv) nimmt man meist 'a lot of'.",
    explanation: "Im positiven Aussagesatz benutzt man meist 'a lot of': a lot of homework.",
  },
  {
    id: "s4-g30-5", topic: "quantifiers", topicLabel: "much/many/a lot of", category: "grammar",
    type: "fill_gap", difficulty: 2,
    question: "She hasn't got ___ time. (much/many)",
    correct: "much",
    hint: "time = nicht zählbar, Satz ist verneint.",
    explanation: "Verneinung + nicht zählbar → much: She hasn't got much time.",
  },

  // ==========================================
  // GRAMMAR G31: a few / a little / a couple of
  // ==========================================
  {
    id: "s4-g31-1", topic: "quantifiers2", topicLabel: "a few/a little/a couple of", category: "grammar",
    type: "multiple_choice", difficulty: 1,
    question: "I have ___ friends in England.",
    options: ["a few", "a little"], correct: "a few",
    hint: "'friends' kann man zählen.",
    explanation: "Zählbar → a few friends.",
  },
  {
    id: "s4-g31-2", topic: "quantifiers2", topicLabel: "a few/a little/a couple of", category: "grammar",
    type: "multiple_choice", difficulty: 1,
    question: "Can I have ___ milk, please?",
    options: ["a few", "a little"], correct: "a little",
    hint: "'milk' kann man nicht zählen.",
    explanation: "Nicht zählbar → a little milk.",
  },
  {
    id: "s4-g31-3", topic: "quantifiers2", topicLabel: "a few/a little/a couple of", category: "grammar",
    type: "multiple_choice", difficulty: 2,
    question: "We stayed in London for ___ days.",
    options: ["a little", "a couple of"], correct: "a couple of",
    hint: "a couple of = zwei oder drei.",
    explanation: "a couple of days = zwei oder drei Tage.",
  },
  {
    id: "s4-g31-4", topic: "quantifiers2", topicLabel: "a few/a little/a couple of", category: "grammar",
    type: "multiple_choice", difficulty: 2,
    question: "There is only ___ juice left.",
    options: ["a few", "a little"], correct: "a little",
    hint: "'juice' ist nicht zählbar.",
    explanation: "Nicht zählbar → a little juice.",
  },
  {
    id: "s4-g31-5", topic: "quantifiers2", topicLabel: "a few/a little/a couple of", category: "grammar",
    type: "fill_gap", difficulty: 2,
    question: "He bought ___ ___ comics. (ein paar – zählbar)",
    correct: "a few",
    hint: "comics = zählbar.",
    explanation: "ein paar (zählbar) → a few comics.",
  },

  // ==========================================
  // GRAMMAR G32: can / can't / mustn't
  // ==========================================
  {
    id: "s4-g32-1", topic: "modals_can", topicLabel: "can/can't/mustn't", category: "grammar",
    type: "multiple_choice", difficulty: 1,
    question: "She ___ swim very fast.",
    options: ["can", "mustn't"], correct: "can",
    hint: "Es geht um eine Fähigkeit.",
    explanation: "Fähigkeit → can: She can swim very fast.",
  },
  {
    id: "s4-g32-2", topic: "modals_can", topicLabel: "can/can't/mustn't", category: "grammar",
    type: "multiple_choice", difficulty: 2,
    question: "You ___ run near the pool. It's dangerous!",
    options: ["can", "mustn't"], correct: "mustn't",
    hint: "Etwas ist verboten.",
    explanation: "Verbot → mustn't: You mustn't run near the pool.",
  },
  {
    id: "s4-g32-3", topic: "modals_can", topicLabel: "can/can't/mustn't", category: "grammar",
    type: "fill_gap", difficulty: 1,
    question: "___ you help me, please?",
    correct: "Can",
    hint: "Höfliche Bitte / Fähigkeit am Satzanfang.",
    explanation: "Can you help me, please? – can am Satzanfang für eine Bitte.",
  },
  {
    id: "s4-g32-4", topic: "modals_can", topicLabel: "can/can't/mustn't", category: "grammar",
    type: "fill_gap", difficulty: 2,
    question: "I'm sorry, I ___ come to your party. (Verneinung von can)",
    correct: "can't",
    alternativeCorrect: ["cannot", "can not"],
    hint: "can + not, kurz geschrieben.",
    explanation: "Verneinung von can → can't (cannot).",
  },

  // ==========================================
  // GRAMMAR G33: must / needn't
  // ==========================================
  {
    id: "s4-g33-1", topic: "modals_must", topicLabel: "must/needn't", category: "grammar",
    type: "multiple_choice", difficulty: 1,
    question: "It's very late. You ___ go to bed now.",
    options: ["must", "needn't"], correct: "must",
    hint: "Es ist nötig / eine Pflicht.",
    explanation: "Pflicht/Notwendigkeit → must: You must go to bed now.",
  },
  {
    id: "s4-g33-2", topic: "modals_must", topicLabel: "must/needn't", category: "grammar",
    type: "multiple_choice", difficulty: 2,
    question: "You ___ buy bread. We've still got enough.",
    options: ["must", "needn't"], correct: "needn't",
    hint: "Es ist NICHT nötig.",
    explanation: "Nicht nötig → needn't: You needn't buy bread.",
  },
  {
    id: "s4-g33-3", topic: "modals_must", topicLabel: "must/needn't", category: "grammar",
    type: "fill_gap", difficulty: 2,
    question: "We ___ hurry. We have lots of time. (müssen nicht)",
    correct: "needn't",
    alternativeCorrect: ["need not", "don't need to", "do not need to"],
    hint: "'müssen nicht' = needn't.",
    explanation: "müssen nicht → needn't: We needn't hurry.",
  },
  {
    id: "s4-g33-4", topic: "modals_must", topicLabel: "must/needn't", category: "grammar",
    type: "multiple_choice", difficulty: 1,
    question: "I ___ do my homework before dinner.",
    options: ["must", "needn't"], correct: "must",
    hint: "Es ist nötig.",
    explanation: "Notwendigkeit → must.",
  },

  // ==========================================
  // GRAMMAR G34: Simple Past — Aussagesätze
  // ==========================================
  {
    id: "s4-g34-1", topic: "simple_past", topicLabel: "Simple Past (Aussage)", category: "grammar",
    type: "fill_gap", difficulty: 1,
    question: "Yesterday we ___ football in the park. (play)",
    correct: "played",
    hint: "Regelmäßiges Verb: + -ed.",
    explanation: "play → played (regelmäßig).",
  },
  {
    id: "s4-g34-2", topic: "simple_past", topicLabel: "Simple Past (Aussage)", category: "grammar",
    type: "fill_gap", difficulty: 2,
    question: "She ___ to London last summer. (go)",
    correct: "went",
    hint: "go ist unregelmäßig.",
    explanation: "go → went (unregelmäßig).",
  },
  {
    id: "s4-g34-3", topic: "simple_past", topicLabel: "Simple Past (Aussage)", category: "grammar",
    type: "fill_gap", difficulty: 1,
    question: "They ___ a film last night. (watch)",
    correct: "watched",
    hint: "Regelmäßiges Verb: + -ed.",
    explanation: "watch → watched.",
  },
  {
    id: "s4-g34-4", topic: "simple_past", topicLabel: "Simple Past (Aussage)", category: "grammar",
    type: "fill_gap", difficulty: 2,
    question: "He ___ a great birthday party. (have)",
    correct: "had",
    hint: "have ist unregelmäßig.",
    explanation: "have → had (unregelmäßig).",
  },
  {
    id: "s4-g34-5", topic: "simple_past", topicLabel: "Simple Past (Aussage)", category: "grammar",
    type: "fill_gap", difficulty: 2,
    question: "I ___ my friends yesterday. (see)",
    correct: "saw",
    hint: "see ist unregelmäßig.",
    explanation: "see → saw (unregelmäßig).",
  },
  {
    id: "s4-g34-6", topic: "simple_past", topicLabel: "Simple Past (Aussage)", category: "grammar",
    type: "fill_gap", difficulty: 1,
    question: "We ___ our grandparents at Christmas. (visit)",
    correct: "visited",
    hint: "Regelmäßiges Verb: + -ed.",
    explanation: "visit → visited.",
  },
  {
    id: "s4-g34-7", topic: "simple_past", topicLabel: "Simple Past (Aussage)", category: "grammar",
    type: "multiple_choice", difficulty: 1,
    question: "Last week Tom ___ his room.",
    options: ["cleaned", "cleand", "clean"], correct: "cleaned",
    hint: "clean + -ed, richtig geschrieben.",
    explanation: "clean → cleaned.",
  },
  {
    id: "s4-g34-8", topic: "simple_past", topicLabel: "Simple Past (Aussage)", category: "grammar",
    type: "fill_gap", difficulty: 2,
    question: "My mum ___ a chocolate cake. (make)",
    correct: "made",
    hint: "make ist unregelmäßig.",
    explanation: "make → made (unregelmäßig).",
  },

  // ==========================================
  // GRAMMAR G35: Simple Past — Fragen
  // ==========================================
  {
    id: "s4-g35-1", topic: "simple_past_q", topicLabel: "Simple Past (Frage)", category: "grammar",
    type: "fill_gap", difficulty: 1,
    question: "___ you watch TV last night?",
    correct: "Did",
    hint: "Frage im Simple Past beginnt mit ...?",
    explanation: "Frage im Simple Past: Did + Subjekt + Verb (Grundform).",
  },
  {
    id: "s4-g35-2", topic: "simple_past_q", topicLabel: "Simple Past (Frage)", category: "grammar",
    type: "multiple_choice", difficulty: 2,
    question: "Where ___ they go on holiday?",
    options: ["did", "do", "was"], correct: "did",
    hint: "Vergangenheit + Frage.",
    explanation: "Where did they go ...? – did + Grundform.",
  },
  {
    id: "s4-g35-3", topic: "simple_past_q", topicLabel: "Simple Past (Frage)", category: "grammar",
    type: "fill_gap", difficulty: 2,
    question: "What ___ she eat for breakfast?",
    correct: "did",
    hint: "did + Subjekt + Grundform.",
    explanation: "What did she eat ...? – nach 'did' steht die Grundform (eat).",
  },
  {
    id: "s4-g35-4", topic: "simple_past_q", topicLabel: "Simple Past (Frage)", category: "grammar",
    type: "word_order", difficulty: 3,
    question: "Bringe die Wörter in die richtige Reihenfolge:",
    words: ["did", "you", "Where", "go", "yesterday"],
    correct: "Where did you go yesterday",
    hint: "Fragewort + did + Subjekt + Verb + Rest.",
    explanation: "Where did you go yesterday? – Fragewort + did + Subjekt + Grundform.",
  },
  {
    id: "s4-g35-5", topic: "simple_past_q", topicLabel: "Simple Past (Frage)", category: "grammar",
    type: "multiple_choice", difficulty: 1,
    question: "___ Tom play tennis on Sunday?",
    options: ["Did", "Do", "Was"], correct: "Did",
    hint: "Vergangenheit, Frage am Satzanfang.",
    explanation: "Did Tom play ...? – did + Grundform.",
  },

  // ==========================================
  // GRAMMAR G36: Simple Past — Verneinung
  // ==========================================
  {
    id: "s4-g36-1", topic: "simple_past_neg", topicLabel: "Simple Past (Verneinung)", category: "grammar",
    type: "multiple_choice", difficulty: 1,
    question: "She ___ go to school yesterday. She was ill.",
    options: ["didn't", "doesn't", "wasn't"], correct: "didn't",
    hint: "Verneinung im Simple Past.",
    explanation: "didn't + Grundform: She didn't go to school.",
  },
  {
    id: "s4-g36-2", topic: "simple_past_neg", topicLabel: "Simple Past (Verneinung)", category: "grammar",
    type: "fill_gap", difficulty: 2,
    question: "Yesterday it ___ rain. (Verneinung, ein Wort)",
    correct: "didn't",
    alternativeCorrect: ["did not"],
    hint: "did + not, kurz.",
    explanation: "Yesterday it didn't rain. – nach 'didn't' steht die Grundform (rain).",
  },
  {
    id: "s4-g36-3", topic: "simple_past_neg", topicLabel: "Simple Past (Verneinung)", category: "grammar",
    type: "multiple_choice", difficulty: 2,
    question: "They ___ like the food at the party.",
    options: ["didn't", "don't", "weren't"], correct: "didn't",
    hint: "Vergangenheit, Verneinung.",
    explanation: "didn't + Grundform: They didn't like the food.",
  },
  {
    id: "s4-g36-4", topic: "simple_past_neg", topicLabel: "Simple Past (Verneinung)", category: "grammar",
    type: "fill_gap", difficulty: 3,
    question: "He ___ us last week. (nicht besuchen – visit; Verneinung)",
    correct: "didn't visit",
    alternativeCorrect: ["did not visit"],
    hint: "didn't + Grundform (visit).",
    explanation: "He didn't visit us last week. – didn't + Grundform.",
  },

  // ==========================================
  // GRAMMAR: Saying the date (Datum & Ordnungszahlen)
  // ==========================================
  {
    id: "s4-date-1", topic: "dates", topicLabel: "Saying the date", category: "grammar",
    type: "multiple_choice", difficulty: 2,
    question: "When is your birthday? — It's ___.",
    options: ["the 3rd of May", "the 3 of May", "the three May"], correct: "the 3rd of May",
    hint: "Datum: the + Ordnungszahl + of + Monat.",
    explanation: "the 3rd of May (the third of May).",
  },
  {
    id: "s4-date-2", topic: "dates", topicLabel: "Saying the date", category: "grammar",
    type: "fill_gap", difficulty: 2,
    question: "Today is the ___ of June. (12.)",
    correct: "twelfth",
    hint: "12. als Ordnungszahl ausschreiben.",
    explanation: "12. = twelfth.",
  },
  {
    id: "s4-date-3", topic: "dates", topicLabel: "Saying the date", category: "grammar",
    type: "multiple_choice", difficulty: 1,
    question: "My birthday is ___ 21st June.",
    options: ["on", "in", "at"], correct: "on",
    hint: "Bei einem genauen Datum benutzt man ...?",
    explanation: "Bei einem Datum: on – on 21st June.",
  },
  {
    id: "s4-date-4", topic: "dates", topicLabel: "Saying the date", category: "grammar",
    type: "fill_gap", difficulty: 1,
    question: "1st = ___ (Ordnungszahl ausschreiben)",
    correct: "first",
    hint: "der/die/das Erste.",
    explanation: "1st = first.",
  },
  {
    id: "s4-date-5", topic: "dates", topicLabel: "Saying the date", category: "grammar",
    type: "fill_gap", difficulty: 1,
    question: "3rd = ___ (Ordnungszahl ausschreiben)",
    correct: "third",
    hint: "der/die/das Dritte.",
    explanation: "3rd = third.",
  },
  {
    id: "s4-date-6", topic: "dates", topicLabel: "Saying the date", category: "grammar",
    type: "multiple_choice", difficulty: 2,
    question: "What's the date today? — ___",
    options: ["It's the fifth of March", "It's the five of March", "It's the fifth March"], correct: "It's the fifth of March",
    hint: "the + Ordnungszahl + of + Monat.",
    explanation: "It's the fifth of March. (5th of March)",
  },

  // ==========================================
  // READING COMPREHENSION (Mia's birthday)
  // ==========================================
  {
    id: "s4-read-1", topic: "reading", topicLabel: "Leseverstehen", category: "reading",
    type: "reading_true_false", difficulty: 2, text: readingText,
    question: "Mia was eleven years old.", correct: "false",
    hint: "Wie alt wurde Mia?",
    explanation: "Mia was twelve years old – also falsch.",
  },
  {
    id: "s4-read-2", topic: "reading", topicLabel: "Leseverstehen", category: "reading",
    type: "reading_true_false", difficulty: 2, text: readingText,
    question: "Her friends came in the morning.", correct: "true",
    hint: "Wann kamen die Freunde?",
    explanation: "'In the morning, her friends came to her house.' – richtig.",
  },
  {
    id: "s4-read-3", topic: "reading", topicLabel: "Leseverstehen", category: "reading",
    type: "reading_true_false", difficulty: 2, text: readingText,
    question: "They had lunch at two o'clock.", correct: "false",
    hint: "Um wie viel Uhr gab es Mittagessen?",
    explanation: "'At one o'clock they had lunch.' – also falsch.",
  },
  {
    id: "s4-read-4", topic: "reading", topicLabel: "Leseverstehen", category: "reading",
    type: "reading_true_false", difficulty: 2, text: readingText,
    question: "Mia's dad made a chocolate cake.", correct: "true",
    hint: "Wer machte den Kuchen?",
    explanation: "'Mia's dad made pizza and a big chocolate cake.' – richtig.",
  },
  {
    id: "s4-read-5", topic: "reading", topicLabel: "Leseverstehen", category: "reading",
    type: "fill_gap", difficulty: 2, text: readingText,
    question: "After lunch, they watched a ___ film.", correct: "funny",
    hint: "Was für ein Film war es?",
    explanation: "'they watched a funny film.' – funny.",
  },
  {
    id: "s4-read-6", topic: "reading", topicLabel: "Leseverstehen", category: "reading",
    type: "fill_gap", difficulty: 2, text: readingText,
    question: "Mia got a new ___ and some books.", correct: "bike",
    hint: "Was bekam Mia geschenkt?",
    explanation: "'Mia got a new bike and some books.' – bike.",
  },
  {
    id: "s4-read-7", topic: "reading", topicLabel: "Leseverstehen", category: "reading",
    type: "reading_true_false", difficulty: 2, text: readingText,
    question: "In the evening, everyone went home.", correct: "true",
    hint: "Was passierte am Abend?",
    explanation: "'In the evening, everyone went home.' – richtig.",
  },

  // ==========================================
  // MEDIATION (Sprachmittlung) — Geburtstag, Essen, Freunde
  // ==========================================
  {
    id: "s4-med-1", topic: "mediation", topicLabel: "Sprachmittlung", category: "mediation",
    type: "translate", difficulty: 2,
    question: "Schreib auf Englisch: 'Letzten Samstag hatte ich Geburtstag.'",
    correct: "Last Saturday it was my birthday",
    alternativeCorrect: ["Last Saturday was my birthday", "It was my birthday last Saturday"],
    hint: "last Saturday = letzten Samstag, my birthday = mein Geburtstag.",
    explanation: "'Last Saturday it was my birthday.'",
  },
  {
    id: "s4-med-2", topic: "mediation", topicLabel: "Sprachmittlung", category: "mediation",
    type: "translate", difficulty: 2,
    question: "Dein Freund fragt: 'What did you eat?' Du hast Pizza gegessen. Antworte auf Englisch.",
    correct: "I ate pizza",
    alternativeCorrect: ["I had pizza", "We ate pizza", "We had pizza"],
    hint: "eat → ate (Simple Past).",
    explanation: "'I ate pizza.' – eat wird im Simple Past zu ate.",
  },
  {
    id: "s4-med-3", topic: "mediation", topicLabel: "Sprachmittlung", category: "mediation",
    type: "translate", difficulty: 2,
    question: "Schreib auf Englisch: 'Wir haben im Garten gespielt.'",
    correct: "We played in the garden",
    alternativeCorrect: ["We played in the yard"],
    hint: "play → played, garden = Garten.",
    explanation: "'We played in the garden.'",
  },
  {
    id: "s4-med-4", topic: "mediation", topicLabel: "Sprachmittlung", category: "mediation",
    type: "translate", difficulty: 2,
    question: "Erkläre auf Englisch: 'Meine Party fängt um vier Uhr an.'",
    correct: "My party starts at four",
    alternativeCorrect: ["My party starts at 4", "My party begins at four", "My party starts at four o'clock", "My party begins at 4"],
    hint: "to start = anfangen, at four = um vier.",
    explanation: "'My party starts at four (o'clock).'",
  },
  {
    id: "s4-med-5", topic: "mediation", topicLabel: "Sprachmittlung", category: "mediation",
    type: "translate", difficulty: 3,
    question: "Schreib auf Englisch: 'Ich habe gestern meine Freunde getroffen.'",
    correct: "I met my friends yesterday",
    alternativeCorrect: ["Yesterday I met my friends"],
    hint: "meet → met (Simple Past), yesterday = gestern.",
    explanation: "'I met my friends yesterday.' – meet wird zu met.",
  },
  {
    id: "s4-med-6", topic: "mediation", topicLabel: "Sprachmittlung", category: "mediation",
    type: "translate", difficulty: 3,
    question: "Sag deinem Freund auf Englisch: 'Mein Geburtstag ist am 21. Juni.'",
    correct: "My birthday is on the 21st of June",
    alternativeCorrect: ["My birthday is on 21st June", "My birthday is on the twenty-first of June", "My birthday is on June 21st", "My birthday is on the 21st of June"],
    hint: "Datum: on the + Ordnungszahl + of + Monat.",
    explanation: "'My birthday is on the 21st of June.'",
  },
];

export default questionsSA4;
