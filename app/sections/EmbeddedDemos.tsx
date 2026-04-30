import { ScrollSection } from "@/app/components/ScrollSection";
import { Mp4Video } from "@/app/components/Mp4Video";
import { Card } from "@/app/components/Card";
import { Callout } from "@/app/components/Callout";
import { CodeBlock } from "@/app/components/CodeBlock";
import { MarkdownTable } from "@/app/components/MarkdownTable";
import { Mermaid } from "@/app/components/Mermaid";
import { sections } from "@/app/lib/sections";

// ───────────────────────────────────────────────────────────────────────
// 데모별 "Claude 가 실제로 뱉은 결과물" — 영상 캡처가 아니라 실 출력
// ───────────────────────────────────────────────────────────────────────

const demoAResponsibilityTable = `| 함수                 | 영역    | 라인     | 책임                                |
| -------------------- | ------- | -------- | ----------------------------------- |
| denali_cmd_ctrl()    | IO      |  88~142  | command/address strobe 시퀀서       |
| denali_read_buf()    | IO/DMA  | 144~198  | data port FIFO 드레인               |
| denali_write_buf()   | IO/DMA  | 200~254  | data port FIFO 채우기               |
| denali_irq_handler() | IRQ     | 256~320  | INT_STATUS 디스패치 (race risk!)    |
| denali_ecc_correct() | ECC     | 322~398  | 4bit/8bit Hamming · BCH 분기        |
| denali_setup_dma()   | DMA     | 400~462  | descriptor chain 구성               |
| denali_probe()       | probe   | 464~612  | clock·reset·layout 등록             |
| nand_dt_init()       | probe   | 614~698  | DT 노드 → controller config 매핑    |
| denali_remove()      | probe   | 700~736  | 자원 해제 (irq/clk/dma)             |`;

const demoAMermaid = `flowchart LR
  subgraph io_c["io.c — 명령/데이터 시퀀서"]
    A1[denali_cmd_ctrl]
    A2[denali_read_buf]
    A3[denali_write_buf]
  end
  subgraph ecc_c["ecc.c — ECC 분기"]
    B1[denali_ecc_correct]
    B2[denali_irq_handler]
  end
  subgraph probe_c["probe.c — 라이프사이클"]
    C1[denali_probe]
    C2[nand_dt_init]
    C3[denali_remove]
  end
  A1 --> B2
  A2 --> B1
  C1 -. setup .-> A1
  C1 -. setup .-> B1
`;

const demoADiff = `--- a/drivers/mtd/nand/raw/denali.c
+++ b/drivers/mtd/nand/raw/denali.c
@@ -271,15 +271,11 @@ static void denali_irq_handler(struct denali_nand_info *denali)
-       u32 ecc_status = (irq_status >> 4) & 0x0fff;
-       u32 sect       = (irq_status >> 16) & 0xff;
-       bool corr_err  = (irq_status & 0x80000000) ? true : false;
+       u32 ecc_status = FIELD_GET(IRQ_ECC_STATUS_MASK, irq_status);
+       u32 sect       = FIELD_GET(IRQ_SECT_MASK,       irq_status);
+       bool corr_err  = FIELD_GET(IRQ_CORR_ERR,        irq_status);

@@ -22,6 +22,12 @@
+#define IRQ_ECC_STATUS_MASK   GENMASK(15, 4)
+#define IRQ_SECT_MASK         GENMASK(23, 16)
+#define IRQ_CORR_ERR          BIT(31)
`;

