"""Erzeugt Vokabel-Audios (Kokoro-82M, lokal) als .m4a für einen Kurs.

Aufruf (mit der Python-Umgebung aus scripts/setup-kokoro.sh):

    ~/.local/kokoro/venv/bin/python -I scripts/generate-audio.py MANIFEST.json [--out public/audio] [--prune]

MANIFEST.json:
    {
      "course": "fr-6",
      "items": [
        {"id": "fr6_ecole",    "text": "l'école", "lang": "fr", "kind": "word"},
        {"id": "fr6_ecole_ex", "text": "Voilà l'école !", "lang": "fr", "kind": "sentence"},
        {"id": "en6_bike",     "text": "the bike", "lang": "en", "voice": "bm_george"}
      ]
    }

Ergebnis:
    <out>/<course>/<id>.m4a      eine Datei pro Eintrag (AAC, ca. 10 KB)
    <out>/<course>/index.json    {id: {file, text, lang, voice, speed, hash}} – die App liest das,
                                 um nur dort einen 🔊-Button zu zeigen, wo es Audio gibt.

`phonemes` (optional): Laute direkt vorgeben, wenn Kokoro den Text falsch ausspricht (z. B. „what a“).
`kind` (word | sentence, Standard word): Einzelwörter werden langsamer gesprochen und bekommen vorne
Stille, damit der Anfang beim Abspielen (Handy, Bluetooth-Kopfhörer) nicht verschluckt wird.

Bereits erzeugte Einträge mit unverändertem Text/Stimme/Tempo/Stille werden übersprungen.
--prune löscht Audios, deren id nicht mehr im Manifest steht.
"""

import argparse
import hashlib
import json
import subprocess
import sys
import tempfile
from pathlib import Path

KOKORO_HOME = Path.home() / ".local/kokoro"
MODEL = KOKORO_HOME / "models/kokoro-v1.0.onnx"
VOICES = KOKORO_HOME / "models/voices-v1.0.bin"

# Vom Nutzer freigegebene Stimmen (Hörproben 2026-10-10). `speed` gilt für Sätze.
# Französisch langsamer (2026-10-19, Wunsch des Nutzers): Die Beispielsätze der Hör-Karten waren zu schnell.
# Französisch mit `stretch` (2026-11-15, Fehler gemeldet vom Nutzer): Bei langsamem Tempo (Kokoro speed < 1) setzt
# ff_siwis vor viele Wörter und Sätze 60–100 ms tiefes Brummen – klingt wie ein verschluckter Artikel („un“/„le“).
# Bei Tempo 1,0 fast nie. Deshalb mit Tempo 1,0 erzeugen und danach ohne Tonhöhenänderung langsamer machen
# (time_stretch), Reste vor stimmlosen Anlauten werden abgeschnitten (trim_ghost).
DEFAULTS = {
    "fr": {"voice": "ff_siwis", "lang": "fr-fr", "speed": 0.75, "stretch": True},
    "en": {"voice": "bf_emma", "lang": "en-gb", "speed": 0.95},
}
# Einzelwörter (2026-10-11, Wunsch des Nutzers): kurze Wörter wie „air“ waren kaum zu verstehen →
# langsamer sprechen und Stille davor (Sekunden). Sätze bekommen nur etwas Vorlauf.
KIND = {
    "word": {"speed": 0.8, "lead": 0.8, "tail": 0.3},
    "sentence": {"speed": None, "lead": 0.3, "tail": 0.2},
    # Hörverstehen (2026-10-25): Dialog aus mehreren Zeilen/Stimmen, etwas langsamer, Pause zwischen den Zeilen.
    "listening": {"speed": 0.9, "lead": 0.6, "tail": 0.8},
}
LISTENING_GAP = 0.55  # Sekunden Stille zwischen zwei Zeilen eines Dialogs
AAC_BITRATE = "48000"

# Anlaut-Störgeräusche (gefunden 2026-10-13): Kokoro setzt vor Wörter, die mit einem Vokal beginnen, oft einen
# Klick und ein Hauchen („air“ klingt wie „hair“, „I mean“ mit Rauschen davor). Keine feste Einstellung hilft
# bei allen Wörtern. Deshalb werden für Einträge mit Vokal/Halbvokal am Anfang mehrere Varianten erzeugt, bei
# jeder wird Klick/Hauchen vor dem Stimmeinsatz ausgeblendet (trim_pre_voicing), und die Variante mit dem
# saubersten Anfang wird behalten (onset_score). Konsonant-Anfänge bleiben unverändert, denn dort ist
# Rauschen am Anfang richtig (s, f, ch …) und würde sonst „wegoptimiert“.
ONSET_VERSION = "onset-v2"
VOWEL_START = set("aeiouyɑɐɒɔəɛɜɪʊʌœøæɥwj")


