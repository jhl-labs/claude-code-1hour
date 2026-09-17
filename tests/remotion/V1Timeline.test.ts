import { describe, expect, it } from "vitest";
import { milestones } from "@/remotion/compositions/V1Timeline";

describe("V1Timeline milestones", () => {
  it("has 8 milestones ending with Workflow orchestration", () => {
    expect(milestones).toHaveLength(8);
    expect(milestones[milestones.length - 1]).toMatchObject({
      year: "2026 현재",
      title: "Workflow 오케스트레이션",
    });
  });

  it("includes the Claude 5 lineup milestone", () => {
    const claude5 = milestones.find((m) => m.title.includes("Claude 5"));
    expect(claude5).toBeDefined();
    expect(claude5?.title).toContain("Opus 5");
    expect(claude5?.title).toContain("Sonnet 5");
    expect(claude5?.title).toContain("Fable 5.1");
  });
});
