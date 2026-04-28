type Props = { videoId: string; aspect?: "video" | "square"; note?: string };
export function VideoPlaceholder({ videoId, aspect = "video", note }: Props) {
  const aspectClass = aspect === "square" ? "aspect-square" : "aspect-video";
  return (
    <div
      className={`relative ${aspectClass} w-full overflow-hidden rounded-md bg-bg-panel ring-1 ring-white/10`}
      aria-label={`영상 자리: ${videoId}`}
    >
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-mono text-3xl text-accent">{videoId}</div>
          <div className="mt-2 text-sm text-ink-muted">영상 자리 · 플랜 2~3에서 채워짐</div>
          {note && <div className="mt-2 text-xs text-ink-muted">{note}</div>}
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] [background-image:repeating-linear-gradient(0deg,transparent_0_2px,#fff_2px_3px)]"
      />
    </div>
  );
}
