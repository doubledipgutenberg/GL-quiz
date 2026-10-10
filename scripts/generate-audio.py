"""Erzeugt Vokabel-Audios (Kokoro-82M, lokal) als .m4a für einen Kurs.

Aufruf (mit der Python-Umgebung aus scripts/setup-kokoro.sh):

    ~/.local/kokoro/venv/bin/python -I scripts/generate-audio.py MANIFEST.json [--out public/audio] [--prune]

MANIFEST.json:
    {
      "course": "fr-6",
      "items": [
        {"id": "fr6_ecole", "text": "l'école", "lang": "fr"},
        {"id": "en6_bike",  "text": "the bike", "lang": "en", "voice": "bm_george"}
      ]
    }

Ergebnis:
    <out>/<course>/<id>.m4a      eine Datei pro Eintrag (AAC, ca. 10 KB)
    <out>/<course>/index.json    {id: {file, text, lang, voice, speed, hash}} – die App liest das,
                                 um nur dort einen 🔊-Button zu zeigen, wo es Audio gibt.

Bereits erzeugte Einträge mit unverändertem Text/Stimme/Tempo werden übersprungen.
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

# Vom Nutzer freigegebene Stimmen (Hörproben 2026-10-10).
DEFAULTS = {
    "fr": {"voice": "ff_siwis", "lang": "fr-fr", "speed": 0.9},
    "en": {"voice": "bf_emma", "lang": "en-gb", "speed": 0.95},
}
AAC_BITRATE = "48000"


def settings(item):
    base = DEFAULTS.get(item.get("lang"))
    if not base:
        raise SystemExit(f"Unbekannte Sprache '{item.get('lang')}' bei id={item.get('id')} (erlaubt: {sorted(DEFAULTS)})")
    return {
        "voice": item.get("voice", base["voice"]),
        "lang": base["lang"],
        "speed": float(item.get("speed", base["speed"])),
    }


def fingerprint(text, s):
    raw = json.dumps({"text": text, **s}, sort_keys=True, ensure_ascii=False)
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
        h = fingerprint(it["text"], s)
        f = out_dir / f"{it['id']}.m4a"
        if index.get(it["id"], {}).get("hash") == h and f.exists():
            continue
        todo.append((it, s, h, f))

    print(f"{course}: {len(items)} Einträge, {len(items) - len(todo)} aktuell, {len(todo)} zu erzeugen")

    if todo:
        import soundfile as sf
        from kokoro_onnx import Kokoro

        kokoro = Kokoro(str(MODEL), str(VOICES))
        with tempfile.TemporaryDirectory() as tmp:
            for n, (it, s, h, f) in enumerate(todo, 1):
                audio, rate = kokoro.create(it["text"], voice=s["voice"], speed=s["speed"], lang=s["lang"])
                wav = Path(tmp) / f"{it['id']}.wav"
                sf.write(wav, audio, rate)
                subprocess.run(
                    ["afconvert", "-f", "m4af", "-d", "aac", "-b", AAC_BITRATE, str(wav), str(f)],
                    check=True,
                )
                index[it["id"]] = {"file": f.name, "text": it["text"], "lang": it["lang"], **s, "hash": h}
                print(f"  [{n}/{len(todo)}] {it['id']}: {it['text']}")

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
