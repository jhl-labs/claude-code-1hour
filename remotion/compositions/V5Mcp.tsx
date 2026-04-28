import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";

type Node = {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  appearAtSec: number;
  color?: string;
};

const center = { x: 960, y: 600 };
const nodes: Node[] = [
  {
    id: "github",
    label: "GitHub",
    sub: "PR · Issue",
    x: 240,
    y: 220,
    appearAtSec: 5,
    color: "#9b9bff",
  },
  {
    id: "db",
    label: "DB",
    sub: "Postgres / Mongo",
    x: 1680,
    y: 220,
    appearAtSec: 6.5,
  },
  {
    id: "slack",
    label: "Slack",
    sub: "Team channels",
    x: 200,
    y: 980,
    appearAtSec: 8,
    color: "#a1d3ff",
  },
  {
    id: "jira",
    label: "Jira / Linear",
    sub: "Tickets",
    x: 1700,
    y: 980,
    appearAtSec: 9.5,
    color: "#f2c14e",
  },
  {
    id: "jtag",
    label: "JTAG",
    sub: "디버거 · 로직 애널라이저",
    x: 960,
    y: 120,
    appearAtSec: 11,
    color: tokens.colors.accent,
  },
];

export const V5Mcp: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  return (
    <AbsoluteFill
      style={{
        background: tokens.colors.bg,
        color: tokens.colors.ink,
        padding: 80,
      }}
    >
      <FadeSlide startSec={0} from="top">
        <h1
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 64,
            fontWeight: 700,
          }}
        >
          MCP — 외부 시스템과의 다리
        </h1>
      </FadeSlide>
      <FadeSlide startSec={0.5} from="top">
        <p
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 28,
            color: tokens.colors.inkSoft,
          }}
        >
          Claude가 GitHub · DB · Slack · 측정장비까지 직접 다룸
        </p>
      </FadeSlide>

      <svg
        style={{ position: "absolute", inset: 0 }}
        viewBox="0 0 1920 1080"
      >
        {/* 중앙 노드 */}
        {(() => {
          const p = interpolate(frame, [2 * fps, 3 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <g
              transform={`translate(${center.x}, ${center.y})`}
              opacity={p}
            >
              <circle
                r={130}
                fill={`${tokens.colors.accent}22`}
                stroke={tokens.colors.accent}
                strokeWidth={3}
              />
              <text
                textAnchor="middle"
                y={-10}
                fontFamily={tokens.fonts.sans}
                fontSize={36}
                fontWeight={700}
                fill={tokens.colors.ink}
              >
                Claude Code
              </text>
              <text
                textAnchor="middle"
                y={32}
                fontFamily={tokens.fonts.mono}
                fontSize={22}
                fill={tokens.colors.accent}
              >
                MCP host
              </text>
            </g>
          );
        })()}
        {/* 노드 + 엣지 */}
        {nodes.map((n) => {
          const p = interpolate(
            frame,
            [n.appearAtSec * fps, (n.appearAtSec + 0.6) * fps],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const color = n.color ?? tokens.colors.inkSoft;
          return (
            <g key={n.id} opacity={p}>
              <line
                x1={center.x}
                y1={center.y}
                x2={n.x}
                y2={n.y}
                stroke={color}
                strokeWidth={2}
                strokeDasharray="6 6"
                opacity={0.4}
              />
              <g transform={`translate(${n.x}, ${n.y})`}>
                <circle
                  r={70}
                  fill={`${color}22`}
                  stroke={color}
                  strokeWidth={2}
                />
                <text
                  textAnchor="middle"
                  y={-4}
                  fontFamily={tokens.fonts.sans}
                  fontSize={26}
                  fontWeight={600}
                  fill={tokens.colors.ink}
                >
                  {n.label}
                </text>
                <text
                  textAnchor="middle"
                  y={28}
                  fontFamily={tokens.fonts.sans}
                  fontSize={18}
                  fill={tokens.colors.inkSoft}
                >
                  {n.sub}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      <FadeSlide startSec={14} from="bottom">
        <p
          style={{
            position: "absolute",
            left: 96,
            bottom: 60,
            fontFamily: tokens.fonts.sans,
            fontSize: 30,
            color: tokens.colors.accent,
            maxWidth: 1700,
          }}
        >
          하드웨어와 만나는 지점에 다리를 놓는다 — JTAG · 로직 애널라이저까지.
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
