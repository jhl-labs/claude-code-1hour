import { ScrollSection } from "@/app/components/ScrollSection";
import { PracticeVideo } from "@/app/components/PracticeVideo";
import { RealDemoVideo } from "@/app/components/RealDemoVideo";
import { LessonSlides } from "@/app/components/LessonSlides";
import { SectionIntro } from "@/app/components/SectionIntro";
import { CodeBlock } from "@/app/components/CodeBlock";
import { Mermaid } from "@/app/components/Mermaid";
import { sections } from "@/app/lib/sections";
const meta = sections[3];
const demos = [
  {
    id: "V7-A-legacy-c",
    title: "1 · 레거시 C 분석",
    prompt:
      "drivers/mtd/nand/raw/davinci_nand.c의 ECC 계산·보정·ready 경로를 분석해줘. 파일·함수·근거 위치를 붙이고 MMIO 접근과 순수 계산을 구분해줘. 아직 수정하지 마.",
    review:
      "함수명·분기·레지스터 접근을 고정한 커밋의 원본과 대조합니다. 책임 분리는 제안일 뿐 동작 동등성의 증거가 아닙니다.",
  },
  {
    id: "V7-C-build",
    title: "2 · 빌드 설정과 결과 검토",
    prompt:
      "da850evm_nand_defconfig의 NAND_DAVINCI 설정을 확인하고 arm-linux-gnueabi-와 별도 O= 출력 디렉토리로 davinci_nand.o를 실제 컴파일해줘. 생성 .config와 file 결과를 확인하고 보드 미검증 항목을 보고해줘.",
    review:
      "최종 .config, 변경 object의 컴파일 여부, 명령의 exit code를 확인합니다. sandbox 성공만으로 DaVinci 하드웨어 지원을 검증했다고 판단하지 않습니다.",
  },
  {
    id: "V7-E-unit-test",
    title: "3 · 테스트 가능한 경계 만들기",
    prompt:
      "1-bit ECC의 비트 포장만 helper로 추출하고 드라이버와 호스트 테스트가 같은 함수를 사용하게 해줘. 경계값·reserved bit·독립 기준 계산을 검사하고, 마스크를 일부러 바꾼 mutant가 assertion으로 실패하는지 확인해줘. 1-bit 설정에서 ARM 컴파일도 확인해줘.",
    review:
      "테스트가 의도한 오류를 실제로 잡는지 먼저 확인합니다. 드라이버의 static 함수나 하드웨어 ECC 함수를 다른 파일에서 임의 호출하지 않습니다.",
  },
  {
    id: "V7-H-docs",
    title: "4 · 근거가 있는 문서화",
    prompt:
      "davinci_nand.c와 관련 헤더·doc/를 읽고 호출 흐름을 문서화해줘. 레지스터 항목에는 코드 위치와 데이터시트 절을 붙여줘. 사양서를 못 찾으면 미확인으로 표시해줘.",
    review:
      "사양서 버전과 소스 커밋을 기록합니다. offset·ECC 방식·DMA 동작을 다른 컨트롤러에서 가져오지 않습니다. Mermaid 렌더 결과도 원본 코드와 대조합니다.",
  },
];
export function EmbeddedDemos({
  onEnter,
}: {
  onEnter?: (id: typeof meta.id) => void;
}) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <SectionIntro
        label="§3 · 24분 · 시연 → 코드 검토 → 직접 실습"
        title="실제 작업을 보고, 내 코드에 적용하기"
      >
        같은 U-Boot 소스로 분석 → ARM 교차 컴파일 → 테스트 작성·실행 → 문서화를
        직접 수행했습니다. 각 실습의 실제 Claude Code 영상을 보고, 같은
        요청을 실행한 뒤 결과를 비교하세요.
      </SectionIntro>
      <nav aria-label="실습 시연 목록" className="my-6 grid gap-3 sm:grid-cols-2">
        {demos.map(d=><a key={d.id} href={`#practice-${d.id}`} className="rounded-lg border border-accent/30 bg-bg-soft p-4 text-accent">{d.title} · 실제 시연 ↓</a>)}
      </nav>
      <p className="rounded bg-bg-soft p-5 leading-relaxed text-ink-soft">
        실제 시연 → 요청과 검토 기준 → 직접 실습 순서로 진행합니다.
        보드 실행 없이 확인한 범위는 각 영상 아래에 명시했습니다. 기준 소스는{" "}
        <a
          href="https://github.com/u-boot/u-boot/blob/v2026.01/drivers/mtd/nand/raw/davinci_nand.c"
          className="text-accent underline"
        >
          U-Boot v2026.01
        </a>
        입니다. 실제 작업에서는 git rev-parse HEAD로 정확한 커밋을 남기세요.
      </p>
      <div className="mt-10 space-y-12">
        {demos.map((d) => (
          <article key={d.id} id={`practice-${d.id}`} className="scroll-mt-6">
            <h3 className="text-2xl font-semibold">{d.title}</h3>
            <PracticeVideo id={d.id} />
            <details className="my-5 rounded-lg border border-white/10 p-4"><summary className="cursor-pointer text-ink-soft">단계별 설명 슬라이드 펼치기</summary><LessonSlides id={d.id} /></details>
            <h4 className="font-semibold">직접 사용할 요청</h4>
            <p className="mt-2 rounded border-l-2 border-accent bg-bg-soft p-4 leading-relaxed">
              {d.prompt}
            </p>
            <h4 className="mt-5 font-semibold">검토할 것</h4>
            <p className="mt-2 leading-relaxed text-ink-soft">{d.review}</p>
          </article>
        ))}
      </div>
      <details className="mt-10 rounded-lg bg-bg-soft p-6"><summary className="cursor-pointer text-xl font-semibold">처음이라면 · 작은 C 예제 50초 워밍업</summary><RealDemoVideo /></details>
      <details className="mt-10 rounded-lg bg-bg-soft p-6">
        <summary className="cursor-pointer text-xl font-semibold">
          실행 가능한 작은 테스트와 문서 예제
        </summary>
        <p className="my-4 leading-relaxed">
          다음 코드는 하위12비트를 추출하는 독립 교육 예제입니다. U-Boot
          드라이버의 ECC·MMIO·보드 동작을 검증하지 않습니다. 저장소의
          demos/examples/bitfield_test.c와 같은 내용입니다.
        </p>
        <CodeBlock lang="c">{`#include <assert.h>
static unsigned low12(unsigned raw) { return raw & 0x0fffu; }
int main(void) {
    assert(low12(0u) == 0u);
    assert(low12(0xfaaafbbbu) == 0xbbbu);
    assert(low12(0xffffffffu) == 0xfffu);
    assert(low12(0xfffff000u) == 0u);
    return 0;
}`}</CodeBlock>
        <CodeBlock lang="bash">{`cc -std=c11 -Wall -Wextra -Werror demos/examples/bitfield_test.c -o /tmp/bitfield-test
/tmp/bitfield-test`}</CodeBlock>
        <p className="my-4">
          개념도: 실제 함수의 순서·분기를 확인한 후 아래 구조를 구체화하세요.
        </p>
        <Mermaid
          chart={`flowchart LR
  A[명령 설정] --> B[ready 대기]
  B --> C[데이터 읽기]
  C --> D[ECC 상태 확인]
  D --> E[보정 또는 오류 반환]`}
        />
      </details>
    </ScrollSection>
  );
}
