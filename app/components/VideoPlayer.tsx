"use client";
import { Player } from "@remotion/player";
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
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.5 });
  return (
    <div ref={ref} className="overflow-hidden rounded-md ring-1 ring-white/10">
      <Player
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
