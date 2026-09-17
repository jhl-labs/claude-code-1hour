import { describe, expect, it } from "vitest";
import { faqs } from "@/app/sections/QA";

describe("QA faqs", () => {
  it("keeps exactly 10 questions", () => {
    expect(faqs).toHaveLength(10);
  });

  it("replaces the skill-gap question with a Workflow question", () => {
    const hasOldQuestion = faqs.some((f) =>
      f.q.includes("잘 쓰는 사람과 못 쓰는 사람"),
    );
    expect(hasOldQuestion).toBe(false);

    const workflowFaq = faqs.find((f) => f.q.includes("Workflow"));
    expect(workflowFaq).toBeDefined();
    expect(workflowFaq?.tag).toBe("활용");
  });
});
