// Vokabelliste English Topic 1 – jede Vokabel mind. 1x im Wortschatz-Quiz
// Format: { id, en, de } – id = eindeutig für Admin-Auswertung "X von Y gekonnt"

function slug(s) {
  return s.toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .slice(0, 40) || 'voc';
}

const raw = `
a lot to learn – viel zu lernen
acting a scene – eine Theaterszene spielen
afternoon – Nachmittag
alone – allein
angry – wütend, böse
around – um … herum
Art – Kunst / Kunstunterricht
at – an, auf, bei
at home – zu Hause
at school – in der Schule
at the station – am Bahnhof
to ask – fragen, bitten
to bark – bellen
be careful – pass auf
to be about – handeln von
to be good at – gut sein in
to be in the way – im Weg sein
to be jealous (of) – eifersüchtig sein (auf)
to be late – zu spät sein
to be scared (of) – Angst haben (vor)
to be – sein
before – vor; bevor
bike – Fahrrad
board – Tafel
box – Box, Kasten
building – Gebäude
bus station – Busbahnhof
by (bike) – mit (dem Fahrrad)
cafeteria – Cafeteria
carrot – Karotte, Möhre
chips – Pommes frites
class – Klasse
classmate – Klassenkamerad/-in
classroom – Klassenzimmer
clear – klar, deutlich
club – Klub, Verein
coach – Trainer/-in
to come – kommen
Come on! – Komm schon!
cooking – Kochen
country – Land
countries – Länder
to dance – tanzen
days of the week – Wochentage
dialogue – Dialog
dinner – Abendessen
to do – machen, tun
dog-tired – hundemüde
drink – Getränk
DVD – DVD
early – früh
ear – Ohr
end – Ende
English – Englisch
English-speaking – englischsprachig
escalator – Rolltreppe
even – sogar, selbst
evening – Abend
everyone – jeder, alle
exercise book – Übungsheft
Excuse me – Entschuldigung
eye – Auge
face – Gesicht
finger – Finger
first – erste/-r/-s
food – Essen, Lebensmittel
foot / feet – Fuß / Füße
fun – Spaß, lustig
funny – lustig
German – Deutsch
get fit – fit werden
to give – geben, schenken
Good morning – Guten Morgen
goodbye – auf Wiedersehen
grandparents – Großeltern
granny – Oma
group – Gruppe, Klasse
hair – Haare
hand – Hand
handball – Handball
to have (a sweet) – (ein Bonbon) essen
to have breakfast – frühstücken
to have fun – Spaß haben
to have got – haben, besitzen
head – Kopf
help – Hilfe
Here you are – bitte schön
he's right – er hat recht
him – ihn, ihm
History – Geschichte
hobbies – Hobbys
home – nach Hause
homework – Hausaufgaben
How to… – Wie man…
in – in
in the evenings – abends
in the mornings – morgens
in the park – im Park
in the shop – im Laden
in the street – auf der Straße
important – wichtig
interesting – interessant
into – in … hinein
it's your turn – du bist dran
joke – Witz
just – nur, einfach
king – König
knee – Knie
Latin – Latein
to laugh – lachen
leg – Bein
lemonade – Limonade
lesson – Unterrichtsstunde
to listen for – horchen auf
to look – schauen
to look after – aufpassen auf
to look for – suchen nach
loud – laut
lots (of) – viel, viele
lunch – Mittagessen
lunch break – Mittagspause
machine – Automat, Maschine
man – Mann
men – Männer
Maths – Mathematik
me too – ich auch
mistake – Fehler
money – Geld
morning – Morgen
mouth – Mund
Music – Musik
neighbour – Nachbar/-in
netball – Korbball
never – nie
next – nächste/-r/-s
no – kein
nose – Nase
office – Büro
often – oft
on – auf, an
on Mondays – montags
open – offen, geöffnet
to open – öffnen
other – andere
page – Seite
pair – Paar
pen – Füller
pencil – Bleistift
pencil-case – Mäppchen
people – Menschen
person – Person
pet – Haustier
planner – Kalender
pocket money – Taschengeld
poem – Gedicht
popular – beliebt
project – Projekt
pudding – Nachtisch
question – Frage
right away – sofort
roommate – Zimmergenosse/-in
rude – unhöflich
ruler – Lineal
rule – Regel
to run – rennen
to run away – wegrennen
Science – Naturwissenschaften
scene – Szene
schoolbag – Schultasche
silly – albern
to sing – singen
to sit – sitzen
to sit down – sich hinsetzen
situation – Situation
to skate – skaten
to sleep – schlafen
to snore – schnarchen
sound – Klang, Ton
speaker – Sprecher/-in
to speak – sprechen
sports – Sport
to stand – stehen
to stand up – aufstehen
station – Bahnhof
student – Schüler/-in
to stop – aufhören
story – Geschichte
street – Straße
subject – Schulfach
sweets – Süßigkeiten
tail – Schwanz
talent show – Talentwettbewerb
teacher – Lehrer/-in
these – diese (Plural)
they – sie
thing – Ding, Sache
to think – denken
those – jene
through – durch
time – Zeit
timetable – Stundenplan
tired – müde
to tidy – aufräumen
today – heute
tomorrow – morgen
to pay – bezahlen
to play a trick – einen Streich spielen
to practise – üben
to put – legen, stellen
to take – nehmen
to talk – sprechen
to teach – lehren
to throw – werfen
to use – benutzen
to visit – besuchen
to walk – gehen
to warm up – aufwärmen
to wash – waschen
to watch – ansehen
to wear – tragen
to work – arbeiten
to write – schreiben
train – Zug
tutor – Klassenlehrer/-in
tutor group – Klasse (engl. Schule)
typical – typisch
uniform – Schuluniform
very much – sehr
vet – Tierarzt/-ärztin
voice – Stimme
volleyball – Volleyball
Wait and see – warte ab
way – Weg, Art
week – Woche
well – nun, also
what about… – wie wäre es mit…
What's the time? – Wie spät ist es?
when – wenn, wann
where – wo
whose – wessen
window – Fenster
woman – Frau
women – Frauen
work – Arbeit
You're welcome – gern geschehen
`;

