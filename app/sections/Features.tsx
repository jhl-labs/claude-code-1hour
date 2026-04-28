import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlaceholder } from "@/app/components/VideoPlaceholder";
import { Card } from "@/app/components/Card";
import { sections } from "@/app/lib/sections";

const meta = sections.find((s) => s.id === "features")!;

const features = [
  {
    videoId: "V2",
    title: "CLI + 에이전틱 루프",
    body: "사람이 한 번 시키면, Claude가 사고 → 도구 호출 → 관찰 → 다음 행동을 스스로 반복. 보드 디버깅 때 '이거 보고, 저거 시도하고...' 하는 그 루프와 똑같음.",
    note: "CLI 60초 시뮬레이션",
  },
  {
    videoId: "V3",
    title: "CLAUDE.md = 프로젝트의 기억",
    body: "팀의 빌드 명령·코딩 규칙·하드웨어 제약을 적어두면 Claude가 매 세션마다 그걸 알고 시작. 신규 입사자에게 알려주듯이 한 번만.",
    note: "CLAUDE.md 45초 모션",
  },
  {
    videoId: "V4",
    title: "도구 사용 (Read · Edit · Bash · Grep)",
    body: "말만 하는 게 아니라 실제로 파일을 읽고 고치고 빌드를 돌림. 이게 ChatGPT 웹 채팅과의 결정적 차이.",
    note: "도구 호출 60초",
  },
  {
    videoId: "V5",
    title: "MCP — 외부 시스템과의 다리",
    body: "GitHub · DB · Jira · 내부 시스템에 Claude가 직접 접근. JTAG 디버거나 측정장비도 MCP로 연결 가능.",
    note: "MCP 다이어그램 60초",
  },
  {
    videoId: "V6",
    title: "Skills · Subagents · Hooks",
    body: "Skill = 자주 하는 절차의 호출 가능한 형태. Subagent = 큰 작업의 위임. Hook = 자동 트리거(예: 커밋 전 단위테스트).",
    note: "세 개념 90초",
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
              <VideoPlaceholder videoId={f.videoId} note={f.note} />
            </div>
          </Card>
        ))}
      </div>
    </ScrollSection>
  );
}
