import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";
import { Terminal } from "../shared/Terminal";
import { TypeOn } from "../shared/TypeOn";

export const V11Install: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const stepShown = (s: number) => frame >= s * fps;

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
            fontSize: 44,
            fontWeight: 700,
          }}
        >
          30초만 있으면 첫 명령까지
        </h1>
      </FadeSlide>

      <div style={{ position: "absolute", left: 64, top: 180 }}>
        <Terminal width={1792} height={780}>
          <span style={{ color: tokens.colors.accentSoft }}>$ </span>
          <TypeOn
            text="npm install -g @anthropic-ai/claude-code"
            startSec={1}
            charsPerSec={28}
            cursor={false}
          />
          <br />
          {stepShown(4) && (
            <span style={{ color: tokens.colors.inkSoft }}>
              {"added 1 package in 6.3s\n"}
            </span>
          )}
          {stepShown(6) && (
            <>
              <span style={{ color: tokens.colors.accentSoft }}>$ </span>
              <TypeOn
                text="cd ~/work/u-boot && claude"
                startSec={6}
                charsPerSec={26}
                cursor={false}
              />
              <br />
            </>
          )}
          {stepShown(10) && (
            <span style={{ color: tokens.colors.accent }}>
              {"\nClaude Code v1.x · NAND 컨트롤러 펌웨어 프로젝트 감지\n"}
              {"CLAUDE.md 5줄 읽음 — 빌드: make sandbox_defconfig\n\n"}
              {"어떻게 도와드릴까요?\n\n"}
            </span>
          )}
          {stepShown(15) && (
            <>
              <span style={{ color: tokens.colors.accentSoft }}>&gt; </span>
              <TypeOn
                text="가장 무서운 파일 한 개 코드리뷰 시켜줘"
                startSec={15}
                charsPerSec={22}
                cursor={false}
              />
              <br />
            </>
          )}
          {stepShown(22) && (
            <span style={{ color: tokens.colors.ok }}>
              {"● drivers/mtd/nand/raw/davinci_nand.c 분석 시작...\n"}
            </span>
          )}
        </Terminal>
      </div>

      <FadeSlide startSec={26} from="bottom">
        <p
          style={{
            position: "absolute",
            left: 64,
            bottom: 32,
            fontFamily: tokens.fonts.sans,
            fontSize: 26,
            color: tokens.colors.accent,
          }}
        >
          ✓ 오늘 미팅 후 30분이면 — 가장 무서운 파일부터.
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
