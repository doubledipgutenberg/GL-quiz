// Spielt eine Vokabel ab: zuerst die vorab erzeugte Datei (public/audio/<kurs>/<id>.m4a),
// falls die fehlt oder nicht abspielbar ist, die eingebaute Sprachausgabe des Browsers.

const VOICE_LANG = { fr: 'fr-FR', en: 'en-GB', de: 'de-DE' };
let current = null;

function speakFallback(text, lang) {
  if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = VOICE_LANG[lang] || lang || 'fr-FR';
  u.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

/** @param {{course: string, id: string, text: string, lang: string}} audio */
export function playAudio(audio) {
  if (!audio) return;
  try {
    current?.pause();
  } catch {
    // ignorieren
  }
  let fellBack = false;
  const fallback = () => {
    if (fellBack) return;
    fellBack = true;
    speakFallback(audio.text, audio.lang);
  };
  const el = new Audio(`${import.meta.env.BASE_URL}audio/${audio.course}/${audio.id}.m4a`);
  current = el;
  el.addEventListener('error', fallback, { once: true });
  el.play().catch(fallback);
}
