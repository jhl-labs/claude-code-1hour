import { ScrollSection } from "@/app/components/ScrollSection";
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
      "이 드라이버를 실제로 컴파일하는 보드 설정과 Kconfig 의존성을 찾아줘. 사용할 toolchain과 출력 디렉토리를 명시한 검증 계획을 먼저 제시해줘. 없는 설정을 만들어내지 마.",
    review:
      "최종 .config, 변경 object의 컴파일 여부, 명령의 exit code를 확인합니다. sandbox 성공만으로 DaVinci 하드웨어 지원을 검증했다고 판단하지 않습니다.",
  },
  {
    id: "V7-E-unit-test",
    title: "3 · 테스트 가능한 경계 만들기",
    prompt:
      "MMIO와 순수 계산을 분리할 수 있는 최소 변경을 제안해줘. mock이 실제 코드와 연결되는 방법, 정상·경계·오류 테스트, 빌드 등록을 설명해줘. 실행하지 않은 결과는 PASS라고 적지 마.",
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
        먼저 실제 Claude Code 터미널에서 분석 → 실패 재현 → 수정 → 재검증을
        확인합니다. 작은 독립 C 예제로 흐름을 익힌 뒤 U-Boot NAND 코드로
        범위를 넓힙니다.
      </SectionIntro>
      <RealDemoVideo />
      <h3 className="mt-12 mb-4 text-2xl font-semibold">응용 실습 · U-Boot NAND</h3>
      <p className="rounded bg-bg-soft p-5 leading-relaxed text-ink-soft">
        아래는 직접 실행할 실습 가이드입니다. 예제를 읽고 → 원본 코드와 대조하고
        → 프롬프트를 실행하고 → 검증 범위를 토론하세요. 참고 소스는{" "}
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
          <article key={d.id}>
            <h3 className="text-2xl font-semibold">{d.title}</h3>
            <LessonSlides id={d.id} />
            <h4 className="font-semibold">직접 사용할 요청</h4>
            <p className="mt-2 rounded border-l-2 border-accent bg-bg-soft p-4 leading-relaxed">
              {d.prompt}
            </p>
            <h4 className="mt-5 font-semibold">검토할 것</h4>
            <p className="mt-2 leading-relaxed text-ink-soft">{d.review}</p>
          </article>
        ))}
      </div>
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
