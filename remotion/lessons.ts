import data from "./lesson-data.json";
export type Lesson = (typeof data)[number];
export const lessons = data;
export function getLesson(id: string): Lesson {
  const lesson = lessons.find((item) => item.id === id);
  if (!lesson) throw new Error(`Unknown lesson: ${id}`);
  return lesson;
}
export function durationSeconds(lesson: Lesson) {
  return lesson.sceneSeconds * lesson.scenes.length;
}
