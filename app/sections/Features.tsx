import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlayer } from "@/app/components/VideoPlayer";
import { Card } from "@/app/components/Card";
import { sections } from "@/app/lib/sections";
import { V2CliLoop } from "@/remotion/compositions/V2CliLoop";
import { V3ClaudeMd } from "@/remotion/compositions/V3ClaudeMd";
import { V4Tools } from "@/remotion/compositions/V4Tools";
import { V5Mcp } from "@/remotion/compositions/V5Mcp";
import { V6SkillsSubagentsHooks } from "@/remotion/compositions/V6SkillsSubagentsHooks";

const meta = sections.find((s) => s.id === "features")!;

type FeatureItem = {
  videoId: string;
  title: string;
  stage: string;
  body: string[];
  embedded: string;
  example: { label: string; text: string };
  extra?: { label: string; text: string };
  composition: React.ComponentType<Record<string, never>>;
  durationSec: number;
};

const features: FeatureItem[] = [
  {
    videoId: "V2",
    title: "CLI + 에이전틱 루프",
    stage: "오늘 바로",
    body: [
      "사람이 한 번 시키면, Claude 가 사고 → 도구 호출 → 관찰 → 다음 행동을 스스로 반복합니다.",
      "보드 디버깅에서 “레지스터 한 번 보고, 로그 한 번 보고, 가설 세우고, 다시 시도” 하는 그 루프와 똑같음. 차이는 코드 위에서 돌아간다는 것 뿐.",
    ],
    embedded:
      "터미널 기반 = SSH 접속한 빌드 서버·타겟 보드 호스트에서 그대로. GUI 도 IDE 도 강요 안 함.",
    example: {
      label: "예",
      text: '"ECC 4비트 에러 처리 로직을 찾아서, 타임아웃 코드와 같이 묶여 있는지 확인해줘" — 5번의 도구 호출로 끝.',
    },
    extra: {
      label: "Plan mode",
      text: 'Shift+Tab 으로 큰 작업 전 "계획 먼저 검토" 모드 진입. 빌드 깨뜨릴 수정 전에 사람이 한 번 확인.',
    },
    composition: V2CliLoop as React.ComponentType<Record<string, never>>,
    durationSec: 60,
  },
  {
    videoId: "V3",
    title: "CLAUDE.md = 프로젝트의 기억",
    stage: "오늘 바로",
    body: [
      "팀의 빌드 명령·코딩 규칙·하드웨어 제약을 적어두면 Claude 가 매 세션마다 그걸 알고 시작합니다.",
      "신규 입사자에게 한 번 알려주듯이 한 번만. 매 PR 마다 “BCH-8 인지 확인했나?”를 다시 말할 필요 없음.",
    ],
    embedded:
      "ECC · OOB 사이즈 · IRQ 컨텍스트 · 비트필드 매크로 정책 — 사람이 자주 까먹는 항목이 그대로 컨텍스트.",
    example: {
      label: "한 줄 예",
      text: '"ECC: BCH-8 고정. 변경 시 OOB 레이아웃까지 확인." → Claude 가 ECC 관련 변경엔 항상 OOB 도 같이 검사.',
    },
    composition: V3ClaudeMd as React.ComponentType<Record<string, never>>,
    durationSec: 45,
  },
  {
    videoId: "V4",
    title: "도구 사용 (Read · Edit · Bash · Grep)",
    stage: "오늘 바로",
    body: [
      "말만 하는 게 아니라 실제로 파일을 읽고, 고치고, 빌드를 돌립니다. ChatGPT 웹 채팅과의 결정적 차이.",
      "Read = 파일 정독 / Grep = 심볼·문자열 검색 / Edit = 정확한 변경 / Bash = 빌드·테스트·git. 이 4 가지 조합으로 거의 모든 임베디드 작업이 됨.",
    ],
    embedded:
      "make · git · objdump · scripts/checkpatch.pl 까지 그대로 호출. 사내 빌드 스크립트를 따로 가르칠 필요 없음.",
    example: {
      label: "관찰",
      text: "Bash 권한은 매 호출마다 물어봄. 위험 명령은 자동 차단(rm -rf, force push). 안전이 기본값.",
    },
    composition: V4Tools as React.ComponentType<Record<string, never>>,
    durationSec: 60,
  },
  {
    videoId: "V5",
    title: "MCP — 외부 시스템과의 다리",
    stage: "2주차 이후",
    body: [
      "GitHub · DB · Jira · 내부 시스템에 Claude 가 직접 접근. Model Context Protocol 이 표준 인터페이스.",
      "사내에 이미 있는 도구를 Claude 와 잇는 표준 방법. 매번 별도 통합 코드를 짤 필요가 없습니다.",
    ],
    embedded:
      "JTAG 디버거·로직 애널라이저·내부 트레이스 서버를 MCP 로 노출하면, Claude 가 측정값을 직접 읽고 다음 시나리오를 결정. 사람이 콘솔에 GDB 명령 치는 시간을 그만큼 절약.",
    example: {
      label: "사내 시나리오",
      text: "Jira MCP → 티켓 자동 링크. GitHub MCP → PR 본문·리뷰 자동 작성. 사내 빌드팜 MCP → cross-build 결과 회수.",
    },
    composition: V5Mcp as React.ComponentType<Record<string, never>>,
    durationSec: 60,
  },
  {
    videoId: "V6",
    title: "Skills · Subagents · Hooks",
    stage: "팀 적용 단계",
    body: [
      "Skill = 자주 하는 절차의 호출 가능한 형태(릴리즈 노트 작성·MISRA 점검).",
      "Subagent = 큰 작업의 위임. 메인 컨텍스트를 더럽히지 않고 “이 디렉토리만 정리” 같은 분담.",
      "Hook = 자동 트리거. 커밋 전 단위테스트, 빌드 후 정적 분석, 위험 명령 차단까지.",
    ],
    embedded:
      "Hook 으로 “git push 전 sandbox 빌드 + checkpatch” 강제. Subagent 로 “drivers/mtd/ 만 리팩토링” 분담. 팀 노하우가 코드가 됨.",
    example: {
      label: "조합",
      text: "PR 생성 → Hook → security-review subagent + test-runner subagent 병렬 → 사람은 결과 표만 검토.",
    },
    composition: V6SkillsSubagentsHooks as React.ComponentType<Record<string, never>>,
    durationSec: 90,
  },
];

