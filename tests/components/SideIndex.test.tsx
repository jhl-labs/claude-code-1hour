import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SideIndex } from "@/app/components/SideIndex";

describe("SideIndex", () => {
  it("7개 항목을 렌더하고 active를 강조", () => {
    render(<SideIndex activeId="features" />);
    expect(screen.getByText("Hero")).toBeInTheDocument();
    expect(screen.getByText(/핵심 기능/)).toBeInTheDocument();
    const active = screen.getByText(/핵심 기능/).closest("a");
    expect(active).toHaveAttribute("data-active", "true");
  });
});
