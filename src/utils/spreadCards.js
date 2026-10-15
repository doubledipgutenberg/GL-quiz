// Dasselbe Wort nicht direkt hintereinander (Wunsch des Nutzers, 2026-10-15): Eine Vokabel hat bis zu vier
// Kartentypen (Deutsch, Englisch/Französisch, Lückentext, Hören). Nach dem Mischen werden die Karten so
// verteilt, dass
//   - FEST: nie zwei Karten desselben Worts direkt hintereinander (vor jeder Karte wird geprüft, ob sich der
//     Rest danach noch ohne Doppel legen lässt – geht immer, solange kein Wort mehr als die Hälfte stellt),
//   - MÖGLICHST: mindestens MIN_GAP andere Karten dazwischen.
// Die Reihenfolge bleibt zufällig: Unter den Wörtern, die gerade „Pause“ haben dürfen, wird zufällig gewählt,
// Wörter mit vielen übrigen Karten etwas bevorzugt, damit sich am Ende der Runde nichts staut.

export const MIN_GAP = 5;

/** Zu welchem Wort gehört die Karte? vocabId (Klasse 6), sonst die ID ohne Kartentyp-Endung (Klasse 5). */
export function wordOf(card) {
  if (card?.vocabId) return card.vocabId;
  return String(card?.id ?? '').replace(/_(de|en|fr|gap|listen|second)$/, '');
}

/**
 * Verteilt `cards` (bereits gemischt) so, dass gleiche Wörter auseinanderliegen.
 * `random` austauschbar für Tests.
 */
export function spreadByWord(cards, { minGap = MIN_GAP, random = Math.random } = {}) {
  const groups = new Map(); // Wort -> Karten (Reihenfolge wie gemischt)
  for (const card of cards) {
    const w = wordOf(card);
    if (!groups.has(w)) groups.set(w, []);
    groups.get(w).push(card);
  }
  if (groups.size === cards.length) return cards; // jedes Wort nur einmal – nichts zu tun

  // Mehr Abstand als Wörter-1 geht nicht (z. B. „Neue Vokabeln“ mit wenigen Wörtern).
  const gap = Math.max(1, Math.min(minGap, groups.size - 1));
  const lastAt = new Map(); // Wort -> letzte Position
  const out = [];
  let lastWord = null;
  while (out.length < cards.length) {
    const pos = out.length;
    const left = cards.length - pos;
    const open = [...groups].filter(([, list]) => list.length);
    // Nach dieser Karte (Wort w) muss der Rest ohne Doppel legbar sein:
    // kein Wort mehr als die Hälfte (aufgerundet), w selbst höchstens die Hälfte (abgerundet), weil es nicht vorne stehen darf.
    const feasible = (w) => {
      const m = left - 1;
      return open.every(([x, list]) => {
        const c = x === w ? list.length - 1 : list.length;
        return c <= Math.ceil(m / 2) && (x !== w || c <= Math.floor(m / 2));
      });
    };
    const notLast = open.filter(([w]) => w !== lastWord);
    const safe = notLast.filter(([w]) => feasible(w));
    const pool = safe.length ? safe : notLast.length ? notLast : open; // letzteres nur, wenn es nicht anders geht
    const rested = pool.filter(([w]) => !lastAt.has(w) || pos - lastAt.get(w) > gap);
    let pick;
    if (rested.length) {
      // zufällig, gewichtet mit der Zahl übriger Karten
      const total = rested.reduce((n, [, list]) => n + list.length, 0);
      let r = random() * total;
      pick = rested.find(([, list]) => (r -= list.length) < 0) || rested[rested.length - 1];
    } else {
      // Kein Wort hat volle Pause: das am längsten nicht gezeigte nehmen
      pick = pool.reduce((a, b) => ((lastAt.get(a[0]) ?? -1) <= (lastAt.get(b[0]) ?? -1) ? a : b));
    }
    const [w, list] = pick;
    out.push(list.shift());
    lastAt.set(w, pos);
    lastWord = w;
  }
  return out;
}
