"use client";
import { useCallback, useState } from "react";
import { SideIndex } from "@/app/components/SideIndex";
import { ProgressBar } from "@/app/components/ProgressBar";
import { Hero } from "@/app/sections/Hero";
import { History } from "@/app/sections/History";
import { Features } from "@/app/sections/Features";
import { EmbeddedDemos } from "@/app/sections/EmbeddedDemos";
import { Impact } from "@/app/sections/Impact";
import { GettingStarted } from "@/app/sections/GettingStarted";
import { QA } from "@/app/sections/QA";
import type { SectionMeta } from "@/app/lib/sections";

export default function Page() {
  const [activeId, setActiveId] = useState<SectionMeta["id"] | null>(null);
  // 안정 참조: ScrollSection의 onEnter effect deps가 매 렌더 변하지 않도록.
  const setActiveIdCb = useCallback((id: SectionMeta["id"]) => setActiveId(id), []);
  return (
    <main>
      <SideIndex activeId={activeId} />
      <ProgressBar activeId={activeId} />
      <Hero onEnter={setActiveIdCb} />
      <History onEnter={setActiveIdCb} />
      <Features onEnter={setActiveIdCb} />
      <EmbeddedDemos onEnter={setActiveIdCb} />
      <Impact onEnter={setActiveIdCb} />
      <GettingStarted onEnter={setActiveIdCb} />
      <QA onEnter={setActiveIdCb} />
    </main>
  );
}
