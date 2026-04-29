"use client";
import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef } from "react";
import { useInView } from "@/app/lib/useInView";

type Props<T> = {
  composition: React.ComponentType<T>;
  inputProps: T;
  durationInFrames: number;
  fps?: number;
  width?: number;
  height?: number;
  loop?: boolean;
  controls?: boolean;
};

/**
 * Remotion `Player` 의 자동재생 래퍼.
 * - 뷰포트 진입(threshold 0.5) 시 imperative play(), 이탈 시 pause()
 * - autoPlay prop 은 mount 시점에만 적용되므로 inView 변화에 직접 대응
 */
export function VideoPlayer<T>({
  composition,
  inputProps,
  durationInFrames,
  fps = 30,
  width = 1920,
  height = 1080,
  loop = false,
  controls = true,
}: Props<T>) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });
  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    if (inView) {
      p.play();
    } else {
      p.pause();
    }
  }, [inView]);

  return (
    <div ref={ref} className="overflow-hidden rounded-md ring-1 ring-white/10 bg-black">
      <Player
        ref={playerRef}
        component={composition as React.ComponentType<unknown>}
        inputProps={inputProps as unknown as Record<string, unknown>}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={width}
        compositionHeight={height}
        style={{ width: "100%", aspectRatio: `${width} / ${height}` }}
        autoPlay={inView}
        controls={controls}
        loop={loop}
      />
    </div>
  );
}
