// Feedback-Sticker aus dem Design System (design-system/assets/Stickers, Regeln in
// design-system/components/FeedbackSticker/README.md). Ersetzt die früheren Film-Figuren.
// Zufällig, aber per Shuffle-Bag: Jeder Sticker einer Sorte (Kurs × Ergebnis) kommt einmal dran,
// bevor sich einer wiederholt; der erste einer neuen Runde ist nie der zuletzt gezeigte.
import STICKERS from '../../design-system/assets/Stickers/stickers.json';
import { COURSES, EXAMS } from './questions';

const URLS = import.meta.glob('../../design-system/assets/Stickers/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
});
const srcOf = (file) => URLS[`../../design-system/assets/Stickers/${file}`];

/** Sprache des Kurses einer Frage: 'fr' | 'en' (Englisch 5 und 6 → 'en'). */
export function langOfQuestion(question) {
  const courseId = question?.course || EXAMS[question?.exam]?.course;
  return COURSES.find((c) => c.id === courseId)?.lang === 'fr' ? 'fr' : 'en';
}

const bags = new Map();
const last = new Map();

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Nächster Sticker für Kurs-Sprache und Ergebnis: { src, exclaim, line }. */
export function nextSticker(lang, isCorrect) {
  const course = lang === 'fr' ? 'fr' : 'en';
  const verdict = isCorrect ? 'richtig' : 'nicht-ganz';
  const key = `${course}|${verdict}`;
  let bag = bags.get(key);
  if (!bag || bag.length === 0) {
    bag = shuffle(STICKERS.filter((s) => s.course === course && s.verdict === verdict));
    // Nicht zweimal hintereinander denselben (Übergang zwischen zwei Durchläufen).
    if (bag.length > 1 && bag[bag.length - 1].file === last.get(key)) bag.unshift(bag.pop());
    bags.set(key, bag);
  }
  const s = bag.pop();
  last.set(key, s.file);
  return { src: srcOf(s.file), exclaim: s.exclaim, line: s.line };
}

/** Zufällige Neigung zwischen −4° und +4° (README: leicht schief, wie aufgeklebt). */
export const stickerTilt = () => `${(Math.random() * 8 - 4).toFixed(1)}deg`;
