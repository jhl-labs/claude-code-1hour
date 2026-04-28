#!/usr/bin/env bash
set -euo pipefail

# 지원 환경 가드: 본 강의 도구 셋업은 Linux x86_64 전용 바이너리만 받음.
if [[ "$(uname -s)" != "Linux" || "$(uname -m)" != "x86_64" ]]; then
  echo "[install] 지원 환경: Linux x86_64 — 현재: $(uname -sm)" >&2
  exit 1
fi

BIN_DIR="${HOME}/.local/bin"
mkdir -p "$BIN_DIR"

# PATH에 BIN_DIR 미포함 시 경고만 — 셸 재시작 후 사용 가능
case ":$PATH:" in
  *":$BIN_DIR:"*) ;;
  *) echo "[warn] $BIN_DIR 가 PATH 에 없음 — 셸 설정에 추가하세요" >&2 ;;
esac

# vhs (charm sh) — 결정적 터미널 영상 생성
if ! command -v vhs >/dev/null 2>&1; then
  echo "[install] vhs"
  VHS_VERSION="0.7.2"
  TMP=$(mktemp -d)
  curl -L "https://github.com/charmbracelet/vhs/releases/download/v${VHS_VERSION}/vhs_${VHS_VERSION}_Linux_x86_64.tar.gz" \
    -o "$TMP/vhs.tgz"
  tar -xzf "$TMP/vhs.tgz" -C "$TMP"
  install -m 0755 "$TMP/vhs_${VHS_VERSION}_Linux_x86_64/vhs" "$BIN_DIR/vhs"
  rm -rf "$TMP"
fi

# agg (asciinema → gif) — 보조 도구
if ! command -v agg >/dev/null 2>&1; then
  echo "[install] agg"
  AGG_VERSION="1.4.3"
  curl -L "https://github.com/asciinema/agg/releases/download/v${AGG_VERSION}/agg-x86_64-unknown-linux-gnu" \
    -o "$BIN_DIR/agg"
  chmod 0755 "$BIN_DIR/agg"
fi

if ! command -v ttyd >/dev/null 2>&1; then
  echo "[note] ttyd 미설치 — vhs 동작에는 무관, 무시"
fi

# 절대경로로 호출하여 PATH 의존 제거
echo "[done] vhs $("$BIN_DIR/vhs" --version) / agg $("$BIN_DIR/agg" --version 2>&1 | head -1)"
