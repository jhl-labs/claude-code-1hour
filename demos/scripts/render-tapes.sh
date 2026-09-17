#!/usr/bin/env bash
# Compatibility entry point; the old simulated terminal tapes are retired.
set -euo pipefail
cd "$(dirname "$0")/../.."
node scripts/videos/render.cjs
