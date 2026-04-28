import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";
import { Stopwatch } from "../shared/Stopwatch";

export const V8BeforeAfter: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const splitP = interpolate(frame, [1 * fps, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const verdictP = interpolate(frame, [78 * fps, 80 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: tokens.colors.bg }}>
      <FadeSlide startSec={0} from="top">
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: tokens.fonts.sans,
            fontSize: 56,
            fontWeight: 700,
            color: tokens.colors.ink,
          }}
        >
          같은 작업 · 다른 두 시간
        </div>
        <div
          style={{
            position: "absolute",
            top: 124,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: tokens.fonts.sans,
            fontSize: 26,
            color: tokens.colors.inkSoft,
          }}
        >
          U-Boot davinci_nand.c — 함수별 책임 분리 + 비트필드 매크로 정리
        </div>
      </FadeSlide>

      {/* 좌: 사람 */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 60,
          width: 880,
          height: 760,
          background: `linear-gradient(180deg, ${tokens.colors.midnight}, ${tokens.colors.bg})`,
          borderRadius: 16,
          padding: 48,
          opacity: splitP,
          border: `1px solid ${tokens.colors.midnight}`,
        }}
      >
        <div
          style={{
            fontFamily: tokens.fonts.mono,
            color: "#f2a268",
            fontSize: 28,
          }}
        >
          BEFORE · 사람
        </div>
        <div
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 30,
            fontWeight: 600,
            marginTop: 8,
            color: tokens.colors.ink,
          }}
        >
          정독 · 메모 · 화이트보드
        </div>
        <ul
          style={{
            marginTop: 24,
            fontFamily: tokens.fonts.sans,
            fontSize: 24,
            color: tokens.colors.inkSoft,
            lineHeight: 1.6,
          }}
        >
          <li>함수 600라인 1줄씩 읽기</li>
          <li>매크로 → 의미 추적</li>
          <li>회의실 화이트보드에 정리</li>
          <li>다음 날 다시 봄...</li>
        </ul>
        <div style={{ marginTop: 56 }}>
          <Stopwatch
            totalSeconds={27 * 60}
            startSec={3}
            durationSec={70}
            color="#f2a268"
            label="경과"
          />
        </div>
      </div>

      {/* 우: Claude Code */}
      <div
        style={{
          position: "absolute",
          top: 240,
          right: 60,
          width: 880,
          height: 760,
          background: `linear-gradient(180deg, #1a1a1f, ${tokens.colors.bg})`,
          borderRadius: 16,
          padding: 48,
          opacity: splitP,
          border: `1px solid ${tokens.colors.accent}66`,
        }}
      >
        <div
          style={{
            fontFamily: tokens.fonts.mono,
            color: tokens.colors.accent,
            fontSize: 28,
          }}
        >
          AFTER · Claude Code
        </div>
        <div
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 30,
            fontWeight: 600,
            marginTop: 8,
            color: tokens.colors.ink,
          }}
        >
          한 번의 프롬프트, 의미 단위 분해
        </div>
        <ul
          style={{
            marginTop: 24,
            fontFamily: tokens.fonts.sans,
            fontSize: 24,
            color: tokens.colors.inkSoft,
            lineHeight: 1.6,
          }}
        >
          <li>함수 책임 표 자동 생성</li>
          <li>책임 분리 다이어그램</li>
          <li>매크로 → FIELD_PREP/GET diff</li>
          <li>리뷰 시작점 70%</li>
        </ul>
        <div style={{ marginTop: 56 }}>
          <Stopwatch
            totalSeconds={2 * 60 + 30}
            startSec={3}
            durationSec={6}
            color={tokens.colors.accent}
            label="경과"
          />
        </div>
      </div>

      {/* 결과 */}
      <div
        style={{
          position: "absolute",
          top: 1010,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: tokens.fonts.sans,
          fontSize: 36,
          fontWeight: 700,
          color: tokens.colors.accent,
          opacity: verdictP,
        }}
      >
        27분 → 2분 30초 · 사람은 검토자 역할로 격상
      </div>
    </AbsoluteFill>
  );
};
