#!/usr/bin/env python3
"""
Synthesize a deterministic asciinema cast (v2) from a YAML-ish scene file,
without spawning a real shell. This guarantees:
  - no host names / user paths leak into recordings
  - byte-for-byte reproducibility
  - no ttyd / login shell dependency

Scene file format (simple line-based):
  # comment
  COLS 120
  ROWS 30
  PROMPT $
  TYPE_DELAY 0.04
  HOLD 1.5

  : type "echo hello"
  : enter
  : output "hello\n"
  : sleep 1.0
  : cat outputs/A-legacy-c.txt
  : prompt

`cat` reads the referenced file (relative to repo root /demos) and
streams it line-by-line with a small per-line delay so the user can read.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

DEMOS_DIR = Path(__file__).resolve().parent.parent  # demos/


def esc_red(s: str) -> str:
    return f"\x1b[31m{s}\x1b[0m"


def esc_green(s: str) -> str:
    return f"\x1b[32m{s}\x1b[0m"


def esc_cyan(s: str) -> str:
    return f"\x1b[36m{s}\x1b[0m"


def esc_yellow(s: str) -> str:
    return f"\x1b[33m{s}\x1b[0m"


def esc_dim(s: str) -> str:
    return f"\x1b[2m{s}\x1b[0m"


def esc_bold(s: str) -> str:
    return f"\x1b[1m{s}\x1b[0m"


def colorize_diff_line(line: str) -> str:
    if line.startswith("+++") or line.startswith("---"):
        return esc_bold(line)
    if line.startswith("+"):
        return esc_green(line)
    if line.startswith("-"):
        return esc_red(line)
    if line.startswith("@@"):
        return esc_cyan(line)
    return line


def colorize_pass_line(line: str) -> str:
    if "PASSED" in line or "passed" in line:
        return line.replace("PASSED", esc_green("PASSED")).replace(
            "passed", esc_green("passed"))
    if "FAILED" in line or "ERROR" in line:
        return line.replace("FAILED", esc_red("FAILED")).replace(
            "ERROR", esc_red("ERROR"))
    return line


def render_cast(scene_path: Path, cast_path: Path) -> float:
    """Return final timestamp (so caller knows total duration)."""
    cols = 140
    rows = 38
    prompt = "$ "
    type_delay = 0.04
    hold = 1.0

    events: list[tuple[float, str, str]] = []
    t = 0.0

    def out(payload: str) -> None:
        nonlocal t
        events.append((round(t, 4), "o", payload))

    def advance(dt: float) -> None:
        nonlocal t
        t += dt

    def emit_prompt() -> None:
        out(esc_dim(prompt))

    def type_text(text: str) -> None:
        for ch in text:
            advance(type_delay)
            out(ch)

    def emit_file(path: Path) -> None:
        with path.open("r", encoding="utf-8") as fh:
            text = fh.read()
        # color heuristics
        for raw_line in text.splitlines():
            advance(0.06)  # streaming feel — long enough to read along
            line = raw_line
            if any(line.startswith(p) for p in ("+++", "---", "+", "-", "@@")):
                line = colorize_diff_line(line)
            else:
                line = colorize_pass_line(line)
            # heading underlines
            if line.startswith("===") or line.startswith("---"):
                line = esc_dim(line)
            elif line.startswith("[Claude]"):
                line = esc_cyan("[Claude]") + line[len("[Claude]"):]
            elif line.startswith("[done]"):
                line = esc_green(line)
            out(line + "\r\n")
        # short pause so eye catches the end
        advance(0.3)

    # ----- parse scene -----
    with scene_path.open("r", encoding="utf-8") as fh:
        scene = fh.read().splitlines()

    # initial prompt before first command
    emit_prompt()
    advance(0.4)

    for raw in scene:
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("COLS "):
            cols = int(line.split()[1])
            continue
        if line.startswith("ROWS "):
            rows = int(line.split()[1])
            continue
        if line.startswith("PROMPT "):
            prompt = line[len("PROMPT "):].strip() + " "
            continue
        if line.startswith("TYPE_DELAY "):
            type_delay = float(line.split()[1])
            continue
        if line.startswith("HOLD "):
            hold = float(line.split()[1])
            continue
        if not line.startswith(":"):
            continue
        body = line[1:].strip()
        if body.startswith("type "):
            text = body[len("type "):].strip()
            if text.startswith('"') and text.endswith('"'):
                text = text[1:-1]
            type_text(text)
        elif body == "enter":
            advance(0.05)
            out("\r\n")
        elif body.startswith("output "):
            text = body[len("output "):].strip()
            if text.startswith('"') and text.endswith('"'):
                text = text[1:-1]
            text = text.replace("\\n", "\r\n")
            advance(0.1)
            out(text)
        elif body.startswith("sleep "):
            advance(float(body.split()[1]))
        elif body.startswith("cat "):
            rel = body[len("cat "):].strip()
            target = DEMOS_DIR / rel
            if not target.exists():
                raise FileNotFoundError(f"cat target not found: {target}")
            emit_file(target)
        elif body == "prompt":
            advance(0.2)
            emit_prompt()
        elif body.startswith("hold"):
            parts = body.split()
            advance(float(parts[1]) if len(parts) > 1 else hold)
        else:
            raise ValueError(f"unknown directive: {body}")

    # final hold so reader can read tail
    advance(hold)
    out("")  # ensure trailing event

    # ----- write cast v2 -----
    header = {
        "version": 2,
        "width": cols,
        "height": rows,
        "timestamp": 1700000000,
        "env": {"SHELL": "/bin/bash", "TERM": "xterm-256color"},
        "theme": {
            "fg": "#cdd6f4",
            "bg": "#1e1e2e",
            "palette": (
                "#45475a:#f38ba8:#a6e3a1:#f9e2af:#89b4fa:#cba6f7:#94e2d5:#bac2de:"
                "#585b70:#f38ba8:#a6e3a1:#f9e2af:#89b4fa:#cba6f7:#94e2d5:#a6adc8"
            ),
        },
    }
    with cast_path.open("w", encoding="utf-8") as fh:
        fh.write(json.dumps(header) + "\n")
        for ts, kind, payload in events:
            fh.write(json.dumps([ts, kind, payload], ensure_ascii=False) + "\n")
    return t


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("scene", type=Path)
    ap.add_argument("cast", type=Path)
    args = ap.parse_args()
    duration = render_cast(args.scene, args.cast)
    print(f"[render_cast] {args.scene.name} -> {args.cast.name}  ({duration:.1f}s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
