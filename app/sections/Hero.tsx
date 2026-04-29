import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlayer } from "@/app/components/VideoPlayer";
import { V0HeroLoop } from "@/remotion/compositions/V0HeroLoop";
import { sections } from "@/app/lib/sections";

const meta = sections.find((s) => s.id === "hero")!;

const agenda: { mins: string; title: string; note: string }[] = [
  { mins: "0~6",   title: "§1 Claude Code 가 뭔가",      note: "한 줄 정의 · 왜 지금이 변곡점인가" },
  { mins: "6~18",  title: "§2 핵심 5 가지",               note: "오늘 바로 쓸 3개 + 나중에 붙일 2개" },
  { mins: "18~42", title: "§3 임베디드 라이브 데모 4 종",  note: "U-Boot NAND 컨트롤러 · 각 6분" },
  { mins: "42~48", title: "§4 그래서 우리가 얻는 것",     note: "처리 속도보다 검토 품질과 밀도" },
  { mins: "48~55", title: "§5 시작하기",                   note: "오늘 30분 · 이번 주 7일" },
  { mins: "55~60", title: "Q & A",                          note: "라이브 우선 6문답" },
];

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
            U-Boot 의 NAND 컨트롤러 드라이버 위에서, 가짜 데모 없이 직접 보여드립니다.
            오늘 끝나면 — 내일 아침 첫 빌드 전에 — 자기 코드로 첫 실험을 돌릴 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-bg-soft px-3 py-1 ring-1 ring-white/10">U-Boot</span>
            <span className="rounded-full bg-bg-soft px-3 py-1 ring-1 ring-white/10">NAND / MTD</span>
            <span className="rounded-full bg-bg-soft px-3 py-1 ring-1 ring-white/10">Kconfig · Makefile</span>
            <span className="rounded-full bg-bg-soft px-3 py-1 ring-1 ring-white/10">DM · sandbox</span>
            <span className="rounded-full bg-bg-soft px-3 py-1 ring-1 ring-white/10">C / 비트필드</span>
          </div>
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

      {/* 60분 어젠다 */}
          <div className="mt-16">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">오늘 60분 흐름</h2>
          <span className="text-xs text-ink-muted">데모 24분 · 설명 31분 · Q&A 5분</span>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {agenda.map((row) => (
            <li
              key={row.mins}
              className="rounded-md bg-bg-soft px-4 py-3 ring-1 ring-white/5"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-accent w-16 shrink-0">{row.mins}</span>
                <div className="min-w-0">
                  <div className="font-semibold leading-tight">{row.title}</div>
                  <div className="mt-1 text-xs text-ink-muted leading-snug">{row.note}</div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* 사전 안내 */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-ink-soft">
        <div className="rounded-md border-l-2 border-accent/50 bg-bg-soft/50 px-4 py-3">
          <div className="text-xs uppercase tracking-wider text-ink-muted mb-1">대상</div>
          메모리 컨트롤러·펌웨어·드라이버를 매일 만지는 엔지니어. AI 도구 경험 무관.
        </div>
        <div className="rounded-md border-l-2 border-accent/50 bg-bg-soft/50 px-4 py-3">
          <div className="text-xs uppercase tracking-wider text-ink-muted mb-1">전제</div>
          본인 PC 에 git 으로 작업 중인 C 프로젝트가 1개 있다면 충분. 별도 준비물 없음.
        </div>
        <div className="rounded-md border-l-2 border-accent/50 bg-bg-soft/50 px-4 py-3">
          <div className="text-xs uppercase tracking-wider text-ink-muted mb-1">결과물</div>
          오늘 30분이면 첫 명령. 이번 주 안에 코드리뷰·단위테스트 워크플로우에 붙일 수 있음.
        </div>
      </div>
    </ScrollSection>
  );
}
