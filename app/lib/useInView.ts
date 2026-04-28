"use client";
import { useCallback, useEffect, useState } from "react";

/**
 * 뷰포트 진입 감지를 위한 IntersectionObserver 래퍼.
 *
 * callback ref 패턴: `<div ref={ref}>`처럼 그대로 JSX에 꽂아 쓰면 React가
 * mount/unmount 시점에 element를 setState로 전달해 observer 부착/해제를 트리거.
 */
export function useInView<T extends Element>(options?: { threshold?: number; rootMargin?: string }) {
  const [el, setEl] = useState<T | null>(null);
  const ref = useCallback((node: T | null) => setEl(node), []);
  const [inView, setInView] = useState(false);
  const threshold = options?.threshold ?? 0.4;
  const rootMargin = options?.rootMargin;

  useEffect(() => {
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold, ...(rootMargin ? { rootMargin } : {}) },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [el, threshold, rootMargin]);

  return { ref, inView };
}
