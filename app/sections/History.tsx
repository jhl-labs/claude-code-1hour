import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlaceholder } from "@/app/components/VideoPlaceholder";
import { Card } from "@/app/components/Card";
import { Callout } from "@/app/components/Callout";
import { sections } from "@/app/lib/sections";

const meta = sections.find((s) => s.id === "history")!;

export function History({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <header className="mb-10">
        <div className="text-xs uppercase tracking-wider text-accent">§1</div>
        <h2 className="mt-1 text-4xl font-semibold">{meta.longTitle}</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.4fr] gap-10 items-start">
        <div className="space-y-6">
          <Callout tone="info" title="한 줄 정의">
            <p className="font-mono text-lg">
              Claude Code = 터미널에서 자율적으로 일하는 코드 동료
            </p>
          </Callout>
          <p className="text-ink-soft">
            웹 개발자만의 도구가 아닙니다. C/C++, 빌드 시스템, 디바이스 트리, 펌웨어 — 메모리 컨트롤러 엔지니어가 매일 만지는 영역에서 Claude Code는 강합니다.
          </p>
        </div>
        <div>
          <VideoPlaceholder videoId="V1" note="역사 타임라인 (90초)" />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card eyebrow="최근 6개월" title="Plugins / Skills">
          호출 가능한 절차와 커뮤니티 스킬 생태계가 폭발적으로 확장.
        </Card>
        <Card eyebrow="최근 6개월" title="Subagent / Hook 표준화">
          큰 작업 위임과 자동 트리거가 1급 시민으로 자리 잡음.
        </Card>
        <Card eyebrow="최근 6개월" title="SDK · IDE 통합">
          VS Code · JetBrains · Web · CLI 어디서든 같은 에이전틱 루프.
        </Card>
      </div>
    </ScrollSection>
  );
}
