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
DEFAULTS = {
    "fr": {"voice": "ff_siwis", "lang": "fr-fr", "speed": 0.9},
    "en": {"voice": "bf_emma", "lang": "en-gb", "speed": 0.95},
}
# Einzelwörter (2026-10-11, Wunsch des Nutzers): kurze Wörter wie „air“ waren kaum zu verstehen →
# langsamer sprechen und Stille davor (Sekunden). Sätze bekommen nur etwas Vorlauf.
KIND = {
    "word": {"speed": 0.8, "lead": 0.8, "tail": 0.3},
    "sentence": {"speed": None, "lead": 0.3, "tail": 0.2},
}
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


def synthesize(kokoro, it, s):
    """Gibt (audio, rate, gewählte Variante, Score) zurück."""
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
        audio, rate = kokoro.create(phonemes, voice=s["voice"], speed=speed, lang=s["lang"], is_phonemes=True)
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
        h = fingerprint(it["text"], s, it.get("phonemes"))
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
                print(f"  [{n}/{len(todo)}] {it['id']}: {it['text']}  ({variant}, Anlaut {score:.1f})")

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
