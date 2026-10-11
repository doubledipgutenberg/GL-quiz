// Answer checking logic
//
// Philosophie: "smart & kind" — großzügig bei der FORM, streng bei der RECHTSCHREIBUNG.
// Akzeptiert werden Unterschiede, die nichts mit Können zu tun haben:
//   Groß-/Kleinschreibung, Leerzeichen, Satzzeichen, fehlender/zusätzlicher Artikel,
//   fehlendes/zusätzliches "to" bei Verben, Umlaut-Schreibweise (ä = ae = a-Umlaut),
//   Klammer-Hinweise, Genus-Endungen (Käufer/-in), und JEDE einzelne von mehreren
//   richtigen Bedeutungen ("Botschaft; Nachricht" → eines reicht).
// NICHT akzeptiert werden echte Tippfehler/Rechtschreibfehler ("celabrate") —
// das ist beim Vokabeltraining absichtlich so.
//
// Französisch (question.answerLang === 'fr'), Entscheidung des Nutzers:
//   Akzente zählen streng (fehlender/falscher Akzent oder Cedille = falsch).
//   Artikel darf fehlen, aber ein FALSCHER Artikel (falsches Geschlecht: "une chat") ist falsch.
//   Verkürzte Formen (l', d', m', t' …) werden wie ein eigenes Wort behandelt.

const EN_ARTICLES = ['the', 'a', 'an'];
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

// Reduziert einen String auf seinen "Kern" für den Vergleich.
function canonical(str) {
  let s = foldUmlauts(String(str).toLowerCase());
  s = s.replace(/[()]/g, ' ');                 // Klammern -> Leerzeichen (Inhalt bleibt)
  s = s.replace(/[.,!?;:_"„“”‘’`…]/g, ' ');    // Satzzeichen -> Leerzeichen
  s = s.replace(/[-/]/g, ' ');                 // Bindestrich/Schrägstrich -> Leerzeichen
  s = s.replace(/'/g, '');                     // Apostroph weg (dont = don't)
  s = s.replace(/\s+/g, ' ').trim();
  let words = s.split(' ').filter(Boolean);
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

function checkFrench(question, userAnswer) {
  const userCanon = frCanonical(userAnswer);
  if (!userCanon) return false;
  const userArticle = frArticle(userAnswer);
  return allOptions(question).some((opt) => {
    if (frCanonical(opt) !== userCanon) return false;
    const optArticle = frArticle(opt);
    return !(userArticle && optArticle && userArticle !== optArticle);
  });
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
    .replace(/[.,!?;:_"„“”‘’`…]/g, ' ')
    .replace(/'/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function checkAnswer(question, userAnswer) {
  if (question.answerLang === 'fr' && question.type !== 'word_order' && question.type !== 'reading_true_false' && question.type !== 'multiple_choice') {
    return checkFrench(question, userAnswer);
  }
  const userCanon = canonical(userAnswer);
  if (!userCanon) return false;

  // Haupt- und Alternativantworten (mit allen "kind"-Regeln)
  if (acceptableSet(question).has(userCanon)) return true;

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
