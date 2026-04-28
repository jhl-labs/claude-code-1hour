import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlaceholder } from "@/app/components/VideoPlaceholder";
import { Card } from "@/app/components/Card";
import { sections } from "@/app/lib/sections";

const meta = sections.find((s) => s.id === "impact")!;

const audiences = [
  { who: "시니어",   gain: "혼자 보던 코드를 둘이 보는 효과 — 검토자 역할로 격상" },
  { who: "주니어",   gain: "베테랑 옆에서 일하는 환경 — 쉬운 질문이 쉬워짐" },
  { who: "PL/리더",  gain: "문서화·온보딩이 비용이 아니라 부산물이 됨" },
  { who: "리뷰어",   gain: "리뷰 시작점이 0% → 70%에서 시작" },
];

export function Impact({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <header className="mb-10">
        <div className="text-xs uppercase tracking-wider text-accent">§4</div>
        <h2 className="mt-1 text-4xl font-semibold">{meta.longTitle}</h2>
        <p className="mt-2 text-ink-muted">한 마디: 도구가 아니라 '동시에 일하는 한 명의 동료'.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-muted">V8 · 90초</div>
          <h3 className="mt-1 mb-3 text-xl font-semibold">Before / After</h3>
          <VideoPlaceholder videoId="V8" note="좌: 사람 / 우: Claude — 27분 vs 2분 30초" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-muted">V9 · 60초</div>
          <h3 className="mt-1 mb-3 text-xl font-semibold">시간 절감 차트</h3>
          <VideoPlaceholder videoId="V9" note="막대 그래프 애니. 마지막 막대(문서화)는 다른 색 — 0 → 1" />
        </div>
      </div>

      <div className="mt-10">
        <h3 className="mb-3 text-xl font-semibold">하루/주간 워크플로우는 이렇게 바뀐다</h3>
        <p className="text-ink-soft max-w-3xl">
          회의·디버그·문서·리뷰 슬롯이 재배치됨. 회의·검토·아키텍처에 시간이 오히려 늘어나고, 보드·디버거·로직 애널라이저와 만나는 시간이 더 중요해진다.
          내 일이 줄어드는 게 아니라 내 일의 <em className="text-accent not-italic">밀도</em>가 올라간다.
        </p>
      </div>

      <div className="mt-10">
        <h3 className="mb-3 text-xl font-semibold">누가 가장 이득을 보는가</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {audiences.map((a) => (
            <Card key={a.who} eyebrow="대상" title={a.who}>
              {a.gain}
            </Card>
          ))}
        </div>
      </div>
    </ScrollSection>
  );
}
