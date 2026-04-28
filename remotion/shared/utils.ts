import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { tokens } from "../tokens";

export const SMOOTH = tokens.ease.smooth;

/** 0~1 진행도. fromFrame 시작, 길이 lengthFrames. */
export function useProgress(fromFrame: number, lengthFrames: number) {
  const frame = useCurrentFrame();
  return interpolate(frame, [fromFrame, fromFrame + lengthFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * t * (3 - 2 * t),
  });
}

/** composition fps 헬퍼 */
export function useFps() {
  return useVideoConfig().fps;
}

/** 시간(초) → 프레임 수 */
export function secondsToFrames(seconds: number, fps: number) {
  return Math.round(seconds * fps);
}
