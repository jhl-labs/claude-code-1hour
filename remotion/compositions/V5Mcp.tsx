import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";
import { TypeOn } from "../shared/TypeOn";

/**
 * V5 — MCP (Model Context Protocol) 보강판 · 90초 / 2700 frame.
 *
 * 5 장면:
 *   S1 (0~16)  : 정의 + Claude ↔ 외부 도구 다이어그램
 *   S2 (16~38) : 호출 시퀀스 — prompt → tools/list → tools/call → 결과 회수
 *   S3 (38~60) : 임베디드 시나리오 — JTAG MCP 로 ECC 카운터 읽기
 *   S4 (60~76) : 3 가지 Primitive (Tools / Resources / Prompts)
 *   S5 (76~90) : 등록 한 줄 + 종결
 */

const FPS = 30;
const SCENES = {
  S1: { from: 0,  to: 16 },
  S2: { from: 16, to: 38 },
  S3: { from: 38, to: 60 },
  S4: { from: 60, to: 76 },
  S5: { from: 76, to: 90 },
};

function useSceneOpacity(fromSec: number, toSec: number) {
  const frame = useCurrentFrame();
  const fadeIn = 0.4;
  const fadeOut = 0.4;
  return interpolate(
    frame,
    [
      fromSec * FPS,
      (fromSec + fadeIn) * FPS,
      (toSec - fadeOut) * FPS,
      toSec * FPS,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
}

// ───────────────────────────────────────────────────────────────────────────
// S1 — 정의 + 다이어그램
// ───────────────────────────────────────────────────────────────────────────

type Node = {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  appearAtSec: number;
  color?: string;
};

const center = { x: 960, y: 580 };
const nodes: Node[] = [
  { id: "github", label: "GitHub",      sub: "PR · Issue",         x: 280,  y: 240, appearAtSec: 4.5, color: "#9b9bff" },
  { id: "db",     label: "DB",           sub: "Postgres / Mongo",   x: 1640, y: 240, appearAtSec: 5.5 },
  { id: "slack",  label: "Slack",        sub: "Team channels",      x: 240,  y: 940, appearAtSec: 6.5, color: "#a1d3ff" },
  { id: "jira",   label: "Jira / Linear", sub: "Tickets",           x: 1680, y: 940, appearAtSec: 7.5, color: "#f2c14e" },
  { id: "jtag",   label: "JTAG",         sub: "디버거 · 측정장비",  x: 960,  y: 130, appearAtSec: 9,    color: tokens.colors.accent },
  { id: "fs",     label: "Filesystem",   sub: "내부 빌드팜·로그",    x: 960,  y: 1020, appearAtSec: 10.5, color: tokens.colors.ok },
];

const SceneOne: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = useSceneOpacity(SCENES.S1.from, SCENES.S1.to);
  return (
    <AbsoluteFill style={{ opacity, padding: 80 }}>
      <FadeSlide startSec={0} from="top">
        <h1 style={{ fontFamily: tokens.fonts.sans, fontSize: 64, fontWeight: 700, margin: 0 }}>
          MCP — Model Context Protocol
        </h1>
      </FadeSlide>
      <FadeSlide startSec={0.5} from="top">
        <p style={{ fontFamily: tokens.fonts.sans, fontSize: 28, color: tokens.colors.inkSoft, marginTop: 8 }}>
          Claude 가 외부 시스템·사내 도구·측정장비까지 직접 호출하는 표준 인터페이스
        </p>
      </FadeSlide>

      <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 1920 1080">
        {/* 중앙 노드 */}
        {(() => {
          const p = interpolate(frame, [2 * FPS, 3 * FPS], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <g transform={`translate(${center.x}, ${center.y})`} opacity={p}>
              <circle r={140} fill={`${tokens.colors.accent}22`} stroke={tokens.colors.accent} strokeWidth={3} />
              <text textAnchor="middle" y={-12} fontFamily={tokens.fonts.sans} fontSize={36} fontWeight={700} fill={tokens.colors.ink}>
                Claude Code
              </text>
              <text textAnchor="middle" y={28} fontFamily={tokens.fonts.mono} fontSize={22} fill={tokens.colors.accent}>
                MCP host
              </text>
            </g>
          );
        })()}
        {nodes.map((n) => {
          const p = interpolate(
            frame,
            [n.appearAtSec * FPS, (n.appearAtSec + 0.6) * FPS],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const color = n.color ?? tokens.colors.inkSoft;
          return (
            <g key={n.id} opacity={p}>
              <line x1={center.x} y1={center.y} x2={n.x} y2={n.y} stroke={color} strokeWidth={2} strokeDasharray="6 6" opacity={0.4} />
              <g transform={`translate(${n.x}, ${n.y})`}>
                <circle r={75} fill={`${color}22`} stroke={color} strokeWidth={2} />
                <text textAnchor="middle" y={-4} fontFamily={tokens.fonts.sans} fontSize={26} fontWeight={600} fill={tokens.colors.ink}>
                  {n.label}
                </text>
                <text textAnchor="middle" y={26} fontFamily={tokens.fonts.sans} fontSize={17} fill={tokens.colors.inkSoft}>
                  {n.sub}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      <p style={{
        position: "absolute",
        left: 96,
        bottom: 60,
        fontFamily: tokens.fonts.sans,
        fontSize: 26,
        color: tokens.colors.inkSoft,
        maxWidth: 1700,
        opacity: interpolate(frame, [12 * FPS, 13 * FPS], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
      }}>
        한 번만 만들어 두면 — <span style={{ color: tokens.colors.accent }}>모든 AI 클라이언트</span>가 같은 도구를 쓸 수 있다.
      </p>
    </AbsoluteFill>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// S2 — 호출 시퀀스
// ───────────────────────────────────────────────────────────────────────────

type Step = { atSec: number; from: "user" | "claude" | "mcp" | "ext"; to: "user" | "claude" | "mcp" | "ext"; label: string; sub?: string };

const seqSteps: Step[] = [
  { atSec: 17.5, from: "user",  to: "claude", label: "PR #482 의 리뷰 코멘트 다 가져와", sub: "사용자 prompt" },
  { atSec: 20,   from: "claude", to: "mcp",   label: "tools/list",                       sub: "사용 가능한 도구 조회" },
  { atSec: 22.5, from: "mcp",   to: "claude", label: "[get_pr, list_comments, ...]",     sub: "도구 카탈로그" },
  { atSec: 25,   from: "claude", to: "mcp",   label: "tools/call list_comments(482)",    sub: "JSON-RPC 호출" },
  { atSec: 28,   from: "mcp",   to: "ext",   label: "GitHub REST API",                  sub: "외부 시스템 어댑터" },
  { atSec: 30,   from: "ext",   to: "mcp",   label: "12 comments JSON",                 sub: "원본 결과" },
  { atSec: 32.5, from: "mcp",   to: "claude", label: "structured result",                sub: "Claude 컨텍스트로" },
  { atSec: 35,   from: "claude", to: "user",  label: "12 코멘트 요약 + 우선순위 3",       sub: "다음 행동까지 결정" },
];

const COLS = {
  user:   { x: 200,  label: "사용자",       color: tokens.colors.inkSoft },
  claude: { x: 720,  label: "Claude Code", color: tokens.colors.accent },
  mcp:    { x: 1240, label: "MCP server",   color: "#9b9bff" },
  ext:    { x: 1720, label: "외부 시스템",   color: tokens.colors.ok },
};

const SceneTwo: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = useSceneOpacity(SCENES.S2.from, SCENES.S2.to);
  return (
    <AbsoluteFill style={{ opacity, padding: 80 }}>
      <h1 style={{ fontFamily: tokens.fonts.sans, fontSize: 56, fontWeight: 700, margin: 0 }}>
        호출 흐름 — JSON-RPC 한 번에 외부 결과 회수
      </h1>
      <p style={{ fontFamily: tokens.fonts.sans, fontSize: 24, color: tokens.colors.inkSoft, marginTop: 6 }}>
        사람은 prompt 한 번. 나머지는 Claude ↔ MCP server ↔ 외부 시스템 사이의 자동 왕복.
      </p>

      {/* 컬럼 헤더 + 라이프라인 */}
      <svg style={{ position: "absolute", left: 0, top: 240, width: "100%", height: 800 }} viewBox="0 0 1920 800">
        {Object.entries(COLS).map(([key, col]) => (
          <g key={key}>
            <rect x={col.x - 120} y={0} width={240} height={56} rx={28} fill={`${col.color}22`} stroke={col.color} strokeWidth={2} />
            <text x={col.x} y={36} textAnchor="middle" fontFamily={tokens.fonts.sans} fontSize={24} fontWeight={600} fill={tokens.colors.ink}>
              {col.label}
            </text>
            <line x1={col.x} y1={70} x2={col.x} y2={780} stroke={col.color} strokeWidth={1} strokeDasharray="4 6" opacity={0.5} />
          </g>
        ))}

        {/* 메시지 화살표 */}
        {seqSteps.map((s, i) => {
          const p = interpolate(
            frame,
            [s.atSec * FPS, (s.atSec + 0.4) * FPS],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const fromX = COLS[s.from].x;
          const toX = COLS[s.to].x;
          const y = 110 + i * 78;
          const dir = toX > fromX ? 1 : -1;
          const labelX = (fromX + toX) / 2;
          const headX = toX - dir * 8;
          const arrowColor = COLS[s.from].color;
          return (
            <g key={i} opacity={p}>
              <line x1={fromX} y1={y} x2={toX} y2={y} stroke={arrowColor} strokeWidth={2.5} />
              <polygon
                points={`${headX},${y} ${headX - dir * 12},${y - 6} ${headX - dir * 12},${y + 6}`}
                fill={arrowColor}
              />
              <rect x={labelX - 280} y={y - 36} width={560} height={28} rx={4} fill={tokens.colors.bg} opacity={0.85} />
              <text x={labelX} y={y - 16} textAnchor="middle" fontFamily={tokens.fonts.mono} fontSize={20} fill={tokens.colors.ink}>
                {s.label}
              </text>
              {s.sub && (
                <text x={labelX} y={y + 24} textAnchor="middle" fontFamily={tokens.fonts.sans} fontSize={16} fill={tokens.colors.inkSoft}>
                  {s.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// S3 — 임베디드 시나리오 (JTAG MCP)
// ───────────────────────────────────────────────────────────────────────────

const SceneThree: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = useSceneOpacity(SCENES.S3.from, SCENES.S3.to);
  const sceneFrame = frame - SCENES.S3.from * FPS;
  const startedAt = SCENES.S3.from;

  return (
    <AbsoluteFill style={{ opacity, padding: 80 }}>
      <h1 style={{ fontFamily: tokens.fonts.sans, fontSize: 56, fontWeight: 700, margin: 0 }}>
        시나리오 — JTAG MCP 로 ECC 카운터 읽기
      </h1>
      <p style={{ fontFamily: tokens.fonts.sans, fontSize: 24, color: tokens.colors.inkSoft, marginTop: 6 }}>
        측정장비를 MCP 서버로 노출하면, Claude 가 직접 레지스터 읽고 다음 행동을 결정한다.
      </p>

      {/* 좌: prompt + 호출 */}
      <div style={{
        position: "absolute",
        left: 80,
        top: 230,
        width: 880,
        background: "#101014",
        border: `1px solid ${tokens.colors.panel}`,
        borderRadius: 12,
        padding: 24,
        fontFamily: tokens.fonts.mono,
      }}>
        <div style={{ fontSize: 18, color: tokens.colors.inkSoft, marginBottom: 12 }}>prompt — 사용자가 한 줄</div>
        <div style={{ fontSize: 22, color: tokens.colors.ink, lineHeight: 1.5, marginBottom: 24 }}>
          <TypeOn
            text="ECC 카운터 레지스터 0x40, 0x44 를 1초 간격으로 10회 읽고, 4비트 에러 추세를 표로 정리해줘."
            startSec={startedAt + 0.5}
            charsPerSec={50}
          />
        </div>
        <div style={{ fontSize: 18, color: tokens.colors.inkSoft, marginBottom: 8, marginTop: 18 }}>Claude 의 도구 호출</div>
        {[
          { at: 4,    text: "→ jtag.read_reg(0x40)  # ECC_ERR_CNT_4BIT" },
          { at: 5,    text: "→ jtag.read_reg(0x44)  # ECC_ERR_CNT_BCH" },
          { at: 6,    text: "→ time.sleep(1)" },
          { at: 7,    text: "(× 10)" },
        ].map((line, i) => {
          const p = interpolate(
            sceneFrame,
            [line.at * FPS, (line.at + 0.3) * FPS],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <div key={i} style={{ opacity: p, fontSize: 20, color: tokens.colors.accent, marginTop: 6 }}>
              {line.text}
            </div>
          );
        })}
      </div>

      {/* 우: 결과 표 */}
      <div style={{
        position: "absolute",
        right: 80,
        top: 230,
        width: 880,
        background: "#101014",
        border: `1px solid ${tokens.colors.panel}`,
        borderRadius: 12,
        padding: 24,
        fontFamily: tokens.fonts.mono,
        opacity: interpolate(sceneFrame, [10 * FPS, 11 * FPS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{ fontSize: 18, color: tokens.colors.inkSoft, marginBottom: 12 }}>Claude 분석 결과</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 20 }}>
          <thead>
            <tr style={{ color: tokens.colors.inkSoft, textAlign: "left" }}>
              <th style={{ padding: "6px 8px" }}>t(s)</th>
              <th style={{ padding: "6px 8px" }}>0x40 (4bit)</th>
              <th style={{ padding: "6px 8px" }}>0x44 (BCH)</th>
              <th style={{ padding: "6px 8px" }}>Δ</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["0", "12", "0", "—"],
              ["1", "12", "0", "0"],
              ["2", "13", "0", "+1"],
              ["3", "15", "0", "+2"],
              ["4", "17", "0", "+2"],
              ["…", "…", "…", "…"],
              ["9", "24", "0", "+1.3/s"],
            ].map((row, i) => {
              const p = interpolate(
                sceneFrame,
                [(11.2 + i * 0.4) * FPS, (11.5 + i * 0.4) * FPS],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              );
              return (
                <tr key={i} style={{ opacity: p, color: tokens.colors.ink }}>
                  {row.map((c, j) => (
                    <td key={j} style={{ padding: "4px 8px" }}>{c}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{
          marginTop: 18,
          padding: "12px 16px",
          background: `${tokens.colors.accent}1A`,
          borderLeft: `4px solid ${tokens.colors.accent}`,
          fontFamily: tokens.fonts.sans,
          fontSize: 20,
          color: tokens.colors.ink,
          opacity: interpolate(sceneFrame, [16 * FPS, 17 * FPS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          Claude: <span style={{ color: tokens.colors.accent }}>4bit 만 단조 증가</span>. BCH 영역 불변 → 보드 디스턴스 의심,
          OOB 레이아웃은 무관.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// S4 — 3 가지 Primitive
// ───────────────────────────────────────────────────────────────────────────

type Prim = { title: string; desc: string; examples: string[]; color: string; appearAt: number };

const primitives: Prim[] = [
  {
    title: "Tools",
    desc: "호출 가능한 함수 — 실제 동작을 일으킴",
    examples: ["github.get_pr(id)", "jtag.read_reg(addr)", "buildfarm.run('am335x')"],
    color: tokens.colors.accent,
    appearAt: 61,
  },
  {
    title: "Resources",
    desc: "읽기 전용 데이터 — Claude 컨텍스트로 흘러들어옴",
    examples: ["repo://drivers/mtd/", "schema://nand_metrics", "doc://datasheet/EMIF"],
    color: "#9b9bff",
    appearAt: 65,
  },
  {
    title: "Prompts",
    desc: "재사용 템플릿 — 팀 노하우를 한 줄 호출로",
    examples: ["/code-review @file", "/post-mortem @incident", "/release-notes @tag"],
    color: tokens.colors.ok,
    appearAt: 69,
  },
];

const SceneFour: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = useSceneOpacity(SCENES.S4.from, SCENES.S4.to);
  return (
    <AbsoluteFill style={{ opacity, padding: 80 }}>
      <h1 style={{ fontFamily: tokens.fonts.sans, fontSize: 56, fontWeight: 700, margin: 0 }}>
        MCP 서버가 노출하는 3 가지
      </h1>
      <p style={{ fontFamily: tokens.fonts.sans, fontSize: 24, color: tokens.colors.inkSoft, marginTop: 6 }}>
        도구만 있는 게 아니다 — Claude 가 데이터를 읽고, 팀 prompt 를 호출할 수도 있다.
      </p>

      <div style={{ display: "flex", gap: 32, marginTop: 64 }}>
        {primitives.map((p) => {
          const op = interpolate(
            frame,
            [p.appearAt * FPS, (p.appearAt + 0.5) * FPS],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <div
              key={p.title}
              style={{
                opacity: op,
                flex: 1,
                background: "#101014",
                border: `2px solid ${p.color}`,
                borderRadius: 16,
                padding: 28,
              }}
            >
              <div style={{ fontFamily: tokens.fonts.sans, fontSize: 36, fontWeight: 700, color: p.color, marginBottom: 8 }}>
                {p.title}
              </div>
              <div style={{ fontFamily: tokens.fonts.sans, fontSize: 20, color: tokens.colors.inkSoft, marginBottom: 20, lineHeight: 1.45 }}>
                {p.desc}
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {p.examples.map((e) => (
                  <li
                    key={e}
                    style={{
                      fontFamily: tokens.fonts.mono,
                      fontSize: 19,
                      color: tokens.colors.ink,
                      padding: "6px 10px",
                      background: `${p.color}1A`,
                      borderRadius: 6,
                      marginBottom: 6,
                    }}
                  >
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// S5 — 등록 한 줄 + 종결
// ───────────────────────────────────────────────────────────────────────────

const SceneFive: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = useSceneOpacity(SCENES.S5.from, SCENES.S5.to);
  const sceneFrame = frame - SCENES.S5.from * FPS;
  return (
    <AbsoluteFill style={{ opacity, padding: 80 }}>
      <h1 style={{ fontFamily: tokens.fonts.sans, fontSize: 56, fontWeight: 700, margin: 0 }}>
        등록은 한 줄 — 또는 .mcp.json
      </h1>
      <p style={{ fontFamily: tokens.fonts.sans, fontSize: 24, color: tokens.colors.inkSoft, marginTop: 6 }}>
        프로젝트 루트에 설정 파일 한 장이면 팀원 모두가 같은 도구를 씀.
      </p>

      {/* CLI 한 줄 */}
      <div style={{
        marginTop: 56,
        background: "#101014",
        border: `1px solid ${tokens.colors.panel}`,
        borderRadius: 12,
        padding: 24,
        fontFamily: tokens.fonts.mono,
        fontSize: 24,
        color: tokens.colors.ink,
        opacity: interpolate(sceneFrame, [0.3 * FPS, 1 * FPS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <span style={{ color: tokens.colors.accent }}>$ </span>
        <TypeOn
          text="claude mcp add github -- npx -y @modelcontextprotocol/server-github"
          startSec={SCENES.S5.from + 0.5}
          charsPerSec={45}
        />
      </div>

      {/* .mcp.json 예시 */}
      <div style={{
        marginTop: 32,
        background: "#101014",
        border: `1px solid ${tokens.colors.panel}`,
        borderRadius: 12,
        padding: 24,
        fontFamily: tokens.fonts.mono,
        fontSize: 20,
        color: tokens.colors.ink,
        opacity: interpolate(sceneFrame, [3 * FPS, 4 * FPS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{ color: tokens.colors.inkSoft, fontSize: 16, marginBottom: 12 }}>.mcp.json — 팀 공용 설정</div>
        <pre style={{ margin: 0, lineHeight: 1.5, whiteSpace: "pre" }}>{`{
  "mcpServers": {
    "github":  { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"] },
    "jtag":    { "command": "/opt/jtag-mcp/server", "env": { "JTAG_PORT": "ttyUSB0" } },
    "buildfarm": { "url": "https://build.internal/mcp" }
  }
}`}</pre>
      </div>

      <div style={{
        position: "absolute",
        left: 96,
        bottom: 64,
        right: 96,
        padding: "20px 28px",
        background: `${tokens.colors.accent}1A`,
        borderLeft: `4px solid ${tokens.colors.accent}`,
        borderRadius: 8,
        fontFamily: tokens.fonts.sans,
        fontSize: 28,
        color: tokens.colors.ink,
        opacity: interpolate(sceneFrame, [9 * FPS, 10 * FPS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        사내 도구를 한 번만 MCP 로 감싸면, <span style={{ color: tokens.colors.accent }}>모든 AI 클라이언트</span>가
        그대로 씀 — Claude Code · IDE 플러그인 · 자동화 봇 가리지 않고.
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// 루트
// ───────────────────────────────────────────────────────────────────────────

export const V5Mcp: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: tokens.colors.bg, color: tokens.colors.ink }}>
      <SceneOne />
      <SceneTwo />
      <SceneThree />
      <SceneFour />
      <SceneFive />
    </AbsoluteFill>
  );
};
