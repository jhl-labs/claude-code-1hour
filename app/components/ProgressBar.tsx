"use client";
import { sections, type SectionMeta } from "@/app/lib/sections";

type Props = { activeId: SectionMeta["id"] | null };

export function ProgressBar({ activeId }: Props) {
  if (!activeId) return null;
  const idx = sections.findIndex((s) => s.id === activeId);
  if (idx < 0) return null;
  const current = sections[idx];
  const remaining = sections
    .slice(idx)
    .reduce((a, s) => a + s.durationMinutes, 0);
  const percent = Math.round(
    (sections.slice(0, idx).reduce((sum, s) => sum + s.durationMinutes, 0) /
      sections.reduce((sum, s) => sum + s.durationMinutes, 0)) *
      100,
  );
  const label =
    current.number !== null
      ? `§${current.number} ${current.title}`
      : current.title;
  return (
    <aside
      aria-label="강사 진행 가이드"
      className="fixed bottom-6 right-6 z-40 rounded-md bg-bg-panel/90 backdrop-blur px-4 py-3 text-xs text-ink-soft shadow-lg ring-1 ring-white/5 hidden lg:block"
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-accent">{label}</span>
        <span className="text-ink-muted">·</span>
        <span>강의 배분상 남은 약 {remaining}분</span>
        <span className="text-ink-muted">·</span>
        <span>{percent}%</span>
      </div>
    </aside>
  );
}