def first_phoneme(ph):
    return next((c for c in ph if c not in "ˈˌ ,.!?…;:\"'-"), "")


def onset_score(audio, rate):
    """≈2 = sauberer Vokalanfang; höher = Rauschen/Klick am Anfang."""
    import numpy as np

    peak = float(np.abs(audio).max()) or 1.0
    onset = int(np.argmax(np.abs(audio) > peak * 0.03))
    seg = audio[onset: onset + int(0.06 * rate)]
    if len(seg) < 16:
        return 99.0
    zcr = np.mean(np.abs(np.diff(np.sign(seg)))) / 2 * rate
    spec = np.abs(np.fft.rfft(seg * np.hanning(len(seg)))) + 1e-12
    flat = float(np.exp(np.mean(np.log(spec))) / np.mean(spec))
    click = float(np.abs(audio[onset: onset + int(0.012 * rate)]).max()) / peak
    return float(zcr / 2000 + flat / 0.27 + (2 if click > 0.35 else 0))


def trim_pre_voicing(audio, rate, max_cut=0.15):
    """Bei Vokal-Anfängen: Klick/Hauchen VOR dem Stimmeinsatz ausblenden (ein Vokal beginnt mit Stimme).
    Stimmeinsatz = erster Frame mit klarer Periodizität (Grundton 70–400 Hz). Höchstens max_cut Sekunden."""
    import numpy as np

    peak = float(np.abs(audio).max()) or 1.0
    onset = int(np.argmax(np.abs(audio) > peak * 0.03))
    win, hop = int(0.025 * rate), int(0.005 * rate)
    lo, hi = int(rate / 400), int(rate / 70)
    voiced = None
    for start in range(onset, min(len(audio) - win, onset + int(max_cut * rate)), hop):
        f = audio[start:start + win]
        if np.sqrt(np.mean(f ** 2)) < peak * 0.04:
            continue
        f = f - f.mean()
        ac = np.correlate(f, f, "full")[win - 1:]
        if ac[0] > 0 and ac[lo:hi].max() / ac[0] > 0.6:
            voiced = start
            break
    if voiced is None:
        return audio
    cut = max(0, voiced - int(0.005 * rate))
    out = audio.copy()
    out[:cut] = 0
    fade = int(0.008 * rate)
    out[cut:cut + fade] *= np.linspace(0, 1, fade, dtype=out.dtype)
    return out


def shift_pitch(audio, factor):
    """Tonhöhe × factor durch Umrechnen der Abtastung (Tempo ändert sich mit, daher vorher langsamer/schneller
    sprechen lassen). Für Französisch gibt es nur eine Stimme (ff_siwis) – so klingt ein zweiter Sprecher anders."""
    import numpy as np

    n = int(len(audio) / factor)
    return np.interp(np.arange(n) * factor, np.arange(len(audio)), audio).astype(audio.dtype)


def time_stretch(x, rate, sr, win_s=0.03, tol_s=0.012):
    """Tempo × rate (rate < 1 = langsamer), Tonhöhe bleibt (WSOLA: überlappende Stücke, jeweils an der
    ähnlichsten Stelle angesetzt)."""
    import numpy as np

    win = int(win_s * sr)
    hs, tol = win // 2, int(tol_s * sr)
    w = np.hanning(win)
    ha = hs * rate
    x = np.concatenate([np.zeros(tol), x, np.zeros(win + tol)]).astype(np.float64)
    n = int((len(x) - win - 2 * tol) / ha)
    y, ws = np.zeros(n * hs + win), np.zeros(n * hs + win)
    prev = tol
    for i in range(n):
        nom = int(i * ha) + tol
        if i == 0:
            st = nom
        else:
            target = x[prev + hs: prev + hs + win]
            lo, hi = max(0, nom - tol), min(len(x) - win, nom + tol)
            cands = np.lib.stride_tricks.sliding_window_view(x[lo: hi + win], win)[: hi - lo + 1]
            st = lo + int(np.argmax(cands @ target))
        y[i * hs: i * hs + win] += x[st: st + win] * w
        ws[i * hs: i * hs + win] += w
        prev = st
    return (y / np.maximum(ws, 1e-3)).astype(np.float32)


