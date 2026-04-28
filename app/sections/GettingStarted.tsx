import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlayer } from "@/app/components/VideoPlayer";
import { CodeBlock } from "@/app/components/CodeBlock";
import { Card } from "@/app/components/Card";
import { Callout } from "@/app/components/Callout";
import { sections } from "@/app/lib/sections";
import { V11Install } from "@/remotion/compositions/V11Install";
import { QRCodeSVG } from "qrcode.react";

const meta = sections.find((s) => s.id === "getting-started")!;

const claudeMdTemplate = `# 우리 프로젝트
이 프로젝트는 NAND 컨트롤러 펌웨어다.

## 빌드/실행
- 빌드: \`make sandbox_defconfig && make -j$(nproc)\`
- 단위테스트: \`./test/py/test.py --bd=sandbox\`

## 관습
- 새 컨트롤러 드라이버는 drivers/mtd/nand/raw/ 에.
- 비트필드는 FIELD_PREP/FIELD_GET 사용.

## 하드웨어 제약
- ECC: BCH-8, OOB 64바이트
- 페이지 크기: 4KB
`;

export function GettingStarted({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <header className="mb-10">
        <div className="text-xs uppercase tracking-wider text-accent">§5</div>
        <h2 className="mt-1 text-4xl font-semibold">{meta.longTitle}</h2>
        <p className="mt-2 text-ink-muted">오늘 미팅 후 30분이면 첫 명령까지.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-8 items-start">
        <div className="space-y-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-muted">V11 · 30초</div>
            <h3 className="mt-1 mb-3 text-xl font-semibold">설치 & 첫 명령</h3>
            <VideoPlayer
              composition={V11Install}
              inputProps={{}}
              durationInFrames={30 * 30}
            />
          </div>
          <Card eyebrow="템플릿" title="CLAUDE.md 첫 5~10줄">
            <CodeBlock lang="markdown">{claudeMdTemplate}</CodeBlock>
          </Card>
        </div>
        <div className="space-y-6">
          <Card eyebrow="오늘 안 해보면 손해" title="체크리스트">
            <ul className="space-y-2 text-ink-soft">
              <li>☐ <code className="font-mono">npm install -g @anthropic-ai/claude-code</code></li>
              <li>☐ 프로젝트 루트에 CLAUDE.md 5줄 작성</li>
              <li>☐ 가장 무서운 파일을 Claude에 코드리뷰 시키기</li>
              <li>☐ 단위테스트 1개 작성 시키기 (sandbox)</li>
            </ul>
          </Card>
          <Callout tone="info" title="더 알고 싶을 때">
            공식 문서 · 사내 슬랙 채널 · vibe-project-lesson(자가학습 28모듈).
          </Callout>
          <div className="rounded-lg bg-bg-soft p-6 ring-1 ring-white/5 grid place-items-center">
            <div className="text-xs uppercase tracking-wider text-ink-muted mb-3">이 강의 페이지</div>
            <QRCodeSVG value="https://example.invalid/claude-code-1hour" size={140} bgColor="#1a1a1f" fgColor="#f5f5f5" />
            <p className="mt-3 text-xs text-ink-muted">발표 직전 실제 URL로 교체</p>
          </div>
        </div>
      </div>
    </ScrollSection>
  );
}
