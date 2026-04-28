"use client";
import { useEffect, useMemo, useState } from "react";

/**
 * 뷰포트 진입 감지를 위한 IntersectionObserver 래퍼.
 *
 * `ref`는 setter 후크가 달린 객체를 반환해서 `.current = element` 직접 할당과
 * React JSX `ref={...}` 두 패턴 모두에서 element 변경을 즉시 감지한다.
 */
export function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const [el, setEl] = useState<T | null>(null);
  const [inView, setInView] = useState(false);

  const ref = useMemo(() => {
    const holder = { _current: null as T | null };
    Object.defineProperty(holder, "current", {
      get() {
        return holder._current;
      },
      set(value: T | null) {
        holder._current = value;
        setEl(value);
      },
      configurable: true,
      enumerable: true,
    });
    return holder as unknown as { current: T | null };
  }, []);

  useEffect(() => {
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4, ...options },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [el, options]);

  return { ref, inView };
}
