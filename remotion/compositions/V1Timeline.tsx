import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";

type Milestone = { year: string; title: string; sub: string };

const milestones: Milestone[] = [
  { year: "2021", title: "Anthropic 창립", sub: "안전한 AI 연구" },
  { year: "2022~2023", title: "Claude 1 / 2", sub: "대화형 LLM 라인업 시작" },
  {
    year: "2024",
    title: "Claude 3 (Opus/Sonnet/Haiku)",
    sub: "에이전틱 도구 사용",
  },
  { year: "2025-02", title: "Claude Code 베타", sub: "터미널 코드 동료" },
  { year: "2025 GA", title: "정식 출시 + Plugins/Skills", sub: "생태계 확장" },
  {
    year: "2026 현재",
    title: "Subagent · Hook · MCP · IDE",
    sub: "어디서든 같은 에이전틱 루프",
  },
];

export const V1Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  // 라인 진행: 2초~14초 (12초)
  const lineP = interpolate(frame, [2 * fps, 14 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: tokens.colors.bg,
        padding: 96,
        color: tokens.colors.ink,
      }}
    >
      <FadeSlide startSec={0} from="left">
        <h1
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 64,
            fontWeight: 700,
          }}
        >
          Claude Code 짧은 역사
        </h1>
      </FadeSlide>
      <FadeSlide startSec={0.5} from="left">
        <p
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 28,
            color: tokens.colors.inkSoft,
            marginBottom: 64,
          }}
        >
          5년의 흐름을 90초에
        </p>
      </FadeSlide>
      <div style={{ position: "relative", height: 380, marginTop: 32 }}>
        {/* 가로 라인 */}
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            top: 200,
            height: 4,
            background: "#1a1a1f",
            borderRadius: 2,
          }}
        >
          <div
            style={{
              width: `${lineP * 100}%`,
              height: "100%",
              background: tokens.colors.accent,
              borderRadius: 2,
            }}
          />
        </div>
        {milestones.map((m, i) => {
          const start = 2 + i * 2;
          const dotP = interpolate(
            frame,
            [start * fps, (start + 0.5) * fps],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const left = `${(i / (milestones.length - 1)) * 100}%`;
          return (
            <div
              key={m.year}
              style={{
                position: "absolute",
                left,
                top: 0,
                transform: "translateX(-50%)",
                width: 240,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  background: tokens.colors.accent,
                  margin: "190px auto 0",
                  transform: `scale(${dotP})`,
                  opacity: dotP,
                  boxShadow: `0 0 ${20 * dotP}px ${tokens.colors.accent}`,
                }}
              />
              <div
                style={{
                  fontFamily: tokens.fonts.mono,
                  fontSize: 22,
                  color: tokens.colors.accent,
                  marginTop: 16,
                  opacity: dotP,
                }}
              >
                {m.year}
              </div>
              <div
                style={{
                  fontFamily: tokens.fonts.sans,
                  fontSize: 22,
                  fontWeight: 600,
                  marginTop: 4,
                  opacity: dotP,
                }}
              >
                {m.title}
              </div>
              <div
                style={{
                  fontFamily: tokens.fonts.sans,
                  fontSize: 18,
                  color: tokens.colors.inkSoft,
                  marginTop: 4,
                  opacity: dotP,
                }}
              >
                {m.sub}
              </div>
            </div>
          );
        })}
      </div>
      <FadeSlide startSec={15} from="bottom">
        <p
          style={{
            marginTop: 80,
            fontFamily: tokens.fonts.sans,
            fontSize: 28,
            color: tokens.colors.accent,
          }}
        >
          웹 개발자의 도구가 아니다 — 임베디드까지 통한다.
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
