import React from "react";
import { useProgress } from "./utils";

type Props = {
  startSec: number;
  durationSec?: number;
  from?: "left" | "right" | "bottom" | "top";
  distance?: number;
  children: React.ReactNode;
};

export const FadeSlide: React.FC<Props> = ({
  startSec,
  durationSec = 0.6,
  from = "bottom",
  distance = 24,
  children,
}) => {
  const fps = 30;
  const p = useProgress(startSec * fps, durationSec * fps);
  const offset = (1 - p) * distance;
  const tx = from === "left" ? -offset : from === "right" ? offset : 0;
  const ty = from === "top" ? -offset : from === "bottom" ? offset : 0;
  return (
    <div style={{ opacity: p, transform: `translate(${tx}px, ${ty}px)` }}>
      {children}
    </div>
  );
};
