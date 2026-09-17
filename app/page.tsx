"use client";
import { useEffect, useState } from "react";
import { SideIndex } from "@/app/components/SideIndex";
import { ProgressBar } from "@/app/components/ProgressBar";
import { Hero } from "@/app/sections/Hero";
import { History } from "@/app/sections/History";
import { Features } from "@/app/sections/Features";
import { EmbeddedDemos } from "@/app/sections/EmbeddedDemos";
import { Impact } from "@/app/sections/Impact";
import { GettingStarted } from "@/app/sections/GettingStarted";
import { QA } from "@/app/sections/QA";
import { activeSectionAt } from "@/app/lib/activeSection";
import type { SectionMeta } from "@/app/lib/sections";

export default function Page() {
  const [activeId, setActiveId] = useState<SectionMeta["id"] | null>(null);
  useEffect(() => {
    let pending = 0;
    const update = () => {
      pending = 0;
      const positions = [
        ...document.querySelectorAll<HTMLElement>("section[data-section-id]"),
      ].map((el) => ({
        id: el.id as SectionMeta["id"],
        top: el.getBoundingClientRect().top,
      }));
      const bottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      setActiveId(
        activeSectionAt(
          positions,
          Math.min(160, window.innerHeight * 0.2),
          bottom,
        ),
      );
    };
    const schedule = () => {
      if (!pending) pending = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(pending);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return (
    <main>
      <SideIndex activeId={activeId} />
      <ProgressBar activeId={activeId} />
      <Hero />
      <History />
      <Features />
      <EmbeddedDemos />
      <Impact />
      <GettingStarted />
      <QA />
    </main>
  );
}
