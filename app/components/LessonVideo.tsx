"use client";
import { useEffect, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { LessonFilm } from "@/remotion/shared/LessonFilm";
import { getLesson, durationSeconds } from "@/remotion/lessons";
import manifest from "@/public/videos/manifest.json";
import { assetPath } from "@/app/lib/assetPath";

export function LessonVideo({
  id,
  mp4 = false,
}: {
  id: string;
  mp4?: boolean;
}) {
  const lesson = getLesson(id);
  const revision = manifest.find(video => video.id === id)?.sha256.slice(0, 12);
  const player = useRef<PlayerRef>(null);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const play = () =>
      window.dispatchEvent(new CustomEvent("lesson-play", { detail: id }));
    const pauseOther = (e: Event) => {
      if ((e as CustomEvent).detail !== id) {
        player.current?.pause();
        video.current?.pause();
      }
    };
    const current = player.current;
    current?.addEventListener("play", play);
    window.addEventListener("lesson-play", pauseOther);
    return () => {
      current?.removeEventListener("play", play);
      window.removeEventListener("lesson-play", pauseOther);
    };
  }, [id]);
  const seek = (seconds: number) => {
    if (mp4 && video.current) {
      video.current.currentTime = seconds;
      video.current.pause();
    } else {
      player.current?.seekTo(seconds * 30);
      player.current?.pause();
    }
  };
  return (
    <figure data-lesson-id={id} className="my-6 min-w-0">
      <figcaption className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
        <span className="text-accent">{lesson.kind}</span>
        <span>{durationSeconds(lesson)}초 · 무음 · 직접 재생</span>
      </figcaption>
      <div className="overflow-hidden rounded-lg ring-1 ring-white/10 bg-black">
        {mp4 ? (
          <video
            ref={video}
            controls
            playsInline
            preload="metadata"
            className="w-full aspect-video"
            poster={assetPath(`/videos/posters/${id}.jpg?v=${revision}`)}
            src={assetPath(`/videos/${id}.mp4?v=${revision}`)}
            onPlay={() =>
              window.dispatchEvent(
                new CustomEvent("lesson-play", { detail: id }),
              )
            }
          >
            <track
              kind="captions"
              srcLang="ko"
              label="한국어 설명"
              src={assetPath(`/videos/${id}.vtt?v=${revision}`)}
            />
          </video>
        ) : (
          <Player
            ref={player}
            component={LessonFilm}
            inputProps={{ lessonId: id }}
            compositionWidth={1920}
            compositionHeight={1080}
            durationInFrames={durationSeconds(lesson) * 30}
            fps={30}
            controls
            showVolumeControls={false}
            showPlaybackRateControl
            style={{ width: "100%", aspectRatio: "16 / 9" }}
          />
        )}
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        작은 화면에서는 전체화면으로 확대하거나 아래 장면별 설명을 읽으세요.{" "}
        <a
          className="text-accent underline"
          href={lesson.source}
          target="_blank"
          rel="noreferrer"
        >
          공식 참고 자료 ↗
        </a>
      </p>
      <details className="mt-3 rounded-md border border-white/10 p-4">
        <summary className="cursor-pointer text-ink">
          장면별 설명과 예제 코드 ({lesson.scenes.length}장면)
        </summary>
        <ol className="mt-4 space-y-6">
          {lesson.scenes.map((scene, i) => (
            <li key={scene.title}>
              <button
                type="button"
                onClick={() => seek(i * lesson.sceneSeconds)}
                className="text-left font-semibold text-accent underline"
              >
                {Math.floor((i * lesson.sceneSeconds) / 60)}:
                {String((i * lesson.sceneSeconds) % 60).padStart(2, "0")} ·{" "}
                {scene.title}
              </button>
              <pre className="mt-2 overflow-x-auto rounded bg-bg p-3 text-sm leading-relaxed">
                {scene.code.join("\n")}
              </pre>
              {scene.points.map((p) => (
                <p
                  key={p}
                  className="mt-2 text-sm leading-relaxed text-ink-soft"
                >
                  {p}
                </p>
              ))}
            </li>
          ))}
        </ol>
      </details>
    </figure>
  );
}
