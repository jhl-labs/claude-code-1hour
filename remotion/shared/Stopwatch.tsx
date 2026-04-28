import React from "react";
import { useCurrentFrame } from "remotion";
import { tokens } from "../tokens";

type Props = {
  totalSeconds: number;
  startSec: number;
  durationSec: number;
  color?: string;
  label?: string;
};

export const Stopwatch: React.FC<Props> = ({
  totalSeconds,
  startSec,
  durationSec,
  color = tokens.colors.accent,
  label,
}) => {
  const fps = 30;
  const frame = useCurrentFrame();
  const elapsedFrames = Math.max(0, frame - startSec * fps);
  const t = Math.min(1, elapsedFrames / (durationSec * fps));
  const shown = totalSeconds * t;
  const min = Math.floor(shown / 60);
  const sec = Math.floor(shown % 60);
  const display = `${min.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`;
  return (
    <div style={{ display: "inline-block", textAlign: "center" }}>
      {label && (
        <div
          style={{
            color: tokens.colors.inkSoft,
            fontSize: 22,
            marginBottom: 8,
            fontFamily: tokens.fonts.sans,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          fontFamily: tokens.fonts.mono,
          fontSize: 96,
          color,
          fontWeight: 700,
          letterSpacing: "0.02em",
        }}
      >
        {display}
      </div>
    </div>
  );
};
