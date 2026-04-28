import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";

const codeLines = [
  "#define NAND_CMD_READ_PAGE   0x00",
  "FIELD_PREP(DENALI_DMA_CFG_AMODE, mode)",
  "ecc_bch_calc(&ctrl->ecc, page, oob)",
  "wait_event_timeout(ctrl->irq_wait, ...)",
  "writel(reg, ctrl->base + REG_CMD)",
  "$ make sandbox_defconfig && make -j$(nproc)",
  "✓ test/dm/nand_denali — PASS",
  "claude '이 드라이버 함수 책임 분리해줘'",
];

export const V0HeroLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  return (
    <AbsoluteFill
      style={{ background: tokens.colors.bg, overflow: "hidden" }}
    >
      {/* 흐르는 코드 라인 */}
      {codeLines.map((line, i) => {
        const speed = 90 + (i % 3) * 30; // px/sec
        const offset = (frame / fps) * speed;
        const x = ((i * 250 - offset) % 2300 + 2300) % 2300;
        const y = 100 + ((i * 110) % 880);
        const opacity = 0.18 + (i % 3) * 0.04;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 200,
              top: y,
              fontFamily: tokens.fonts.mono,
              fontSize: 26,
              color: tokens.colors.ink,
              opacity,
              whiteSpace: "nowrap",
            }}
          >
            {line}
          </div>
        );
      })}
      {/* 비네트 오버레이 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, transparent 0, ${tokens.colors.bg} 80%)`,
        }}
      />
      {/* 중앙 강조 배지 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: tokens.fonts.mono,
            fontSize: 28,
            color: tokens.colors.accent,
            padding: "12px 24px",
            border: `1px solid ${tokens.colors.accent}66`,
            borderRadius: 999,
            background: `${tokens.colors.accent}1A`,
            letterSpacing: "0.3em",
            opacity: interpolate(
              frame % (fps * 5),
              [0, fps * 0.6, fps * 4.4, fps * 5],
              [0, 1, 1, 0],
            ),
          }}
        >
          U-BOOT NAND · LIVE
        </div>
      </div>
      {/* 스캔라인 */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.025) 2px 3px)",
        }}
      />
    </AbsoluteFill>
  );
};