const demoCMakefileDiff = `--- a/drivers/mtd/nand/raw/Makefile
+++ b/drivers/mtd/nand/raw/Makefile
@@ -8,3 +8,4 @@ obj-\$(CONFIG_NAND_DENALI)        += denali.o
 obj-\$(CONFIG_NAND_DENALI_DT)     += denali_dt.o
+obj-\$(CONFIG_NAND_DENALI_V2)     += denali_v2.o

--- a/drivers/mtd/nand/raw/Kconfig
+++ b/drivers/mtd/nand/raw/Kconfig
@@ -67,6 +67,14 @@ config NAND_DENALI_DT
        depends on NAND_DENALI
        help
+config NAND_DENALI_V2
+       bool "Support Denali NAND V2 (rev >= 2.4)"
+       depends on NAND_DENALI
+       default n
+       help
+         Enables register layout and ECC table for Denali V2
+         (sandbox + am335x verified).

--- a/configs/sandbox_defconfig
+++ b/configs/sandbox_defconfig
@@ -212,3 +212,4 @@ CONFIG_NAND_DENALI=y
 CONFIG_NAND_DENALI_DT=y
+CONFIG_NAND_DENALI_V2=y
`;

const demoCBuildLog = `\$ make sandbox_defconfig && make -j$(nproc)
  HOSTCC  scripts/basic/fixdep
  ...
  CC      drivers/mtd/nand/raw/denali_v2.o
  AR      drivers/mtd/nand/raw/built-in.a
  LD      u-boot
  Image  Name:   U-Boot 2026.04
  Created:      Wed Apr 29 16:55:21 2026
  Image Type:   sandbox
  Data Size:    8482456 Bytes = 8.09 MiB
size delta vs HEAD~1: +4072 bytes  (V2 ECC table)
warnings: 0
result: PASS

\$ make CROSS_COMPILE=arm-linux-gnueabihf- am335x_evm_defconfig && make -j$(nproc)
  ...
  LD      u-boot
warnings: 0
result: PASS  (cross-compile)`;

const demoEUnitTestCode = `// test/dm/nand_denali.c — Claude 가 신규 작성
#include <dm.h>
#include <dm/test.h>
#include <test/ut.h>

static int dm_test_denali_ready(struct unit_test_state *uts)
{
    struct mtd_info *mtd = mock_denali_setup(uts, 0);
    ut_assertok(mock_denali_wait_ready(mtd, 1));
    ut_asserteq(mock_denali_irq_count(mtd), 1);
    return 0;
}
DM_TEST(dm_test_denali_ready, UTF_DM | UTF_SCAN_FDT);

static int dm_test_denali_4bit_timeout(struct unit_test_state *uts)
{
    struct mtd_info *mtd = mock_denali_setup(uts, 0);
    mock_denali_inject_ecc_err(mtd, /*nbits=*/4);
    mock_denali_set_timeout(mtd, 50);  /* tight bound */
    ut_assertne(mtd_read(mtd, 0, 4096, NULL, buf), 0);
    ut_asserteq(mock_denali_irq_count(mtd), 1);
    return 0;
}
DM_TEST(dm_test_denali_4bit_timeout, UTF_DM | UTF_SCAN_FDT);
// ... ecc_pack / 1bit / 3bit 케이스 동일 패턴`;

const demoETestRun = `\$ ./test/py/test.py --bd=sandbox -k nand
============================= test session starts ==============================
collected 7 items / 5 selected

dm_test_denali_ready          PASS  (3 ms)
dm_test_denali_ecc_pack       PASS  (8 ms)
dm_test_denali_4bit_timeout   PASS  (52 ms)
dm_test_denali_1bit_correct   PASS  (4 ms)
dm_test_denali_3bit_correct   PASS  (5 ms)
============================== 5 passed in 0.18s ==============================

coverage:
  pack_ecc()        100%  (32/32 lines)
  correct_data()     85%  (47/55 lines)  ← 미커버: rare BCH path
  irq dispatch()     78%  (32/41 lines)  ← 미커버: timeout edge`;

