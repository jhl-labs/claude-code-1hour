import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlayer } from "@/app/components/VideoPlayer";
import { Card } from "@/app/components/Card";
import { Callout } from "@/app/components/Callout";
import { CodeBlock } from "@/app/components/CodeBlock";
import { sections } from "@/app/lib/sections";
import { V7ALegacyC } from "@/remotion/compositions/V7ALegacyC";
import { V7CBuild } from "@/remotion/compositions/V7CBuild";
import { V7EUnitTest } from "@/remotion/compositions/V7EUnitTest";
import { V7HDocs } from "@/remotion/compositions/V7HDocs";

const meta = sections.find((s) => s.id === "embedded-demos")!;

type Demo = {
  id: "A" | "C" | "E" | "H";
  videoId: string;
  title: string;
  setup: string;
  prompt: string;
  result: string;
  emphasis: string;
  composition: React.ComponentType<Record<string, never>>;
  durationSec: number;
};

const demos: Demo[] = [
  {
    id: "A",
    videoId: "V7-A",
    title: "레거시 C 분석·리팩토링",
    setup:
      "U-Boot drivers/mtd/nand/raw/ 의 NAND 컨트롤러 드라이버 (600~800라인, 레거시).",
    prompt:
      "이 NAND 컨트롤러 드라이버의 함수별 책임을 정리하고, 명령 시퀀서·ECC·DMA 부분을 책임 단위로 분리할 수 있게 리팩토링을 제안해줘. 비트필드 매크로 가독성 개선 포함.",
    result:
      "함수 책임 마크다운 표 + Mermaid 다이어그램 + 매크로 → FIELD_PREP/FIELD_GET 변환 diff",
    emphasis:
      "10년 된 코드를 30초에 의미 단위로 분리해 읽음. 코드리뷰 시작점이 0이 아니라 70%.",
    composition: V7ALegacyC,
    durationSec: 90,
  },
  {
    id: "C",
    videoId: "V7-C",
    title: "빌드 시스템 다루기",
    setup: "새 IP rev(가칭 V2) 지원을 위해 Kconfig 옵션·Makefile·defconfig 동시 수정.",
    prompt:
      "CONFIG_NAND_DENALI_V2 Kconfig 옵션 추가. 관련 Makefile, defconfig까지 일관되게. sandbox 빌드가 깨지지 않게.",
    result:
      "Kconfig·Makefile·defconfig 동시 diff + `make sandbox_defconfig && make` 실제 통과",
    emphasis:
      "여러 디렉토리에 흩어진 빌드 파일을 동시에·일관되게. 가장 자주 깜빡하는 부분.",
    composition: V7CBuild,
    durationSec: 90,
  },
  {
    id: "E",
    videoId: "V7-E",
    title: "단위 테스트 자동 생성",
    setup: "NAND 컨트롤러 핵심 함수에 단위테스트가 0개임을 강조.",
    prompt:
      "이 함수의 unit test를 sandbox에서 돌릴 수 있게 작성. 정상 + 경계 조건(타임아웃·잘못된 명령·ECC 비트 1~3개 에러). test/dm/ 패턴 따라서.",
    result:
      "test/dm/nand_<ctrl>.c 신규 + Mock 레지스터 + Kconfig·Makefile 등록 + ./test/py/test.py PASS",
    emphasis:
      "Mock·픽스처가 귀찮아 미루던 단위테스트가 1분에 만들어지고 host에서 돌아감. 보드 없이 회귀 검증.",
    composition: V7EUnitTest,
    durationSec: 90,
  },
  {
    id: "H",
    videoId: "V7-H",
    title: "문서화 자동 생성",
    setup: "데모 A와 같은 드라이버. 문서가 0줄임 강조.",
    prompt:
      "이 드라이버의 컨트롤러 레지스터 맵을 마크다운 표로(오프셋·비트필드·의미). 'NAND read page' 명령 흐름을 Mermaid 시퀀스 다이어그램으로(CPU/컨트롤러/NAND chip).",
    result: "레지스터 맵 표 + Mermaid 시퀀스 다이어그램 + 메모리 트레이닝 흐름도",
    emphasis: "데이터시트와 코드 사이의 갭을 5분에 메움. 속도가 아니라 '안 하던 걸 하게 됨'.",
    composition: V7HDocs,
    durationSec: 90,
  },
];

export function EmbeddedDemos({
  onEnter,
}: {
  onEnter?: (id: typeof meta.id) => void;
}) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <header className="mb-10">
        <div className="text-xs uppercase tracking-wider text-accent">§3</div>
        <h2 className="mt-1 text-4xl font-semibold">{meta.longTitle}</h2>
        <p className="mt-2 text-ink-muted">4종 데모 · 각 ~7분 · U-Boot 메모리 서브시스템</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {demos.map((d) => (
          <Card key={d.id} eyebrow={`데모 ${d.id} · ${d.videoId}`} title={d.title}>
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-6 items-start">
              <div className="space-y-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-ink-muted">Setup</div>
                  <p className="mt-1">{d.setup}</p>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-ink-muted">Prompt</div>
                  <CodeBlock lang="markdown">{d.prompt}</CodeBlock>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-ink-muted">Claude 결과</div>
                  <p className="mt-1 text-ink-soft">{d.result}</p>
                </div>
                <Callout tone="info" title="강사 강조">
                  {d.emphasis}
                </Callout>
              </div>
              <VideoPlayer
                composition={d.composition}
                inputProps={{}}
                durationInFrames={d.durationSec * 30}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="mb-3 text-xl font-semibold">시간 절감 요약</h3>
        <table className="w-full text-sm">
          <thead className="text-ink-muted">
            <tr className="text-left">
              <th className="py-2">데모</th>
              <th className="py-2">사람</th>
              <th className="py-2">Claude Code</th>
              <th className="py-2">절감</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr><td className="py-2">A 분석</td><td>30~60분</td><td>1분 + 검토 5분</td><td className="text-accent">~85%</td></tr>
            <tr><td className="py-2">C 빌드</td><td>30분</td><td>5분</td><td className="text-accent">~80%</td></tr>
            <tr><td className="py-2">E 단위테스트</td><td>2~4시간</td><td>5분 + 검토 10분</td><td className="text-accent">~90%</td></tr>
            <tr><td className="py-2">H 문서화</td><td>1~2일 (안 함이 다반사)</td><td>10분</td><td className="text-accent">0 → 1</td></tr>
          </tbody>
        </table>
        <p className="mt-3 text-xs text-ink-muted">* 데모 실측 후 발표 직전 수치 보정.</p>
      </div>
    </ScrollSection>
  );
}
