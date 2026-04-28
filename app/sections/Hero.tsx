import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlayer } from "@/app/components/VideoPlayer";
import { V0HeroLoop } from "@/remotion/compositions/V0HeroLoop";
import { sections } from "@/app/lib/sections";

const meta = sections.find((s) => s.id === "hero")!;

export function Hero({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-12 items-center">
        <div>
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent">
            메모리 컨트롤러 엔지니어를 위한 60분
          </div>
          <h1 className="text-5xl lg:text-6xl font-semibold leading-tight">
            Claude Code,
            <br />
            <span className="text-accent">1주일</span> 걸리던 일을
            <br />
            <span className="text-accent">1시간</span> 안에.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-soft">
            U-Boot의 NAND 컨트롤러 드라이버 위에서, 가짜 데모 없이 직접 보여드립니다.
          </p>
          <div className="mt-10 text-sm text-ink-muted">↓ 시작</div>
        </div>
        <div className="opacity-90">
          <VideoPlayer
            composition={V0HeroLoop}
            inputProps={{}}
            durationInFrames={15 * 30}
            loop
            controls={false}
          />
        </div>
      </div>
    </ScrollSection>
  );
}
