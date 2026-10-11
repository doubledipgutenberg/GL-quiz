// Englisch Klasse 6 – Unit 1 „My friends and I“ (Check-in, Station 1, Station 2 bis „to fix“).
// Inhalte nach dem Vokabelteil (S. 195–198), der Grammatik (G1 going-to future, G2 question tags,
// G3 Fragen mit Präpositionen) und dem Practice pool der Unit – alle Sätze selbst formuliert.
// Hinweis: Kein Komma und kein Semikolon in `correct` von Freitext-Fragen – die trennen dort
// Alternativen. Weitere richtige Lösungen → alternativeCorrect.

const EXAM = 'en6-u1';

const T = {
  going: ['en_going_to', 'going-to future'],
  tags: ['en_question_tags', 'Question tags'],
  prep: ['en_prepositions', 'Fragen mit Präpositionen'],
  feelings: ['en_feelings', 'Feelings'],
  words: ['en_words', 'Wörter im Satz'],
  ae: ['en_american', 'American English'],
  numbers: ['en_numbers', 'Numbers & years'],
  reading: ['en_reading', 'Reading'],
  mediation: ['mediation', 'Sprachmittlung'],
};

const q = (id, [topic, topicLabel], category, rest) => ({
  id: `en6-u1-${id}`,
  exam: EXAM,
  topic,
  topicLabel,
  category,
  difficulty: 1,
  ...rest,
});

const readingText =
  "Hi, I'm Lily. Last summer my family moved house. We lived in a big city for eleven years, " +
  'but now we live on a farm close to a small town. In the city there was always a lot of noise and ' +
  "pollution, and there were traffic jams every morning. Here it's very quiet. Our house is on a hill, " +
  'and I can see fields and a river from my window.\n\n' +
  "At first I was a bit worried. I didn't know anybody, and the next shopping mall is far away. " +
  "Public transport isn't great here either – there's only one bus every hour. But now I love the " +
  "outdoor activities. My new friend Jess is teaching me to ride a horse. Next week we're going to " +
  "take part in a race. I'm really nervous! My little brother says I'm going to fall off. " +
  "He's such a show-off – he can't even ride a bike!";

const flyerText =
  'Riverside Summer Camp – Fun for kids from 9 to 14!\n' +
  '• Outdoor activities every day: hiking, fishing and horse riding\n' +
  '• Bad weather? No problem – indoor games and a movie theater on the camp\n' +
  '• Price: $45 per day (lunch included), $250 for one week\n' +
  '• Free Wi-Fi in the main building\n' +
  '• Pets are not allowed.';

