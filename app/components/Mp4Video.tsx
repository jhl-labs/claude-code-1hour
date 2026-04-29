"use client";
import { useEffect, useRef } from "react";
import { useInView } from "@/app/lib/useInView";

type Props = {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  poster?: string;
};

/**
 * 정적 mp4 데모 영상 플레이어. Remotion `Player` 의 자리를 대신한다.
 * - 뷰포트 진입(threshold 0.5) 시 자동 재생, 이탈 시 정지.
 * - autoPlay 시 muted 강제 (브라우저 정책).
 */
export function Mp4Video({
  src,
  autoPlay = true,
  loop = false,
  controls = true,
  poster,
}: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.5 });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView && autoPlay) {
      v.play().catch(() => {});
    } else if (!inView) {
      v.pause();
    }
  }, [inView, autoPlay]);

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-md ring-1 ring-white/10 aspect-video w-full bg-bg-panel"
    >
      <video
        ref={videoRef}
        // 캐시 버스트 — 영상 갱신 시 브라우저가 옛 mp4를 그대로 쓰지 않도록.
        src={`${src}?v=20260429-1438`}
        className="w-full h-full object-contain bg-black"
        controls={controls}
        loop={loop}
        muted={autoPlay}
        playsInline
        poster={poster}
        preload="metadata"
      />
    </div>
  );
}
