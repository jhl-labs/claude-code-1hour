#!/usr/bin/env bash
set -euo pipefail

# vhs (charm sh) — 결정적 터미널 영상 생성
if ! command -v vhs >/dev/null 2>&1; then
  echo "[install] vhs"
  VHS_VERSION="0.7.2"
  TMP=$(mktemp -d)
  curl -L "https://github.com/charmbracelet/vhs/releases/download/v${VHS_VERSION}/vhs_${VHS_VERSION}_Linux_x86_64.tar.gz" \
    -o "$TMP/vhs.tgz"
  tar -xzf "$TMP/vhs.tgz" -C "$TMP"
  install -m 0755 "$TMP/vhs" "$HOME/.local/bin/vhs"
  rm -rf "$TMP"
fi

# agg (asciinema → gif) — 보조 도구
if ! command -v agg >/dev/null 2>&1; then
  echo "[install] agg"
  AGG_VERSION="1.4.3"
  curl -L "https://github.com/asciinema/agg/releases/download/v${AGG_VERSION}/agg-x86_64-unknown-linux-gnu" \
    -o "$HOME/.local/bin/agg"
  chmod 0755 "$HOME/.local/bin/agg"
fi

if ! command -v ttyd >/dev/null 2>&1; then
  echo "[note] ttyd 미설치 — vhs 동작에는 무관, 무시"
fi

echo "[done] vhs $(vhs --version) / agg $(agg --version 2>&1 | head -1)"
