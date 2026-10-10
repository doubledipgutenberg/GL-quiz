#!/usr/bin/env bash
# Richtet Node 22 + die Spacefast-CLI ein (die CLI braucht Node >= 20.3).
# Alles landet in ~/.local/node22 – das System-Node bleibt unberührt.
# Idempotent. Danach einmalig: ~/.local/node22/bin/sf login  (Bestätigung im Browser).
#
#   scripts/setup-spacefast.sh
set -euo pipefail

N="${NODE22_HOME:-$HOME/.local/node22}"
NODE_VERSION=v22.23.3
SPACEFAST_VERSION=0.5.0

[ "$(uname -s)" = Darwin ] && [ "$(uname -m)" = arm64 ] || { echo "Nur für macOS auf Apple-Chip getestet." >&2; exit 1; }

if [ "$("$N/bin/node" -v 2>/dev/null)" != "$NODE_VERSION" ]; then
  echo "→ Node $NODE_VERSION installieren"
  TMP="$(mktemp -d)"
  F="node-$NODE_VERSION-darwin-arm64"
  curl -sSfL -o "$TMP/$F.tar.gz" "https://nodejs.org/dist/$NODE_VERSION/$F.tar.gz"
  curl -sSfL -o "$TMP/SHASUMS256.txt" "https://nodejs.org/dist/$NODE_VERSION/SHASUMS256.txt"
  (cd "$TMP" && grep " $F.tar.gz\$" SHASUMS256.txt | shasum -a 256 -c -)
  tar -xzf "$TMP/$F.tar.gz" -C "$TMP"
  rm -rf "$N" && mkdir -p "$(dirname "$N")" && mv "$TMP/$F" "$N"
  rm -rf "$TMP"
else
  echo "✓ Node $NODE_VERSION"
fi

export PATH="$N/bin:$PATH"
if [ "$(sf --version 2>/dev/null | awk -F'[/ ]' '{print $2}')" != "$SPACEFAST_VERSION" ]; then
  echo "→ Spacefast-CLI $SPACEFAST_VERSION installieren"
  npm install -g --silent "spacefast@$SPACEFAST_VERSION"
fi
echo "✓ $(sf --version | awk '{print $1}')"
sf whoami >/dev/null 2>&1 && echo "✓ angemeldet: $(sf whoami 2>/dev/null | head -1)" || echo "→ jetzt einmalig anmelden: $N/bin/sf login"
