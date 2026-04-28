import React from "react";
import { useCurrentFrame } from "remotion";

type Props = {
  text: string;
  startSec: number;
  charsPerSec?: number;
  cursor?: boolean;
  style?: React.CSSProperties;
};

export const TypeOn: React.FC<Props> = ({
  text,
  startSec,
  charsPerSec = 40,
  cursor = true,
  style,
}) => {
  const fps = 30;
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startSec * fps);
  const charsShown = Math.min(
    text.length,
    Math.floor((elapsed / fps) * charsPerSec),
  );
  const visible = text.slice(0, charsShown);
  const showCursor = cursor && Math.floor(frame / 15) % 2 === 0;
  return (
    <span style={style}>
      {visible}
      {showCursor && <span style={{ opacity: 0.7 }}>▍</span>}
    </span>
  );
};
