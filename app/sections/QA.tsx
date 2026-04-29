import { ScrollSection } from "@/app/components/ScrollSection";
import { Card } from "@/app/components/Card";
import { Callout } from "@/app/components/Callout";
import { sections } from "@/app/lib/sections";

const meta = sections.find((s) => s.id === "qa")!;

type FAQ = { q: string; a: string; tag?: string };

const faqs: FAQ[] = [
  {
    tag: "보안",
    q: "보안상 사내 코드를 외부에 보내도 됩니까?",
    a: "엔터프라이즈 플랜은 학습 미사용 + 데이터 보존 정책 통제 가능. 사내 프록시·감사로그·도메인 화이트리스트와 함께 운영. 자세한 정책은 보안팀 가이드 따라.",
  },
  {
    tag: "기술",
    q: "C 임베디드 코드를 정말 잘 이해합니까?",
    a: "오늘 보신 U-Boot 데모가 답입니다. C/C++ · Kconfig · Makefile · linker script · 디바이스 트리 · RTOS 코드 모두 강함. 매크로·비트필드처럼 전통적 정적분석이 약한 영역에서도 의미적으로 추적함.",
  },
  {
    tag: "검증",
    q: "하드웨어 없이 검증 안 되는 코드는 어떻게?",
    a: "AI 가 80% 를 만들고, 사람이 보드 위에서 마무리. 일의 분담이 바뀌는 것이지 사람이 빠지는 게 아님. sandbox · DM 테스트 · QEMU 같은 호스트 검증 루프를 만들어 회귀의 80% 를 보드 없이.",
  },
  {
    tag: "기술",
    q: "메모리 제약·실시간성·코딩 표준도 반영합니까?",
    a: "가능합니다. CLAUDE.md 나 Skill 에 “스택 사용 < 256B”, “IRQ 컨텍스트 sleep 금지”, “MISRA 예외 규칙” 같은 제약을 적어두면 출력이 그 범위 안으로 좁혀집니다.",
  },
  {
    tag: "기술",
    q: "환각(hallucination) 으로 잘못된 레지스터 사양을 만들지 않나요?",
    a: "위험은 있음. 그래서 두 단계: (1) CLAUDE.md 에 “데이터시트는 docs/ds/*.pdf 만 신뢰” 같은 출처 한정. (2) 변경 후 sandbox/DM 테스트로 즉시 회귀. 환각이 빌드를 깨면 Claude 가 스스로 알아챔.",
  },
  {
    tag: "조직",
    q: "팀 안에서 잘 쓰는 사람과 못 쓰는 사람 격차가 커지지 않을까요?",
    a: "초반엔 벌어집니다. 그래서 개인 요령으로 두지 말고 CLAUDE.md, 공용 프롬프트, Skill 로 굳혀야 합니다. 그래야 격차가 개인 숙련도가 아니라 팀 자산으로 바뀝니다.",
  },
  {
    tag: "도입",
    q: "오늘 미팅 끝나고 가장 먼저 뭘 해야 합니까?",
    a: "(1) 설치·로그인 5분. (2) CLAUDE.md 5줄 작성. (3) “가장 무서운 파일을 코드리뷰” 1번 시켜보기. 이 3단계까지가 30분. §5 페이지에 그대로 적혀 있습니다.",
  },
  {
    tag: "도입",
    q: "비용은 얼마나 듭니까?",
    a: "엔터프라이즈는 시트 단위. 절감되는 엔지니어 시간(데모 4 종 합계 80~90%)으로 단기에 본전. 정확한 사내 단가는 IT/구매 부서 견적 참고.",
  },
];

export function QA({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <header className="mb-10">
        <h2 className="text-4xl font-semibold">{meta.longTitle}</h2>
        <p className="mt-2 text-ink-muted">5분. 라이브에서는 6문답만 다루고, 추가 질문은 이 카드들을 기준으로 확장합니다.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map((f) => (
          <Card key={f.q} eyebrow={f.tag} title={f.q}>
            <p className="leading-relaxed">{f.a}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <Callout tone="ok" title="마지막 한 마디">
          <p className="leading-relaxed">
            “1주일 걸리던 일을 1시간에” 는 마케팅 카피가 아니라 오늘 보여드린 데모 4 종의 실측입니다.
            오늘 끝나면 — 내일 아침 첫 빌드 전에 — 자기 코드로 첫 실험을 돌려 보세요.
            그 첫 30 분이 다음 1 년의 워크플로우를 결정합니다.
          </p>
        </Callout>
      </div>
    </ScrollSection>
  );
}
