import React from "react";
import { tokens } from "../tokens";
import { useProgress } from "./utils";

type Props = {
  label: string;
  startSec: number;
  durationSec?: number;
  /** 0~1: 절감률 또는 막대 길이 비율 */
  value: number;
  color?: string;
  /** 우측 라벨 (예: "85%", "0 → 1") */
  valueLabel: string;
  width?: number;
};

export const AnimatedBar: React.FC<Props> = ({
  label,
  startSec,
  durationSec = 1.0,
  value,
  color = tokens.colors.accent,
  valueLabel,
  width = 900,
}) => {
  const p = useProgress(startSec * 30, durationSec * 30);
  return (
    <div
      style={{
        width,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 28,
            color: tokens.colors.ink,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: tokens.fonts.mono,
            fontSize: 36,
            color,
            fontWeight: 700,
          }}
        >
          {valueLabel}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 24,
          background: "#1a1a1f",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value * p * 100}%`,
            height: "100%",
            background: color,
            borderRadius: 12,
            transition: "none",
          }}
        />
      </div>
    </div>
  );
};
