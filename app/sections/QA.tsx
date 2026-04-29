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
    q: "메모리 제약·실시간성 같은 비기능 요구는 무시하지 않나요?",
    a: "CLAUDE.md 에 제약을 명시하면 Claude 가 이를 고려. “스택 사용 < 256B”, “IRQ 컨텍스트 sleep 금지” 같은 한 줄이 Claude 의 출력에 그대로 반영됨. 데모 H 의 레지스터 맵 자동 정리도 같은 메커니즘.",
  },
  {
    tag: "기술",
    q: "MISRA · CERT-C 같은 코딩 표준은요?",
    a: "Skill 또는 CLAUDE.md 에 적용 규칙·금지 항목·예외 케이스를 명시. PR 단위 자동 점검을 Hook 으로 묶으면 사람이 일일이 보지 않아도 표준 위반이 머지 전에 잡힘.",
  },
  {
    tag: "기술",
    q: "환각(hallucination) 으로 잘못된 레지스터 사양을 만들지 않나요?",
    a: "위험은 있음. 그래서 두 단계: (1) CLAUDE.md 에 “데이터시트는 docs/ds/*.pdf 만 신뢰” 같은 출처 한정. (2) 변경 후 sandbox/DM 테스트로 즉시 회귀. 환각이 빌드를 깨면 Claude 가 스스로 알아챔.",
  },
  {
    tag: "조직",
    q: "팀에 Claude Code 잘 쓰는 사람·못 쓰는 사람 격차가 벌어지지 않을까요?",
    a: "초반엔 벌어집니다. 그래서 CLAUDE.md · Skill · 사내 슬랙 채널이 필요. 잘 쓰는 사람의 노하우를 한 사람에게 가두지 말고 코드(Skill)로 굳혀 모두가 호출.",
  },
  {
    tag: "조직",
    q: "기존 legacy 코드의 책임은? AI 가 고친 버그가 났을 때.",
    a: "책임은 항상 머지한 사람. PR 리뷰 프로세스는 그대로 유지. AI 가 만든 패치도 사람이 검토하고 머지. 단, 검토에 들이는 시간이 줄어드니 더 많은 PR 을 더 깊이 검토할 수 있음.",
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
        <p className="mt-2 text-ink-muted">자주 묻는 질문 · 라이브 5 분. 슬라이드는 사후 자료로.</p>
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
