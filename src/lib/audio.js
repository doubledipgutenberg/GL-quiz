// Spielt Vokabel-Audio: zuerst die vorab erzeugte Datei (public/audio/<kurs>/<id>.m4a),
// falls die fehlt oder nicht abspielbar ist, die eingebaute Sprachausgabe des Browsers.

const VOICE_LANG = { fr: 'fr-FR', en: 'en-GB', de: 'de-DE' };
let current = null;
let run = 0; // jede neue Wiedergabe bricht eine noch laufende Folge ab

function speakFallback(text, lang, onEnd) {
  if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = VOICE_LANG[lang] || lang || 'fr-FR';
  u.rate = 0.9;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

function playOne(audio, onEnd) {
  try {
    current?.pause();
  } catch {
    // ignorieren
  }
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    onEnd?.();
  };
  let fellBack = false;
  const fallback = () => {
    if (fellBack) return;
    fellBack = true;
    speakFallback(audio.text, audio.lang, finish);
  };
  const el = new Audio(`${import.meta.env.BASE_URL}audio/${audio.course}/${audio.id}.m4a`);
  current = el;
  el.addEventListener('error', fallback, { once: true });
  el.addEventListener('ended', finish, { once: true });
  el.play().catch(fallback);
}

/** @param {{course: string, id: string, text: string, lang: string}} audio */
export function playAudio(audio) {
  if (!audio) return;
  run += 1;
  playOne(audio);
}

/**
 * Spielt mehrere Audios nacheinander mit kurzer Pause (Hör-Karte: erst das Wort, dann der Beispielsatz).
 * Startet eine andere Wiedergabe, wird der Rest der Folge nicht mehr gespielt.
 */
export function playSequence(list, gapMs = 700) {
  const items = (list || []).filter(Boolean);
  if (items.length === 0) return;
  run += 1;
  const mine = run;
  const step = (i) => {
    if (i >= items.length || mine !== run) return;
    playOne(items[i], () => setTimeout(() => step(i + 1), gapMs));
  };
  step(0);
}
