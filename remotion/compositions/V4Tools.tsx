import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";

type Tool = {
  name: string;
  description: string;
  example: string;
  startSec: number;
  color: string;
};

const tools: Tool[] = [
  {
    name: "Read",
    description: "파일 내용 읽기",
    example: "Read('drivers/mtd/nand/raw/davinci_nand.c')",
    startSec: 4,
    color: tokens.colors.accent,
  },
  {
    name: "Edit",
    description: "파일 수정",
    example: "Edit('drivers/.../denali.c', oldText, newText)",
    startSec: 17,
    color: tokens.colors.accentSoft,
  },
  {
    name: "Bash",
    description: "셸 명령 실행",
    example: "Bash('make sandbox_defconfig && make -j$(nproc)')",
    startSec: 30,
    color: tokens.colors.ok,
  },
  {
    name: "Grep",
    description: "코드 검색",
    example: "Grep('FIELD_PREP', glob='**/*.c')",
    startSec: 43,
    color: "#9b9bff",
  },
];

export const V4Tools: React.FC = () => {
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
          도구 사용 — 말하지 않고, 직접 한다
        </h1>
        <p
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 28,
            color: tokens.colors.inkSoft,
            marginTop: 6,
          }}
        >
          Read · Edit · Bash · Grep — 파일을 직접 읽고 고치고 빌드를 돌린다.
        </p>
      </FadeSlide>

      <div
        style={{
          marginTop: 64,
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {tools.map((t) => {
          const p = interpolate(
            frame,
            [t.startSec * fps, (t.startSec + 0.5) * fps],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const slide = (1 - p) * 60;
          return (
            <div
              key={t.name}
              style={{
                opacity: p,
                transform: `translateX(-${slide}px)`,
                padding: "28px 36px",
                border: `1px solid ${t.color}55`,
                borderLeft: `6px solid ${t.color}`,
                borderRadius: 12,
                background: `${t.color}10`,
                display: "flex",
                alignItems: "center",
                gap: 32,
                maxWidth: 1700,
              }}
            >
              <div
                style={{
                  fontFamily: tokens.fonts.mono,
                  fontSize: 44,
                  fontWeight: 700,
                  color: t.color,
                  minWidth: 160,
                }}
              >
                {t.name}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: tokens.fonts.sans,
                    fontSize: 26,
                    color: tokens.colors.ink,
                    marginBottom: 6,
                  }}
                >
                  {t.description}
                </div>
                <div
                  style={{
                    fontFamily: tokens.fonts.mono,
                    fontSize: 22,
                    color: tokens.colors.inkSoft,
                  }}
                >
                  {t.example}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <FadeSlide startSec={56} from="bottom">
        <p
          style={{
            marginTop: 48,
            fontFamily: tokens.fonts.sans,
            fontSize: 28,
            color: tokens.colors.accent,
          }}
        >
          ChatGPT 웹 채팅과의 결정적 차이 — 실행한다.
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
