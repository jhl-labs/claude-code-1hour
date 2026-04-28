import { ScrollSection } from "@/app/components/ScrollSection";
import { Card } from "@/app/components/Card";
import { sections } from "@/app/lib/sections";

const meta = sections.find((s) => s.id === "qa")!;

const faqs = [
  { q: "보안상 코드를 클라우드에 보내도 됩니까?",
    a: "엔터프라이즈 플랜은 학습 미사용 + 데이터 보존 정책 통제 가능. 자세한 내용은 보안팀 정책에 따라." },
  { q: "C 임베디드 코드를 잘 이해합니까?",
    a: "오늘 보신 U-Boot 데모가 답입니다. C/C++, Kconfig, Makefile, RTOS 코드 모두 강함." },
  { q: "하드웨어 없이 검증 안 되는 코드는?",
    a: "AI가 80%를 만들고, 사람이 보드 위에서 마무리. 일의 분담이 바뀌는 것이지 사람이 빠지는 게 아님." },
  { q: "메모리 제약·실시간성은 무시하지 않나요?",
    a: "CLAUDE.md에 제약을 명시하면 Claude가 이를 고려. 데모 H의 레지스터 맵 자동 정리도 같은 메커니즘." },
];

export function QA({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <header className="mb-10">
        <h2 className="text-4xl font-semibold">{meta.longTitle}</h2>
        <p className="mt-2 text-ink-muted">자주 묻는 질문 · 라이브 5분</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map((f) => (
          <Card key={f.q} title={f.q}>{f.a}</Card>
        ))}
      </div>
    </ScrollSection>
  );
}
