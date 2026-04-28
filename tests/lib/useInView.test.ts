import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInView } from "@/app/lib/useInView";

class MockObserver {
  static instances: MockObserver[] = [];
  cb: IntersectionObserverCallback;
  el: Element | null = null;
  constructor(cb: IntersectionObserverCallback) {
    this.cb = cb;
    MockObserver.instances.push(this);
  }
  observe(el: Element) { this.el = el; }
  disconnect() {}
  trigger(isIntersecting: boolean) {
    this.cb(
      [{ isIntersecting, target: this.el!, intersectionRatio: isIntersecting ? 1 : 0 } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

beforeEach(() => {
  MockObserver.instances = [];
  // @ts-expect-error
  globalThis.IntersectionObserver = MockObserver;
});

describe("useInView", () => {
  it("진입 시 true, 이탈 시 false", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>());
    const div = document.createElement("div");
    act(() => { (result.current.ref as React.MutableRefObject<HTMLDivElement>).current = div; });
    const obs = MockObserver.instances[0];
    expect(obs).toBeDefined();
    act(() => obs.trigger(true));
    expect(result.current.inView).toBe(true);
    act(() => obs.trigger(false));
    expect(result.current.inView).toBe(false);
  });
});
