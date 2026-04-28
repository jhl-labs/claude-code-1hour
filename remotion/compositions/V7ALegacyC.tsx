import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";
import { Terminal } from "../shared/Terminal";
import { TypeOn } from "../shared/TypeOn";
import { DiffBlock, DiffLine } from "../shared/DiffBlock";

const responsibility = [
  { fn: "davinci_nand_init", role: "초기화 · 클럭 · IRQ 등록" },
  { fn: "davinci_nand_cmd", role: "명령 시퀀서 (CMD/ADDR/DATA 페이즈)" },
  { fn: "davinci_nand_read_page", role: "페이지 읽기 + ECC 검증" },
  { fn: "davinci_nand_write_page", role: "페이지 쓰기 + ECC 생성" },
  { fn: "davinci_nand_dma_xfer", role: "DMA 전송 (호환 모드 분기)" },
  { fn: "davinci_nand_ecc_calc", role: "BCH ECC 계산" },
  { fn: "davinci_nand_irq_handler", role: "인터럽트 처리 · wake 큐" },
];

const diff: DiffLine[] = [
  { type: "ctx", text: "static u32 build_dma_cfg(u32 mode, u32 burst, u32 size)" },
  { type: "ctx", text: "{" },
  { type: "del", text: "    return ((mode << 24) & 0xff000000) |" },
  { type: "del", text: "           ((burst << 16) & 0x00ff0000) |" },
  { type: "del", text: "            (size & 0x0000ffff);" },
  { type: "add", text: "    return FIELD_PREP(DMA_CFG_MODE,  mode)  |" },
  { type: "add", text: "           FIELD_PREP(DMA_CFG_BURST, burst) |" },
  { type: "add", text: "           FIELD_PREP(DMA_CFG_SIZE,  size);" },
  { type: "ctx", text: "}" },
];

export const V7ALegacyC: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const sceneB = interpolate(frame, [12 * fps, 14 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneC = interpolate(frame, [55 * fps, 57 * fps], [0, 1], {
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
          데모 A · 레거시 C 분석 → 책임 분리 + 매크로 정리
        </h1>
        <p
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 22,
            color: tokens.colors.inkSoft,
            marginTop: 4,
          }}
        >
          U-Boot drivers/mtd/nand/raw/davinci_nand.c (≈700 라인)
        </p>
      </FadeSlide>

      {/* Scene A: prompt 입력 (0~12s) */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 220,
          opacity: 1 - sceneB,
        }}
      >
        <Terminal width={1792} height={420}>
          <span style={{ color: tokens.colors.accentSoft }}>$ </span>
          <TypeOn
            text={
              "claude '이 NAND 컨트롤러 드라이버의 함수별 책임을 정리하고, " +
              "명령 시퀀서·ECC·DMA 부분을 책임 단위로 분리할 수 있게 리팩토링을 제안해줘. " +
              "비트필드 매크로 가독성 개선 포함.'"
            }
            startSec={2}
            charsPerSec={32}
            cursor={false}
          />
        </Terminal>
      </div>

      {/* Scene B: 함수 책임 표 (12~55s) */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 220,
          width: 1100,
          opacity: sceneB * (1 - sceneC * 0.7),
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
          ● 함수 책임 마크다운 표
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
              gridTemplateColumns: "440px 1fr",
              gap: 0,
              padding: "12px 20px",
              borderBottom: `1px solid ${tokens.colors.panel}`,
              color: tokens.colors.inkSoft,
              fontFamily: tokens.fonts.mono,
              fontSize: 18,
            }}
          >
            <div>함수</div>
            <div>책임</div>
          </div>
          {responsibility.map((r, i) => {
            const at = 13 + i * 0.8;
            const p = interpolate(
              frame,
              [at * fps, (at + 0.4) * fps],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div
                key={r.fn}
                style={{
                  display: "grid",
                  gridTemplateColumns: "440px 1fr",
                  padding: "10px 20px",
                  borderBottom: `1px solid ${tokens.colors.panel}`,
                  opacity: p,
                }}
              >
                <div
                  style={{
                    fontFamily: tokens.fonts.mono,
                    fontSize: 20,
                    color: tokens.colors.ink,
                  }}
                >
                  {r.fn}()
                </div>
                <div
                  style={{
                    fontFamily: tokens.fonts.sans,
                    fontSize: 20,
                    color: tokens.colors.inkSoft,
                  }}
                >
                  {r.role}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scene B: 책임 분리 카드 (오른쪽) */}
      <div
        style={{
          position: "absolute",
          right: 64,
          top: 220,
          width: 660,
          opacity: sceneB * (1 - sceneC * 0.7),
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
          ● 분리 제안
        </div>
        {[
          { name: "command_sequencer.c", body: "cmd / address / data 페이즈" },
          { name: "ecc.c", body: "BCH 계산 + 비트 보정" },
          { name: "dma.c", body: "DMA 전송 + 호환 모드 분기" },
          { name: "core.c", body: "init · IRQ · 라이프사이클" },
        ].map((c, i) => {
          const at = 22 + i * 1.2;
          const p = interpolate(
            frame,
            [at * fps, (at + 0.6) * fps],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <div
              key={c.name}
              style={{
                padding: "16px 20px",
                marginBottom: 12,
                opacity: p,
                background: `${tokens.colors.accent}10`,
                border: `1px solid ${tokens.colors.accent}55`,
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  fontFamily: tokens.fonts.mono,
                  fontSize: 22,
                  color: tokens.colors.accent,
                  marginBottom: 4,
                }}
              >
                {c.name}
              </div>
              <div
                style={{
                  fontFamily: tokens.fonts.sans,
                  fontSize: 18,
                  color: tokens.colors.inkSoft,
                }}
              >
                {c.body}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scene C: 매크로 diff (55~90s) */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 320,
          opacity: sceneC,
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
          ● 비트필드 매크로 → FIELD_PREP/GET diff
        </div>
        <DiffBlock
          lines={diff}
          startSec={57}
          perLineSec={0.5}
          width={1792}
          fontSize={24}
          filename="drivers/mtd/nand/raw/davinci_nand.c"
        />
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
          ✓ 30초에 의미 단위 분해 — 코드리뷰 시작점이 0이 아니라 70%
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
