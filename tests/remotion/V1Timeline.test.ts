import { describe, it, expect } from "vitest";
import { lessons, durationSeconds } from "@/remotion/lessons";
describe("lesson publishing contract", () => {
  it("gives every scene a reachable cue and bounds idle time", () => {
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
    for (const lesson of lessons) {
      expect(lesson.sceneSeconds).toBeLessThanOrEqual(10);
      expect(lesson.scenes.length).toBeGreaterThan(1);
      lesson.scenes.forEach((scene, i) => {
        expect(i * lesson.sceneSeconds).toBeLessThan(durationSeconds(lesson));
        expect(scene.code.length).toBeLessThanOrEqual(6);
        expect(scene.points.length).toBe(2);
      });
    }
  });
});
