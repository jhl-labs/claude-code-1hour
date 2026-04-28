import { ScrollSection } from "@/app/components/ScrollSection";
import { sections } from "@/app/lib/sections";

const meta = sections.find((s) => s.id === "qa")!;

export function QA({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <h2 className="text-2xl text-ink-muted">{meta.longTitle}</h2>
      <p className="mt-2 text-sm text-ink-muted">콘텐츠는 다음 task에서 채워짐</p>
    </ScrollSection>
  );
}
