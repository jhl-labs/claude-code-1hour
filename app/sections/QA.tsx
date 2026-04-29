import { ScrollSection } from "@/app/components/ScrollSection";
import { Card } from "@/app/components/Card";
import { Callout } from "@/app/components/Callout";
import { sections } from "@/app/lib/sections";

const meta = sections.find((s) => s.id === "qa")!;

type FAQ = { q: string; a: string; tag?: string };

const faqs: FAQ[] = [
  {
    tag: "비교",
    q: "Copilot · Cursor 와 뭐가 다릅니까?",
    a: "Copilot/Cursor 는 IDE 안의 자동완성·채팅이 중심. Claude Code 는 (1) 터미널에서 자율 루프로 일하고, (2) Read/Edit/Bash/Grep 4종 도구로 빌드·테스트·git 까지 직접 실행하고, (3) CLAUDE.md 로 팀의 규칙을 영구 기억합니다. “옆에서 코드 짜주는 도구” vs “위임할 수 있는 동료”의 차이.",
  },
  {
    tag: "기술",
    q: "C 임베디드 코드를 정말 잘 이해합니까?",
    a: "오늘 보신 U-Boot 데모가 답입니다. C/C++ · Kconfig · Makefile · linker script · 디바이스 트리 · RTOS 코드 모두 강함. 매크로·비트필드처럼 전통적 정적분석이 약한 영역에서도 의미적으로 추적합니다.",
  },
  {
    tag: "기술",
    q: "메모리 제약·실시간성·코딩 표준도 반영합니까?",
    a: "가능합니다. CLAUDE.md 나 Skill 에 “스택 사용 < 256B”, “IRQ 컨텍스트 sleep 금지”, “MISRA 예외 규칙” 같은 제약을 적어두면 출력이 그 범위 안으로 좁혀집니다. 제약을 안 적으면 일반적인 답이 옵니다 — 모든 건 컨텍스트에 달림.",
  },
  {
    tag: "특성",
    q: "환각(hallucination) 으로 잘못된 레지스터 사양을 만들지 않나요?",
    a: "위험은 있습니다. 그래서 두 단계: (1) CLAUDE.md 에 “데이터시트는 docs/ds/*.pdf 만 신뢰” 같은 출처 한정. (2) 변경 후 sandbox/DM 테스트로 즉시 회귀. 환각이 빌드를 깨면 Claude 가 스스로 알아채고 다시 시도합니다 — 자율 루프의 자가 교정.",
  },
  {
    tag: "특성",
    q: "같은 작업을 두 번 시키면 결과가 똑같습니까?",
    a: "완전히 같지는 않습니다. LLM 은 본질적으로 비결정적이고, 코드 변경처럼 경로가 여러 개인 작업은 매번 약간 다른 풀이를 냅니다. 그래서 평가 기준은 “같은 결과”가 아니라 “같은 검증 게이트(빌드·테스트·리뷰)를 통과하느냐”. 게이트가 정확하면 비결정성은 문제가 안 됩니다.",
  },
  {
    tag: "특성",
    q: "컨텍스트가 너무 길어지면 어떻게 처리되나요?",
    a: "세 가지 장치: (1) 자동 컴팩션 — 오래된 메시지를 요약해 토큰 절약. (2) `/clear` 명령으로 사람이 명시적 리셋. (3) Subagent — 큰 작업을 별도 컨텍스트로 위임해 메인을 깨끗하게. “디렉토리 전체 리팩토링” 같은 일은 Subagent 가 맞습니다.",
  },
  {
    tag: "활용",
    q: "Plan mode 는 일반 모드와 언제 구분해서 씁니까?",
    a: "큰 변경(여러 파일 수정·아키텍처 결정·머지 직전 작업) 전에 Shift+Tab 으로 Plan mode 진입. Claude 가 “이렇게 할 계획”만 제시하고 실제 변경은 안 함 — 사람이 검토 후 승인. 일상적 1~2파일 수정은 일반 모드가 빠릅니다.",
  },
  {
    tag: "검증",
    q: "하드웨어 없이 검증 안 되는 코드는 어떻게?",
    a: "AI 가 80% 를 만들고, 사람이 보드 위에서 마무리. 일의 분담이 바뀌는 것이지 사람이 빠지는 게 아닙니다. sandbox · DM 테스트 · QEMU 같은 호스트 검증 루프를 만들면 회귀의 80% 를 보드 없이 잡을 수 있습니다.",
  },
  {
    tag: "활용",
    q: "잘 쓰는 사람과 못 쓰는 사람 격차가 커지지 않을까요?",
    a: "초반엔 벌어집니다. 잘 쓰는 사람의 요령은 대부분 “좋은 CLAUDE.md · 좋은 프롬프트 · 자주 쓰는 Skill”. 그래서 개인 노트로 두지 말고 공용 자산으로 굳혀야 합니다 — 격차가 개인 숙련도가 아니라 팀 자산이 됩니다.",
  },
  {
    tag: "도입",
    q: "오늘 미팅 끝나고 가장 먼저 뭘 해야 합니까?",
    a: "(1) 설치·로그인 5분. (2) CLAUDE.md 5줄 작성. (3) “가장 무서운 파일을 코드리뷰” 1번 시켜보기. 이 3단계까지가 30분. §5 페이지에 그대로 적혀 있습니다.",
  },
];

export function QA({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <header className="mb-10">
        <h2 className="text-4xl font-semibold">{meta.longTitle}</h2>
        <p className="mt-2 text-ink-muted">5분. Claude Code · AI 에이전트의 본질에 대한 10 문답. 라이브에서는 5~6 개만 다루고, 나머지는 사후 자료로.</p>
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
