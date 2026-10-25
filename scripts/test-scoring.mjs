// Testfälle für den Antwort-Check (src/utils/scoring.js):  npm run check:scoring
// Neue Regeln im Matcher immer mit Fällen hier absichern – richtig UND falsch.
import { checkAnswer } from '../src/utils/scoring.js';
import { fr6VocabCards } from '../src/data/fr6/cards.js';
import { en6VocabCards } from '../src/data/en6/cards.js';

const cards = Object.fromEntries([...fr6VocabCards(), ...en6VocabCards()].map((c) => [c.id, c]));
const q = (correct, extra = {}) => ({ type: 'vocab_card', correct, ...extra });
const longQ = {
  type: 'short_answer',
  correct: "She is worried about her wheelchair. Lukas says there's a lift.",
  keywords: [['wheelchair'], ['lift', 'elevator', 'ground floor', 'path', 'worry', 'ok', 'okay', 'fine']],
  minWords: 8,
};
const helpQ = { type: 'short_answer', correct: 'They help each other with the languages.', keywords: [['german', 'english', 'language', 'languages']], minWords: 5 };

// [Frage, Antwort, erwartet, Beschreibung]
const CASES = [
  // Grundregeln
  [q('ein Plakat; ein Poster'), 'Plakat', true, 'eine von mehreren Bedeutungen reicht'],
  [q('ein Plakat; ein Poster'), 'das Plakat', true, 'anderer Artikel im Deutschen egal'],
  [q('Juror/-in; Richter/-in'), 'Jurorin', true, 'Genus-Endung'],
  [q('to fix'), 'fix', true, '„to“ darf fehlen'],
  [q('celebrate'), 'celabrate', false, 'Tippfehler bleibt falsch'],

  // Mehrere Bedeutungen auf einmal, Reihenfolge egal (2026-10-20)
  [q('ein Plakat; ein Poster'), 'Plakat, Poster', true, 'beide Bedeutungen'],
  [q('ein Plakat; ein Poster'), 'Poster, Plakat', true, 'beide, umgekehrt'],
  [q('ein Plakat; ein Poster'), 'ein Poster; ein Plakat', true, 'mit Artikel und Semikolon'],
  [q('ein Plakat; ein Poster'), 'Plakat und Poster', true, 'mit „und“'],
  [q('ein Plakat; ein Poster'), 'Poster / Plakat', true, 'mit Schrägstrich'],
  [q('ein Plakat; ein Poster'), 'Plakat, Hund', false, 'ein Teil falsch → falsch'],
  [q('ein Plakat; ein Poster'), 'Plakat,', true, 'Komma am Ende stört nicht'],
  [q('toll; prima; leuchtend'), 'prima, toll, leuchtend', true, 'drei Bedeutungen'],
  [q('Juror/-in; Richter/-in'), 'Richterin, Juror', true, 'Endungen + Reihenfolge'],
  [q('Yes I am', { type: 'translate' }), 'Yes, I am.', true, 'Satz mit Komma bleibt ein Satz'],
  [q('Yes I am', { type: 'translate' }), 'Yes, I', false, 'Satzteile sind keine Bedeutungen'],
  [{ type: 'word_order', correct: 'What are you going to do' }, 'What are you going to do?', true, 'Wortstellung: richtige Reihenfolge'],
  [{ type: 'word_order', correct: 'What are you going to do' }, 'What, you are going to do', false, 'Wortstellung: falsche Reihenfolge bleibt falsch'],

  // Musterlösung wörtlich abgetippt
  [q('Juror/-in; Richter/-in'), 'Juror/-in; Richter/-in', true, 'Lösung mit Endungen abgetippt'],
  [q('konnte/-n; könnte/-n'), 'könnte/-n', true, 'Lösung mit Endung abgetippt'],

  // Auswahlfragen: genau die gewählte Option (2026-10-20)
  [{ type: 'multiple_choice', correct: 'Salut, Léo !', options: [] }, 'Salut, Léo !', true, 'MC: richtige Option mit Komma'],
  [{ type: 'multiple_choice', correct: '10,000', options: [] }, '10,000', true, 'MC: Zahl mit Komma'],
  [{ type: 'multiple_choice', correct: 'Mr. Smith', options: [] }, 'Mr Smith', false, 'MC: Punkt fehlt → falsche Option'],
  [{ type: 'multiple_choice', correct: "children's", options: [] }, 'childrens', false, 'MC: Apostroph fehlt → falsche Option'],
  [{ type: 'multiple_choice', correct: "I'm not.", options: [] }, 'I’m not.', true, 'MC: typografischer Apostroph zählt gleich'],

  // Platzhalter jmdn./etw./sb/sth sind optional (2026-10-25)
  [cards.en6_to_tease_sb_en, 'tease', true, 'tease = to tease sb'],
  [cards.en6_to_tease_sb_en, 'to tease sb', true, 'mit sb abgetippt'],

  // Drei oder mehr Bedeutungen → mindestens zwei verschiedene (2026-10-25)
  [{ type: 'vocab_card', id: 'x_de', correct: 'eins; zwei; drei' }, 'zwei', false, '3 Bedeutungen: eine reicht nicht'],
  [{ type: 'vocab_card', id: 'x_de', correct: 'eins; zwei; drei' }, 'drei, eins', true, '3 Bedeutungen: zwei reichen'],
  [{ type: 'vocab_card', id: 'x_en', correct: 'eins; zwei; drei' }, 'zwei', true, 'Richtung Englisch: Regel gilt nicht'],
  [cards.en6_to_tease_sb_de, 'ärgern', false, 'tease: nur eine Bedeutung'],
  [cards.en6_to_tease_sb_de, 'aufziehen, ärgern', true, 'tease: zwei Bedeutungen ohne „jmdn.“'],
  [cards.en6_to_tease_sb_de, 'jmdn. hänseln; jmdn. ärgern', true, 'tease: zwei Bedeutungen mit „jmdn.“'],
  [cards.en6_to_tease_sb_de, 'ärgern, ärgern', false, 'dieselbe Bedeutung zweimal zählt einmal'],
  [cards.en6_to_tease_sb_de, 'ärgern, Hund', false, 'ein falscher Teil → falsch'],
  [cards.en6_brilliant_de, 'toll', false, 'brilliant: nur eine Bedeutung'],
  [cards.en6_brilliant_de, 'prima und leuchtend', true, 'brilliant: zwei mit „und“'],
  [cards.en6_should_de, 'sollte', true, 'should: nur Formen → eine reicht (Ausnahme)'],
  [cards.fr6_salut_de, 'Hallo', false, 'Salut: nur eine Bedeutung'],
  [cards.fr6_salut_de, 'Tschüs, Hallo', true, 'Salut: zwei Bedeutungen'],
  [cards.en6_almost_de, 'fast', true, 'nur zwei Bedeutungen → eine reicht'],

  // Endungen: eine Form reicht, auch die Kurzform (2026-10-25)
  [cards.en6_latest_de, 'neuster', true, 'latest: neuster (Kurzform)'],
  [cards.en6_latest_de, 'neuestes', true, 'latest: neuestes'],
  [cards.en6_latest_de, 'neu', false, 'latest: neu ist falsch'],

  // Auslassungspunkte: fehlen dürfen, „…“ und „...“ egal; Tippfehler bleibt falsch
  [cards.en6_there_s_nothing_more_exciting_than_en, "There's nothing more exciting than", true, '„…“ darf fehlen'],
  [cards.en6_there_s_nothing_more_exciting_than_en, "There's nothing more exciting than ...", true, 'drei Punkte statt „…“'],
  [cards.en6_there_s_nothing_more_exciting_than_en, "There's nothig more exciting than", false, 'Tippfehler „nothig“ bleibt falsch'],

  // Kurzformen = Langformen, außer bei Question tags; typografische Apostrophe (2026-10-25)
  [cards.en6_there_s_nothing_more_exciting_than_gap, 'There is nothing more exciting than', true, 'Lückentext: There is = There’s'],
  [cards.en6_there_s_nothing_more_exciting_than_gap, "There's nothing more exciting than", true, 'Lückentext: Kurzform'],
  [q("I'm in a bad mood today", { type: 'translate' }), 'I am in a bad mood today', true, "I am = I'm"],
  [q("Don't push me", { type: 'translate' }), 'Do not push me', true, "do not = don't"],
  [q("I can't swim", { type: 'translate' }), 'I cannot swim', true, "cannot = can't"],
  [q("I don't know", { type: 'translate' }), 'I don’t know', true, 'typografischer Apostroph (iPad)'],
  [{ type: 'word_order', correct: "I don't know" }, 'I don’t know', true, 'Wortstellung: typografischer Apostroph'],
  [q("isn't she", { type: 'fill_gap', topic: 'en_question_tags' }), 'is not she', false, 'Question tag: Langform ist falsch'],
  [q("isn't she", { type: 'fill_gap', topic: 'en_question_tags' }), 'isn’t she', true, 'Question tag: typografischer Apostroph'],
  [q("Emily's horse", { type: 'translate' }), 'Emily is horse', false, 'Besitz-’s wird nicht zu „is“'],

  // Hörverstehen (2026-10-25): Ankreuzen genau richtig; Kurzantworten über Schlüsselwörter
  [{ type: 'multi_select', correctOptions: ['A', 'C'], options: [] }, 'C | A', true, 'Ankreuzen: genau die richtigen'],
  [{ type: 'multi_select', correctOptions: ['A', 'C'], options: [] }, 'A', false, 'Ankreuzen: eine fehlt'],
  [{ type: 'multi_select', correctOptions: ['A', 'C'], options: [] }, 'A | B | C', false, 'Ankreuzen: eine zu viel'],
  [{ type: 'short_answer', correct: 'In the fall.', keywords: [['fall', 'autumn']] }, 'in autumn', true, 'Kurzantwort: Schlüsselwort'],
  [{ type: 'short_answer', correct: 'In the fall.', keywords: [['fall', 'autumn']] }, 'in summer', false, 'Kurzantwort: ohne Schlüsselwort falsch'],
  [{ type: 'short_answer', correct: 'They are going to watch a barrel race.', keywords: [['barrel race', 'race']] }, 'watch a barrel race', true, 'Kurzantwort: Wortgruppe'],
  [{ type: 'short_answer', correct: 'At four o’clock.', keywords: [['four', '4']] }, 'at 4', true, 'Kurzantwort: Ziffer'],

  // Längere offene Fragen (ein bis zwei Sätze): alle Schlüsselwort-Gruppen + Mindestlänge
  [longQ, 'She is worried about her wheelchair, but Lukas says there is a lift.', true, 'Lang: beide Gruppen, lang genug'],
  [longQ, "She's worried about her wheelchair. Lukas says don’t worry.", true, 'Lang: Kurzform + typogr. Apostroph'],
  [longQ, 'Because of her wheelchair and the lift', false, 'Lang: zu kurz (7 Wörter)'],
  [longQ, 'wheelchair', false, 'Lang: nur ein Schlüsselwort'],
  [longQ, 'She is worried about her wheelchair at the new school.', false, 'Lang: zweite Gruppe fehlt'],
  [longQ, 'She is a bit worried about the school. The school has a lift.', false, 'Lang: erste Gruppe fehlt'],
  [longQ, 'Kayla is worried about her wheelchair. There is an elevator.', true, 'Lang: AE-Wort elevator'],
  [helpQ, 'They help with the languages.', true, 'Lang: genau minWords'],
  [helpQ, 'With German and English.', false, 'Lang: 4 Wörter < 5'],

  // Echte Karten
  [cards.fr6_une_affiche_de, 'Poster, Plakat', true, 'affiche → Poster, Plakat'],
  [cards.fr6_un_magasin_de, 'Laden, Geschäft', true, 'magasin → Laden, Geschäft'],
  [cards.en6_brilliant_de, 'prima, toll', true, 'brilliant → prima, toll'],
  [cards.en6_to_leave_de, 'verlassen und losgehen', true, 'to leave → zwei Bedeutungen mit „und“'],
  [cards.fr6_un_ami_une_amie_fr, 'une amie, un ami', true, 'Französisch: beide Formen, umgekehrt'],
  [cards.fr6_un_ami_une_amie_fr, 'un ami, une chat', false, 'Französisch: ein Teil falsch'],
  [cards.fr6_un_magasin_fr, 'une magasin', false, 'Französisch: falscher Artikel bleibt falsch'],
  [cards.fr6_a_fr, 'a', false, 'Französisch: fehlender Akzent bleibt falsch'],
];

let fail = 0;
for (const [question, answer, expected, label] of CASES) {
  if (!question) {
    console.log(`✗ Karte fehlt: ${label}`);
    fail++;
    continue;
  }
  const got = checkAnswer(question, answer);
  if (got !== expected) {
    console.log(`✗ ${label}: „${answer}“ → ${got}, erwartet ${expected}`);
    fail++;
  }
}
console.log(fail ? `${fail} von ${CASES.length} Fällen falsch` : `✓ Antwort-Check: alle ${CASES.length} Fälle richtig`);
process.exit(fail ? 1 : 0);