UNVOICED_START = set("sʃftkp")
FRICATIVE_START = set("sʃf")


def trim_ghost(audio, rate, phonemes):
    """Beginnt der Text mit einem stimmlosen Laut (s, ch, f, t, k, p), darf davor nichts Stimmhaftes klingen.
    Tiefes Brummen (fast nur Energie unter 500 Hz) vor diesem Laut wird abgeschnitten (höchstens 0,2 s)."""
    import numpy as np

    first = first_phoneme(phonemes)
    if first not in UNVOICED_START:
        return audio
    peak = float(np.abs(audio).max()) or 1.0
    onset = int(np.argmax(np.abs(audio) > peak * 0.02))
    win, hop = int(0.02 * rate), int(0.005 * rate)
    cut = None
    low_run = 0
    for i in range(40):
        st = onset + i * hop
        f = audio[st: st + win]
        if len(f) < win:
            break
        sp = np.abs(np.fft.rfft(f * np.hanning(win))) ** 2
        fq = np.fft.rfftfreq(win, 1 / rate)
        tot = sp[fq > 60].sum() + 1e-12
        lo, hi = sp[(fq > 60) & (fq < 500)].sum() / tot, sp[fq > 3000].sum() / tot
        if first in FRICATIVE_START and hi > 0.25:
            cut = st
            break
        if lo > 0.85:
            low_run = i + 1
        elif first not in FRICATIVE_START or i > low_run + 2:
            cut = onset + low_run * hop
            break
    if cut is None or cut - onset < int(0.03 * rate):
        return audio
    cut = max(onset, cut - int(0.005 * rate))
    out = audio[cut:].copy()
    fade = int(0.005 * rate)
    out[:fade] *= np.linspace(0, 1, fade, dtype=out.dtype)
    return out


def speak(kokoro, text, voice, speed, lang, s, is_phonemes=False, shift=1.0):
    """Ein Stück Sprache; bei `stretch` mit Tempo 1,0 erzeugt und danach verlangsamt (siehe DEFAULTS)."""
    if not s.get("stretch"):
        audio, rate = kokoro.create(text, voice=voice, speed=speed / shift, lang=lang, is_phonemes=is_phonemes)
        return (shift_pitch(audio, shift) if shift != 1.0 else audio), rate
    audio, rate = kokoro.create(text, voice=voice, speed=1.0 / shift, lang=lang, is_phonemes=is_phonemes)
    if shift != 1.0:
        audio = shift_pitch(audio, shift)
    audio = time_stretch(audio, speed, rate)
    ph = text if is_phonemes else kokoro.tokenizer.phonemize(text, lang)
    return trim_ghost(audio, rate, ph), rate


def synthesize_dialog(kokoro, it, s):
    """Hörverstehen: jede Zeile mit ihrer Stimme, dazwischen kurze Stille → eine Aufnahme.
    Optional `shift` je Zeile (z. B. 0.85 = tiefer): gleiche Stimme, andere Tonlage, gleiches Tempo."""
    import numpy as np

    parts, rate = [], 24000
    for seg in it["segments"]:
        audio, rate = speak(kokoro, seg["text"], seg["voice"], s["speed"], s["lang"], s, shift=float(seg.get("shift", 1.0)))
        if parts:
            parts.append(np.zeros(int(rate * LISTENING_GAP), dtype=audio.dtype))
        parts.append(audio)
    return np.concatenate(parts), rate, "Dialog", 0.0


def synthesize(kokoro, it, s):
    """Gibt (audio, rate, gewählte Variante, Score) zurück."""
    if it.get("segments"):
        return synthesize_dialog(kokoro, it, s)
    ph = it.get("phonemes") or kokoro.tokenizer.phonemize(it["text"], s["lang"])
    variants = [("Standard", ph, s["speed"])]
    if first_phoneme(ph) in VOWEL_START:
        variants += [
            ("Punkt am Ende", ph.rstrip(".!?…") + ".", s["speed"]),
            ("Glottisschlag", "ʔ" + ph, s["speed"]),
            ("Tempo +0,05", ph, s["speed"] + 0.05),
            ("Tempo +0,1", ph, s["speed"] + 0.1),
        ]
    vowel = len(variants) > 1
    best = None
    for name, phonemes, speed in variants:
        audio, rate = speak(kokoro, phonemes, s["voice"], speed, s["lang"], s, is_phonemes=True)
        if vowel:
            audio = trim_pre_voicing(audio, rate)
        score = onset_score(audio, rate) if vowel else 0.0
        if best is None or score < best[3]:
            best = (audio, rate, name, score)
    return best


