// Answer checking logic
//
// Philosophie: "smart & kind" — großzügig bei der FORM, streng bei der RECHTSCHREIBUNG.
// Akzeptiert werden Unterschiede, die nichts mit Können zu tun haben:
//   Groß-/Kleinschreibung, Leerzeichen, Satzzeichen, fehlender/zusätzlicher Artikel,
//   fehlendes/zusätzliches "to" bei Verben, Umlaut-Schreibweise (ä = ae = a-Umlaut),
//   Klammer-Hinweise, Genus-Endungen (Käufer/-in), und JEDE einzelne von mehreren
//   richtigen Bedeutungen ("Botschaft; Nachricht" → eines reicht).
//   Mehrere Bedeutungen auf einmal, in beliebiger Reihenfolge (2026-10-20, Wunsch des Nutzers):
//   "Plakat, Poster" = "Poster, Plakat" = "Plakat und Poster" – richtig, wenn JEDER Teil für sich richtig ist.
//   Vokabeln mit DREI ODER MEHR Bedeutungen (Antwort auf Deutsch, Wunsch des Nutzers 2026-10-25): mindestens ZWEI
//   verschiedene Bedeutungen nötig ("toll, prima" bei brilliant). Endungen ("neueste/-r/-s") sind keine Bedeutungen.
//   Ausnahme per `minAnswers: 1` an der Vokabel (z. B. should – sollte; solltest; … sind nur Formen).
//   Englische Kurzformen = Langformen ("There is" = "There's"), außer bei Question tags. Typografische
//   Apostrophe (’ vom iPad) zählen wie '.
// NICHT akzeptiert werden echte Tippfehler/Rechtschreibfehler ("celabrate") —
// das ist beim Vokabeltraining absichtlich so.
//
// Französisch (question.answerLang === 'fr'), Entscheidung des Nutzers:
//   Akzente zählen streng (fehlender/falscher Akzent oder Cedille = falsch).
//   Artikel darf fehlen, aber ein FALSCHER Artikel (falsches Geschlecht: "une chat") ist falsch.
//   Verkürzte Formen (l', d', m', t' …) werden wie ein eigenes Wort behandelt.

const EN_ARTICLES = ['the', 'a', 'an'];
const PLACEHOLDERS = ['sb', 'sth', 'jmdn', 'jmdm', 'jmds', 'jmd', 'etw'];
const DE_ARTICLES = ['der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer', 'eines'];
const FR_ARTICLES = ['le', 'la', 'les', 'l', 'un', 'une', 'des', 'du'];

function foldUmlauts(s) {
  return s
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
}

function stripLeading(words, list) {
  if (words.length > 1 && list.includes(words[0])) return words.slice(1);
  return words;
}

// Englische Kurzformen = Langformen (2026-10-25, Wunsch des Nutzers): there's = there is, I'm = I am,
// don't = do not, can't = cannot … Nicht bei Question tags – dort ist die Kurzform der Lernstoff
// („isn't she“, nicht „is not she“). Wird pro Frage in checkAnswer gesetzt.
let keepContractions = false;

