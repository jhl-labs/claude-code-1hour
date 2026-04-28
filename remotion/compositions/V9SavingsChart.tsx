import React from "react";
import { AbsoluteFill } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";
import { AnimatedBar } from "../shared/AnimatedBar";

const items: {
  label: string;
  value: number;
  valueLabel: string;
  color?: string;
}[] = [
  { label: "데모 A · 레거시 C 분석", value: 0.85, valueLabel: "-85%" },
  { label: "데모 C · 빌드 시스템", value: 0.8, valueLabel: "-80%" },
  { label: "데모 E · 단위 테스트", value: 0.9, valueLabel: "-90%" },
  {
    label: "데모 H · 문서화",
    value: 1.0,
    valueLabel: "0 → 1",
    color: tokens.colors.ok,
  },
];

export const V9SavingsChart: React.FC = () => {
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
            marginBottom: 8,
          }}
        >
          한 사람의 시간이 어디로 갔나
        </h1>
      </FadeSlide>
      <FadeSlide startSec={0.4} from="left">
        <p
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 28,
            color: tokens.colors.inkSoft,
            marginBottom: 56,
          }}
        >
          U-Boot 메모리 컨트롤러 작업 기준
        </p>
      </FadeSlide>
      <div style={{ marginLeft: 8 }}>
        {items.map((it, i) => (
          <AnimatedBar
            key={it.label}
            label={it.label}
            startSec={1.5 + i * 0.9}
            durationSec={1.0}
            value={it.value}
            valueLabel={it.valueLabel}
            color={it.color}
          />
        ))}
      </div>
      <FadeSlide startSec={6} from="bottom">
        <p
          style={{
            marginTop: 32,
            fontFamily: tokens.fonts.sans,
            fontSize: 28,
            color: tokens.colors.accent,
            fontWeight: 600,
          }}
        >
          마지막 막대는 속도가 아니라 가능성 자체가 바뀐 영역.
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