const demoHRegisterMap = `| 오프셋 | 레지스터          | 비트     | 의미                                  |
| ------ | ----------------- | -------- | ------------------------------------- |
| 0x000  | DEVICE_ID         | 31:0     | controller revision (0x4 = V2)        |
| 0x010  | CHIP_RESET        | 0        | self-clearing soft reset              |
| 0x040  | ECC_ERR_CNT_4BIT  | 31:0     | 4-bit Hamming err 누적 카운터          |
| 0x044  | ECC_ERR_CNT_BCH   | 31:0     | BCH 보정 카운터                       |
| 0x080  | INT_STATUS        | 31:0     | IRQ 디스패치 — bit별 의미는 표 §아래   |
| 0x100  | DMA_DESC_BASE     | 31:0     | DMA descriptor chain head 물리주소    |
| 0x104  | DMA_BURST_LEN     | 7:0      | AXI burst length (1/4/8/16)           |
| 0x200  | TIMING_CTRL_0     | 31:0     | tCS / tCH / tCLS / tCLH 인코딩        |
| 0x204  | TIMING_CTRL_1     | 31:0     | tWP / tWH / tRP / tREH 인코딩         |
| 0x300  | OOB_LAYOUT        | 15:0     | OOB 64B 안의 ECC 영역 시작 오프셋     |`;

const demoHMermaid = `sequenceDiagram
  autonumber
  participant CPU as CPU (driver)
  participant DRV as denali_read_page
  participant EMIF as EMIF / Controller
  participant CHIP as NAND chip

  CPU->>DRV: read_page(page_addr, buf)
  DRV->>EMIF: cmd READ0 + addr cycles (5)
  EMIF->>CHIP: CLE/ALE strobe + R/B# wait
  CHIP-->>EMIF: data (4KB) + OOB (64B)
  EMIF-->>DRV: DMA descriptor done IRQ
  DRV->>EMIF: ECC_ERR_CNT_* read
  alt 정상
    DRV-->>CPU: buf, no err
  else 1~4bit 보정 가능
    DRV->>DRV: pack_ecc + correct_data
    DRV-->>CPU: buf, corrected_bits=N
  else 5bit+ uncorrectable
    DRV-->>CPU: -EBADMSG
  end
`;

const meta = sections.find((s) => s.id === "embedded-demos")!;

type SceneCue = { at: string; label: string };

type Demo = {
  id: "A" | "C" | "E" | "H";
  videoId: string;
  title: string;
  talkMinutes: string;
  setup: string;
  prompt: string;
  result: string;
  emphasis: string;
  videoSrc: string;
  poster: string;
  /** 영상 안에서 어떤 장면이 언제 나오는지 — 강사가 옆에 붙여 설명할 가이드 */
  scenes: SceneCue[];
  /** 강사가 영상 보는 동안 짚어줄 핵심 한 줄 */
  watchFor: string;
};

