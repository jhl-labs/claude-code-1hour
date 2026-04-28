import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInView } from "@/app/lib/useInView";

class MockObserver {
  static instances: MockObserver[] = [];
  static lastInit: IntersectionObserverInit | undefined;
  cb: IntersectionObserverCallback;
  el: Element | null = null;
  disconnected = false;
  constructor(cb: IntersectionObserverCallback, init?: IntersectionObserverInit) {
    this.cb = cb;
    MockObserver.lastInit = init;
    MockObserver.instances.push(this);
  }
  observe(el: Element) { this.el = el; }
  disconnect() { this.disconnected = true; }
  trigger(isIntersecting: boolean) {
    this.cb(
      [{ isIntersecting, target: this.el!, intersectionRatio: isIntersecting ? 1 : 0 } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

beforeEach(() => {
  MockObserver.instances = [];
  MockObserver.lastInit = undefined;
  // @ts-expect-error
  globalThis.IntersectionObserver = MockObserver;
});

describe("useInView", () => {
  it("element 부착 시 inView 토글, options 전달, unmount 시 disconnect", () => {
    const { result, unmount } = renderHook(() => useInView<HTMLDivElement>({ threshold: 0.5 }));
    const div = document.createElement("div");
    act(() => result.current.ref(div));
    const obs = MockObserver.instances[0];
    expect(obs).toBeDefined();
    expect(MockObserver.lastInit?.threshold).toBe(0.5);
    act(() => obs.trigger(true));
    expect(result.current.inView).toBe(true);
    act(() => obs.trigger(false));
    expect(result.current.inView).toBe(false);
    unmount();
    expect(obs.disconnected).toBe(true);
  });
});