export function Features({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <header className="mb-10">
        <div className="text-xs uppercase tracking-wider text-accent">§2</div>
        <h2 className="mt-1 text-4xl font-semibold">{meta.longTitle}</h2>
        <p className="mt-2 text-ink-muted">12분. 오늘 바로 쓸 3개를 먼저, 나머지 2개는 확장 기능으로 본다.</p>
      </header>

      {/* 한 줄 요약 띠 */}
      <div className="mb-8 rounded-md bg-bg-soft/70 px-5 py-4 ring-1 ring-white/5 text-sm leading-relaxed text-ink-soft">
        <span className="text-accent font-semibold">한 줄 요약: </span>
        Claude Code 는 (1) <strong>CLI 에이전틱 루프</strong>로 일하고, (2) <strong>CLAUDE.md</strong> 로 팀의
        지식을 기억하고, (3) <strong>도구</strong>로 코드·빌드·테스트를 직접 만지고, (4){" "}
        <strong>MCP</strong> 로 외부 시스템과 연결되며, (5) <strong>Skills/Subagents/Hooks</strong> 로
        팀 노하우를 코드처럼 굳힙니다.
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="rounded-md border-l-2 border-accent/50 bg-bg-soft/60 px-4 py-3">
          <div className="text-xs uppercase tracking-wider text-ink-muted mb-1">오늘 바로 가져갈 것</div>
          CLI 루프, <code className="font-mono text-xs">CLAUDE.md</code>, 도구 사용. 여기까지 이해하면
          오늘 데모 4종은 거의 다 설명됩니다.
        </div>
        <div className="rounded-md border-l-2 border-white/10 bg-bg-soft/60 px-4 py-3">
          <div className="text-xs uppercase tracking-wider text-ink-muted mb-1">나중에 붙일 것</div>
          MCP 와 Skills/Subagents/Hooks 는 팀 적용 단계의 증폭기입니다. 오늘은 “이런 확장축이 있다”까지만.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {features.map((f) => (
          <Card key={f.videoId} eyebrow={`${f.stage} · ${f.videoId}`} title={f.title}>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr,1fr] gap-5 items-start">
              <div className="space-y-3 text-sm">
                {f.body.map((p, i) => (
                  <p key={i} className="leading-relaxed">{p}</p>
                ))}
                <div className="rounded-md border-l-2 border-accent/50 bg-bg/50 px-3 py-2 text-xs">
                  <div className="text-accent uppercase tracking-wider mb-1">임베디드 맥락</div>
                  <p className="leading-relaxed">{f.embedded}</p>
                </div>
                <div className="text-xs text-ink-muted leading-relaxed">
                  <span className="text-accent font-semibold">{f.example.label}: </span>
                  {f.example.text}
                </div>
                {f.extra && (
                  <div className="text-xs text-ink-muted leading-relaxed">
                    <span className="text-accent font-semibold">{f.extra.label}: </span>
                    {f.extra.text}
                  </div>
                )}
              </div>
              <VideoPlayer
                composition={f.composition}
                inputProps={{}}
                durationInFrames={f.durationSec * 30}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* 5가지를 한 표로 — 어떤 순서로 손에 익혀야 하나 */}
      <div className="mt-10">
        <h3 className="mb-3 text-xl font-semibold">기능 도입 순서 — 한 번에 다 가져가지 말 것</h3>
        <div className="overflow-x-auto rounded-md ring-1 ring-white/5 bg-bg-soft">
          <table className="w-full text-sm">
            <thead className="text-ink-muted">
              <tr className="text-left">
                <th className="px-4 py-3 w-24">시점</th>
                <th className="px-4 py-3">기능</th>
                <th className="px-4 py-3">언제 도입</th>
                <th className="px-4 py-3">사람의 일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr><td className="px-4 py-2.5 font-mono text-xs text-accent">Day 1</td><td>CLI 루프 + 도구</td><td>설치 직후</td><td>질문하고 빌드/테스트 결과 검토</td></tr>
              <tr><td className="px-4 py-2.5 font-mono text-xs text-accent">Day 3</td><td>CLAUDE.md</td><td>같은 실수 2번 반복될 때</td><td>5~10줄 작성·갱신</td></tr>
              <tr><td className="px-4 py-2.5 font-mono text-xs text-accent">Week 2</td><td>Skills</td><td>같은 절차 3번 이상 반복</td><td>팀 표준 절차를 Skill 로 고정</td></tr>
              <tr><td className="px-4 py-2.5 font-mono text-xs text-accent">Month 1</td><td>MCP</td><td>외부 시스템(Jira·GitHub·빌드팜) 연계</td><td>MCP 서버 1개 붙여 보기</td></tr>
              <tr><td className="px-4 py-2.5 font-mono text-xs text-accent">Month 2</td><td>Subagents · Hooks</td><td>팀 워크플로우 표준화</td><td>자동 게이트와 금기 정의</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          * 시점은 권장값. 팀 상황에 따라 늦춰도 무방. 단, 첫 줄(CLAUDE.md 1줄)은 오늘부터.
        </p>
      </div>
    </ScrollSection>
  );
}
