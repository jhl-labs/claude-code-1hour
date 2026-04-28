"use client";
import { useEffect } from "react";
import { useInView } from "@/app/lib/useInView";
import type { SectionMeta } from "@/app/lib/sections";

type Props = {
  section: SectionMeta;
  onEnter?: (id: SectionMeta["id"]) => void;
  children: React.ReactNode;
};

export function ScrollSection({ section, onEnter, children }: Props) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.5 });
  useEffect(() => {
    if (inView) onEnter?.(section.id);
  }, [inView, section.id, onEnter]);
  return (
    <section
      ref={ref}
      id={section.id}
      data-section-id={section.id}
      className="min-h-screen flex flex-col justify-center px-12 py-20"
    >
      {children}
    </section>
  );
}
