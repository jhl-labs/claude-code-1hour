import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlayer } from "@/app/components/VideoPlayer";
import { Card } from "@/app/components/Card";
import { Callout } from "@/app/components/Callout";
import { sections } from "@/app/lib/sections";
import { V8BeforeAfter } from "@/remotion/compositions/V8BeforeAfter";
import { V9SavingsChart } from "@/remotion/compositions/V9SavingsChart";

const meta = sections.find((s) => s.id === "impact")!;

const audiences = [
  { who: "시니어",   gain: "혼자 보던 코드를 둘이 보는 효과 — 검토자 역할로 격상. 머릿속의 직관이 리뷰 코멘트 형태로 더 빠르게 후배에게 전달됨." },
  { who: "주니어",   gain: "베테랑 옆에서 일하는 환경 — 쉬운 질문이 쉬워짐. “이 매크로는 왜 이렇게 생겼나요?”를 두려움 없이." },
  { who: "PL/리더",  gain: "문서화·온보딩이 비용이 아니라 부산물. 신규 입사자 첫 주 진입 비용이 크게 감소." },
  { who: "리뷰어",   gain: "리뷰 시작점이 0% → 70%. 사람은 race·hardware-truth·아키텍처 같은 진짜 어려운 문제에 집중." },
];

type DayRow = { time: string; before: string; after: string };

const dayBeforeAfter: DayRow[] = [
  { time: "09:00", before: "어제 빌드 깨진 거 원인 추적 — 3시간",                         after: "Claude 가 git bisect + Kconfig 변경 추적 → 로그 받기 — 20분" },
  { time: "11:00", before: "신규 IP rev 지원 패치 — Kconfig·Makefile·defconfig 수동 수정", after: "“V2 추가” 한 번으로 3 파일 동시 수정 + sandbox 검증" },
  { time: "14:00", before: "이번 주 PR 코드리뷰 5건 — 정독 30분 × 5",                     after: "Subagent 로 1차 검토 → 사람은 race·hardware 만 검토 — 50분" },
  { time: "16:00", before: "단위테스트는 다음 주에…",                                     after: "5 케이스 + Mock 자동 생성 → sandbox PASS — 10분" },
  { time: "17:30", before: "데이터시트 vs 코드 갭 메우는 문서화 — 안 함",                  after: "레지스터 맵 표 + Mermaid 시퀀스 자동 — 15분" },
];

export function Impact({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <header className="mb-10">
        <div className="text-xs uppercase tracking-wider text-accent">§4</div>
        <h2 className="mt-1 text-4xl font-semibold">{meta.longTitle}</h2>
        <p className="mt-2 text-ink-muted">한 마디: 도구가 아니라 “동시에 일하는 한 명의 동료”.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-muted">V8 · 90초</div>
          <h3 className="mt-1 mb-3 text-xl font-semibold">Before / After</h3>
          <VideoPlayer
            composition={V8BeforeAfter}
            inputProps={{}}
            durationInFrames={90 * 30}
          />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-muted">V9 · 60초</div>
          <h3 className="mt-1 mb-3 text-xl font-semibold">시간 절감 차트</h3>
          <VideoPlayer
            composition={V9SavingsChart}
            inputProps={{}}
            durationInFrames={60 * 30}
          />
        </div>
      </div>

      {/* 핵심 메시지 — 감소 아니라 밀도 */}
      <div className="mt-10">
        <Callout tone="info" title="핵심 메시지">
          <p className="leading-relaxed">
            내 일이 줄어드는 게 아니라 내 일의 <em className="text-accent not-italic">밀도</em>가 올라갑니다.
            손이 가는 작업(빌드 파일 수정·매크로 변환·boilerplate 테스트)은 위임하고, 사람만 할 수
            있는 일에 시간을 더 쓰게 됩니다 — <strong>race condition · 하드웨어 진실 · 아키텍처 결정 ·
            요구사항 협상</strong>.
          </p>
        </Callout>
      </div>

      {/* 하루 비교 표 */}
      <div className="mt-10">
        <h3 className="mb-3 text-xl font-semibold">엔지니어의 하루는 이렇게 바뀐다</h3>
        <div className="overflow-x-auto rounded-md ring-1 ring-white/5 bg-bg-soft">
          <table className="w-full text-sm">
            <thead className="text-ink-muted">
              <tr className="text-left">
                <th className="px-4 py-3 w-20">시각</th>
                <th className="px-4 py-3">Before — 지금</th>
                <th className="px-4 py-3">After — Claude Code 도입 후</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {dayBeforeAfter.map((row) => (
                <tr key={row.time}>
                  <td className="px-4 py-3 font-mono text-accent text-xs align-top">{row.time}</td>
                  <td className="px-4 py-3 text-ink-soft align-top leading-relaxed">{row.before}</td>
                  <td className="px-4 py-3 align-top leading-relaxed">{row.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          * 회의·디버그·문서·리뷰 슬롯이 재배치됨. 보드·디버거·로직 애널라이저와 만나는 시간은 오히려 늘어남.
        </p>
      </div>

      {/* 일주일 단위 효과 */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card eyebrow="주 단위" title="회의 → 결정">
          <p>
            “이거 어떻게 하지” 회의 시간이 짧아짐. 회의 들어가기 전에 옵션 3개와 trade-off 표가
            준비됨. 회의는 결정만.
          </p>
        </Card>
        <Card eyebrow="주 단위" title="리뷰 → 깊은 리뷰">
          <p>
            1차 검토(스타일·dead code·obvious bug)는 자동. 사람은 race·하드웨어 가정·확장성 같은
            진짜 어려운 문제만.
          </p>
        </Card>
        <Card eyebrow="주 단위" title="문서 → 부산물">
          <p>
            문서화가 별도 작업이 아니라 코드 변경의 부산물. 데이터시트와 코드의 갭이 사라지면
            온보딩이 가벼워짐.
          </p>
        </Card>
      </div>

      {/* 누가 가장 이득 */}
      <div className="mt-10">
        <h3 className="mb-3 text-xl font-semibold">누가 가장 이득을 보는가</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {audiences.map((a) => (
            <Card key={a.who} eyebrow="대상" title={a.who}>
              {a.gain}
            </Card>
          ))}
        </div>
      </div>

      {/* 함정 — 안 변하는 것 */}
      <div className="mt-10">
        <Callout tone="warn" title="안 변하는 것 — 솔직한 면">
          <ul className="space-y-1.5 text-sm leading-relaxed">
            <li>· 보드 위에서 마지막 검증은 여전히 사람. AI 가 대신 못 만짐.</li>
            <li>· 데이터시트 의역·하드웨어 진실(설계자 의도) 은 사람만 압니다.</li>
            <li>· “일정이 절반”이 아니라 “같은 시간에 더 많은 가치” — 매니저에게 전할 메시지를 정확히.</li>
            <li>· CLAUDE.md 가 부실하면 Claude 가 환각. 도구의 한계가 아니라 컨텍스트의 한계.</li>
          </ul>
        </Callout>
      </div>
    </ScrollSection>
  );
}
