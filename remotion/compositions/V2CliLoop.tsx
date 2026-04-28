import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";
import { Terminal } from "../shared/Terminal";
import { TypeOn } from "../shared/TypeOn";

export const V2CliLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const stepP = (s: number) =>
    interpolate(frame, [s * fps, (s + 0.6) * fps], [0, 1], {
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
            fontSize: 56,
            fontWeight: 700,
          }}
        >
          CLI + 에이전틱 루프
        </h1>
        <p
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 26,
            color: tokens.colors.inkSoft,
            marginTop: 4,
          }}
        >
          한 번 시키면 사고 → 도구 → 관찰 → 다음 행동을 스스로 반복
        </p>
      </FadeSlide>

      <div style={{ position: "absolute", left: 80, top: 200 }}>
        <Terminal
          width={1180}
          height={780}
          title="claude — drivers/mtd/nand/raw"
        >
          <span style={{ color: tokens.colors.accentSoft }}>$ </span>
          <TypeOn
            text="claude 'davinci_nand.c 함수별 책임 정리해줘'"
            startSec={2}
            charsPerSec={26}
            cursor={false}
          />
          <br />
          <br />
          {stepP(7) > 0 && (
            <span style={{ opacity: stepP(7), color: tokens.colors.accent }}>
              ● 사고: 600라인 코드 스캔, 함수 7개 식별 중...{"\n"}
            </span>
          )}
          {stepP(11) > 0 && (
            <span style={{ opacity: stepP(11) }}>
              ● 도구:{" "}
              <span style={{ color: tokens.colors.accent }}>Read</span>
              (davinci_nand.c){"\n"}
            </span>
          )}
          {stepP(15) > 0 && (
            <span style={{ opacity: stepP(15) }}>
              ● 도구:{" "}
              <span style={{ color: tokens.colors.accent }}>Grep</span>
              ("FIELD_PREP|FIELD_GET"){"\n"}
            </span>
          )}
          {stepP(19) > 0 && (
            <span style={{ opacity: stepP(19), color: "#9ca3af" }}>
              {"  관찰: 매크로 12개, 함수 7개 발견\n"}
            </span>
          )}
          {stepP(23) > 0 && (
            <span style={{ opacity: stepP(23) }}>
              ● 사고: 명령 시퀀서 / ECC / DMA 책임 분리 가능{"\n"}
            </span>
          )}
          {stepP(28) > 0 && (
            <span style={{ opacity: stepP(28) }}>
              ● 도구:{" "}
              <span style={{ color: tokens.colors.accent }}>Write</span>
              (REFACTOR.md){"\n"}
            </span>
          )}
          {stepP(33) > 0 && (
            <span style={{ opacity: stepP(33), color: tokens.colors.ok }}>
              ✓ 함수 책임 표 + diagram + 매크로 변환 diff 완료{"\n"}
            </span>
          )}
        </Terminal>
      </div>

      {/* 우측 라벨 */}
      <div
        style={{ position: "absolute", right: 80, top: 240, width: 480 }}
      >
        {[
          {
            label: "사고",
            desc: "다음에 무엇을 할지 결정",
            c: tokens.colors.accent,
            at: 7,
          },
          {
            label: "도구",
            desc: "Read · Edit · Bash · Grep",
            c: tokens.colors.accentSoft,
            at: 11,
          },
          {
            label: "관찰",
            desc: "도구 결과 분석",
            c: "#9ca3af",
            at: 19,
          },
          {
            label: "반복",
            desc: "끝날 때까지 스스로",
            c: tokens.colors.ok,
            at: 33,
          },
        ].map((x) => (
          <div
            key={x.label}
            style={{ marginBottom: 32, opacity: stepP(x.at) }}
          >
            <div
              style={{
                fontFamily: tokens.fonts.mono,
                fontSize: 22,
                color: x.c,
                marginBottom: 4,
              }}
            >
              {x.label}
            </div>
            <div
              style={{
                fontFamily: tokens.fonts.sans,
                fontSize: 24,
                color: tokens.colors.ink,
              }}
            >
              {x.desc}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
