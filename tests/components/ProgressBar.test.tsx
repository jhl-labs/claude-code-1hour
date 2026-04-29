import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "@/app/components/ProgressBar";

describe("ProgressBar", () => {
  it("현재 섹션과 남은 시간을 표시한다", () => {
    render(<ProgressBar activeId="features" />);
    expect(screen.getByText(/§2 핵심 기능/)).toBeInTheDocument();
    // features 12 + embedded 24 + impact 6 + getting 7 + qa 5 = 54분
    expect(screen.getByText(/남은 약 54분/)).toBeInTheDocument();
  });

  it("activeId가 null이면 숨긴다", () => {
    const { container } = render(<ProgressBar activeId={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
