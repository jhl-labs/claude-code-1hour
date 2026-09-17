import { describe, it, expect } from "vitest";
import { activeSectionAt } from "@/app/lib/activeSection";
describe("active section follows the viewport anchor", () => {
  it("selects a tall section even when less than half can be visible", () => {
    expect(
      activeSectionAt(
        [
          { id: "intro", top: -2400 },
          { id: "demo", top: -1000 },
          { id: "end", top: 9000 },
        ],
        160,
      ),
    ).toBe("demo");
  });
  it("handles direct navigation and the end of a short final section", () => {
    const sections = [
      { id: "intro", top: -500 },
      { id: "demo", top: 0 },
      { id: "end", top: 700 },
    ];
    expect(activeSectionAt(sections, 160)).toBe("demo");
    expect(activeSectionAt(sections, 160, true)).toBe("end");
    expect(activeSectionAt([], 160)).toBeNull();
  });
});
