// Reihenfolge der Vokabelkarten (Wünsche des Nutzers):
//   2026-10-15: Dasselbe Wort nie direkt hintereinander – eine Vokabel hat bis zu vier Kartentypen (Deutsch,
//               Englisch/Französisch, Lückentext, Hören).
//   2026-10-20: Nach der Hälfte muss jedes Wort mindestens einmal drangekommen sein (mit irgendeiner Karte).
// Deshalb, nach dem Mischen:
//   - ZUERST jedes Wort einmal (zufällige Reihenfolge, zufälliger Kartentyp), erst danach die weiteren Karten.
//     Hat jedes Wort mindestens zwei Karten, ist damit spätestens bei der Hälfte jedes Wort dran gewesen.
//   - FEST: nie zwei Karten desselben Worts direkt hintereinander (vor jeder Karte wird geprüft, ob sich der
//     Rest danach noch ohne Doppel legen lässt – geht immer, solange kein Wort mehr als die Hälfte stellt).
//   - MÖGLICHST: mindestens MIN_GAP andere Karten dazwischen.
// Unter den erlaubten Wörtern wird zufällig gewählt, Wörter mit vielen übrigen Karten etwas bevorzugt.

export const MIN_GAP = 5;

/** Zu welchem Wort gehört die Karte? vocabId (Klasse 6), sonst die ID ohne Kartentyp-Endung (Klasse 5). */
export function wordOf(card) {
  if (card?.vocabId) return card.vocabId;
  return String(card?.id ?? '').replace(/_(de|en|fr|gap|listen|second)$/, '');
}

/**
 * Ordnet `cards` (bereits gemischt) nach den Regeln oben.
 * `seen`: Wörter, die vorher schon drankamen (z. B. in früheren Runden des Durchgangs) – sie haben keinen Vorrang.
 * `recent`: die zuletzt gefragten Wörter davor (ältestes zuerst) – damit auch über eine Rundengrenze hinweg
 *   nicht dasselbe Wort direkt folgt.
 * `random`: austauschbar (Tests, feste Reihenfolge per Startwert im Wortschatz-Durchgang).
 */
export function spreadByWord(cards, { minGap = MIN_GAP, random = Math.random, seen = null, recent = [] } = {}) {
  const groups = new Map(); // Wort -> Karten (Reihenfolge wie gemischt)
  for (const card of cards) {
    const w = wordOf(card);
    if (!groups.has(w)) groups.set(w, []);
    groups.get(w).push(card);
  }
  if (groups.size === cards.length && !recent.length) return cards; // jedes Wort nur einmal – nichts zu tun

  // Mehr Abstand als Wörter-1 geht nicht (z. B. „Neue Vokabeln“ mit wenigen Wörtern).
  const gap = Math.max(1, Math.min(minGap, groups.size - 1));
  const lastAt = new Map(); // Wort -> letzte Position (vorherige Runde: negative Positionen)
  recent.forEach((w, i) => lastAt.set(w, i - recent.length));
  const out = [];
  let lastWord = recent.length ? recent[recent.length - 1] : null;
  const isNew = (w) => !lastAt.has(w) && !(seen && seen.has(w));

  while (out.length < cards.length) {
    const pos = out.length;
    const m = cards.length - pos - 1; // Karten nach dieser
    const open = [...groups].filter(([, list]) => list.length);

    // Größte und zweitgrößte Restmenge – damit lässt sich jede Wahl in O(1) prüfen.
    let max = 0;
    let maxWord = null;
    let second = 0;
    for (const [w, list] of open) {
      if (list.length > max) {
        second = max;
        max = list.length;
        maxWord = w;
      } else if (list.length > second) second = list.length;
    }
    // Nach Wort w muss der Rest ohne Doppel legbar sein: kein anderes Wort mehr als die Hälfte (aufgerundet),
    // w selbst höchstens die Hälfte (abgerundet), weil es nicht gleich wieder vorne stehen darf.
    const feasible = ([w, list]) => {
      const others = w === maxWord ? second : max;
      return others <= Math.ceil(m / 2) && list.length - 1 <= Math.floor(m / 2);
    };

    const notLast = open.filter(([w]) => w !== lastWord);
    const safe = notLast.filter(feasible);
    const pool = safe.length ? safe : notLast.length ? notLast : open; // letzteres nur, wenn es nicht anders geht
    const fresh = pool.filter(([w]) => isNew(w));
    const rested = fresh.length ? fresh : pool.filter(([w]) => !lastAt.has(w) || pos - lastAt.get(w) > gap);

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
