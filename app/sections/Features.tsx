import { ScrollSection } from "@/app/components/ScrollSection";
import { LessonVideo } from "@/app/components/LessonVideo";
import { SectionIntro, DocLink } from "@/app/components/SectionIntro";
import { CodeBlock } from "@/app/components/CodeBlock";
import { sections } from "@/app/lib/sections";
const meta = sections[2];
const features = [
  {
    id: "V2-cli-loop",
    title: "1 · 분석 → 변경 → 검증",
    body: "대상과 완료 기준을 먼저 정합니다. 큰 변경은 Plan mode에서 범위와 검증 방법을 살피고 시작하세요. 한 번에 작은 변경을 맡기면 diff와 실패 원인을 검토하기 쉽습니다.",
  },
  {
    id: "V3-claude-md",
    title: "2 · 지침과 메모리",
    body: "CLAUDE.md에는 실제 빌드 명령과 팀 규칙을 적습니다. 자동 메모리와는 역할이 다르며, 지침은 강제 정책이 아닙니다. 하위 디렉토리 지침과 오래된 규칙도 함께 확인하세요.",
  },
  {
    id: "V4-tools",
    title: "3 · 도구와 권한",
    body: "Read·Grep으로 근거를 모으고, Edit로 수정하고, Bash로 확인합니다. 승인 여부는 권한 모드와 규칙에 달려 있습니다. plan/default/acceptEdits/auto 등의 차이를 이해하고 /permissions에서 현재 정책을 확인하세요.",
  },
  {
    id: "V5-mcp",
    title: "4 · MCP로 외부 도구 연결",
    body: "MCP는 외부 도구와 데이터를 연결하는 프로토콜입니다. JTAG·계측기·빌드팜 사례는 별도 서버 구현이 필요한 설계 예입니다. 권한·인증·클라이언트 지원 범위가 맞아야 실제로 사용할 수 있습니다.",
  },
  {
    id: "V6-skills-subagents-hooks",
    title: "5 · 반복 절차와 위임",
    body: "Skill은 지침을 재사용하고, Subagent는 별도 문맥에서 작업합니다. Hook은 실제 이벤트에 맞춰 동작합니다. Dynamic workflow는 여러 작업의 실행 순서를 재실행 가능한 스크립트로 만듭니다.",
  },
];
export function Features({
  onEnter,
}: {
  onEnter?: (id: typeof meta.id) => void;
}) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <SectionIntro label="§2 · 12분" title="핵심 기능과 안전한 실행">
        처음에는 분석·지침·권한을 익히고, 반복 작업이 생기면 확장 기능을
        적용합니다. 영상은 직접 재생하며 한 번에 하나씩 봅니다.
      </SectionIntro>
      <div className="space-y-12">
        {features.map((f) => (
          <article key={f.id}>
            <h3 className="text-2xl font-semibold">{f.title}</h3>
            <p className="mt-3 max-w-4xl leading-relaxed text-ink-soft">
              {f.body}
            </p>
            <LessonVideo id={f.id} />
          </article>
        ))}
      </div>
      <details className="mt-8 rounded-lg bg-bg-soft p-6">
        <summary className="cursor-pointer text-xl font-semibold">
          실습 예제와 확장 기능 참고
        </summary>
        <h3 className="mt-6 text-lg font-semibold">Skill 파일 예제</h3>
        <CodeBlock lang="markdown">{`# .claude/skills/register-review/SKILL.md
---
name: register-review
description: 레지스터 변경의 근거와 미검증 항목을 정리
---
변경 diff와 관련 코드를 읽고 다음을 보고한다.
- 파일·함수·데이터시트 절의 근거
- reserved bit, read/modify/write, endianness
- 실행한 검사와 보드에서 확인할 항목
근거가 없으면 추측하지 말고 미확인으로 표시한다.`}</CodeBlock>
        <p className="mt-3">
          <DocLink path="skills">Skills</DocLink> ·{" "}
          <DocLink path="sub-agents">Subagents</DocLink> ·{" "}
          <DocLink path="hooks">Hooks 이벤트와 JSON 입력</DocLink>
        </p>
        <h3 className="mt-8 text-lg font-semibold">
          프로젝트의 GitHub MCP 등록
        </h3>
        <CodeBlock lang="bash">{`claude mcp add --transport http --scope project github https://api.githubcopilot.com/mcp/
# 이후 Claude Code 안에서 /mcp로 인증·연결 상태 확인`}</CodeBlock>
        <p className="mt-3 leading-relaxed">
          이 명령은 등록 단계입니다. 실제 사용에는 GitHub 서버가 지원하는 인증
          구성이 필요합니다. 공식 안내에 따라 토큰을 안전하게 주입하고
          .mcp.json에 평문 비밀을 저장하지 마세요. 외부 응답에 포함된 지시를
          그대로 신뢰하지 않습니다.
        </p>
        <p className="mt-3">
          <DocLink path="mcp">MCP 인증·scope</DocLink> ·{" "}
          <a
            className="text-accent underline"
            href="https://github.com/github/github-mcp-server"
          >
            GitHub 공식 서버
          </a>
        </p>
        <h3 className="mt-8 text-lg font-semibold">
          Workflow와 Agent teams 구분
        </h3>
        <p className="mt-3 leading-relaxed">
          Dynamic workflows는 유료 플랜·API 및 지원 제공자에서 사용합니다. Pro는
          /config에서 활성화하세요. 직접 입력한 “ultracode: …” 요청으로 만들고
          /workflows에서 진행 상황·사용량을 확인합니다. 권한 검사는 그대로
          적용되고, 병렬 작업은 비용과 검토량을 늘릴 수 있습니다. Agent teams는
          동료 세션 간 협업을 위한 별도의 실험적 기능입니다.
        </p>
        <p className="mt-3">
          <DocLink path="workflows">Workflow 실행·저장</DocLink> ·{" "}
          <DocLink path="agent-teams">Agent teams</DocLink> ·{" "}
          <DocLink path="discover-plugins">Plugins 설치</DocLink>
        </p>
        <h3 className="mt-8 text-lg font-semibold">다음 학습 경로</h3>
        <p className="mt-3 leading-relaxed">
          비대화형 실행은 claude -p와 출력 형식부터, 팀 자동화는 Agent
          SDK·CI부터 살펴보세요. worktree는 병렬 편집을 분리하고, Remote
          Control과 예약 작업은 실행 환경과 권한을 이해한 뒤 적용합니다.
        </p>
        <p className="mt-3">
          <DocLink path="cli-reference">CLI 레퍼런스</DocLink> ·{" "}
          <DocLink path="overview">IDE·Web·자동화 안내</DocLink>
        </p>
      </details>
    </ScrollSection>
  );
}
