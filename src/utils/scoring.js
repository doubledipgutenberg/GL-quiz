// Answer checking logic

function normalize(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:'"]+$/g, '')  // remove trailing punctuation
    .replace(/\s+/g, ' ');          // normalize whitespace
}

function wordSet(str) {
  return new Set(
    normalize(str).split(',').map(s => s.trim()).filter(Boolean)
  );
}

export function checkAnswer(question, userAnswer) {
  const answer = normalize(userAnswer);

  if (!answer) return false;

  // Check main correct answer
  if (normalize(question.correct) === answer) return true;

  // Check alternative correct answers
  if (question.alternativeCorrect) {
    if (question.alternativeCorrect.some(alt => normalize(alt) === answer))
      return true;
  }

  // vocab_card: comma-separated correct (e.g. "legen, stellen") – accept same set or superset
  if (question.type === 'vocab_card' && question.correct.includes(',')) {
    const correctSet = wordSet(question.correct);
    const answerSet = wordSet(userAnswer);
    if ([...correctSet].every(w => answerSet.has(w))) return true;
  }

  // vocab_card: correct like "Fuß / Füße" – allow comma/slash mixing and sets
  if (question.type === 'vocab_card' && question.correct.includes('/')) {
    const correctSetFromSlash = wordSet(question.correct.replace(/\//g, ','));
    const answerSetFromSlash = wordSet(userAnswer.replace(/\//g, ','));
    if ([...correctSetFromSlash].every(w => answerSetFromSlash.has(w))) return true;

    // Also handle forms like "nächste/-r/-s" – accept base and single variants
    const base = question.correct.split('/')[0].replace(/-$/, '').trim();
    if (normalize(base) === answer) return true;
    const variants = question.correct
      .split(/\s*\/\s*/)
      .map(s => s.replace(/^-?\s*/, '').trim())
      .filter(Boolean);
    if (variants.some(v => normalize(v) === answer)) return true;
  }

  // For true/false questions
  if (question.type === 'reading_true_false') {
    const correctNorm = normalize(question.correct);
    // Accept "true"/"false", "richtig"/"falsch", "yes"/"no"
    if (correctNorm === 'true' && ['true', 'richtig', 'yes', 'ja', 'right', 'correct'].includes(answer)) return true;
    if (correctNorm === 'false' && ['false', 'falsch', 'no', 'nein', 'wrong', 'incorrect'].includes(answer)) return true;
  }

  // For word order - be more lenient with punctuation and capitalization
  if (question.type === 'word_order') {
    const correctWords = normalize(question.correct).split(' ');
    const answerWords = answer.split(' ');
    if (correctWords.length === answerWords.length) {
      return correctWords.every((word, i) => word === answerWords[i]);
    }
  }

  // For translation/mediation - check if key parts are present
  if (question.type === 'translate') {
    // Already checked main and alternatives above
    return false;
  }

  return false;
}

export function calculatePoints(question, isCorrect) {
  return isCorrect ? question.difficulty : 0;
}

export function getMaxPoints(questions) {
  return questions.reduce((sum, q) => sum + q.difficulty, 0);
}
