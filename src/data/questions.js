// English Topic 1 - Units 2, 3 & Across Cultures 1
// Question database for 2. Schulaufgabe

const questions = [
  // ==========================================
  // GRAMMAR: a/an (G8)
  // ==========================================
  {
    id: "g8-1",
    topic: "article_a_an",
    topicLabel: "a/an (Unbestimmter Artikel)",
    category: "grammar",
    type: "multiple_choice",
    difficulty: 1,
    question: "My sister has got ___ orange cat.",
    options: ["a", "an"],
    correct: "an",
    hint: "Schau dir den ersten Buchstaben des nächsten Wortes an!",
    explanation: "'Orange' beginnt mit einem Vokal (o), deshalb benutzen wir 'an'."
  },
  {
    id: "g8-2",
    topic: "article_a_an",
    topicLabel: "a/an (Unbestimmter Artikel)",
    category: "grammar",
    type: "multiple_choice",
    difficulty: 1,
    question: "There is ___ umbrella in the classroom.",
    options: ["a", "an"],
    correct: "an",
    hint: "Mit welchem Laut beginnt 'umbrella'?",
    explanation: "'Umbrella' beginnt mit einem Vokal (u), deshalb benutzen wir 'an'."
  },
  {
    id: "g8-3",
    topic: "article_a_an",
    topicLabel: "a/an (Unbestimmter Artikel)",
    category: "grammar",
    type: "multiple_choice",
    difficulty: 1,
    question: "He is ___ good student.",
    options: ["a", "an"],
    correct: "a",
    hint: "Mit welchem Laut beginnt 'good'?",
    explanation: "'Good' beginnt mit einem Konsonanten (g), deshalb benutzen wir 'a'."
  },

  // ==========================================
  // GRAMMAR: have got (G10-12)
  // ==========================================
  {
    id: "g10-1",
    topic: "have_got",
    topicLabel: "have got",
    category: "grammar",
    type: "fill_gap",
    difficulty: 1,
    question: "I ___ got a new bike.",
    correct: "have",
    hint: "Welche Form passt zu 'I'?",
    explanation: "Mit 'I' benutzen wir 'have got'."
  },
  {
    id: "g10-2",
    topic: "have_got",
    topicLabel: "have got",
    category: "grammar",
    type: "fill_gap",
    difficulty: 1,
    question: "She ___ got two brothers.",
    correct: "has",
    hint: "Welche Form passt zu 'she'?",
    explanation: "Mit 'he/she/it' benutzen wir 'has got'."
  },
  {
    id: "g10-3",
    topic: "have_got",
    topicLabel: "have got",
    category: "grammar",
    type: "multiple_choice",
    difficulty: 2,
    question: "___ your friend got a pet?",
    options: ["Have", "Has", "Do", "Is"],
    correct: "Has",
    hint: "'Your friend' = he/she",
    explanation: "Fragen mit 'have got': Has + he/she/it + got...? 'Your friend' ist wie 'he' oder 'she'."
  },

  // ==========================================
  // GRAMMAR: who, what, whose (G13)
  // ==========================================
  {
    id: "g13-1",
    topic: "who_what_whose",
    topicLabel: "who/what/whose",
    category: "grammar",
    type: "multiple_choice",
    difficulty: 2,
    question: "___ is your favourite teacher? — Mrs Smith.",
    options: ["Who", "What", "Whose"],
    correct: "Who",
    hint: "Wir fragen nach einer Person.",
    explanation: "'Who' benutzen wir, wenn wir nach einer Person fragen."
  },
  {
    id: "g13-2",
    topic: "who_what_whose",
    topicLabel: "who/what/whose",
    category: "grammar",
    type: "multiple_choice",
    difficulty: 2,
    question: "___ bag is this? — It's Tom's bag.",
    options: ["Who", "What", "Whose"],
    correct: "Whose",
    hint: "Wir fragen, wem etwas gehört.",
    explanation: "'Whose' benutzen wir, wenn wir fragen, wem etwas gehört."
  },

  // ==========================================
  // GRAMMAR: can/can't (G14)
  // ==========================================
  {
    id: "g14-1",
    topic: "can_cant",
    topicLabel: "can/can't",
    category: "grammar",
    type: "fill_gap",
    difficulty: 1,
    question: "Fish ___ swim, but they can't walk.",
    correct: "can",
    hint: "Können Fische schwimmen?",
    explanation: "'Can' drückt aus, dass jemand etwas kann/fähig ist."
  },
  {
    id: "g14-2",
    topic: "can_cant",
    topicLabel: "can/can't",
    category: "grammar",
    type: "multiple_choice",
    difficulty: 2,
    question: "My little brother is two. He ___ read a book.",
    options: ["can", "can't"],
    correct: "can't",
    hint: "Was kann ein zweijähriges Kind?",
    explanation: "Ein zweijähriges Kind kann noch nicht lesen, deshalb 'can't'."
  },

  // ==========================================
  // GRAMMAR: Imperativ (G15)
  // ==========================================
  {
    id: "g15-1",
    topic: "imperative",
    topicLabel: "Imperativ",
    category: "grammar",
    type: "multiple_choice",
    difficulty: 2,
    question: "Welcher Satz ist ein korrekter Imperativ?",
    options: ["You open the window.", "Open the window!", "He opens the window.", "Opening the window."],
    correct: "Open the window!",
    hint: "Der Imperativ ist eine Befehlsform. Mit welcher Wortart beginnt er?",
    explanation: "Der Imperativ beginnt direkt mit dem Verb, ohne Subjekt: 'Open the window!'"
  },
  {
    id: "g15-2",
    topic: "imperative",
    topicLabel: "Imperativ",
    category: "grammar",
    type: "fill_gap",
    difficulty: 2,
    question: "___ quiet, please! (be)",
    correct: "Be",
    hint: "Imperativ = Grundform des Verbs am Anfang",
    explanation: "Im Imperativ steht das Verb in der Grundform am Satzanfang: 'Be quiet!'"
  },

  // ==========================================
  // GRAMMAR: s-Genitiv (G16)
  // ==========================================
  {
    id: "g16-1",
    topic: "s_genitive",
    topicLabel: "s-Genitiv",
    category: "grammar",
    type: "fill_gap",
    difficulty: 2,
    question: "This is my ___ car. (dad)",
    correct: "dad's",
    hint: "Wie zeigt man im Englischen Besitz mit 's?",
    explanation: "Der s-Genitiv zeigt Besitz: dad's car = das Auto von meinem Vater."
  },
  {
    id: "g16-2",
    topic: "s_genitive",
    topicLabel: "s-Genitiv",
    category: "grammar",
    type: "multiple_choice",
    difficulty: 2,
    question: "The ___ toys are in the garden.",
    options: ["children's", "childrens", "childrens'", "children"],
    correct: "children's",
    hint: "'Children' ist schon Plural. Wo kommt das Apostroph hin?",
    explanation: "Bei unregelmäßigem Plural (children) kommt 's direkt an das Wort: children's."
  },

  // ==========================================
  // GRAMMAR: Besitzform mit of (G17)
  // ==========================================
  {
    id: "g17-1",
    topic: "of_possessive",
    topicLabel: "Besitzform mit of",
    category: "grammar",
    type: "multiple_choice",
    difficulty: 2,
    question: "Wie sagt man 'die Farbe des Autos' auf Englisch?",
    options: ["the colour of the car", "the car's colour", "the colour the car", "of the car colour"],
    correct: "the colour of the car",
    hint: "Bei Sachen benutzen wir oft 'of'.",
    explanation: "Bei Gegenständen (nicht Personen) benutzen wir oft 'of': the colour of the car."
  },
  {
    id: "g17-2",
    topic: "of_possessive",
    topicLabel: "Besitzform mit of",
    category: "grammar",
    type: "multiple_choice",
    difficulty: 2,
    question: "Welcher Satz ist richtig?",
    options: ["the name of the school", "the school of the name", "the name school's", "of school the name"],
    correct: "the name of the school",
    hint: "Was gehört wem? Der Name gehört zur Schule.",
    explanation: "'The name of the school' — bei Sachen/Orten benutzen wir 'of'."
  },

  // ==========================================
  // GRAMMAR: this/that/these/those (G18)
  // ==========================================
  {
    id: "g18-1",
    topic: "this_that",
    topicLabel: "this/that/these/those",
    category: "grammar",
    type: "multiple_choice",
    difficulty: 2,
    question: "Look at ___ birds over there in the tree! (weit weg, Mehrzahl)",
    options: ["this", "that", "these", "those"],
    correct: "those",
    hint: "Weit weg + Mehrzahl = ?",
    explanation: "'Those' benutzen wir für Dinge, die weit weg sind (Mehrzahl). Nah + Einzahl = this, nah + Mehrzahl = these, weit + Einzahl = that, weit + Mehrzahl = those."
  },
  {
    id: "g18-2",
    topic: "this_that",
    topicLabel: "this/that/these/those",
    category: "grammar",
    type: "multiple_choice",
    difficulty: 1,
    question: "___ is my pencil here in my hand. (nah, Einzahl)",
    options: ["This", "That", "These", "Those"],
    correct: "This",
    hint: "Nah + Einzahl = ?",
    explanation: "'This' benutzen wir für eine Sache, die nah ist."
  },

  // ==========================================
  // GRAMMAR: Simple Present (G19)
  // ==========================================
  {
    id: "g19-1",
    topic: "simple_present",
    topicLabel: "Simple Present",
    category: "grammar",
    type: "fill_gap",
    difficulty: 2,
    question: "My mum ___ to work every day. (go)",
    correct: "goes",
    hint: "Was passiert mit dem Verb bei 'he/she/it'?",
    explanation: "Im Simple Present bekommt das Verb bei he/she/it ein -s oder -es: go → goes."
  },
  {
    id: "g19-2",
    topic: "simple_present",
    topicLabel: "Simple Present",
    category: "grammar",
    type: "fill_gap",
    difficulty: 2,
    question: "They ___ football after school. (play)",
    correct: "play",
    hint: "Bei 'they' — bleibt das Verb in der Grundform?",
    explanation: "Bei I/you/we/they bleibt das Verb in der Grundform: They play."
  },
  {
    id: "g19-3",
    topic: "simple_present",
    topicLabel: "Simple Present",
    category: "grammar",
    type: "multiple_choice",
    difficulty: 2,
    question: "She ___ her homework in the afternoon.",
    options: ["do", "does", "doing", "done"],
    correct: "does",
    hint: "She/he/it — das 's' muss mit!",
    explanation: "Bei he/she/it bekommt das Verb im Simple Present ein -s/-es: she does."
  },

  // ==========================================
  // GRAMMAR: Satzstellung (G21)
  // ==========================================
  {
    id: "g21-1",
    topic: "word_order",
    topicLabel: "Satzstellung",
    category: "grammar",
    type: "word_order",
    difficulty: 3,
    question: "Bringe die Wörter in die richtige Reihenfolge:",
    words: ["every", "goes", "He", "to", "school", "day"],
    correct: "He goes to school every day",
    hint: "Subjekt + Verb + Rest. Wann kommt die Zeitangabe?",
    explanation: "Englische Satzstellung: Subjekt (He) + Verb (goes) + Ort (to school) + Zeit (every day)."
  },
  {
    id: "g21-2",
    topic: "word_order",
    topicLabel: "Satzstellung",
    category: "grammar",
    type: "word_order",
    difficulty: 3,
    question: "Bringe die Wörter in die richtige Reihenfolge:",
    words: ["often", "We", "play", "in", "the", "park"],
    correct: "We often play in the park",
    hint: "Wo steht das Häufigkeitsadverb? Vor dem Vollverb!",
    explanation: "Häufigkeitsadverbien stehen vor dem Vollverb: We often play..."
  },

  // ==========================================
  // GRAMMAR: Häufigkeitsadverbien (G22)
  // ==========================================
  {
    id: "g22-1",
    topic: "frequency_adverbs",
    topicLabel: "Häufigkeitsadverbien",
    category: "grammar",
    type: "multiple_choice",
    difficulty: 2,
    question: "I ___ eat pizza. I love it! (immer)",
    options: ["always", "never", "sometimes", "rarely"],
    correct: "always",
    hint: "Welches Wort bedeutet 'immer'?",
    explanation: "'Always' = immer. Die Reihenfolge: always > usually > often > sometimes > rarely > never."
  },
  {
    id: "g22-2",
    topic: "frequency_adverbs",
    topicLabel: "Häufigkeitsadverbien",
    category: "grammar",
    type: "multiple_choice",
    difficulty: 2,
    question: "Where does the adverb go? 'She is ___ late for school.'",
    options: ["She is always late", "She always is late", "Always she is late", "She late is always"],
    correct: "She is always late",
    hint: "Bei 'to be' kommt das Adverb NACH dem Verb!",
    explanation: "Nach 'to be' (is/am/are) steht das Häufigkeitsadverb danach: She is always late."
  },

  // ==========================================
  // GRAMMAR: Uhrzeit
  // ==========================================
  {
    id: "time-1",
    topic: "telling_time",
    topicLabel: "Uhrzeit",
    category: "grammar",
    type: "fill_gap",
    difficulty: 2,
    question: "It's 3:30. In English: It's half ___ three.",
    correct: "past",
    hint: "30 Minuten nach der vollen Stunde = half ___",
    explanation: "'Half past' bedeutet 'halb' — aber Achtung: im Englischen sagt man die Stunde DAVOR, nicht danach!"
  },
  {
    id: "time-2",
    topic: "telling_time",
    topicLabel: "Uhrzeit",
    category: "grammar",
    type: "multiple_choice",
    difficulty: 2,
    question: "It's 7:15. How do you say this?",
    options: ["It's quarter past seven", "It's quarter to seven", "It's half past seven", "It's seven and quarter"],
    correct: "It's quarter past seven",
    hint: "15 Minuten nach = quarter past",
    explanation: "7:15 = 'quarter past seven'. 15 Minuten nach der vollen Stunde = quarter past."
  },

  // ==========================================
  // VOCABULARY: Definitions
  // ==========================================
  {
    id: "voc-def-1",
    topic: "vocabulary",
    topicLabel: "Wortschatz",
    category: "vocabulary",
    type: "fill_gap",
    difficulty: 1,
    question: "A person who teaches you at school is a ___.",
    correct: "teacher",
    hint: "teach + er = ?",
    explanation: "A teacher — jemand, der unterrichtet (to teach)."
  },
  {
    id: "voc-def-2",
    topic: "vocabulary",
    topicLabel: "Wortschatz",
    category: "vocabulary",
    type: "fill_gap",
    difficulty: 1,
    question: "The room where you sleep is your ___.",
    correct: "bedroom",
    hint: "bed + room = ?",
    explanation: "Bedroom = Schlafzimmer (bed = Bett, room = Zimmer)."
  },
  {
    id: "voc-def-3",
    topic: "vocabulary",
    topicLabel: "Wortschatz",
    category: "vocabulary",
    type: "fill_gap",
    difficulty: 2,
    question: "You go there to borrow books. It's a ___.",
    correct: "library",
    hint: "Es ist kein Buchgeschäft, sondern ein Ort wo man Bücher ausleihen kann.",
    explanation: "Library = Bibliothek/Bücherei. (Achtung: nicht 'bookshop'!)"
  },

  // ==========================================
  // VOCABULARY: Opposites
  // ==========================================
  {
    id: "voc-opp-1",
    topic: "vocabulary",
    topicLabel: "Wortschatz (Gegenteile)",
    category: "vocabulary",
    type: "fill_gap",
    difficulty: 1,
    question: "The opposite of 'big' is ___.",
    correct: "small",
    alternativeCorrect: ["little", "tiny"],
    hint: "Denk an Größen — was ist das Gegenteil von groß?",
    explanation: "Big ↔ small (groß ↔ klein)."
  },
  {
    id: "voc-opp-2",
    topic: "vocabulary",
    topicLabel: "Wortschatz (Gegenteile)",
    category: "vocabulary",
    type: "fill_gap",
    difficulty: 1,
    question: "The opposite of 'old' is ___.",
    correct: "new",
    alternativeCorrect: ["young"],
    hint: "Was ist das Gegenteil von alt?",
    explanation: "Old ↔ new/young (alt ↔ neu/jung)."
  },
  {
    id: "voc-opp-3",
    topic: "vocabulary",
    topicLabel: "Wortschatz (Gegenteile)",
    category: "vocabulary",
    type: "fill_gap",
    difficulty: 1,
    question: "The opposite of 'easy' is ___.",
    correct: "difficult",
    alternativeCorrect: ["hard"],
    hint: "Was ist das Gegenteil von einfach?",
    explanation: "Easy ↔ difficult/hard (einfach ↔ schwierig)."
  },

  // ==========================================
  // VOCABULARY: Picture-based (images from web)
  // ==========================================
  {
    id: "voc-pic-1",
    topic: "vocabulary",
    topicLabel: "Wortschatz (Bilder)",
    category: "vocabulary",
    type: "picture_vocab",
    difficulty: 1,
    question: "What animal is this?",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop",
    correct: "cat",
    hint: "Miau!",
    explanation: "cat = Katze"
  },
  {
    id: "voc-pic-2",
    topic: "vocabulary",
    topicLabel: "Wortschatz (Bilder)",
    category: "vocabulary",
    type: "picture_vocab",
    difficulty: 1,
    question: "What animal is this?",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop",
    correct: "dog",
    hint: "Wuff!",
    explanation: "dog = Hund"
  },
  {
    id: "voc-pic-3",
    topic: "vocabulary",
    topicLabel: "Wortschatz (Bilder)",
    category: "vocabulary",
    type: "picture_vocab",
    difficulty: 1,
    question: "What is this place?",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&h=200&fit=crop",
    correct: "school",
    hint: "Du gehst jeden Tag dorthin zum Lernen.",
    explanation: "school = Schule"
  },
  {
    id: "voc-pic-4",
    topic: "vocabulary",
    topicLabel: "Wortschatz (Bilder)",
    category: "vocabulary",
    type: "picture_vocab",
    difficulty: 1,
    question: "What is this?",
    imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=200&fit=crop",
    correct: "books",
    alternativeCorrect: ["book"],
    hint: "Du liest sie gerne.",
    explanation: "books = Bücher"
  },
  {
    id: "voc-pic-5",
    topic: "vocabulary",
    topicLabel: "Wortschatz (Bilder)",
    category: "vocabulary",
    type: "picture_vocab",
    difficulty: 1,
    question: "What is this?",
    imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=200&h=200&fit=crop",
    correct: "family",
    hint: "Mama, Papa und Kinder zusammen = ?",
    explanation: "family = Familie"
  },

  // ==========================================
  // VOCABULARY: Full list Units 2 & 3 (p.209–221)
  // Familie, Zuhause, Schule, Gegenstände, Adjektive, Verben, Hobbies
  // ==========================================
  { id: "voc-u2-1", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "Your mother and your father are your ___. (Eltern)", correct: "parents", hint: "Mama und Papa zusammen", explanation: "parents = Eltern" },
  { id: "voc-u2-2", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "The son of my mother is my ___.", correct: "brother", hint: "männliches Geschwisterkind", explanation: "brother = Bruder" },
  { id: "voc-u2-3", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "The daughter of my parents is my ___.", correct: "sister", hint: "weibliches Geschwisterkind", explanation: "sister = Schwester" },
  { id: "voc-u2-4", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "My mother's mother is my ___.", correct: "grandmother", alternativeCorrect: ["grandma", "granny"], hint: "Oma", explanation: "grandmother = Großmutter" },
  { id: "voc-u2-5", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "My father's father is my ___.", correct: "grandfather", alternativeCorrect: ["grandpa", "grandad"], hint: "Opa", explanation: "grandfather = Großvater" },
  { id: "voc-u2-6", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I live in a ___. (Haus)", correct: "house", hint: "Haus", explanation: "house = Haus" },
  { id: "voc-u2-7", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I sleep in my ___. (Schlafzimmer)", correct: "bedroom", hint: "bed + room", explanation: "bedroom = Schlafzimmer" },
  { id: "voc-u2-8", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I wash in the ___. (Badezimmer)", correct: "bathroom", hint: "bath + room", explanation: "bathroom = Badezimmer" },
  { id: "voc-u2-9", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "We cook in the ___. (Küche)", correct: "kitchen", hint: "Küche", explanation: "kitchen = Küche" },
  { id: "voc-u2-10", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "We sit in the ___ room. (Wohnzimmer)", correct: "living", hint: "living room", explanation: "living room = Wohnzimmer" },
  { id: "voc-u2-11", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "Flowers grow in the ___. (Garten)", correct: "garden", hint: "Garten", explanation: "garden = Garten" },
  { id: "voc-u2-12", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "A ___ teaches at school.", correct: "teacher", hint: "Lehrer/in", explanation: "teacher = Lehrer/in" },
  { id: "voc-u2-13", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "You are a ___ at school. (Schüler)", correct: "pupil", alternativeCorrect: ["student"], hint: "Schüler", explanation: "pupil / student = Schüler" },
  { id: "voc-u2-14", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "We have lessons in the ___. (Klassenzimmer)", correct: "classroom", hint: "class + room", explanation: "classroom = Klassenzimmer" },
  { id: "voc-u2-15", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "A person in your class is your ___. (Klassenkamerad)", correct: "classmate", hint: "class + mate", explanation: "classmate = Klassenkamerad/in" },
  { id: "voc-u2-16", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "You do your ___ after school. (Hausaufgaben)", correct: "homework", hint: "home + work", explanation: "homework = Hausaufgaben" },
  { id: "voc-u2-17", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "We have a ___ at school: Don't run! (Regel)", correct: "rule", hint: "Regel", explanation: "rule = Regel" },
  { id: "voc-u2-18", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "At 12 o'clock I have ___. (Mittagessen)", correct: "lunch", hint: "Mittagessen", explanation: "lunch = Mittagessen" },
  { id: "voc-u2-19", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "We eat at school in the ___. (Kantine)", correct: "cafeteria", alternativeCorrect: ["canteen"], hint: "Schulkantine", explanation: "cafeteria = Kantine" },
  { id: "voc-u2-20", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I ___ a pen at the shop. (kaufen)", correct: "buy", hint: "kaufen", explanation: "buy = kaufen" },
  { id: "voc-u2-21", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "Chocolate and candy are ___. (Süßigkeiten)", correct: "sweets", alternativeCorrect: ["candy"], hint: "Süßes", explanation: "sweets = Süßigkeiten" },
  { id: "voc-u2-22", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "You buy things in a ___. (Geschäft)", correct: "shop", alternativeCorrect: ["store"], hint: "Geschäft", explanation: "shop = Geschäft" },
  { id: "voc-u2-23", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I write with a ___. (Füller)", correct: "pen", hint: "Füller", explanation: "pen = Füller" },
  { id: "voc-u2-24", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I put my pens in my ___ ___. (Federmäppchen)", correct: "pencil case", hint: "Feder + Mäppchen", explanation: "pencil case = Federmäppchen" },
  { id: "voc-u2-25", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I write in my ___ ___. (Übungsheft)", correct: "exercise book", alternativeCorrect: ["workbook"], hint: "Übungsheft", explanation: "exercise book = Übungsheft" },
  { id: "voc-u2-26", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I draw a line with a ___. (Lineal)", correct: "ruler", hint: "Lineal", explanation: "ruler = Lineal" },
  { id: "voc-u2-27", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I need a ___ to delete a mistake. (Radiergummi)", correct: "rubber", alternativeCorrect: ["eraser"], hint: "Radiergummi", explanation: "rubber = Radiergummi" },
  { id: "voc-u2-28", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "You need ___ to buy things. (Geld)", correct: "money", hint: "Geld", explanation: "money = Geld" },
  { id: "voc-u2-29", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I put my books in my ___. (Schultasche)", correct: "bag", alternativeCorrect: ["schoolbag", "rucksack"], hint: "Tasche", explanation: "bag = Tasche" },
  { id: "voc-u2-30", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "A ___ is an animal that says 'miaow'.", correct: "cat", hint: "Miau", explanation: "cat = Katze" },
  { id: "voc-u2-31", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "A ___ is an animal that says 'woof'.", correct: "dog", hint: "Wuff", explanation: "dog = Hund" },
  { id: "voc-u2-32", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "A small animal in a cage: ___. (Hamster)", correct: "hamster", hint: "Hamster", explanation: "hamster = Hamster" },
  { id: "voc-u2-33", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "Fish live in water. A ___ is a pet in a bowl.", correct: "fish", hint: "Fisch", explanation: "fish = Fisch" },
  { id: "voc-u2-34", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "The opposite of 'small' is ___.", correct: "big", alternativeCorrect: ["large"], hint: "groß", explanation: "big = groß" },
  { id: "voc-u2-35", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "The opposite of 'new' is ___.", correct: "old", hint: "alt", explanation: "old = alt" },
  { id: "voc-u2-36", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "The opposite of 'difficult' is ___.", correct: "easy", hint: "einfach", explanation: "easy = einfach" },
  { id: "voc-u2-37", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "The opposite of 'good' is ___.", correct: "bad", hint: "schlecht", explanation: "bad = schlecht" },
  { id: "voc-u2-38", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "The opposite of 'right' is ___.", correct: "wrong", hint: "falsch", explanation: "wrong = falsch" },
  { id: "voc-u2-39", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "The opposite of 'open' is ___.", correct: "closed", hint: "geschlossen", explanation: "closed = geschlossen" },
  { id: "voc-u2-40", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I ___ got a brother. (haben)", correct: "have", hint: "have got", explanation: "have = haben" },
  { id: "voc-u3-1", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "Football is a ___. (Hobby)", correct: "hobby", alternativeCorrect: ["sport"], hint: "Hobby", explanation: "hobby = Hobby" },
  { id: "voc-u3-2", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I ___ football. (spielen)", correct: "play", hint: "spielen", explanation: "play = spielen" },
  { id: "voc-u3-3", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I ___ swimming. (schwimmen gehen)", correct: "go", hint: "go swimming", explanation: "go swimming = schwimmen gehen" },
  { id: "voc-u3-4", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I ___ books. (lesen)", correct: "read", hint: "lesen", explanation: "read = lesen" },
  { id: "voc-u3-5", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I ___ music. (mögen)", correct: "like", alternativeCorrect: ["love"], hint: "mögen", explanation: "like = mögen" },
  { id: "voc-u3-6", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I ___ the guitar. (spielen)", correct: "play", hint: "play the guitar", explanation: "play = spielen" },
  { id: "voc-u3-7", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "A ___ is a place for sport or music after school. (Club)", correct: "club", hint: "Verein/Club", explanation: "club = Club/Verein" },
  { id: "voc-u3-8", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I watch ___ in the evening. (Fernsehen)", correct: "TV", alternativeCorrect: ["television"], hint: "Fernseher", explanation: "TV = Fernsehen" },
  { id: "voc-u3-9", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I play on the ___. (Computer)", correct: "computer", hint: "Computer", explanation: "computer = Computer" },
  { id: "voc-u3-10", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "Swimming and football are ___. (Sportarten)", correct: "sports", alternativeCorrect: ["sport"], hint: "Sport", explanation: "sports = Sportarten" },
  { id: "voc-u3-11", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I ___ to school by bus. (fahren/gehen)", correct: "go", hint: "go to school", explanation: "go = fahren/gehen" },
  { id: "voc-u3-12", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "What ___ is it? — It's 3 o'clock. (Uhrzeit)", correct: "time", hint: "Zeit", explanation: "time = Zeit" },
  { id: "voc-u3-13", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "In the morning I get ___ at 7. (aufstehen)", correct: "up", hint: "get up", explanation: "get up = aufstehen" },
  { id: "voc-u3-14", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I ___ breakfast at 7:30. (frühstücken)", correct: "have", alternativeCorrect: ["eat"], hint: "have breakfast", explanation: "have breakfast = frühstücken" },
  { id: "voc-u3-15", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I ___ to bed at 9. (ins Bett gehen)", correct: "go", hint: "go to bed", explanation: "go to bed = ins Bett gehen" },
  { id: "voc-u3-16", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "Every day I ___ my homework. (machen)", correct: "do", hint: "do homework", explanation: "do = machen" },
  { id: "voc-u3-17", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I ___ English at school. (lernen)", correct: "learn", hint: "lernen", explanation: "learn = lernen" },
  { id: "voc-u3-18", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "My best ___ is Tom. (Freund)", correct: "friend", hint: "Freund", explanation: "friend = Freund" },
  { id: "voc-u3-19", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I've ___ a pet. (haben – Kurzform)", correct: "got", hint: "have got", explanation: "got = haben (have got)" },
  { id: "voc-u3-20", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I ___ swim. (können)", correct: "can", hint: "können", explanation: "can = können" },
  { id: "voc-u3-21", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "English is ___. I like it. (leicht)", correct: "easy", hint: "einfach/leicht", explanation: "easy = leicht" },
  { id: "voc-u3-22", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "London is a big ___. (Stadt)", correct: "city", hint: "Stadt", explanation: "city = Stadt" },
  { id: "voc-u3-23", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "I live in a small ___. (Dorf)", correct: "village", hint: "Dorf", explanation: "village = Dorf" },
  { id: "voc-u3-24", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "Greenwich is near ___. (London)", correct: "London", hint: "Hauptstadt", explanation: "London = London" },
  { id: "voc-u3-25", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "Monday, Tuesday, Wednesday are ___ of the week. (Tage)", correct: "days", alternativeCorrect: ["day"], hint: "Tage", explanation: "days = Tage" },
  { id: "voc-u3-26", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "On ___ I don't go to school. (Samstag)", correct: "Saturday", alternativeCorrect: ["Saturdays"], hint: "Samstag", explanation: "Saturday = Samstag" },
  { id: "voc-u3-27", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "In the ___ I get up at 7. (Morgen)", correct: "morning", hint: "Morgen", explanation: "morning = Morgen" },
  { id: "voc-u3-28", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "In the ___ I do my homework. (Nachmittag)", correct: "afternoon", hint: "Nachmittag", explanation: "afternoon = Nachmittag" },
  { id: "voc-u3-29", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "In the ___ I go to bed. (Abend)", correct: "evening", hint: "Abend", explanation: "evening = Abend" },
  { id: "voc-u3-30", topic: "vocabulary", topicLabel: "Wortschatz", category: "vocabulary", type: "fill_gap", difficulty: 1, question: "At ___ I sleep. (Nacht)", correct: "night", hint: "Nacht", explanation: "night = Nacht" },

  // ==========================================
  // READING COMPREHENSION
  // ==========================================
  {
    id: "read-1",
    topic: "reading",
    topicLabel: "Leseverstehen",
    category: "reading",
    type: "reading_true_false",
    difficulty: 2,
    text: "Hi! My name is Emma. I'm 11 years old and I go to Woodhill School in London. I've got a brother. His name is Jack and he's 8. We've got a dog called Buster. After school, I usually do my homework and then I play with Buster in the garden. On Saturdays, I often go swimming with my friends.",
    question: "Emma has got a sister.",
    correct: "false",
    hint: "Lies den Text nochmal genau — wer ist Jack?",
    explanation: "Emma hat einen Bruder (brother) namens Jack, keine Schwester."
  },
  {
    id: "read-2",
    topic: "reading",
    topicLabel: "Leseverstehen",
    category: "reading",
    type: "reading_true_false",
    difficulty: 2,
    text: "Hi! My name is Emma. I'm 11 years old and I go to Woodhill School in London. I've got a brother. His name is Jack and he's 8. We've got a dog called Buster. After school, I usually do my homework and then I play with Buster in the garden. On Saturdays, I often go swimming with my friends.",
    question: "Buster is a cat.",
    correct: "false",
    hint: "Was für ein Tier ist Buster?",
    explanation: "Buster ist ein Hund (dog), keine Katze."
  },
  {
    id: "read-3",
    topic: "reading",
    topicLabel: "Leseverstehen",
    category: "reading",
    type: "reading_true_false",
    difficulty: 2,
    text: "Hi! My name is Emma. I'm 11 years old and I go to Woodhill School in London. I've got a brother. His name is Jack and he's 8. We've got a dog called Buster. After school, I usually do my homework and then I play with Buster in the garden. On Saturdays, I often go swimming with my friends.",
    question: "Emma goes swimming on Saturdays.",
    correct: "true",
    hint: "Was macht Emma am Samstag?",
    explanation: "Richtig! 'On Saturdays, I often go swimming with my friends.'"
  },
  {
    id: "read-4",
    topic: "reading",
    topicLabel: "Leseverstehen",
    category: "reading",
    type: "fill_gap",
    difficulty: 2,
    text: "Hi! My name is Emma. I'm 11 years old and I go to Woodhill School in London. I've got a brother. His name is Jack and he's 8. We've got a dog called Buster. After school, I usually do my homework and then I play with Buster in the garden. On Saturdays, I often go swimming with my friends.",
    question: "After school, Emma first does her ___ and then plays with Buster.",
    correct: "homework",
    hint: "Was macht man nach der Schule zuerst?",
    explanation: "'After school, I usually do my homework' — Hausaufgaben = homework."
  },

  // ==========================================
  // MEDIATION (Sprachmittlung)
  // ==========================================
  {
    id: "med-1",
    topic: "mediation",
    topicLabel: "Sprachmittlung",
    category: "mediation",
    type: "translate",
    difficulty: 3,
    question: "Dein englischer Freund fragt: 'What time do you get up?' Schreibe deine Antwort auf Englisch. (Du stehst um 7 Uhr auf.)",
    correct: "I get up at seven",
    alternativeCorrect: ["I get up at 7", "I get up at seven o'clock", "I get up at 7 o'clock"],
    hint: "get up = aufstehen, at = um (Uhrzeit)",
    explanation: "'I get up at seven (o'clock).' — get up = aufstehen, at + Uhrzeit."
  },
  {
    id: "med-2",
    topic: "mediation",
    topicLabel: "Sprachmittlung",
    category: "mediation",
    type: "translate",
    difficulty: 3,
    question: "Erkläre deinem englischen Freund auf Englisch: 'Ich habe einen Hund. Er heißt Rex.'",
    correct: "I have got a dog. His name is Rex",
    alternativeCorrect: ["I've got a dog. His name is Rex", "I have a dog. His name is Rex", "I have got a dog called Rex", "I've got a dog called Rex"],
    hint: "have got = haben, his name is = er heißt",
    explanation: "'I have got a dog. His name is Rex.' oder 'I've got a dog called Rex.'"
  },
  {
    id: "med-3",
    topic: "mediation",
    topicLabel: "Sprachmittlung",
    category: "mediation",
    type: "translate",
    difficulty: 3,
    question: "Schreib auf Englisch: 'In meiner Schule gibt es eine Bibliothek und einen Sportplatz.'",
    correct: "In my school there is a library and a sports field",
    alternativeCorrect: ["My school has got a library and a sports field", "There is a library and a sports field in my school", "My school has a library and a sports field"],
    hint: "there is = es gibt, library = Bibliothek, sports field = Sportplatz",
    explanation: "'In my school there is a library and a sports field.' — there is = es gibt."
  },
  {
    id: "med-4",
    topic: "mediation",
    topicLabel: "Sprachmittlung",
    category: "mediation",
    type: "translate",
    difficulty: 3,
    question: "Schreib auf Englisch: 'Ich kann gut schwimmen, aber ich kann nicht Klavier spielen.'",
    correct: "I can swim well but I can't play the piano",
    alternativeCorrect: ["I can swim well, but I cannot play the piano", "I can swim but I can't play piano", "I'm good at swimming but I can't play the piano"],
    hint: "can = können, swim = schwimmen, play the piano = Klavier spielen",
    explanation: "'I can swim well, but I can't play the piano.' — can/can't + Verb in der Grundform."
  },
  {
    id: "med-5",
    topic: "mediation",
    topicLabel: "Sprachmittlung",
    category: "mediation",
    type: "translate",
    difficulty: 2,
    question: "Dein Freund fragt: 'What pets have you got?' Du hast zwei Katzen. Antworte auf Englisch.",
    correct: "I have got two cats",
    alternativeCorrect: ["I've got two cats", "I have two cats"],
    hint: "have got = haben, two cats = zwei Katzen",
    explanation: "'I've got two cats.' — have got + Anzahl + Tier im Plural."
  }
];

import { getVocabularyQuestions as getVocabSA2 } from './vocabList';
import questionsSA4 from './questionsSA4';
import { getVocabularyQuestionsSA4 } from './vocabListSA4';

// Metadaten der Schulaufgaben (Reihenfolge = Anzeige im Auswahlmenü)
export const EXAMS = {
  sa2: {
    id: 'sa2',
    label: '2. Schulaufgabe',
    units: 'Units 2 & 3',
    subtitle: 'Vorbereitung auf die 2. Schulaufgabe',
  },
  sa4: {
    id: 'sa4',
    label: '4. Schulaufgabe',
    units: 'Units 5–6 · Across Cultures 2 · Focus 2',
    subtitle: 'Vorbereitung auf die 4. Schulaufgabe',
  },
};

export const DEFAULT_EXAM = 'sa4';

// Alle Fragen mit ihrer Schulaufgabe taggen und zusammenführen.
const allQuestions = [
  ...questions.map((q) => ({ ...q, exam: 'sa2' })),
  ...questionsSA4.map((q) => ({ ...q, exam: 'sa4' })),
];

/**
 * Wortschatz-Quiz: eine Frage pro Vokabel.
 * @param {string} [exam] 'sa2' | 'sa4' | undefined (= beide)
 */
export function getVocabularyQuestions(exam) {
  if (exam === 'sa4') return getVocabularyQuestionsSA4();
  if (exam === 'sa2') return getVocabSA2();
  return [...getVocabSA2(), ...getVocabularyQuestionsSA4()];
}

export default allQuestions;
