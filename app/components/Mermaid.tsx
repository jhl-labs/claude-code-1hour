"use client";
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

type Props = { chart: string; id?: string };
let initialized = false;

export function Mermaid({ chart, id = "m" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({ startOnLoad: false, theme: "dark", securityLevel: "strict" });
      initialized = true;
    }
    const host = ref.current;
    if (!host) return;
    const uid = `${id}-${Math.random().toString(36).slice(2)}`;
    let cancelled = false;
    mermaid.render(uid, chart).then(({ svg }) => {
      if (cancelled || !host) return;
      // mermaid는 securityLevel: "strict" 로 자체 sanitize 하지만,
      // innerHTML 직접 할당을 피하기 위해 DOMParser로 파싱 후 노드 교체.
      const parsed = new DOMParser().parseFromString(svg, "image/svg+xml");
      const svgEl = parsed.documentElement;
      host.replaceChildren(svgEl);
    });
    return () => { cancelled = true; };
  }, [chart, id]);
  return <div ref={ref} className="overflow-x-auto" />;
}
