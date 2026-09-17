import { ScrollSection } from "@/app/components/ScrollSection";
import { LessonVideo } from "@/app/components/LessonVideo";
import { SectionIntro } from "@/app/components/SectionIntro";
import { Card } from "@/app/components/Card";
import { sections } from "@/app/lib/sections";
const meta = sections[4];
export function Impact({
  onEnter,
}: {
  onEnter?: (id: typeof meta.id) => void;
}) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <SectionIntro
        label="§4 · 6분"
        title="효과는 검토와 재작업까지 측정합니다"
      >
        분석·테스트·문서 초안을 위임할 수 있습니다. 실제로 얼마나 도움이
        되는지는 팀의 과제와 완료 기준에 따라 측정해야 합니다. 이 강의에는
        검증된 시간 절감률 자료가 없습니다.
      </SectionIntro>
      <LessonVideo id="V8-before-after" />
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="작성과 실행">
          요청 작성부터 도구 실행·대기 시간을 포함합니다.
        </Card>
        <Card title="검토와 재작업">
          사람의 리뷰, 틀린 제안 수정, 추가 테스트까지 합산합니다.
        </Card>
        <Card title="결함과 비용">
          누락·회귀·미검증 범위와 모델 사용량·비용을 함께 기록합니다.
        </Card>
      </div>
      <LessonVideo id="V9-savings-chart" />
      <div className="rounded-lg border border-accent/30 p-6">
        <h3 className="text-xl font-semibold">작은 도입 실험</h3>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-ink-soft">
          <li>반복되는 작은 과제와 공통 완료 기준을 정합니다.</li>
          <li>AI 사용 전후의 총시간과 검토 결과를 여러 회차 기록합니다.</li>
          <li>성공·실패 사례와 환경을 함께 비교합니다.</li>
          <li>효과가 확인된 범위부터 확장합니다.</li>
        </ol>
        <p className="mt-5 leading-relaxed">
          좋은 컨텍스트도 오류를 없애지는 못합니다. 생성 코드와 생성 테스트가
          같은 잘못된 가정을 공유할 수 있습니다. 타이밍·DMA·MMIO·실시간성은 별도
          도구와 보드에서 검증하고, 승인 책임을 명확히 합니다.
        </p>
      </div>
    </ScrollSection>
  );
}
