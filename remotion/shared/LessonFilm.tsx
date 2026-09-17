import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { getLesson } from "../lessons";

export function LessonFilm({ lessonId }: { lessonId: string }) {
  const lesson = getLesson(lessonId);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneFrames = fps * lesson.sceneSeconds;
  const index = Math.min(
    Math.floor(frame / sceneFrames),
    lesson.scenes.length - 1,
  );
  const local = frame % sceneFrames;
  const scene = lesson.scenes[index];
  const fade = interpolate(local, [0, 10], [0.55, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: "#101218",
        color: "#f3f4f8",
        fontFamily: "'Noto Sans CJK KR', sans-serif",
        padding: 80,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 28,
          color: "#ffb16b",
        }}
      >
        <span>
          {lesson.id} · {lesson.title}
        </span>
        <span>
          {index + 1} / {lesson.scenes.length}
        </span>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
        {lesson.scenes.map((s, i) => (
          <div
            key={s.title}
            style={{
              height: 6,
              flex: 1,
              background: i <= index ? "#ffb16b" : "#353945",
            }}
          />
        ))}
      </div>
      <div style={{ opacity: fade }}>
        <h1 style={{ margin: "48px 0 32px", fontSize: 60, lineHeight: 1.25 }}>
          {scene.title}
        </h1>
        <div
          style={{
            background: "#1c2130",
            border: "2px solid #384155",
            borderRadius: 20,
            padding: "32px 40px",
            height: 370,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
          }}
        >
          <pre
            style={{
              fontFamily: "'Noto Sans Mono CJK KR', monospace",
              margin: 0,
              fontSize: 36,
              lineHeight: 1.65,
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
            }}
          >
            {scene.code.join("\n")}
          </pre>
        </div>
        <div style={{ marginTop: 32 }}>
          {scene.points.map((point, i) => (
            <div
              key={point}
              style={{
                marginTop: 16,
                fontSize: 36,
                lineHeight: 1.45,
                opacity: interpolate(
                  local,
                  [(i + 1) * fps * 1.5, (i + 1) * fps * 1.5 + 12],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                ),
              }}
            >
              <span style={{ color: "#ffb16b" }}>● </span>
              {point}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 40,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 25,
          color: "#aeb8cb",
        }}
      >
        <span>{lesson.kind}</span>
        <span>2026-09-17 · 출처와 전체 설명은 본문에서 확인</span>
      </div>
    </AbsoluteFill>
  );
}