const vocabList = raw
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean)
  .map(line => {
    const dash = line.indexOf(' – ');
    if (dash === -1) return null;
    const en = line.slice(0, dash).trim();
    const de = line.slice(dash + 3).trim();
    if (!en || !de) return null;
    const id = 'voc_' + slug(en);
    return { id, en, de };
  })
  .filter(Boolean);

// Dedupe by id (same English)
const seen = new Set();
const unique = vocabList.filter(v => {
  if (seen.has(v.id)) return false;
  seen.add(v.id);
  return true;
});

export const VOCAB_LIST = unique;

const MIN_VOCAB_SPACING = 40;

/** Zusätzliche akzeptierte Antworten (Synonyme, andere Bedeutungen) – damit „falsch“ nicht zu streng ist */
const ALTERNATIVES = {
  voc_story: { en: ['history'], de: [] },
  voc_to_talk: { en: ['to speak', 'speak'], de: ['sprechen'] },
  voc_to_speak: { en: ['to talk', 'talk'], de: ['sprechen'] },
  voc_to_put: { en: ['to put'], de: ['legen, stellen, setzen', 'stellen, legen, setzen', 'setzen'] },
  voc_legen__stellen: { en: ['to put'], de: ['setzen', 'legen, stellen, setzen'] },
  voc_next: { en: ['next'], de: ['nächste', 'nächstes', 'nächster'] },
  voc_first: { en: ['first'], de: ['erste', 'erster', 'erstes'] },
  voc_other: { en: ['other'], de: ['andere', 'anderer', 'anderes'] },
};

/** Zweite Bedeutung als Zusatzfrage („Noch eine andere Bedeutung?“) */
const SECOND_MEANINGS = {
  voc_story: { word: 'Geschichte', correctEn: 'history', correctDe: 'Geschichte' },
};

const INSTRUCTIONS_EN = [
  'Auf Englisch:',
  'Übersetze ins Englische.',
  'Wie sagt man auf Englisch?',
  'Englisch:',
  'Gib die englische Übersetzung an.',
];

const INSTRUCTIONS_DE = [
  'Auf Deutsch:',
  'Übersetze ins Deutsche.',
  'Wie sagt man auf Deutsch?',
  'Deutsch:',
  'Gib die deutsche Übersetzung an.',
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Zwei (oder drei bei zweiter Bedeutung) Fragen pro Vokabel; gleiche Vokabel mind. MIN_VOCAB_SPACING Fragen auseinander */
export function getVocabularyQuestions() {
  const bucketEn = [];
  const bucketDe = [];
  const bucketSecond = [];

  unique.forEach((v, i) => {
    const instrEn = INSTRUCTIONS_EN[i % INSTRUCTIONS_EN.length];
    const instrDe = INSTRUCTIONS_DE[i % INSTRUCTIONS_DE.length];
    const altEn = ALTERNATIVES[v.id]?.en ?? [];
    const altDe = ALTERNATIVES[v.id]?.de ?? [];
    const baseAltEn = v.en.startsWith('to ') ? [v.en.slice(3)] : [];

    bucketEn.push({
      id: `${v.id}_en`,
      vocabId: v.id,
      topic: 'vocabulary',
      topicLabel: 'Wortschatz',
      category: 'vocabulary',
      type: 'vocab_card',
      difficulty: 1,
      instruction: instrEn,
      word: v.de,
      correct: v.en,
      alternativeCorrect: [...baseAltEn, ...altEn],
      hint: v.en,
      explanation: `${v.en} = ${v.de}`,
    });

    bucketDe.push({
      id: `${v.id}_de`,
      vocabId: v.id,
      topic: 'vocabulary',
      topicLabel: 'Wortschatz',
      category: 'vocabulary',
      type: 'vocab_card',
      difficulty: 1,
      instruction: instrDe,
      word: v.en,
      correct: v.de,
      alternativeCorrect: altDe,
      hint: v.de,
      explanation: `${v.de} = ${v.en}`,
    });

    const second = SECOND_MEANINGS[v.id];
    if (second) {
      bucketSecond.push({
        id: `${v.id}_second`,
        vocabId: v.id,
        topic: 'vocabulary',
        topicLabel: 'Wortschatz',
        category: 'vocabulary',
        type: 'vocab_card',
        difficulty: 1,
        instruction: 'Noch eine andere Bedeutung?',
        word: second.word,
        correct: second.correctEn,
        alternativeCorrect: second.correctDe ? [second.correctDe] : [],
        hint: second.correctEn,
        explanation: `${second.correctEn} = ${second.word}`,
      });
    }
  });

  const shuffledEn = shuffle(bucketEn);
  const shuffledDe = shuffle(bucketDe);
  const shuffledSecond = shuffle(bucketSecond);
  return [...shuffledEn, ...shuffledDe, ...shuffledSecond];
}

export default VOCAB_LIST;
