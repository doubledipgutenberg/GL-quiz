#!/usr/bin/env bash
# Richtet die lokale Sprachausgabe (Kokoro-82M) für die Vokabel-Audios ein.
# Alles landet in ~/.local/kokoro – System-Python und Homebrew bleiben unberührt.
# Idempotent: Bereits vorhandene, korrekte Teile werden übersprungen.
#
#   scripts/setup-kokoro.sh
#
# Danach erzeugt scripts/generate-audio.py die Audiodateien.
set -euo pipefail

K="${KOKORO_HOME:-$HOME/.local/kokoro}"
UV_VERSION=0.13.0
PYTHON_VERSION=3.12.15
MODEL_RELEASE=model-files-v1.0
MODEL_FILE=kokoro-v1.0.onnx
MODEL_BYTES=325532387
VOICES_FILE=voices-v1.0.bin
VOICES_BYTES=28214398
REQ="$(cd "$(dirname "$0")" && pwd)/kokoro-requirements.txt"

[ "$(uname -s)" = Darwin ] && [ "$(uname -m)" = arm64 ] || { echo "Nur für macOS auf Apple-Chip getestet." >&2; exit 1; }
mkdir -p "$K/bin" "$K/models"
export UV_PYTHON_INSTALL_DIR="$K/python" UV_CACHE_DIR="$K/cache" UV_NO_CONFIG=1

# 1) uv (Astral) – Prüfsumme aus dem offiziellen Release
if [ "$("$K/bin/uv" --version 2>/dev/null | awk '{print $2}')" != "$UV_VERSION" ]; then
  echo "→ uv $UV_VERSION installieren"
  TMP="$(mktemp -d)"
  F=uv-aarch64-apple-darwin.tar.gz
  curl -sSfL -o "$TMP/$F" "https://github.com/astral-sh/uv/releases/download/$UV_VERSION/$F"
  curl -sSfL -o "$TMP/$F.sha256" "https://github.com/astral-sh/uv/releases/download/$UV_VERSION/$F.sha256"
  (cd "$TMP" && shasum -a 256 -c "$F.sha256")
  tar -xzf "$TMP/$F" -C "$TMP"
  cp "$TMP/uv-aarch64-apple-darwin/uv" "$TMP/uv-aarch64-apple-darwin/uvx" "$K/bin/"
  rm -rf "$TMP"
else
  echo "✓ uv $UV_VERSION"
fi

# 2) Python + virtuelle Umgebung mit festen Paketversionen
if [ "$("$K/venv/bin/python" -c 'import platform;print(platform.python_version())' 2>/dev/null)" != "$PYTHON_VERSION" ]; then
  echo "→ Python $PYTHON_VERSION + venv"
  "$K/bin/uv" python install "$PYTHON_VERSION"
  rm -rf "$K/venv"
  "$K/bin/uv" venv --python "$PYTHON_VERSION" "$K/venv"
else
  echo "✓ Python $PYTHON_VERSION"
fi
"$K/bin/uv" pip install --quiet --python "$K/venv/bin/python" -r "$REQ"
echo "✓ Pakete laut $(basename "$REQ")"

# 3) Modell + Stimmen (GitHub-Release ohne Prüfsumme → exakte Bytegröße prüfen)
fetch() {
  local name=$1 bytes=$2
  if [ -f "$K/models/$name" ] && [ "$(stat -f%z "$K/models/$name")" = "$bytes" ]; then
    echo "✓ $name"
    return
  fi
  echo "→ $name herunterladen"
  curl -sSfL -o "$K/models/$name.part" "https://github.com/thewh1teagle/kokoro-onnx/releases/download/$MODEL_RELEASE/$name"
  [ "$(stat -f%z "$K/models/$name.part")" = "$bytes" ] || { echo "Größe von $name stimmt nicht" >&2; exit 1; }
  mv "$K/models/$name.part" "$K/models/$name"
}
fetch "$MODEL_FILE" "$MODEL_BYTES"
fetch "$VOICES_FILE" "$VOICES_BYTES"

# 4) Schnelltest
"$K/venv/bin/python" -I -c "
from kokoro_onnx import Kokoro
k = Kokoro('$K/models/$MODEL_FILE', '$K/models/$VOICES_FILE')
a, r = k.create('Bonjour', voice='ff_siwis', speed=0.9, lang='fr-fr')
print(f'✓ Kokoro bereit ({len(a)/r:.2f}s Testaudio)')
" 2>&1 | grep -v '^WARNING'
command -v afconvert >/dev/null && echo "✓ afconvert (macOS) für .m4a"
