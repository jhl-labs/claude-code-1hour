#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEST="$ROOT/demos/uboot"

if [ -d "$DEST/.git" ]; then
  echo "[clone-uboot] 이미 존재: $DEST"
  exit 0
fi

mkdir -p "$ROOT/demos"
echo "[clone-uboot] U-Boot 얕은 복제 (depth=1)"
git clone --depth=1 https://github.com/u-boot/u-boot.git "$DEST"

echo "[clone-uboot] sandbox 빌드 사전 점검"
cd "$DEST"
make sandbox_defconfig >/dev/null
echo "[done] $DEST 준비 완료"
