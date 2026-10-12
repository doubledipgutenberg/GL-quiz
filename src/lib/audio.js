// Spielt Vokabel-Audio (vorab erzeugte Dateien public/audio/<kurs>/<id>.m4a).
//
// Wichtig (Fehler vom 2026-10-12): Früher wurde bei JEDEM fehlgeschlagenen play() die Sprachausgabe des
// Browsers als Ersatz gestartet – auch beim harmlosen AbortError, wenn ein Abspielen ein anderes
// unterbricht. Dann sprach eine fremde Systemstimme das Wort sofort, und die echte Datei kam erst nach
// ihrer 0,8-s-Stille: Man hörte „eine Silbe/ein Geräusch“ vor dem eigentlichen Wort. Deshalb jetzt:
//   – EIN wiederverwendetes <audio>-Element; Unterbrechen (AbortError) ist normal und wird ignoriert.
//   – Ersatzstimme nur, wenn die Datei wirklich fehlt/kaputt ist (error-Event) und nur für die aktuelle
//     Wiedergabe; jede neue Wiedergabe beendet eine laufende Ersatzstimme.
//   – Blockiert der Browser automatisches Abspielen (NotAllowedError, v. a. Safari), bleibt es still.
//     Damit das selten passiert, wird das Element beim ersten Tippen/Klicken einmal stumm „freigeschaltet“.

const VOICE_LANG = { fr: 'fr-FR', en: 'en-GB', de: 'de-DE' };
const hasWindow = typeof window !== 'undefined';
const player = hasWindow ? new Audio() : null;
let run = 0; // jede neue Wiedergabe macht ältere Folgen und Rückrufe ungültig

function cancelSpeech() {
  if (hasWindow && 'speechSynthesis' in window) window.speechSynthesis.cancel();
}

function speakFallback(text, lang, onEnd) {
  if (!text || !hasWindow || !('speechSynthesis' in window)) {
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

// Winzige stille WAV-Datei zum Freischalten (Safari erlaubt danach Abspielen ohne erneutes Tippen).
function silentWav() {
  const samples = 800; // 0,1 s bei 8 kHz, 8 Bit
  const bytes = new Uint8Array(44 + samples);
  const view = new DataView(bytes.buffer);
  const text = (o, s) => [...s].forEach((c, i) => view.setUint8(o + i, c.charCodeAt(0)));
  text(0, 'RIFF'); view.setUint32(4, 36 + samples, true); text(8, 'WAVE'); text(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, 8000, true); view.setUint32(28, 8000, true); view.setUint16(32, 1, true);
  view.setUint16(34, 8, true); text(36, 'data'); view.setUint32(40, samples, true);
  bytes.fill(128, 44);
  return `data:audio/wav;base64,${btoa(String.fromCharCode(...bytes))}`;
}

let unlocked = false;
function unlock() {
  if (unlocked || !player) return;
  unlocked = true;
  if (player.src) return; // es wurde schon (per Klick) etwas abgespielt
  player.muted = true;
  player.src = silentWav();
  player
    .play()
    .catch(() => {})
    .finally(() => {
      player.muted = false;
    });
}
if (hasWindow) {
  window.addEventListener('pointerdown', unlock, { once: true, capture: true });
  window.addEventListener('keydown', unlock, { once: true, capture: true });
}

function playOne(audio, token, onEnd) {
  if (!player || !audio) return;
  cancelSpeech();
  let done = false;
  const finish = () => {
    if (done || token !== run) return;
    done = true;
    onEnd?.();
  };
  player.onended = finish;
  // Nur ein echter Ladefehler (Datei fehlt/kaputt) führt zur Ersatzstimme – und nur, wenn noch aktuell.
  player.onerror = () => {
    if (token === run) speakFallback(audio.text, audio.lang, finish);
  };
  player.muted = false;
  player.src = `${import.meta.env.BASE_URL}audio/${audio.course}/${audio.id}.m4a`;
  player.play().catch((err) => {
    // AbortError = durch neuere Wiedergabe unterbrochen (normal); NotAllowedError = Autoplay blockiert.
    // In beiden Fällen keine Ersatzstimme, sonst redet sie über die echte Datei.
    if (err?.name !== 'AbortError' && err?.name !== 'NotAllowedError' && token === run) {
      speakFallback(audio.text, audio.lang, finish);
    }
  });
}

/** @param {{course: string, id: string, text: string, lang: string}} audio */
export function playAudio(audio) {
  if (!audio) return;
  run += 1;
  playOne(audio, run);
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
    playOne(items[i], mine, () => setTimeout(() => step(i + 1), gapMs));
  };
  step(0);
}
