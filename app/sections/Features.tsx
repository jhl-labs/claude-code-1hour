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
  body: string;
  composition: React.ComponentType<Record<string, never>>;
  durationSec: number;
};

const features: FeatureItem[] = [
  {
    videoId: "V2",
    title: "CLI + 에이전틱 루프",
    body: "사람이 한 번 시키면, Claude가 사고 → 도구 호출 → 관찰 → 다음 행동을 스스로 반복. 보드 디버깅 때 '이거 보고, 저거 시도하고...' 하는 그 루프와 똑같음.",
    composition: V2CliLoop as React.ComponentType<Record<string, never>>,
    durationSec: 60,
  },
  {
    videoId: "V3",
    title: "CLAUDE.md = 프로젝트의 기억",
    body: "팀의 빌드 명령·코딩 규칙·하드웨어 제약을 적어두면 Claude가 매 세션마다 그걸 알고 시작. 신규 입사자에게 알려주듯이 한 번만.",
    composition: V3ClaudeMd as React.ComponentType<Record<string, never>>,
    durationSec: 45,
  },
  {
    videoId: "V4",
    title: "도구 사용 (Read · Edit · Bash · Grep)",
    body: "말만 하는 게 아니라 실제로 파일을 읽고 고치고 빌드를 돌림. 이게 ChatGPT 웹 채팅과의 결정적 차이.",
    composition: V4Tools as React.ComponentType<Record<string, never>>,
    durationSec: 60,
  },
  {
    videoId: "V5",
    title: "MCP — 외부 시스템과의 다리",
    body: "GitHub · DB · Jira · 내부 시스템에 Claude가 직접 접근. JTAG 디버거나 측정장비도 MCP로 연결 가능.",
    composition: V5Mcp as React.ComponentType<Record<string, never>>,
    durationSec: 60,
  },
  {
    videoId: "V6",
    title: "Skills · Subagents · Hooks",
    body: "Skill = 자주 하는 절차의 호출 가능한 형태. Subagent = 큰 작업의 위임. Hook = 자동 트리거(예: 커밋 전 단위테스트).",
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
        <p className="mt-2 text-ink-muted">5개 영상 + 5개 슬라이드, 약 13분</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {features.map((f) => (
          <Card key={f.videoId} eyebrow={f.videoId} title={f.title}>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr,1fr] gap-4 items-start">
              <p>{f.body}</p>
              <VideoPlayer
                composition={f.composition}
                inputProps={{}}
                durationInFrames={f.durationSec * 30}
              />
            </div>
          </Card>
        ))}
      </div>
    </ScrollSection>
  );
}
