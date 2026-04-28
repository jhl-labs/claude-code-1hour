import { describe, expect, it } from "vitest";
import { sections, totalDurationMinutes } from "@/app/lib/sections";

describe("sections", () => {
  it("정확히 6개 섹션 + 1 Q&A 메타", () => {
    expect(sections).toHaveLength(7);
    expect(sections.map((s) => s.id)).toEqual([
      "hero", "history", "features", "embedded-demos", "impact", "getting-started", "qa",
    ]);
  });

  it("총 시간이 60분 슬롯에 들어맞는다 (±2분)", () => {
    const total = totalDurationMinutes();
    expect(total).toBeGreaterThanOrEqual(58);
    expect(total).toBeLessThanOrEqual(62);
  });
});
