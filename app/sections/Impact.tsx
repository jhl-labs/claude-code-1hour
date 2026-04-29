import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlayer } from "@/app/components/VideoPlayer";
import { Card } from "@/app/components/Card";
import { Callout } from "@/app/components/Callout";
import { sections } from "@/app/lib/sections";
import { V8BeforeAfter } from "@/remotion/compositions/V8BeforeAfter";
import { V9SavingsChart } from "@/remotion/compositions/V9SavingsChart";

const meta = sections.find((s) => s.id === "impact")!;

const audiences = [
  { who: "시니어", gain: "혼자 읽던 코드를 둘이 읽는 효과. 본인 직관을 더 빨리 diff와 리뷰 코멘트로 바꿀 수 있습니다." },
  { who: "주니어", gain: "작은 질문을 바로 던질 상대가 생깁니다. 막히는 시간을 줄이고 리뷰 전에 한 번 더 정리할 수 있습니다." },
  { who: "리더", gain: "문서화와 온보딩이 별도 프로젝트가 아니라 코드 변경의 부산물로 붙습니다. 팀 표준화 속도가 빨라집니다." },
];

type DayRow = { time: string; before: string; after: string };

const dayBeforeAfter: DayRow[] = [
  { time: "09:00", before: "어제 빌드 깨진 거 원인 추적 — 3시간",                         after: "Claude 가 git bisect + Kconfig 변경 추적 → 로그 받기 — 20분" },
  { time: "11:00", before: "신규 IP rev 지원 패치 — Kconfig·Makefile·defconfig 수동 수정", after: "“V2 추가” 한 번으로 3 파일 동시 수정 + sandbox 검증" },
  { time: "14:00", before: "이번 주 PR 코드리뷰 5건 — 정독 30분 × 5",                     after: "1차 검토는 자동, 사람은 race·hardware 가정만 집중 — 50분" },
  { time: "16:30", before: "단위테스트·문서화는 다음 주에…",                              after: "테스트 1개 + 레지스터 맵 문서 생성 — 20분" },
];

export function Impact({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <header className="mb-10">
        <div className="text-xs uppercase tracking-wider text-accent">§4</div>
        <h2 className="mt-1 text-4xl font-semibold">{meta.longTitle}</h2>
        <p className="mt-2 text-ink-muted">6분. 핵심은 인원 감축이 아니라 처리 속도와 검토 품질의 재배치입니다.</p>
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
            내 일이 사라지는 것이 아니라 내 일의 <em className="text-accent not-italic">밀도</em>가 올라갑니다.
            반복 작업은 위임하고, 사람은 <strong>race condition · 하드웨어 진실 · 아키텍처 결정 · 요구사항
            협상</strong> 같은 어려운 판단에 시간을 씁니다.
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
        <Card eyebrow="팀 효과" title="회의 → 결정">
          <p>
            “이거 어떻게 하지” 회의 시간이 짧아짐. 회의 들어가기 전에 옵션 3개와 trade-off 표가
            준비됨. 회의는 결정만.
          </p>
        </Card>
        <Card eyebrow="팀 효과" title="리뷰 → 깊은 리뷰">
          <p>
            1차 검토(스타일·dead code·obvious bug)는 자동. 사람은 race·하드웨어 가정·확장성 같은
            진짜 어려운 문제만.
          </p>
        </Card>
        <Card eyebrow="팀 효과" title="문서 → 부산물">
          <p>
            문서화가 별도 작업이 아니라 코드 변경의 부산물. 데이터시트와 코드의 갭이 사라지면
            온보딩이 가벼워짐.
          </p>
        </Card>
      </div>

      {/* 누가 가장 이득 */}
      <div className="mt-10">
        <h3 className="mb-3 text-xl font-semibold">누가 가장 빨리 체감하는가</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <li>· “일정이 절반”이 아니라 “같은 시간에 더 많은 가치”라는 점을 조직에 정확히 설명해야 합니다.</li>
            <li>· CLAUDE.md 가 부실하면 Claude 가 환각. 도구의 한계가 아니라 컨텍스트의 한계.</li>
          </ul>
        </Callout>
      </div>
    </ScrollSection>
  );
}
