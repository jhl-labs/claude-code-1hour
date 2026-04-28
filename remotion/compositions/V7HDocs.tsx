import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";

type RegRow = {
  offset: string;
  name: string;
  bits: string;
  rw: string;
  meaning: string;
};

const regMap: RegRow[] = [
  {
    offset: "0x000",
    name: "CTRL",
    bits: "[31:0]",
    rw: "RW",
    meaning: "전역 컨트롤러 인에이블 / 리셋",
  },
  {
    offset: "0x004",
    name: "INTR_STATUS",
    bits: "[31:0]",
    rw: "RW1C",
    meaning: "인터럽트 상태 (1 쓰면 클리어)",
  },
  {
    offset: "0x010",
    name: "DMA_CFG",
    bits: "[31:24] mode\n[23:16] burst\n[15:0] size",
    rw: "RW",
    meaning: "DMA 모드·버스트·전송 크기",
  },
  {
    offset: "0x040",
    name: "ECC_CTRL",
    bits: "[7:0] level\n[15:8] sector",
    rw: "RW",
    meaning: "BCH ECC 레벨 / 섹터 길이",
  },
  {
    offset: "0x080",
    name: "CMD",
    bits: "[7:0] opcode",
    rw: "WO",
    meaning: "NAND 명령 발행 (0x00=READ, 0x80=PROG, ...)",
  },
  {
    offset: "0x084",
    name: "ADDR",
    bits: "[31:0] cycles",
    rw: "WO",
    meaning: "주소 사이클 (5 cycle 시 32비트 packed)",
  },
  {
    offset: "0x100",
    name: "DATA",
    bits: "[31:0]",
    rw: "RW",
    meaning: "PIO 데이터 포트",
  },
];

type Step = {
  who: "CPU" | "CTRL" | "NAND";
  label: string;
  toIdx: number;
  delay: number;
};

const seqLanes = ["CPU", "CTRL", "NAND"] as const;
const seqSteps: Step[] = [
  { who: "CPU", label: "write CMD = READ", toIdx: 1, delay: 0 },
  { who: "CTRL", label: "issue CMD", toIdx: 2, delay: 0.6 },
  { who: "CPU", label: "write ADDR (5 cycles)", toIdx: 1, delay: 1.2 },
  { who: "CTRL", label: "issue ADDR", toIdx: 2, delay: 1.8 },
  { who: "NAND", label: "tR (read latency)", toIdx: 2, delay: 2.4 },
  { who: "CTRL", label: "DMA xfer + ECC", toIdx: 0, delay: 3.4 },
  { who: "CPU", label: "read INTR_STATUS", toIdx: 1, delay: 4.0 },
];

