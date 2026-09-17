import React from "react";
import { Composition } from "remotion";
import { LessonFilm } from "./shared/LessonFilm";
import { lessons, durationSeconds } from "./lessons";
export const RemotionRoot: React.FC = () => (
  <>
    {lessons.map((lesson) => (
      <Composition
        key={lesson.id}
        id={lesson.id}
        component={LessonFilm}
        defaultProps={{ lessonId: lesson.id }}
        durationInFrames={durationSeconds(lesson) * 30}
        fps={30}
        width={1920}
        height={1080}
      />
    ))}
  </>
);
