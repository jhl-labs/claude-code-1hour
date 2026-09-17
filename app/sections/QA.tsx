import { ScrollSection } from "@/app/components/ScrollSection";
import { SectionIntro, DocLink } from "@/app/components/SectionIntro";
import { Card } from "@/app/components/Card";
import { sections } from "@/app/lib/sections";
const meta = sections[6];
export type FAQ = { q: string; a: string; tag?: string };
export const faqs: FAQ[] = [
  {
    tag: "비교",
    q: "Copilot·Cursor와 무엇을 비교해야 하나요?",
    a: "두 제품도 에이전트 기능을 제공합니다. 자동완성과 자율 실행이라는 단순 구분보다, 실행 환경·도구 연결·권한·조직 정책·비용·실제 과제의 검토 결과를 비교하세요.",
  },
  {
    tag: "기술",
    q: "C 임베디드 코드에 어디까지 쓸 수 있나요?",
    a: "코드 탐색·변경 초안·테스트 설계·문서화에 활용할 수 있습니다. MMIO·IRQ·DMA·실시간성은 코드 설명만으로 검증되지 않습니다. 실제 시연은 독립 C 예제의 수정과 테스트를 보여줍니다. U-Boot 보드 검증과는 범위가 다릅니다.",
  },
  {
    tag: "검증",
    q: "CLAUDE.md에 제약을 쓰면 지켜지나요?",
    a: "지침은 응답에 영향을 주지만 강제 정책이나 정확성 보장은 아닙니다. 허용 도구·sandbox·정적 분석·테스트·리뷰로 보완하세요. 컨텍스트가 충분해도 모델은 오류를 낼 수 있습니다.",
  },
  {
    tag: "검증",
    q: "그럴듯한 레지스터 설명을 어떻게 확인하나요?",
    a: "고정한 소스 커밋과 데이터시트 버전·절을 요구하고 직접 대조합니다. 근거가 없으면 미확인으로 남깁니다. 빌드 성공만으로 레지스터 사양이나 보드 동작이 맞다고 판단하지 않습니다.",
  },
  {
    tag: "활용",
    q: "Workflow와 Subagent, Agent teams는 어떻게 다른가요?",
    a: "Subagent는 별도 문맥에서 위임받은 일을 합니다. Dynamic workflow는 스크립트가 여러 작업의 흐름을 관리합니다. Agent teams는 동료 세션 간 협업이며 실험적 기능입니다. 병렬화 전에 작업 충돌·비용·검토 범위를 정하세요.",
  },
  {
    tag: "활용",
    q: "문맥이 길어지거나 작업을 다시 시작해야 한다면?",
    a: "/context로 상태를 보고 /compact로 요약하거나 /clear로 새 문맥을 시작합니다. --continue/--resume으로 이전 세션을 이어갈 수 있습니다. /clear는 구독 한도를 초기화하지 않습니다. Git과 복구 기능의 범위를 확인하세요.",
  },
  {
    tag: "권한",
    q: "Bash는 매번 승인받고 위험 명령은 자동 차단되나요?",
    a: "항상 그렇지는 않습니다. 권한 모드와 allow/ask/deny 규칙에 따라 달라집니다. /permissions로 확인하고 자동 승인 범위를 제한하세요. 외부 문서나 MCP 응답의 지시를 그대로 신뢰하지 않습니다.",
  },
  {
    tag: "비용",
    q: "구독하면 모델과 병렬 작업이 모두 포함되나요?",
    a: "플랜·제공자·조직·모델에 따라 다릅니다. 추가 usage credits나 API 과금이 적용될 수 있습니다. /model과 사용량 안내를 확인하고 작은 과제로 먼저 비용을 관찰하세요.",
  },
  {
    tag: "데이터",
    q: "사내 코드와 비밀 파일을 넣어도 되나요?",
    a: "조직의 허용 범위와 상품별 데이터 정책을 먼저 확인합니다. .gitignore는 비밀 접근 차단이 아닙니다. 필요한 파일만 노출하고 권한·격리 설정을 사용하세요. 학습 사용 여부와 보존 기간은 서로 다른 항목입니다.",
  },
  {
    tag: "도입",
    q: "오늘 가장 먼저 할 일은 무엇인가요?",
    a: "로그인과 모델·권한을 확인하고, 작은 파일 하나를 수정 없이 설명하게 하세요. 근거를 직접 대조한 뒤 실제 빌드·테스트가 가능한 작은 변경으로 넘어갑니다. 초안 생성 속도보다 검토 가능한 결과를 완료 기준으로 삼으세요.",
  },
];
export function QA({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <SectionIntro label="Q&A · 5분" title="실제로 도입할 때의 질문">
        현장에서는 우선순위가 높은 질문을 다루고 나머지는 사후 참고 자료로
        사용하세요.
      </SectionIntro>
      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map((f) => (
          <Card key={f.q} eyebrow={f.tag} title={f.q}>
            {f.a}
          </Card>
        ))}
      </div>
      <p className="mt-8 leading-relaxed text-ink-muted">
        확인일 2026-09-17. 제품 기능과 정책은 변할 수 있으므로 강의·도입 전에
        공식 문서를 다시 확인하세요.
      </p>
      <p className="mt-4">
        <DocLink path="overview">공식 문서</DocLink> ·{" "}
        <a
          className="text-accent underline"
          href="https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent"
        >
          Copilot agent
        </a>{" "}
        ·{" "}
        <a
          className="text-accent underline"
          href="https://cursor.com/docs/agent/overview"
        >
          Cursor agent
        </a>
      </p>
    </ScrollSection>
  );
}