export const V7HDocs: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const sceneSeq = interpolate(frame, [55 * fps, 57 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: tokens.colors.bg,
        color: tokens.colors.ink,
        padding: 64,
      }}
    >
      <FadeSlide startSec={0} from="top">
        <h1
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          데모 H · 문서화 — 데이터시트와 코드 사이의 갭을 메우다
        </h1>
        <p
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 22,
            color: tokens.colors.inkSoft,
            marginTop: 4,
          }}
        >
          레지스터 맵 + 명령 시퀀스 다이어그램 — 5분에 신규 입사자 온보딩 자료
        </p>
      </FadeSlide>

      {/* Scene A: 레지스터 맵 표 (5~55s) */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 220,
          width: 1792,
          opacity: 1 - sceneSeq,
        }}
      >
        <div
          style={{
            fontFamily: tokens.fonts.mono,
            fontSize: 20,
            color: tokens.colors.accent,
            marginBottom: 8,
          }}
        >
          ● 컨트롤러 레지스터 맵
        </div>
        <div
          style={{
            background: "#101014",
            border: `1px solid ${tokens.colors.panel}`,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "100px 200px 280px 80px 1fr",
              padding: "12px 20px",
              borderBottom: `1px solid ${tokens.colors.panel}`,
              fontFamily: tokens.fonts.mono,
              fontSize: 18,
              color: tokens.colors.inkSoft,
            }}
          >
            <div>OFFSET</div>
            <div>NAME</div>
            <div>BITS</div>
            <div>R/W</div>
            <div>의미</div>
          </div>
          {regMap.map((r, i) => {
            const at = 6 + i * 0.8;
            const p = interpolate(
              frame,
              [at * fps, (at + 0.4) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div
                key={r.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 200px 280px 80px 1fr",
                  padding: "10px 20px",
                  borderBottom: `1px solid ${tokens.colors.panel}`,
                  opacity: p,
                  fontFamily: tokens.fonts.mono,
                  fontSize: 18,
                }}
              >
                <div style={{ color: tokens.colors.accent }}>{r.offset}</div>
                <div style={{ color: tokens.colors.ink }}>{r.name}</div>
                <div
                  style={{
                    color: tokens.colors.inkSoft,
                    whiteSpace: "pre-line",
                    fontSize: 16,
                  }}
                >
                  {r.bits}
                </div>
                <div style={{ color: tokens.colors.inkSoft }}>{r.rw}</div>
                <div
                  style={{
                    color: tokens.colors.inkSoft,
                    fontFamily: tokens.fonts.sans,
                  }}
                >
                  {r.meaning}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scene B: 시퀀스 다이어그램 (55~90s) */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 240,
          width: 1792,
          opacity: sceneSeq,
        }}
      >
        <div
          style={{
            fontFamily: tokens.fonts.mono,
            fontSize: 20,
            color: tokens.colors.accent,
            marginBottom: 12,
          }}
        >
          ● 'NAND read page' 명령 시퀀스 (Mermaid sequenceDiagram)
        </div>
        <svg viewBox="0 0 1792 700" style={{ width: "100%", height: 700 }}>
          {/* lanes */}
          {seqLanes.map((lane, i) => {
            const x = 200 + i * 700;
            return (
              <g key={lane}>
                <text
                  x={x}
                  y={40}
                  textAnchor="middle"
                  fontFamily={tokens.fonts.mono}
                  fontSize={28}
                  fill={tokens.colors.accent}
                >
                  {lane}
                </text>
                <line
                  x1={x}
                  y1={60}
                  x2={x}
                  y2={680}
                  stroke={tokens.colors.panel}
                  strokeWidth={2}
                  strokeDasharray="6 6"
                />
              </g>
            );
          })}
          {seqSteps.map((s, i) => {
            const at = 58 + s.delay;
            const p = interpolate(
              frame,
              [at * fps, (at + 0.5) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            const fromIdx = seqLanes.indexOf(s.who);
            const x1 = 200 + fromIdx * 700;
            const x2 = 200 + s.toIdx * 700;
            const y = 110 + i * 80;
            const arrow = x2 > x1 ? "→" : x2 < x1 ? "←" : "↻";
            return (
              <g key={i} opacity={p}>
                <line
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke={tokens.colors.accent}
                  strokeWidth={2}
                  markerEnd="url(#arrow)"
                />
                <text
                  x={(x1 + x2) / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fontFamily={tokens.fonts.sans}
                  fontSize={20}
                  fill={tokens.colors.ink}
                >
                  {s.label}
                </text>
                {x1 === x2 && (
                  <text
                    x={x1 + 30}
                    y={y + 22}
                    textAnchor="start"
                    fontFamily={tokens.fonts.mono}
                    fontSize={28}
                    fill={tokens.colors.accentSoft}
                  >
                    {arrow}
                  </text>
                )}
              </g>
            );
          })}
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={tokens.colors.accent} />
            </marker>
          </defs>
        </svg>
      </div>

      <FadeSlide startSec={86} from="bottom">
        <p
          style={{
            position: "absolute",
            left: 64,
            bottom: 48,
            fontFamily: tokens.fonts.sans,
            fontSize: 26,
            color: tokens.colors.accent,
          }}
        >
          ✓ 코드만 있던 자리에 문서가 — 속도가 아니라 가능성 자체가 바뀜
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
