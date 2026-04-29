import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlayer } from "@/app/components/VideoPlayer";
import { V1Timeline } from "@/remotion/compositions/V1Timeline";
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
        <p className="mt-2 text-ink-muted">4분. 한 줄 정의 → 변곡점 3개 → 오늘 데모를 보는 관점.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.4fr] gap-10 items-start">
        <div className="space-y-6">
          <Callout tone="info" title="한 줄 정의">
            <p className="font-mono text-lg leading-snug">
              Claude Code = 터미널에서 자율적으로 일하는 코드 동료
            </p>
          </Callout>
          <p className="text-ink-soft leading-relaxed">
            “자율적”이란, 한 번 시키면 <strong>스스로 파일을 읽고 / 빌드를 돌리고 / 로그를 보고 / 다음 행동을
            결정</strong>한다는 뜻입니다. 보드 디버깅에서 “레지스터 보고, 가설 세우고, 다시 시도” 하는 루프를
            코드 저장소 위에서 그대로 반복합니다.
          </p>
          <p className="text-ink-soft leading-relaxed">
            오늘 중요한 것은 “모델이 똑똑해졌다”가 아닙니다. <strong>코드를 읽고, 도구를 쓰고, 팀 규칙을
            기억하는 형태</strong>로 바뀌었기 때문에 임베디드 코드베이스에서도 실전성이 생겼습니다.
          </p>
        </div>
        <div>
          <VideoPlayer
            composition={V1Timeline}
            inputProps={{}}
            durationInFrames={90 * 30}
          />
        </div>
      </div>

      {/* 왜 지금 변곡점인가 */}
      <div className="mt-12">
        <h3 className="mb-4 text-xl font-semibold">왜 지금 실전 도구가 됐나</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card eyebrow="2024" title="대화형에서 작업형으로">
            <p>
              한 번 답하는 챗봇에서 끝나지 않고, 도구를 호출해
              <strong> 읽고 → 시도하고 → 관찰하고 → 다시 시도</strong> 하는 작업 루프가 자리 잡았습니다.
            </p>
          </Card>
          <Card eyebrow="2025" title="큰 저장소를 스스로 탐색">
            <p>
              U-Boot 같은 저장소에서도 사람이 관련 파일을 먼저 고르지 않아도 됩니다.
              <strong>grep, 파일 읽기, 연관 추적</strong>을 Claude가 먼저 수행합니다.
            </p>
          </Card>
          <Card eyebrow="2025~2026" title="팀 규칙을 함께 쓴다">
            <p>
              `CLAUDE.md`, Skills, Hooks 로 팀 절차를 반복 가능하게 만들 수 있습니다.
              개인 요령이 아니라 <strong>팀의 작업 방식</strong>으로 붙는다는 점이 변곡점입니다.
            </p>
          </Card>
        </div>
      </div>

      {/* 메모리 컨트롤러 폭 보강 */}
      <div className="mt-10">
        <Callout tone="info" title="오늘 데모는 NAND, 그 다음은?">
          <p className="leading-relaxed">
            라이브 데모는 NAND/MTD 로 보여드리지만, 같은 패턴이 그대로 적용됩니다 — <strong>DDR
            컨트롤러 캘리브레이션 코드</strong>(타이밍 파라미터 표 자동 정리), <strong>PHY 트레이닝 시퀀스</strong>
            (시퀀스 다이어그램·실패 패턴 분류), <strong>부트로더 SPL 사이즈 분석</strong>
            (<code className="font-mono text-xs">.map</code>·<code className="font-mono text-xs">bloat-o-meter</code> 결과 해석).
            “레지스터 ↔ 데이터시트 ↔ 코드” 삼각관계가 있는 작업이면 거의 다 됩니다.
          </p>
        </Callout>
      </div>

      {/* 데모를 볼 때 체크할 것 */}
      <div className="mt-12">
        <h3 className="mb-4 text-xl font-semibold">오늘 데모를 볼 때 체크할 것 3개</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="rounded-md bg-bg-soft px-4 py-3 ring-1 ring-white/5">
            <div className="text-accent text-xs uppercase tracking-wider mb-1">읽기 능력</div>
            대형 C 코드베이스를 의미 단위로 잘게 나누는지. 함수 책임, 비트필드, 레지스터 정의를 따라가는지.
          </div>
          <div className="rounded-md bg-bg-soft px-4 py-3 ring-1 ring-white/5">
            <div className="text-accent text-xs uppercase tracking-wider mb-1">실행 능력</div>
            단순 설명으로 끝나지 않고 <code className="font-mono text-xs">make</code>, 테스트, diff 검토까지 이어지는지.
          </div>
          <div className="rounded-md bg-bg-soft px-4 py-3 ring-1 ring-white/5">
            <div className="text-accent text-xs uppercase tracking-wider mb-1">검토 가능성</div>
            결과가 사람 리뷰를 더 쉽게 만드는지. 완성본보다 <strong>검토 시작점</strong>을 얼마나 끌어올리는지.
          </div>
        </div>
      </div>
    </ScrollSection>
  );
}