const demos: Demo[] = [
  {
    id: "A",
    videoId: "V7-A",
    title: "레거시 C 분석·리팩토링",
    talkMinutes: "6분",
    setup:
      "U-Boot drivers/mtd/nand/raw/ 의 NAND 컨트롤러 드라이버 (600~800라인, 레거시).",
    prompt:
      "이 NAND 컨트롤러 드라이버의 함수별 책임을 정리하고, 명령 시퀀서·ECC·DMA 부분을 책임 단위로 분리할 수 있게 리팩토링을 제안해줘. 비트필드 매크로 가독성 개선 포함.",
    result:
      "함수 책임 마크다운 표 + Mermaid 다이어그램 + 매크로 → FIELD_PREP/FIELD_GET 변환 diff",
    emphasis:
      "10년 된 코드를 30초에 의미 단위로 분리해 읽음. 코드리뷰 시작점이 0이 아니라 70%.",
    videoSrc: "/videos/V7-A-legacy-c.mp4",
    poster: "/videos/posters/V7-A-legacy-c.jpg",
    watchFor:
      "사람이 똑같이 하려면 정독에만 30~60분. Claude는 5번의 도구 호출로 끝냄.",
    scenes: [
      { at: "0:05", label: "wc -l → 840 라인 — 사람이 한 번에 읽기 무리" },
      { at: "0:08", label: "Read · Grep 5번 호출 — 함수 13개 / 매크로 312곳 식별" },
      { at: "0:18", label: "1) 함수 책임 표 9개 — IO / ECC / DMA / probe 4영역" },
      { at: "0:32", label: "2) 3-way 책임 분리 제안 — io.c / ecc.c / probe.c" },
      { at: "0:45", label: "3) 매크로 변환 diff — 0x0fff/>>4 → GENMASK + FIELD_GET" },
      { at: "1:02", label: "5) race condition 식별 — 4bit ECC IRQ-context 위험" },
      { at: "1:15", label: "검증 명령 + 다음 단계 우선순위 4개" },
    ],
  },
  {
    id: "C",
    videoId: "V7-C",
    title: "빌드 시스템 다루기",
    talkMinutes: "6분",
    setup: "새 IP rev(가칭 V2) 지원을 위해 Kconfig 옵션·Makefile·defconfig 동시 수정.",
    prompt:
      "CONFIG_NAND_DENALI_V2 Kconfig 옵션 추가. 관련 Makefile, defconfig까지 일관되게. sandbox 빌드가 깨지지 않게.",
    result:
      "Kconfig·Makefile·defconfig 동시 diff + `make sandbox_defconfig && make` 실제 통과",
    emphasis:
      "여러 디렉토리에 흩어진 빌드 파일을 동시에·일관되게. 가장 자주 깜빡하는 부분.",
    videoSrc: "/videos/V7-C-build.mp4",
    poster: "/videos/posters/V7-C-build.jpg",
    watchFor:
      "Kconfig·Makefile·defconfig 3 파일 동시에. sandbox + am335x 두 보드에서 동시 검증.",
    scenes: [
      { at: "0:03", label: "ls 3 파일 — 수정해야 할 파일 목록 확인" },
      { at: "0:10", label: "Edit 3번 — Kconfig + Makefile + defconfig 동시 수정" },
      { at: "0:25", label: "git diff --stat — 3 파일 18 라인 추가 (의도와 일치)" },
      { at: "0:38", label: "Bash: make sandbox_defconfig && make — 빌드 PASS" },
      { at: "0:52", label: "대체 보드: am335x cross-compile 검증 — warning 0" },
      { at: "1:05", label: "size delta +4072 byte (V2 ECC table) / dependency 정상" },
      { at: "1:12", label: "검증 결과 요약 — 4개 게이트 모두 ✓" },
    ],
  },
  {
    id: "E",
    videoId: "V7-E",
    title: "단위 테스트 자동 생성",
    talkMinutes: "6분",
    setup: "NAND 컨트롤러 핵심 함수에 단위테스트가 0개임을 강조.",
    prompt:
      "이 함수의 unit test를 sandbox에서 돌릴 수 있게 작성. 정상 + 경계 조건(타임아웃·잘못된 명령·ECC 비트 1~3개 에러). test/dm/ 패턴 따라서.",
    result:
      "test/dm/nand_<ctrl>.c 신규 + Mock 레지스터 + Kconfig·Makefile 등록 + ./test/py/test.py PASS",
    emphasis:
      "Mock·픽스처가 귀찮아 미루던 단위테스트가 1분에 만들어지고 host에서 돌아감. 보드 없이 회귀 검증.",
    videoSrc: "/videos/V7-E-unit-test.mp4",
    poster: "/videos/posters/V7-E-unit-test.jpg",
    watchFor:
      "사람은 mock 만들기 귀찮아 미루던 일. Claude는 5 케이스 + coverage까지 한 번에.",
    scenes: [
      { at: "0:03", label: "grep test/dm/ → (no tests yet) — 시작점 확인" },
      { at: "0:10", label: "Write 3번 — test 파일 + Mock 컨트롤러 + Kconfig 등록" },
      { at: "0:30", label: "DM_TEST 5개 작성 — ready / ecc_pack / 4bit_timeout / 1bit / 3bit" },
      { at: "0:50", label: "Bash: ./test/py/test.py --bd=sandbox -k nand → 5 PASSED" },
      { at: "1:05", label: "coverage 매트릭스 — pack_ecc 100%, correct_data 47/55" },
      { at: "1:18", label: "효과: 보드 없이 host 검증 + 경계조건 4종 망라" },
    ],
  },
  {
    id: "H",
    videoId: "V7-H",
    title: "문서화 자동 생성",
    talkMinutes: "6분",
    setup: "데모 A와 같은 드라이버. 문서가 0줄임 강조.",
    prompt:
      "이 드라이버의 컨트롤러 레지스터 맵을 마크다운 표로(오프셋·비트필드·의미). 'NAND read page' 명령 흐름을 Mermaid 시퀀스 다이어그램으로(CPU/컨트롤러/NAND chip).",
    result: "레지스터 맵 표 + Mermaid 시퀀스 다이어그램 + 메모리 트레이닝 흐름도",
    emphasis: "데이터시트와 코드 사이의 갭을 5분에 메움. 속도가 아니라 '안 하던 걸 하게 됨'.",
    videoSrc: "/videos/V7-H-docs.mp4",
    poster: "/videos/posters/V7-H-docs.jpg",
    watchFor:
      "사람은 1~2일 걸려 안 하던 일. Claude는 표 + 다이어그램 + 매트릭스 + 성능표를 동시에.",
    scenes: [
      { at: "0:03", label: "find Documentation/ → 0 — 문서 부재 확인" },
      { at: "0:10", label: "Read · Grep 3번 — 레지스터 정의 + 데이터시트 참조 추출" },
      { at: "0:25", label: "1) EMIF 레지스터 맵 표 — 오프셋·비트필드·의미" },
      { at: "0:40", label: "2) NAND read page Mermaid 시퀀스 — CPU·DRV·EMIF·CHIP" },
      { at: "0:58", label: "3) ECC 모드 Kconfig 매트릭스 — Hamming/BCH 분기" },
      { at: "1:08", label: "5) probe-time 메모리 트레이닝 흐름도" },
      { at: "1:18", label: "6) 성능 카운터 — read_page 98µs / bbt_scan 480ms" },
    ],
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
        <p className="mt-2 text-ink-muted">24분. 4종 데모 · 각 6분 · U-Boot 메모리 서브시스템</p>
      </header>

      <Callout tone="info" title="현장 운영 메모">
        <p className="leading-relaxed">
          각 데모는 <strong>90초 영상 + 4분 해설 + 30초 전환</strong> 기준입니다. 시간이 밀리면 A, C, E는
          반드시 시연하고 H는 결과 화면만 요약해도 전체 메시지는 유지됩니다.
        </p>
      </Callout>

      <div className="mt-6 grid grid-cols-1 gap-6">
        {demos.map((d) => (
          <Card key={d.id} eyebrow={`데모 ${d.id} · ${d.videoId} · ${d.talkMinutes}`} title={d.title}>
            <div className="space-y-6">
              {/* 상단: 영상 (꽉 채움) */}
              <Mp4Video src={d.videoSrc} poster={d.poster} loop />

              {/* 중단: 좌(시나리오) + 우(장면 가이드) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
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
                </div>

                <div className="rounded-md bg-bg-soft px-4 py-4 ring-1 ring-white/5 text-sm">
                  <div className="text-accent uppercase tracking-wider mb-2 text-xs">
                    영상에서 보실 것
                  </div>
                  <p className="text-ink-soft mb-4 leading-relaxed">{d.watchFor}</p>
                  <ul className="space-y-2 text-ink-soft">
                    {d.scenes.map((s) => (
                      <li key={s.at} className="flex gap-3">
                        <span className="font-mono text-accent shrink-0 w-12">{s.at}</span>
                        <span className="text-xs leading-relaxed">{s.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Claude 가 실제로 뱉은 결과물 — 영상에서 다 보이지 않으니 텍스트로 살림 */}
              <DemoResults demoId={d.id} />

              {/* 하단: 강사 강조 */}
              <Callout tone="info" title="강사 강조">
                {d.emphasis}
              </Callout>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="mb-3 text-xl font-semibold" id="time-savings">시간 절감 요약</h3>
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
        <p className="mt-3 text-xs text-ink-muted">
          * 이 표는 “대체로 얼마나 빨라지는가”를 보여주는 용도입니다. 메시지는 절감률보다도
          <strong> 검토 시작점이 올라간다</strong>는 데 있습니다.
        </p>
      </div>
    </ScrollSection>
  );
}

// ───────────────────────────────────────────────────────────────────────
// DemoResults — 데모별 "Claude 가 실제로 뱉은 결과물"
// 영상이 1분 안에 다 못 보여주는 산출물을 페이지에서 텍스트로 살림.
// ───────────────────────────────────────────────────────────────────────

function ResultBlock({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <div className="text-xs uppercase tracking-wider text-accent">{label}</div>
        {description && <div className="text-xs text-ink-muted">{description}</div>}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function DemoResults({ demoId }: { demoId: Demo["id"] }) {
  return (
    <div className="rounded-md ring-1 ring-accent/20 bg-accent/5 px-5 py-5 space-y-5">
      <div className="flex items-baseline justify-between">
        <h4 className="text-base font-semibold">Claude 가 실제로 뱉은 결과물</h4>
        <span className="text-xs text-ink-muted">영상이 짧아 캡처 못 한 산출물을 텍스트로 살림</span>
      </div>

      {demoId === "A" && (
        <>
          <ResultBlock
            label="1) 함수 책임 마크다운 표"
            description="9 개 함수 — IO / ECC / DMA / probe 4 영역으로 분류"
          >
            <MarkdownTable source={demoAResponsibilityTable} />
          </ResultBlock>
          <ResultBlock
            label="2) 3-way 책임 분리 제안"
            description="io.c / ecc.c / probe.c — Mermaid 흐름도 그대로 렌더"
          >
            <div className="rounded-md bg-bg-soft p-4 ring-1 ring-white/5">
              <Mermaid id="demo-a" chart={demoAMermaid} />
            </div>
          </ResultBlock>
          <ResultBlock
            label="3) 매크로 변환 diff"
            description="raw shift/mask → GENMASK + FIELD_GET (가독성·검증 용이성 ↑)"
          >
            <CodeBlock lang="diff">{demoADiff}</CodeBlock>
          </ResultBlock>
          <Callout tone="warn" title="Claude 가 추가로 짚어준 위험 — race condition">
            <p className="text-sm leading-relaxed">
              <code className="font-mono text-xs">denali_irq_handler()</code> 안에서{" "}
              <code className="font-mono text-xs">INT_STATUS</code> 클리어 전에 ECC 카운터를 읽음 — 4-bit
              correctable 이 IRQ 컨텍스트에서 sleeping 함수와 만나면 lost interrupt 가능. 우선순위 1로
              수정 권장.
            </p>
          </Callout>
        </>
      )}

      {demoId === "C" && (
        <>
          <ResultBlock
            label="1) 3 파일 동시 diff"
            description="Kconfig + Makefile + defconfig — 깜빡하기 쉬운 의존성을 한 번에"
          >
            <CodeBlock lang="diff">{demoCMakefileDiff}</CodeBlock>
          </ResultBlock>
          <ResultBlock
            label="2) sandbox + cross-compile 빌드 결과"
            description="두 보드(am335x · sandbox) 모두 통과 + size delta 회수"
          >
            <CodeBlock lang="bash">{demoCBuildLog}</CodeBlock>
          </ResultBlock>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-md bg-bg-soft px-3 py-2 ring-1 ring-white/5">
              <div className="text-xs uppercase tracking-wider text-ink-muted">size delta</div>
              <div className="font-mono mt-1">+4072 byte</div>
              <div className="text-xs text-ink-muted">V2 ECC table</div>
            </div>
            <div className="rounded-md bg-bg-soft px-3 py-2 ring-1 ring-white/5">
              <div className="text-xs uppercase tracking-wider text-ink-muted">warning</div>
              <div className="font-mono mt-1 text-ok">0</div>
              <div className="text-xs text-ink-muted">checkpatch 통과</div>
            </div>
            <div className="rounded-md bg-bg-soft px-3 py-2 ring-1 ring-white/5">
              <div className="text-xs uppercase tracking-wider text-ink-muted">depends on</div>
              <div className="font-mono mt-1">NAND_DENALI</div>
              <div className="text-xs text-ink-muted">의존성 정상</div>
            </div>
          </div>
        </>
      )}

      {demoId === "E" && (
        <>
          <ResultBlock
            label="1) 신규 단위테스트 코드"
            description="test/dm/nand_denali.c — DM_TEST 5 케이스, 첫 두 개만 발췌"
          >
            <CodeBlock lang="c">{demoEUnitTestCode}</CodeBlock>
          </ResultBlock>
          <ResultBlock
            label="2) sandbox 실행 출력 + coverage"
            description="./test/py/test.py --bd=sandbox -k nand"
          >
            <CodeBlock lang="bash">{demoETestRun}</CodeBlock>
          </ResultBlock>
          <Callout tone="ok" title="추가 산출물">
            <p className="text-sm leading-relaxed">
              Claude 가 함께 만들어 준 것: <strong>Mock 컨트롤러</strong>(<code className="font-mono text-xs">test/mock/denali_mock.c</code>),
              <strong> Kconfig 등록</strong>(<code className="font-mono text-xs">CONFIG_NAND_DENALI_TEST</code>),
              <strong> Makefile 라인</strong>. 사람은 5 분 검토만.
            </p>
          </Callout>
        </>
      )}

      {demoId === "H" && (
        <>
          <ResultBlock
            label="1) EMIF 레지스터 맵 표"
            description="오프셋·비트필드·의미 — 데이터시트 vs 코드 갭 메우는 1차 자료"
          >
            <MarkdownTable source={demoHRegisterMap} />
          </ResultBlock>
          <ResultBlock
            label="2) NAND read page Mermaid 시퀀스"
            description="CPU · 드라이버 · EMIF · NAND chip — 정상/보정/uncorrectable 분기까지"
          >
            <div className="rounded-md bg-bg-soft p-4 ring-1 ring-white/5">
              <Mermaid id="demo-h" chart={demoHMermaid} />
            </div>
          </ResultBlock>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-md bg-bg-soft px-3 py-2 ring-1 ring-white/5">
              <div className="text-xs uppercase tracking-wider text-ink-muted">read_page</div>
              <div className="font-mono mt-1">98 µs</div>
              <div className="text-xs text-ink-muted">평균 4KB 페이지</div>
            </div>
            <div className="rounded-md bg-bg-soft px-3 py-2 ring-1 ring-white/5">
              <div className="text-xs uppercase tracking-wider text-ink-muted">bbt_scan</div>
              <div className="font-mono mt-1">480 ms</div>
              <div className="text-xs text-ink-muted">probe 1회</div>
            </div>
            <div className="rounded-md bg-bg-soft px-3 py-2 ring-1 ring-white/5">
              <div className="text-xs uppercase tracking-wider text-ink-muted">ECC 모드</div>
              <div className="font-mono mt-1">Hamming · BCH</div>
              <div className="text-xs text-ink-muted">Kconfig 매트릭스</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
