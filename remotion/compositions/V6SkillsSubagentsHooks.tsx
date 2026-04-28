import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";

type Concept = {
  name: string;
  tagline: string;
  body: string;
  example: string;
  startSec: number;
};

const concepts: Concept[] = [
  {
    name: "Skill",
    tagline: "자주 하는 절차를 호출 가능한 형태로",
    body: "한 번 정의해두면 어디서든 호출. 'NAND 레지스터 맵 정리해줘'를 명령처럼.",
    example: "$ /register-map drivers/mtd/nand/raw/davinci.c",
    startSec: 2,
  },
  {
    name: "Subagent",
    tagline: "큰 작업을 부하 직원에게 위임",
    body: "코드리뷰 전담, 테스트 작성 전담. 메인 컨텍스트 보호.",
    example: "[ subagent: code-reviewer → 결과 요약 ]",
    startSec: 32,
  },
  {
    name: "Hook",
    tagline: "자동 트리거",
    body: "커밋 직전 자동 단위테스트, 푸시 직전 자동 빌드. 사람이 잊어도 안전망.",
    example: "PreCommit → ./test/py/test.py --bd=sandbox",
    startSec: 62,
  },
];

export const V6SkillsSubagentsHooks: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  return (
    <AbsoluteFill
      style={{
        background: tokens.colors.bg,
        color: tokens.colors.ink,
        padding: 96,
      }}
    >
      <FadeSlide startSec={0} from="top">
        <h1
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 60,
            fontWeight: 700,
          }}
        >
          Skills · Subagents · Hooks
        </h1>
        <p
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 28,
            color: tokens.colors.inkSoft,
            marginTop: 8,
          }}
        >
          Claude Code를 팀 도구로 키우는 세 가지 축
        </p>
      </FadeSlide>

      {concepts.map((c, i) => {
        const p = interpolate(
          frame,
          [c.startSec * fps, (c.startSec + 1) * fps],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const out =
          i < 2
            ? interpolate(
                frame,
                [(c.startSec + 28) * fps, (c.startSec + 29) * fps],
                [1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )
            : 1;
        const opacity = p * out;
        return (
          <div
            key={c.name}
            style={{
              position: "absolute",
              left: 96,
              top: 280,
              width: 1728,
              opacity,
            }}
          >
            <div
              style={{
                fontFamily: tokens.fonts.mono,
                fontSize: 28,
                color: tokens.colors.accent,
                marginBottom: 8,
              }}
            >
              {String(i + 1).padStart(2, "0")} / 03
            </div>
            <div
              style={{
                fontFamily: tokens.fonts.sans,
                fontSize: 96,
                fontWeight: 700,
                lineHeight: 1.05,
              }}
            >
              {c.name}
            </div>
            <div
              style={{
                fontFamily: tokens.fonts.sans,
                fontSize: 36,
                color: tokens.colors.accentSoft,
                marginTop: 12,
              }}
            >
              {c.tagline}
            </div>
            <div
              style={{
                fontFamily: tokens.fonts.sans,
                fontSize: 28,
                color: tokens.colors.inkSoft,
                marginTop: 28,
                maxWidth: 1500,
                lineHeight: 1.5,
              }}
            >
              {c.body}
            </div>
            <div
              style={{
                fontFamily: tokens.fonts.mono,
                fontSize: 26,
                color: tokens.colors.ink,
                marginTop: 40,
                padding: "20px 28px",
                background: "#101014",
                border: `1px solid ${tokens.colors.panel}`,
                borderRadius: 12,
                maxWidth: 1500,
              }}
            >
              {c.example}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