function expandContractions(s) {
  return s
    .replace(/\bcan't\b/g, 'can not')
    .replace(/\bcannot\b/g, 'can not')
    .replace(/\bwon't\b/g, 'will not')
    .replace(/\bshan't\b/g, 'shall not')
    .replace(/(\w)n't\b/g, '$1 not')
    .replace(/\bi'm\b/g, 'i am')
    .replace(/\b(you|we|they|who|what|there)'re\b/g, '$1 are')
    .replace(/\b(i|you|we|they|who|there)'ve\b/g, '$1 have')
    .replace(/\b(i|you|he|she|it|we|they|there|that|who)'ll\b/g, '$1 will')
    .replace(/\b(it|that|there|here|what|where|who|how|he|she)'s\b/g, '$1 is')
    .replace(/\blet's\b/g, 'let us');
}

// Reduziert einen String auf seinen "Kern" für den Vergleich.
function canonical(str) {
  let s = foldUmlauts(String(str).toLowerCase());
  s = s.replace(/[‘’`´]/g, "'");               // typografische Apostrophe (iPad) = ' (don’t = don't)
  if (!keepContractions) s = expandContractions(s);
  s = s.replace(/[()]/g, ' ');                 // Klammern -> Leerzeichen (Inhalt bleibt)
  s = s.replace(/[.,!?;:_"„“”‘’`…]/g, ' ');    // Satzzeichen -> Leerzeichen
  s = s.replace(/[-/]/g, ' ');                 // Bindestrich/Schrägstrich -> Leerzeichen
  s = s.replace(/'/g, '');                     // Apostroph weg (dont = don't)
  s = s.replace(/\s+/g, ' ').trim();
  // Platzhalter wie „jmdn.“, „etw.“, „sb“, „sth“ sind nur Hinweise – „ärgern“ = „jmdn. ärgern“, „tease“ = „to tease sb“
  let words = s.split(' ').filter((w) => w && !PLACEHOLDERS.includes(w));
  words = stripLeading(words, ['to']);         // Verb-"to"
  words = stripLeading(words, EN_ARTICLES);    // a/an/the
  words = stripLeading(words, DE_ARTICLES);    // der/die/das/ein...
  return words.join(' ');
}

// Klammern bedeuten "optional": Variante OHNE und MIT Klammerinhalt erzeugen.
// "to trip (over)" -> ["to trip", "to trip over"]
function parenVariants(s) {
  if (!s.includes('(')) return [s.trim()];
  const dropped = s.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
  const kept = s.replace(/[()]/g, ' ').replace(/\s+/g, ' ').trim();
  return [dropped, kept].filter(Boolean);
}

// Genus-/Endungs- und Schrägstrich-Varianten zu einer (klammerfreien) Variante hinzufügen.
function addSlashSuffix(part, out) {
  // Genus-/Endungsmuster: "Käufer/-in", "nächste/-r/-s"
  const suffixMatch = part.match(/^(.+?)((?:\/-\w+)+)$/);
  if (suffixMatch) {
    const base = suffixMatch[1].trim();
    out.add(base);
    suffixMatch[2].split('/').filter(Boolean).forEach((suf) => {
      out.add(base + suf.replace(/^-/, ''));
    });
    return;
  }

  // Einfache Schrägstrich-Alternativen: "Fuß / Füße"
  if (part.includes('/')) {
    part.split('/').forEach((p) => { if (p.trim()) out.add(p.trim()); });
    return;
  }

  out.add(part);
}

// Aus einer "correct"-Angabe alle akzeptablen Roh-Varianten ableiten.
function expandOptions(correct) {
  const out = new Set();
  String(correct).split(/[;,]/).forEach((rawPart) => {
    const part = rawPart.trim();
    if (!part) return;
    parenVariants(part).forEach((variant) => addSlashSuffix(variant, out));
  });
  return [...out];
}

// Französische Normalisierung: Akzente bleiben erhalten, Apostroph trennt (l'école -> l école).
function frWords(str) {
  return String(str)
    .normalize('NFC')
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[()]/g, ' ')
    .replace(/[.,!?;:_"„“”«»…]/g, ' ')
    .replace(/[-/]/g, ' ')
    .replace(/'/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

function frCanonical(str) {
  return stripLeading(frWords(str), FR_ARTICLES).join(' ');
}

function frArticle(str) {
  const words = frWords(str);
  return words.length > 1 && FR_ARTICLES.includes(words[0]) ? words[0] : null;
}

function allOptions(question) {
  const raw = [question.correct, ...(Array.isArray(question.alternativeCorrect) ? question.alternativeCorrect : [])];
  return raw.filter((v) => v != null).flatMap((v) => expandOptions(v));
}

// Antwort mit mehreren Begriffen in Teile zerlegen: Komma, Semikolon, Schrägstrich, „und/oder“ (bzw. et/ou, and/or).
// Ein Schrägstrich direkt vor einer Endung („Juror/-in“) trennt nicht.
function answerParts(userAnswer) {
  return String(userAnswer)
    .split(/\s*(?:[,;]|\/(?!-)|\s(?:und|oder|and|or|et|ou)\s)\s*/i)
    .map((p) => p.trim())
    .filter(Boolean);
}

function checkFrench(question, userAnswer) {
  if (checkFrenchSingle(question, userAnswer)) return true;
  const parts = answerParts(userAnswer);
  return parts.length > 1 && parts.every((part) => checkFrenchSingle(question, part));
}

function checkFrenchSingle(question, userAnswer) {
  const userCanon = frCanonical(userAnswer);
  if (!userCanon) return false;
  const userArticle = frArticle(userAnswer);
  return allOptions(question).some((opt) => {
    if (frCanonical(opt) !== userCanon) return false;
    const optArticle = frArticle(opt);
    return !(userArticle && optArticle && userArticle !== optArticle);
  });
}

// Bedeutungen einer Vokabel: die Teile der Lösung (durch „;“ getrennt) und jede Alternative.
// Ergebnis: kanonische Form → Nummer der Bedeutung („Juror/-in“ → juror, jurorin = dieselbe Bedeutung).
function meaningMap(question) {
  const map = new Map();
  const parts = String(question.correct ?? '').split(';').map((p) => p.trim()).filter(Boolean);
  const alts = Array.isArray(question.alternativeCorrect) ? question.alternativeCorrect : [];
  [...parts, ...alts].forEach((part, i) =>
    expandOptions(part).forEach((v) => {
      const c = canonical(v);
      if (c && !map.has(c)) map.set(c, i);
    }),
  );
  return map;
}

/** Wie viele verschiedene Bedeutungen muss die Antwort enthalten? (Vokabel → Deutsch mit ≥ 3 Bedeutungen: 2) */
export function requiredMeanings(question) {
  if (question?.minAnswers != null) return question.minAnswers;
  if (question?.type !== 'vocab_card' || !/_de$/.test(String(question.id ?? ''))) return 1;
  const n = String(question.correct ?? '').split(';').filter((p) => p.trim()).length;
  return n >= 3 ? 2 : 1;
}

/** Wie viele verschiedene richtige Bedeutungen stecken in der Antwort? (für den Hinweis nach der Antwort) */
export function countCorrectMeanings(question, userAnswer) {
  const map = meaningMap(question);
  const found = new Set();
  for (const part of answerParts(userAnswer)) {
    const c = canonical(part);
    if (map.has(c)) found.add(map.get(c));
    else {
      const variants = expandOptions(part).map(canonical).filter(Boolean);
      if (variants.length && variants.every((v) => map.has(v))) variants.forEach((v) => found.add(map.get(v)));
    }
  }
  return found.size;
}

// Menge aller akzeptablen kanonischen Formen für eine Frage.
function acceptableSet(question) {
  const set = new Set();
  const add = (val) => {
    if (val == null) return;
    expandOptions(val).forEach((opt) => {
      const c = canonical(opt);
      if (c) set.add(c);
    });
  };
  add(question.correct);
  if (Array.isArray(question.alternativeCorrect)) {
    question.alternativeCorrect.forEach(add);
  }
  return set;
}

// Leichtere Normalisierung für Wortstellungs-Aufgaben (Artikel/"to" bleiben wichtig).
function lightNorm(str) {
  return foldUmlauts(String(str).toLowerCase())
    .replace(/[‘’`´]/g, "'")
    .replace(/[.,!?;:_"„“”‘’`…]/g, ' ')
    .replace(/'/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Auswahlfragen (2026-10-20): Die gewählte Option muss genau die richtige sein. Vorher liefen sie durch den
// Freitext-Check – der zerlegt an Komma/Semikolon/Schrägstrich und ignoriert Satzzeichen. Dadurch galten richtige
// Optionen wie „Salut, Léo !“ oder „10,000“ als falsch und falsche wie „Mr Smith“ (statt „Mr. Smith“) als richtig.
const sameOption = (a, b) => {
  const norm = (x) => String(x ?? '').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
  return norm(a) === norm(b);
};

export function checkAnswer(question, userAnswer) {
  keepContractions = question?.topic === 'en_question_tags';
  try {
    return checkAnswerFor(question, userAnswer);
  } finally {
    keepContractions = false;
  }
}

// Hörverstehen „Tick all the correct answers“ (2026-10-25): genau die richtigen Optionen angekreuzt,
// nicht mehr und nicht weniger. Die Antwort kommt als Optionen, getrennt durch „ | “.
export const MULTI_SEPARATOR = ' | ';
function checkMultiSelect(question, userAnswer) {
  const norm = (x) => String(x).replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();
  const chosen = new Set(String(userAnswer ?? '').split(MULTI_SEPARATOR).map(norm).filter(Boolean));
  const right = (question.correctOptions || []).map(norm);
  return chosen.size === right.length && right.every((o) => chosen.has(o));
}

function checkAnswerFor(question, userAnswer) {
  if (question.type === 'multi_select') return checkMultiSelect(question, userAnswer);
  if (question.type === 'multiple_choice') {
    return [question.correct, ...(Array.isArray(question.alternativeCorrect) ? question.alternativeCorrect : [])].some((c) =>
      sameOption(c, userAnswer),
    );
  }
  if (question.answerLang === 'fr' && question.type !== 'word_order' && question.type !== 'reading_true_false' && question.type !== 'multiple_choice') {
    return checkFrench(question, userAnswer);
  }
  const userCanon = canonical(userAnswer);
  if (!userCanon) return false;

  // Haupt- und Alternativantworten (mit allen "kind"-Regeln)
  const acceptable = acceptableSet(question);
  const partOk = (part) =>
    acceptable.has(canonical(part)) || expandOptions(part).every((v) => acceptable.has(canonical(v)));

  // Vokabel mit drei oder mehr Bedeutungen: jeder Teil richtig UND mindestens zwei verschiedene Bedeutungen.
  const required = requiredMeanings(question);
  if (required >= 2) {
    return answerParts(userAnswer).every(partOk) && countCorrectMeanings(question, userAnswer) >= required;
  }

  if (acceptable.has(userCanon)) return true;

  // Mehrere Bedeutungen auf einmal, Reihenfolge egal: jeder Teil muss für sich richtig sein. Ein Teil darf auch
  // wie die Musterlösung geschrieben sein („Juror/-in“ → Juror und Jurorin).
  if (!['word_order', 'reading_true_false'].includes(question.type)) {
    if (answerParts(userAnswer).every(partOk)) return true;
  }

  // Hörverstehen „Answer the questions“ (keine ganzen Sätze nötig): richtig, wenn aus jeder Gruppe von
  // Schlüsselwörtern eines vorkommt (z. B. [['fall', 'autumn']] → „In the fall.“, „fall“, „In autumn“).
  if (Array.isArray(question.keywords) && question.keywords.length) {
    const words = ` ${userCanon} `;
    if (question.keywords.every((group) => group.some((k) => words.includes(` ${canonical(k)} `)))) return true;
  }

  // True/False: verschiedene Schreibweisen akzeptieren
  if (question.type === 'reading_true_false') {
    const correctNorm = lightNorm(question.correct);
    if (correctNorm === 'true' && ['true', 'richtig', 'yes', 'ja', 'right', 'correct'].includes(userCanon)) return true;
    if (correctNorm === 'false' && ['false', 'falsch', 'no', 'nein', 'wrong', 'incorrect'].includes(userCanon)) return true;
  }

  // Wortstellung: gleiche Reihenfolge, aber tolerant bei Satzzeichen/Groß-Klein
  if (question.type === 'word_order') {
    const correctWords = lightNorm(question.correct).split(' ');
    const answerWords = lightNorm(userAnswer).split(' ');
    if (correctWords.length === answerWords.length) {
      return correctWords.every((word, i) => word === answerWords[i]);
    }
  }

  return false;
}

export function calculatePoints(question, isCorrect) {
  return isCorrect ? question.difficulty : 0;
}

export function getMaxPoints(questions) {
  return questions.reduce((sum, q) => sum + q.difficulty, 0);
}
