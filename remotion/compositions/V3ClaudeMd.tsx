import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";
import { TypeOn } from "../shared/TypeOn";

const claudeMd = `# 우리 프로젝트
NAND 컨트롤러 펌웨어.

## 빌드
- make sandbox_defconfig && make
- ./test/py/test.py --bd=sandbox

## 관습
- 비트필드는 FIELD_PREP / FIELD_GET 사용
- ECC: BCH-8, OOB 64바이트
`;

export const V3ClaudeMd: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  // Scene A 0~8s: 빈 프로젝트 + 의문
  // Scene B 8~25s: CLAUDE.md 작성 (typing)
  // Scene C 25~45s: 다음 세션, Claude가 이미 안다
  const sceneB = interpolate(frame, [8 * fps, 9 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneC = interpolate(frame, [25 * fps, 27 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: tokens.colors.bg,
        color: tokens.colors.ink,
        padding: 96,
      }}
    >
      <FadeSlide startSec={0} from="bottom">
        <h1
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 64,
            fontWeight: 700,
          }}
        >
          CLAUDE.md = 프로젝트의 기억
        </h1>
      </FadeSlide>
      <FadeSlide startSec={0.5} from="bottom">
        <p
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 28,
            color: tokens.colors.inkSoft,
            marginBottom: 48,
          }}
        >
          한 번만 적어두면, 매 세션 알고 시작합니다.
        </p>
      </FadeSlide>

      {/* Scene A: 빈 폴더 */}
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 320,
          opacity: 1 - sceneB,
        }}
      >
        <div
          style={{
            width: 420,
            padding: 24,
            background: tokens.colors.panel,
            borderRadius: 12,
            fontFamily: tokens.fonts.mono,
            fontSize: 22,
            color: tokens.colors.inkSoft,
          }}
        >
          $ ls
          <br />
          (텅 빈 프로젝트)
        </div>
        <div
          style={{
            marginTop: 32,
            fontFamily: tokens.fonts.sans,
            fontSize: 26,
            color: tokens.colors.inkSoft,
            maxWidth: 420,
          }}
        >
          "Claude, 우리 빌드 명령이 뭐였더라..."
          <br />
          (매번 처음부터 알려주기)
        </div>
      </div>

      {/* Scene B: CLAUDE.md 타이핑 */}
      <div
        style={{
          position: "absolute",
          left: 720,
          top: 320,
          opacity: sceneB * (1 - sceneC * 0.7),
          width: 1100,
          padding: 28,
          background: "#101014",
          borderRadius: 12,
          border: `1px solid ${tokens.colors.panel}`,
          fontFamily: tokens.fonts.mono,
          fontSize: 22,
          color: tokens.colors.ink,
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
        }}
      >
        <TypeOn text={claudeMd} startSec={9} charsPerSec={20} cursor />
      </div>

      {/* Scene C: 다음 세션 */}
      <FadeSlide startSec={26} from="right">
        <div
          style={{
            position: "absolute",
            left: 96,
            top: 720,
            width: 1700,
            padding: 28,
            background: `${tokens.colors.accent}14`,
            border: `1px solid ${tokens.colors.accent}66`,
            borderRadius: 12,
            fontFamily: tokens.fonts.mono,
            fontSize: 24,
            color: tokens.colors.ink,
            opacity: sceneC,
          }}
        >
          $ claude "이 NAND 드라이버에 ECC 함수 추가해줘"
          <br />
          <span style={{ color: tokens.colors.accent }}>Claude:</span> BCH-8 /
          OOB 64바이트 / FIELD_PREP 패턴 — 이 프로젝트 관습대로 작업합니다.
        </div>
      </FadeSlide>
    </AbsoluteFill>
  );
};
