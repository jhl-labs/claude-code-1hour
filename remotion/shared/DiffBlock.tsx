import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";

export type DiffLine = { type: "ctx" | "add" | "del"; text: string };

type Props = {
  lines: DiffLine[];
  startSec: number;
  /** 한 줄당 등장 간격 (초) */
  perLineSec?: number;
  width?: number;
  fontSize?: number;
  filename?: string;
};

export const DiffBlock: React.FC<Props> = ({
  lines,
  startSec,
  perLineSec = 0.2,
  width = 1100,
  fontSize = 22,
  filename,
}) => {
  const fps = 30;
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width,
        background: "#101014",
        border: `1px solid ${tokens.colors.panel}`,
        borderRadius: 12,
        overflow: "hidden",
        fontFamily: tokens.fonts.mono,
        fontSize,
      }}
    >
      {filename && (
        <div
          style={{
            padding: "10px 16px",
            background: tokens.colors.panel,
            color: tokens.colors.inkSoft,
            fontSize: 16,
          }}
        >
          {filename}
        </div>
      )}
      <div style={{ padding: "12px 0" }}>
        {lines.map((ln, i) => {
          const at = startSec + i * perLineSec;
          const p = interpolate(
            frame,
            [at * fps, (at + 0.2) * fps],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const sign = ln.type === "add" ? "+" : ln.type === "del" ? "-" : " ";
          const bg =
            ln.type === "add"
              ? "rgba(90,226,124,0.10)"
              : ln.type === "del"
                ? "rgba(255,107,107,0.10)"
                : "transparent";
          const color =
            ln.type === "add"
              ? tokens.colors.ok
              : ln.type === "del"
                ? tokens.colors.err
                : tokens.colors.inkSoft;
          return (
            <div
              key={i}
              style={{
                opacity: p,
                padding: "1px 16px",
                background: bg,
                color,
                whiteSpace: "pre",
              }}
            >
              <span style={{ display: "inline-block", width: 16, color }}>
                {sign}
              </span>
              {ln.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};