const questionsEN6 = [
  // ---------- G1: going-to future ----------
  q('go-1', T.going, 'grammar', {
    type: 'multiple_choice', question: 'Look at the clouds! It ___ rain.', options: ['is going to', 'are going to', 'going to'], correct: 'is going to',
    hint: 'it → is', explanation: 'It is going to rain. – be (am/is/are) + going to + Infinitiv',
  }),
  q('go-2', T.going, 'grammar', {
    type: 'multiple_choice', question: 'We ___ visit our grandma next weekend.', options: ['are going to', 'is going to', 'am going to'], correct: 'are going to',
    hint: 'we → are', explanation: 'We are going to visit … – feststehender Plan',
  }),
  q('go-3', T.going, 'grammar', {
    type: 'fill_gap', difficulty: 2, question: 'I ___ ___ ___ watch the race on TV tonight. (going-to future)', correct: 'am going to',
    alternativeCorrect: ["I'm going to"], hint: 'I → am', explanation: 'I am going to watch … (kurz: I’m going to watch …)',
  }),
  q('go-4', T.going, 'grammar', {
    type: 'fill_gap', difficulty: 2, question: 'Emma ___ going to play football tomorrow. She’s ill. (Verneinung)', correct: "isn't",
    alternativeCorrect: ['is not'], hint: 'Verneinung von is', explanation: 'Emma isn’t going to play … – Verneinung: isn’t/aren’t/’m not + going to',
  }),
  q('go-5', T.going, 'grammar', {
    type: 'word_order', difficulty: 2, question: 'Bring die Wörter in die richtige Reihenfolge:',
    words: ['you', 'going', 'What', 'are', 'to do', 'this weekend'], correct: 'What are you going to do this weekend',
    hint: 'Fragewort + are + you + going to …', explanation: 'What are you going to do this weekend?',
  }),
  q('go-6', T.going, 'grammar', {
    type: 'multiple_choice', question: 'Are you going to move house? – No, ___', options: ["I'm not.", "I don't.", "I amn't."], correct: "I'm not.",
    hint: 'Kurzantwort mit be', explanation: 'Are you going to …? – Yes, I am. / No, I’m not.',
  }),
  q('go-7', T.going, 'grammar', {
    type: 'translate', difficulty: 3, question: 'Schreib auf Englisch: „Wir besuchen nächste Woche Chicago.“ (Plan)',
    correct: "We're going to visit Chicago next week", alternativeCorrect: ['We are going to visit Chicago next week', 'Next week we are going to visit Chicago', "Next week we're going to visit Chicago"],
    hint: 'Im Englischen nicht das Präsens!', explanation: 'We’re going to visit Chicago next week. – Für Pläne nimmt man im Englischen das going-to future, nicht das Präsens.',
  }),
  q('go-8', T.going, 'grammar', {
    type: 'multiple_choice', difficulty: 2, question: 'Welcher Satz ist richtig?',
    options: ['My sister is going to teach me to ride.', 'My sister going to teach me to ride.', 'My sister is going teach me to ride.'], correct: 'My sister is going to teach me to ride.',
    hint: 'be + going to + Verb', explanation: 'Es braucht alle drei Teile: is + going to + teach',
  }),
  q('go-9', T.going, 'grammar', {
    type: 'fill_gap', difficulty: 2, question: '___ Dave and Luke going to watch the latest action movie?', correct: 'Are',
    hint: 'Dave and Luke = they', explanation: 'Are Dave and Luke going to watch …? – Frage: be vor das Subjekt',
  }),

  // ---------- G2: question tags ----------
  q('tag-1', T.tags, 'grammar', {
    type: 'fill_gap', question: 'You’re feeling nervous, ___?', correct: "aren't you",
    hint: 'bejaht → verneinter Tag', explanation: 'You’re …, aren’t you?',
  }),
  q('tag-2', T.tags, 'grammar', {
    type: 'fill_gap', question: 'Madison is a nice girl, ___?', correct: "isn't she",
    hint: 'Madison = she', explanation: 'Madison is …, isn’t she? – Tag immer mit Personalpronomen',
  }),
  q('tag-3', T.tags, 'grammar', {
    type: 'fill_gap', difficulty: 2, question: 'Emily isn’t going to watch the race, ___?', correct: 'is she',
    hint: 'verneint → bejahter Tag', explanation: 'Emily isn’t …, is she?',
  }),
  q('tag-4', T.tags, 'grammar', {
    type: 'fill_gap', difficulty: 2, question: 'Your parents can come to the party, ___?', correct: "can't they",
    hint: 'can → can’t · parents = they', explanation: 'Your parents can …, can’t they?',
  }),
  q('tag-5', T.tags, 'grammar', {
    type: 'fill_gap', difficulty: 2, question: 'Aunt Mary knows a lot about birds, ___?', correct: "doesn't she",
    hint: 'Vollverb im simple present → does', explanation: 'knows → doesn’t she? – ohne Hilfsverb nimmt man eine Form von do',
  }),
  q('tag-6', T.tags, 'grammar', {
    type: 'fill_gap', difficulty: 2, question: 'We talked about the plan yesterday, ___?', correct: "didn't we",
    hint: 'simple past → did', explanation: 'talked → didn’t we? – simple past: did/didn’t',
  }),
  q('tag-7', T.tags, 'grammar', {
    type: 'multiple_choice', difficulty: 3, question: 'I’m in your team, ___?', options: ["aren't I", "amn't I", "isn't I"], correct: "aren't I",
    hint: 'Sonderfall bei I am', explanation: 'I’m …, aren’t I? – Sonderform bei der 1. Person Singular',
  }),
  q('tag-8', T.tags, 'grammar', {
    type: 'fill_gap', difficulty: 3, question: 'We’ve got a good horse, ___?', correct: "haven't we",
    hint: 'have got → haven’t', explanation: 'We’ve got …, haven’t we? – bei have got wie die Kurzantwort mit have',
  }),
  q('tag-9', T.tags, 'grammar', {
    type: 'multiple_choice', difficulty: 2, question: 'We often have a party after the race, ___?', options: ["don't we", "haven't we", "aren't we"], correct: "don't we",
    hint: 'have ist hier ein Vollverb', explanation: 'have (= Vollverb) → don’t we?',
  }),
  q('tag-10', T.tags, 'grammar', {
    type: 'multiple_choice', question: 'Emily’s parents are watching the race, ___?', options: ["aren't they", "aren't Emily's parents", "isn't she"], correct: "aren't they",
    hint: 'Personalpronomen!', explanation: 'Emily’s parents → they: …, aren’t they?',
  }),
  q('tag-11', T.tags, 'grammar', {
    type: 'fill_gap', difficulty: 2, question: 'Ryan and Mike had a lot of fun, ___?', correct: "didn't they",
    hint: 'had = simple past von have (Vollverb)', explanation: 'had → didn’t they?',
  }),

  // ---------- G3: Fragen mit Präpositionen / verbs + prepositions ----------
  q('pre-1', T.prep, 'grammar', {
    type: 'multiple_choice', question: 'What are you worried ___?', options: ['about', 'of', 'with'], correct: 'about',
    hint: 'to worry about', explanation: 'What are you worried about? – Die Präposition steht am Ende der Frage.',
  }),
  q('pre-2', T.prep, 'grammar', {
    type: 'multiple_choice', question: 'Who do you hang out ___ after school?', options: ['with', 'on', 'at'], correct: 'with',
    hint: 'to hang out with', explanation: 'to hang out with sb – Who do you hang out with?',
  }),
  q('pre-4', T.prep, 'grammar', {
    type: 'multiple_choice', question: 'Olivia pointed ___ her sister and said: “This is Lucy.”', options: ['at', 'on', 'over'], correct: 'at',
    hint: 'to point at', explanation: 'to point at sb/sth = auf jmdn./etwas zeigen',
  }),
  q('pre-5', T.prep, 'grammar', {
    type: 'multiple_choice', question: 'You can always count ___ me!', options: ['on', 'at', 'about'], correct: 'on',
    hint: 'sich verlassen auf', explanation: 'to count on sb = sich auf jmdn. verlassen',
  }),
  q('pre-6', T.prep, 'grammar', {
    type: 'multiple_choice', question: 'Be careful! Don’t trip ___ the bag.', options: ['over', 'on', 'with'], correct: 'over',
    hint: 'stolpern über', explanation: 'to trip over sth = über etwas stolpern',
  }),
  q('pre-7', T.prep, 'grammar', {
    type: 'word_order', difficulty: 2, question: 'Bring die Wörter in die richtige Reihenfolge:',
    words: ['does', 'Where', 'come', 'he', 'from'], correct: 'Where does he come from',
    hint: 'Die Präposition kommt ans Ende.', explanation: 'Where does he come from? – „from“ bleibt hinter dem Verb.',
  }),
  q('pre-8', T.prep, 'grammar', {
    type: 'translate', difficulty: 3, question: 'Schreib auf Englisch: „Auf wen wartest du?“',
    correct: 'Who are you waiting for', alternativeCorrect: ['Who are you waiting for?', 'Who do you wait for'],
    hint: 'to wait for · Präposition ans Ende', explanation: 'Who are you waiting for? – im Deutschen steht die Präposition vorne, im Englischen hinten.',
  }),
  q('pre-9', T.prep, 'grammar', {
    type: 'translate', difficulty: 3, question: 'Schreib auf Englisch: „Worüber redet Ryan?“',
    correct: 'What is Ryan talking about', alternativeCorrect: ["What's Ryan talking about", 'What does Ryan talk about'],
    hint: 'to talk about', explanation: 'What is Ryan talking about?',
  }),

  // ---------- Feelings (Practice pool 1) ----------
  q('fee-1', T.feelings, 'grammar', {
    type: 'multiple_choice', question: 'You have chocolate on your white jeans and everyone can see it. You feel …', options: ['embarrassed', 'proud', 'bored'], correct: 'embarrassed',
    hint: 'peinlich berührt', explanation: 'embarrassed = verlegen (die Situation ist embarrassing)',
  }),
  q('fee-2', T.feelings, 'grammar', {
    type: 'multiple_choice', question: 'There’s a big test in Maths tomorrow. You feel …', options: ['nervous', 'happy', 'bored'], correct: 'nervous',
    hint: 'aufgeregt', explanation: 'nervous = nervös, aufgeregt',
  }),
  q('fee-3', T.feelings, 'grammar', {
    type: 'multiple_choice', question: 'Your team won the race. You feel …', options: ['proud', 'worried', 'embarrassed'], correct: 'proud',
    hint: 'stolz', explanation: 'proud (of) = stolz (auf)',
  }),
  q('fee-4', T.feelings, 'grammar', {
    type: 'multiple_choice', difficulty: 2, question: 'Welches Wort passt? This photo is so ___! Please don’t put it in the yearbook.', options: ['embarrassing', 'embarrassed'], correct: 'embarrassing',
    hint: 'Das Foto IST peinlich.', explanation: 'embarrassing = peinlich (die Sache) · embarrassed = verlegen (die Person)',
  }),
  q('fee-5', T.feelings, 'grammar', {
    type: 'multiple_choice', difficulty: 2, question: 'Welches Wort passt? I’m ___ about my horse. It’s ill.', options: ['worried', 'worry'], correct: 'worried',
    hint: 'Adjektiv nach be', explanation: 'I’m worried about … = Ich mache mir Sorgen um … (to worry → worried)',
  }),
  q('fee-6', T.feelings, 'grammar', {
    type: 'fill_gap', difficulty: 2, question: 'Jay is ___ of his little sister because she won the singing contest. (stolz)', correct: 'proud',
    hint: 'stolz = ?', explanation: 'to be proud of sb = stolz auf jmdn. sein',
  }),

  // ---------- Wörter im Satz ----------
  q('wrd-1', T.words, 'grammar', {
    type: 'multiple_choice', difficulty: 2, question: 'Was bedeutet „actually“?', options: ['tatsächlich; eigentlich', 'aktuell', 'jetzt gerade'], correct: 'tatsächlich; eigentlich',
    hint: 'Achtung, falscher Freund!', explanation: 'actually ≠ aktuell – actually = tatsächlich, eigentlich',
  }),
  q('wrd-2', T.words, 'grammar', {
    type: 'multiple_choice', difficulty: 2, question: 'Was bedeutet „the latest news“?', options: ['die neuesten Nachrichten', 'die spätesten Nachrichten', 'die letzten Nachrichten des Tages'], correct: 'die neuesten Nachrichten',
    hint: 'latest = neueste', explanation: 'the latest news = die neuesten (nicht: spätesten) Nachrichten',
  }),
  q('wrd-3', T.words, 'grammar', {
    type: 'fill_gap', question: 'My bike is broken. Can you ___ it? (reparieren)', correct: 'fix',
    hint: 'reparieren = to …', explanation: 'to fix = reparieren',
  }),
  q('wrd-4', T.words, 'grammar', {
    type: 'fill_gap', question: 'It’s ___ 8 o’clock! You’re late for school. (fast)', correct: 'almost',
    hint: 'fast; beinahe', explanation: 'almost = fast, beinahe',
  }),
  q('wrd-5', T.words, 'grammar', {
    type: 'fill_gap', question: 'I can’t come to your party. – Oh, what a ___! (Wie schade!)', correct: 'shame',
    hint: 'Wie schade! = What a …!', explanation: 'What a shame! = Wie schade!',
  }),
  q('wrd-6', T.words, 'grammar', {
    type: 'fill_gap', difficulty: 2, question: 'I grew ___ in Minneapolis. It’s my home town. (aufwachsen)', correct: 'up',
    hint: 'to grow …', explanation: 'to grow up = aufwachsen',
  }),
  q('wrd-7', T.words, 'grammar', {
    type: 'multiple_choice', question: 'It’s a nice day. Let’s play ___!', options: ['outdoors', 'indoors', 'during'], correct: 'outdoors',
    hint: 'draußen', explanation: 'outdoors = draußen ↔ indoors = drinnen',
  }),
  q('wrd-8', T.words, 'grammar', {
    type: 'multiple_choice', question: 'Don’t eat ___ lessons!', options: ['during', 'while', 'between'], correct: 'during',
    hint: 'während + Nomen', explanation: 'during (+ Nomen) = während: during lessons',
  }),
  q('wrd-9', T.words, 'grammar', {
    type: 'multiple_choice', question: 'I always ___ tired when I watch TV.', options: ['get', 'become to', 'make'], correct: 'get',
    hint: 'werden', explanation: 'to get tired = müde werden',
  }),

  // ---------- American English ----------
  q('ae-1', T.ae, 'grammar', {
    type: 'multiple_choice', question: 'British English „film“ = American English …', options: ['movie', 'cinema', 'program'], correct: 'movie',
    hint: 'AE', explanation: 'film (BE) = movie (AE)',
  }),
  q('ae-2', T.ae, 'grammar', {
    type: 'multiple_choice', question: 'British English „cinema“ = American English …', options: ['movie theater', 'movie hall', 'theatre'], correct: 'movie theater',
    hint: 'AE', explanation: 'cinema (BE) = movie theater (AE)',
  }),
  q('ae-3', T.ae, 'grammar', {
    type: 'multiple_choice', question: 'British English „shopping centre“ = American English …', options: ['mall', 'market', 'store'], correct: 'mall',
    hint: 'AE', explanation: 'shopping centre (BE) = mall (AE)',
  }),
  q('ae-4', T.ae, 'grammar', {
    type: 'multiple_choice', question: 'British English „autumn“ = American English …', options: ['fall', 'season', 'harvest'], correct: 'fall',
    hint: 'AE', explanation: 'autumn (BE) = fall (AE)',
  }),
  q('ae-5', T.ae, 'grammar', {
    type: 'multiple_choice', question: 'British English „rubbish“ = American English …', options: ['trash', 'junk food', 'waste paper'], correct: 'trash',
    hint: 'AE', explanation: 'rubbish (BE) = trash (AE)',
  }),
  q('ae-6', T.ae, 'grammar', {
    type: 'multiple_choice', difficulty: 2, question: 'Welches Wort ist American English?', options: ['program', 'programme', 'dialogue'], correct: 'program',
    hint: 'AE lässt oft Buchstaben weg.', explanation: 'program, dialog, organize, meter – American English · programme, dialogue, organise, metre – British English',
  }),

  // ---------- Numbers & years ----------
  q('num-1', T.numbers, 'grammar', {
    type: 'multiple_choice', question: 'Wie liest man 1492 als Jahreszahl?', options: ['fourteen ninety-two', 'one thousand four hundred ninety-two', 'fourteen hundred ninety-two'], correct: 'fourteen ninety-two',
    hint: 'zwei Zweiergruppen', explanation: '1492 = fourteen ninety-two',
  }),
  q('num-2', T.numbers, 'grammar', {
    type: 'multiple_choice', question: 'Wie schreibt man „eins Komma fünf“ auf Englisch?', options: ['1.5', '1,5', '1:5'], correct: '1.5',
    hint: 'Komma → Punkt', explanation: '1.5 = one point five – im Englischen Punkt statt Komma',
  }),
  q('num-3', T.numbers, 'grammar', {
    type: 'multiple_choice', question: 'Wie schreibt man zehntausend auf Englisch?', options: ['10,000', '10.000', '10 000'], correct: '10,000',
    hint: 'Tausender trennt man mit …', explanation: 'Große Zahlen: Komma trennt die Tausender – 10,000',
  }),
  q('num-4', T.numbers, 'grammar', {
    type: 'multiple_choice', question: 'Music videos became popular in the 1980s. Wie sagt man „the 1980s“?', options: ['the eighties', 'the eighteens', 'the eighty'], correct: 'the eighties',
    hint: 'die Achtziger', explanation: 'the 1980s = the nineteen-eighties / the eighties',
  }),
  q('num-5', T.numbers, 'grammar', {
    type: 'translate', difficulty: 2, question: 'Schreib in Worten auf Englisch: 1,000,000', correct: 'one million', alternativeCorrect: ['a million'],
    hint: 'eine Million', explanation: '1,000,000 = one million',
  }),
  q('num-6', T.numbers, 'grammar', {
    type: 'translate', difficulty: 2, question: 'Schreib die Jahreszahl in Worten auf Englisch: 2015', correct: 'twenty fifteen', alternativeCorrect: ['two thousand fifteen', 'two thousand and fifteen'],
    hint: 'zwei Zweiergruppen', explanation: '2015 = twenty fifteen (auch: two thousand and fifteen)',
  }),

  // ---------- Reading ----------
  q('rea-1', T.reading, 'reading', {
    type: 'reading_true_false', difficulty: 2, text: readingText,
    question: 'Lily grew up on a farm.', correct: 'false',
    hint: 'Where did she live for eleven years?', explanation: 'She lived in a big city for eleven years – the family moved to the farm last summer.',
  }),
  q('rea-2', T.reading, 'reading', {
    type: 'reading_true_false', difficulty: 2, text: readingText,
    question: 'There is a lot of noise where Lily lives now.', correct: 'false',
    hint: 'How is it on the farm?', explanation: '“Here it’s very quiet.”',
  }),
  q('rea-3', T.reading, 'reading', {
    type: 'reading_true_false', difficulty: 2, text: readingText,
    question: 'Lily is going to take part in a race.', correct: 'true',
    hint: 'Next week …', explanation: '“Next week we’re going to take part in a race.”',
  }),
  q('rea-4', T.reading, 'reading', {
    type: 'multiple_choice', difficulty: 2, text: readingText,
    question: 'Why was Lily worried at first?', options: ["She didn't know anybody.", 'She was ill.', "She didn't like horses."], correct: "She didn't know anybody.",
    hint: 'At first …', explanation: '“At first I was a bit worried. I didn’t know anybody …”',
  }),
  q('rea-5', T.reading, 'reading', {
    type: 'multiple_choice', difficulty: 2, text: readingText,
    question: 'What is a problem in the country?', options: ['Public transport', 'Pollution', 'Traffic jams'], correct: 'Public transport',
    hint: 'bus …', explanation: '“Public transport isn’t great here – there’s only one bus every hour.”',
  }),
  q('rea-6', T.reading, 'reading', {
    type: 'fill_gap', difficulty: 2, text: readingText,
    question: 'Lily’s friend Jess is ___ her to ride a horse.', correct: 'teaching',
    hint: 'to teach', explanation: '“My new friend Jess is teaching me to ride a horse.”',
  }),

  // ---------- Sprachmittlung ----------
  q('med-1', T.mediation, 'mediation', {
    type: 'multiple_choice', difficulty: 2, text: flyerText,
    question: 'Deine Mutter fragt: „Was kostet eine ganze Woche?“', options: ['250 Dollar', '45 Dollar', '315 Dollar'], correct: '250 Dollar',
    hint: 'for one week', explanation: '„$250 for one week“ – eine Woche kostet 250 Dollar.',
  }),
  q('med-2', T.mediation, 'mediation', {
    type: 'multiple_choice', difficulty: 2, text: flyerText,
    question: 'Dein Vater fragt: „Dürfen wir unseren Hund mitbringen?“', options: ['Nein, Haustiere sind nicht erlaubt.', 'Ja, Haustiere kosten extra.', 'Ja, aber nur im Haupthaus.'], correct: 'Nein, Haustiere sind nicht erlaubt.',
    hint: 'pets', explanation: '„Pets are not allowed.“ = Haustiere sind nicht erlaubt.',
  }),
  q('med-3', T.mediation, 'mediation', {
    type: 'multiple_choice', difficulty: 2, text: flyerText,
    question: 'Deine Schwester fragt: „Was machen wir, wenn es regnet?“', options: ['Spiele drinnen und Kino', 'Wandern und Angeln', 'Nach Hause fahren'], correct: 'Spiele drinnen und Kino',
    hint: 'Bad weather?', explanation: '„indoor games and a movie theater“ – Spiele drinnen und ein Kino.',
  }),
  q('med-4', T.mediation, 'mediation', {
    type: 'translate', difficulty: 2,
    question: 'Erkläre deiner amerikanischen Freundin auf Englisch: „Ich mache mir Sorgen wegen des Tests.“',
    correct: "I'm worried about the test", alternativeCorrect: ['I am worried about the test', 'I worry about the test'],
    hint: 'worried about', explanation: 'I’m worried about the test.',
  }),
  q('med-5', T.mediation, 'mediation', {
    type: 'translate', difficulty: 2,
    question: 'Sag auf Englisch: „In der Stadt gibt es viel Lärm und viele Staus.“',
    correct: 'In the city there is a lot of noise and there are a lot of traffic jams',
    alternativeCorrect: ["In the city there's a lot of noise and there are lots of traffic jams", 'There is a lot of noise and there are a lot of traffic jams in the city', 'In the city there is a lot of noise and there are many traffic jams', 'There is a lot of noise and a lot of traffic jams in the city', 'In the city there is a lot of noise and a lot of traffic jams'],
    hint: 'noise · traffic jam', explanation: 'In the city there is a lot of noise and there are a lot of traffic jams.',
  }),
  q('med-6', T.mediation, 'mediation', {
    type: 'translate', difficulty: 2,
    question: 'Sag auf Englisch: „Mein Bruder ist so ein Angeber!“',
    correct: 'My brother is such a show-off', alternativeCorrect: ["My brother's such a show-off", 'My brother is a show-off', 'My brother is a real show-off'],
    hint: 'Angeber = show-off', explanation: 'My brother is such a show-off!',
  }),
];

export default questionsEN6;
