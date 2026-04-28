#!/usr/bin/env bash
# Render the 5 demo videos.
#
# Strategy:
#   1) Try vhs (.tape -> .mp4) — requires ttyd
#   2) Fallback: synthesize asciinema cast (.scene -> .cast) -> agg -> ffmpeg mp4
#
# Both paths produce decision-deterministic mp4s. Output: demos/recordings/<id>.mp4
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEMOS="$ROOT/demos"
TAPES="$DEMOS/tapes"
OUT="$DEMOS/recordings"
PYTHON="${PYTHON:-python3}"

mkdir -p "$OUT"

# Make sure local-installed tools are reachable
export PATH="$HOME/.local/bin:$PATH"

IDS=(V7-A-legacy-c V7-C-build V7-E-unit-test V7-H-docs V11-install)

have_vhs=0
if command -v vhs >/dev/null 2>&1 && command -v ttyd >/dev/null 2>&1; then
    have_vhs=1
fi

render_with_vhs() {
    local id="$1"
    echo "[vhs] $id"
    (cd "$TAPES" && vhs "$id.tape")
}

render_with_fallback() {
    local id="$1"
    local scene="$TAPES/$id.scene"
    local cast="$OUT/$id.cast"
    local gif="$OUT/$id.gif"
    local mp4="$OUT/$id.mp4"

    echo "[fallback] $id (cast -> agg -> ffmpeg)"

    "$PYTHON" "$DEMOS/scripts/render_cast.py" "$scene" "$cast"

    # CJK-aware monospace font so Korean prompts render correctly.
    # JetBrains Mono → fallback to Noto Sans Mono CJK KR for Hangul.
    # idle-time-limit 30s lets long HOLD survive; last-frame-duration keeps
    # the final tail readable.
    # rows are read from the cast header itself; we still hint at agg.
    local cast_rows
    cast_rows=$(head -1 "$cast" | "$PYTHON" -c "import json,sys; print(json.loads(sys.stdin.read())['height'])")
    agg --cols 140 --rows "$cast_rows" --speed 1.0 --font-size 14 --theme monokai \
        --idle-time-limit 30 --last-frame-duration 8 --fps-cap 30 \
        --font-family "JetBrains Mono,DejaVu Sans Mono,Noto Sans Mono CJK KR,Noto Sans Mono" \
        "$cast" "$gif" >/dev/null 2>&1

    # Direct GIF -> mp4. ffmpeg's gif demuxer reads per-frame durations
    # natively; the fps=30 filter in the vf chain interpolates to a steady
    # 30fps timeline without losing GIF time information.
    ffmpeg -y -loglevel error -i "$gif" \
        -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2,fps=30" \
        -movflags +faststart -pix_fmt yuv420p \
        -c:v libx264 -preset medium -crf 23 \
        "$mp4"

    rm -f "$cast" "$gif"
}

for id in "${IDS[@]}"; do
    if [ "$have_vhs" = "1" ]; then
        if render_with_vhs "$id"; then continue; fi
        echo "[warn] vhs failed for $id, falling back"
    fi
    render_with_fallback "$id"
done

echo "[done] outputs:"
ls -lh "$OUT"/*.mp4