def settings(item):
    base = DEFAULTS.get(item.get("lang"))
    if not base:
        raise SystemExit(f"Unbekannte Sprache '{item.get('lang')}' bei id={item.get('id')} (erlaubt: {sorted(DEFAULTS)})")
    kind = KIND.get(item.get("kind", "word"))
    if not kind:
        raise SystemExit(f"Unbekannte Art '{item.get('kind')}' bei id={item.get('id')} (erlaubt: {sorted(KIND)})")
    return {
        "voice": item.get("voice", base["voice"]),
        "lang": base["lang"],
        "speed": float(item.get("speed", kind["speed"] or base["speed"])),
        "lead": kind["lead"],
        "tail": kind["tail"],
        # Nur wenn gesetzt im Fingerabdruck – sonst würden alle englischen Aufnahmen neu erzeugt.
        **({"stretch": True} if base.get("stretch") else {}),
    }


def fingerprint(text, s, phonemes=None):
    raw = json.dumps({"text": text, "phonemes": phonemes, "onset": ONSET_VERSION, **s}, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:16]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("manifest")
    ap.add_argument("--out", default="public/audio")
    ap.add_argument("--prune", action="store_true")
    args = ap.parse_args()

    manifest = json.loads(Path(args.manifest).read_text(encoding="utf-8"))
    course = manifest["course"]
    items = manifest["items"]
    ids = [it["id"] for it in items]
    if len(ids) != len(set(ids)):
        raise SystemExit("Doppelte ids im Manifest")

    out_dir = Path(args.out) / course
    out_dir.mkdir(parents=True, exist_ok=True)
    index_path = out_dir / "index.json"
    index = json.loads(index_path.read_text(encoding="utf-8")) if index_path.exists() else {}

    todo = []
    for it in items:
        s = settings(it)
        # Dialoge: auch die Stimmen gehören zum Fingerabdruck (andere Stimme → neu erzeugen).
        fp_text = it["text"] if not it.get("segments") else it["text"] + "\n" + json.dumps(it["segments"], ensure_ascii=False)
        h = fingerprint(fp_text, s, it.get("phonemes"))
        f = out_dir / f"{it['id']}.m4a"
        if index.get(it["id"], {}).get("hash") == h and f.exists():
            continue
        todo.append((it, s, h, f))

    print(f"{course}: {len(items)} Einträge, {len(items) - len(todo)} aktuell, {len(todo)} zu erzeugen")

    if todo:
        import numpy as np
        import soundfile as sf
        from kokoro_onnx import Kokoro

        kokoro = Kokoro(str(MODEL), str(VOICES))
        with tempfile.TemporaryDirectory() as tmp:
            for n, (it, s, h, f) in enumerate(todo, 1):
                audio, rate, variant, score = synthesize(kokoro, it, s)
                audio = np.concatenate([
                    np.zeros(int(rate * s["lead"]), dtype=audio.dtype),
                    audio,
                    np.zeros(int(rate * s["tail"]), dtype=audio.dtype),
                ])
                wav = Path(tmp) / f"{it['id']}.wav"
                sf.write(wav, audio, rate)
                subprocess.run(
                    ["afconvert", "-f", "m4af", "-d", "aac", "-b", AAC_BITRATE, str(wav), str(f)],
                    check=True,
                )
                index[it["id"]] = {
                    "file": f.name, "text": it["text"], "lang": it["lang"], **s, "hash": h,
                    **({"phonemes": it["phonemes"]} if it.get("phonemes") else {}),
                    "variant": variant, "onset": round(score, 2),
                }
                shown = it["text"] if not it.get("segments") else f"Dialog, {len(it['segments'])} Zeilen, {len(audio) / rate:.0f} s"
                print(f"  [{n}/{len(todo)}] {it['id']}: {shown}  ({variant}, Anlaut {score:.1f})")

    if args.prune:
        keep = set(ids)
        for stale in [k for k in index if k not in keep]:
            (out_dir / index[stale]["file"]).unlink(missing_ok=True)
            del index[stale]
            print(f"  entfernt: {stale}")

    index_path.write_text(json.dumps(dict(sorted(index.items())), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"→ {index_path}")


if __name__ == "__main__":
    sys.exit(main())
