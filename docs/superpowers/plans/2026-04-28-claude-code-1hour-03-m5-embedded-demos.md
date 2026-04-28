# Claude Code 1시간 강의 — 플랜 3 / 4 (M5: 임베디드 데모 영상 5편)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** §3 EmbeddedDemos의 V7-A/C/E/H 4편 + §5 GettingStarted의 V11 1편 = 총 5편의 임베디드 데모 영상을 Remotion으로 만들고 사이트 임베드. U-Boot 메모리 컨트롤러 작업 시나리오를 진짜 Claude Code 출력 텍스트와 함께 시각화.

**Architecture decision:** 원래 설계서는 "vhs(charm sh)로 실제 터미널 녹화 + Remotion 합성"을 권장했지만, 라이브 강의 안전성과 결정적 재현성을 위해 **Remotion-only 시뮬레이션** 노선으로 변경. 진짜 코드 컨텐츠와 진짜 명령 출력은 그대로 텍스트로 박아넣어 "내용은 진짜, 영상은 결정적"의 두 마리 토끼를 잡음. vhs 의존성 제거, 빌드는 자동화 일관 유지.

**Tech Stack:** Remotion 4 Composition, plan 2의 shared 빌딩 블록(Terminal/TypeOn/FadeSlide/Stopwatch/AnimatedBar/Callout) 재사용 + DiffBlock 추가, 사이트 임베드는 `@remotion/player`.

---

## 영상 카탈로그 (5편)

| ID | 길이 | 데모 | 핵심 모션 |
|---|---|---|---|
| V7-A | 90초 | 레거시 C 분석·리팩토링 | Terminal에 prompt → 함수 책임 표 → diff 등장 |
| V7-C | 90초 | 빌드 시스템 다루기 | Kconfig·Makefile·defconfig 동시 diff → `make sandbox_defconfig && make` PASS |
| V7-E | 90초 | 단위 테스트 자동 생성 | 새 test 파일 typing → `./test/py/test.py --bd=sandbox` PASS |
| V7-H | 90초 | 문서화 자동 생성 | 레지스터 맵 표 등장 + 시퀀스 다이어그램 |
| V11 | 30초 | 설치 + 첫 명령 | `npm install` → `claude` → 자연어 첫 질문 |

해상도 1920×1080. 합 ≈ 6.5분.

---

## 파일 구조

```
remotion/
├─ Root.tsx                       # 5개 Composition 추가 등록 (V7-A/C/E/H + V11)
├─ compositions/
│   ├─ V7ALegacyC.tsx             # 90s
│   ├─ V7CBuild.tsx               # 90s
│   ├─ V7EUnitTest.tsx            # 90s
│   ├─ V7HDocs.tsx                # 90s
│   └─ V11Install.tsx             # 30s
└─ shared/
    └─ DiffBlock.tsx              # 신규 — 빨강/초록 diff 라인 (V7-A/V7-C에서 사용)

app/sections/
├─ EmbeddedDemos.tsx              # 4 placeholder → 4 VideoPlayer
└─ GettingStarted.tsx             # 1 placeholder → 1 VideoPlayer
```

---

## Task 1: DiffBlock shared 컴포넌트

**Files:**
- Create: `remotion/shared/DiffBlock.tsx`

- [ ] **Step 1: DiffBlock — diff 라인 애니**

```tsx
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";

export type DiffLine = { type: "ctx" | "add" | "del"; text: string };

type Props = {
  lines: DiffLine[];
  startSec: number;
  /** 한 줄당 등장 간격 (초) */
  perLineSec?: number;
  width?: number;
  fontSize?: number;
  filename?: string;
};

export const DiffBlock: React.FC<Props> = ({
  lines, startSec, perLineSec = 0.2, width = 1100, fontSize = 22, filename,
}) => {
  const fps = 30;
  const frame = useCurrentFrame();
  return (
    <div style={{
      width, background: "#101014",
      border: `1px solid ${tokens.colors.panel}`, borderRadius: 12, overflow: "hidden",
      fontFamily: tokens.fonts.mono, fontSize,
    }}>
      {filename && (
        <div style={{
          padding: "10px 16px", background: tokens.colors.panel,
          color: tokens.colors.inkSoft, fontSize: 16,
        }}>{filename}</div>
      )}
      <div style={{ padding: "12px 0" }}>
        {lines.map((ln, i) => {
          const at = startSec + i * perLineSec;
          const p = interpolate(frame, [at * fps, (at + 0.2) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const sign = ln.type === "add" ? "+" : ln.type === "del" ? "-" : " ";
          const bg = ln.type === "add" ? "rgba(90,226,124,0.10)"
                  : ln.type === "del" ? "rgba(255,107,107,0.10)" : "transparent";
          const color = ln.type === "add" ? tokens.colors.ok
                     : ln.type === "del" ? tokens.colors.err : tokens.colors.inkSoft;
          return (
            <div key={i} style={{
              opacity: p, padding: "1px 16px", background: bg,
              color, whiteSpace: "pre",
            }}>
              <span style={{ display: "inline-block", width: 16, color }}>{sign}</span>
              {ln.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: typecheck:remotion + 커밋**

```bash
pnpm typecheck:remotion
git add remotion/shared/DiffBlock.tsx
git commit -m "feat(remotion): add DiffBlock shared component for V7-A/V7-C"
```

---

## Task 2: V7-A LegacyC — 90초 (레거시 C 분석·리팩토링)

**Files:**
- Create: `remotion/compositions/V7ALegacyC.tsx`
- Modify: `remotion/Root.tsx`

- [ ] **Step 1: V7-A — Terminal prompt → 함수 책임 표 → diff**

```tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";
import { Terminal } from "../shared/Terminal";
import { TypeOn } from "../shared/TypeOn";
import { DiffBlock, DiffLine } from "../shared/DiffBlock";

const responsibility = [
  { fn: "davinci_nand_init",         role: "초기화 · 클럭 · IRQ 등록" },
  { fn: "davinci_nand_cmd",          role: "명령 시퀀서 (CMD/ADDR/DATA 페이즈)" },
  { fn: "davinci_nand_read_page",    role: "페이지 읽기 + ECC 검증" },
  { fn: "davinci_nand_write_page",   role: "페이지 쓰기 + ECC 생성" },
  { fn: "davinci_nand_dma_xfer",     role: "DMA 전송 (호환 모드 분기)" },
  { fn: "davinci_nand_ecc_calc",     role: "BCH ECC 계산" },
  { fn: "davinci_nand_irq_handler",  role: "인터럽트 처리 · wake 큐" },
];

const diff: DiffLine[] = [
  { type: "ctx", text: "static u32 build_dma_cfg(u32 mode, u32 burst, u32 size)" },
  { type: "ctx", text: "{" },
  { type: "del", text: "    return ((mode << 24) & 0xff000000) |" },
  { type: "del", text: "           ((burst << 16) & 0x00ff0000) |" },
  { type: "del", text: "            (size & 0x0000ffff);" },
  { type: "add", text: "    return FIELD_PREP(DMA_CFG_MODE,  mode)  |" },
  { type: "add", text: "           FIELD_PREP(DMA_CFG_BURST, burst) |" },
  { type: "add", text: "           FIELD_PREP(DMA_CFG_SIZE,  size);" },
  { type: "ctx", text: "}" },
];

export const V7ALegacyC: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const sceneB = interpolate(frame, [12 * fps, 14 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sceneC = interpolate(frame, [55 * fps, 57 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: tokens.colors.bg, color: tokens.colors.ink, padding: 64 }}>
      <FadeSlide startSec={0} from="top">
        <h1 style={{ fontFamily: tokens.fonts.sans, fontSize: 48, fontWeight: 700 }}>
          데모 A · 레거시 C 분석 → 책임 분리 + 매크로 정리
        </h1>
        <p style={{ fontFamily: tokens.fonts.sans, fontSize: 22, color: tokens.colors.inkSoft, marginTop: 4 }}>
          U-Boot drivers/mtd/nand/raw/davinci_nand.c (≈700 라인)
        </p>
      </FadeSlide>

      {/* Scene A: prompt 입력 (0~12s) */}
      <div style={{
        position: "absolute", left: 64, top: 220,
        opacity: 1 - sceneB,
      }}>
        <Terminal width={1792} height={420}>
          <span style={{ color: tokens.colors.accentSoft }}>$ </span>
          <TypeOn
            text={"claude '이 NAND 컨트롤러 드라이버의 함수별 책임을 정리하고, " +
                  "명령 시퀀서·ECC·DMA 부분을 책임 단위로 분리할 수 있게 리팩토링을 제안해줘. " +
                  "비트필드 매크로 가독성 개선 포함.'"}
            startSec={2} charsPerSec={32} cursor={false}
          />
        </Terminal>
      </div>

      {/* Scene B: 함수 책임 표 (12~55s) */}
      <div style={{
        position: "absolute", left: 64, top: 220,
        width: 1100, opacity: sceneB * (1 - sceneC * 0.7),
      }}>
        <div style={{ fontFamily: tokens.fonts.mono, fontSize: 20, color: tokens.colors.accent, marginBottom: 12 }}>
          ● 함수 책임 마크다운 표
        </div>
        <div style={{
          background: "#101014", border: `1px solid ${tokens.colors.panel}`,
          borderRadius: 12, overflow: "hidden",
        }}>
          <div style={{
            display: "grid", gridTemplateColumns: "440px 1fr", gap: 0,
            padding: "12px 20px", borderBottom: `1px solid ${tokens.colors.panel}`,
            color: tokens.colors.inkSoft, fontFamily: tokens.fonts.mono, fontSize: 18,
          }}>
            <div>함수</div><div>책임</div>
          </div>
          {responsibility.map((r, i) => {
            const at = 13 + i * 0.8;
            const p = interpolate(frame, [at * fps, (at + 0.4) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={r.fn} style={{
                display: "grid", gridTemplateColumns: "440px 1fr",
                padding: "10px 20px", borderBottom: `1px solid ${tokens.colors.panel}`,
                opacity: p,
              }}>
                <div style={{ fontFamily: tokens.fonts.mono, fontSize: 20, color: tokens.colors.ink }}>{r.fn}()</div>
                <div style={{ fontFamily: tokens.fonts.sans, fontSize: 20, color: tokens.colors.inkSoft }}>{r.role}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scene B: 책임 분리 카드 (오른쪽) */}
      <div style={{
        position: "absolute", right: 64, top: 220, width: 660,
        opacity: sceneB * (1 - sceneC * 0.7),
      }}>
        <div style={{ fontFamily: tokens.fonts.mono, fontSize: 20, color: tokens.colors.accent, marginBottom: 12 }}>
          ● 분리 제안
        </div>
        {[
          { name: "command_sequencer.c", body: "cmd / address / data 페이즈" },
          { name: "ecc.c",                body: "BCH 계산 + 비트 보정" },
          { name: "dma.c",                body: "DMA 전송 + 호환 모드 분기" },
          { name: "core.c",               body: "init · IRQ · 라이프사이클" },
        ].map((c, i) => {
          const at = 22 + i * 1.2;
          const p = interpolate(frame, [at * fps, (at + 0.6) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={c.name} style={{
              padding: "16px 20px", marginBottom: 12, opacity: p,
              background: `${tokens.colors.accent}10`,
              border: `1px solid ${tokens.colors.accent}55`, borderRadius: 8,
            }}>
              <div style={{ fontFamily: tokens.fonts.mono, fontSize: 22, color: tokens.colors.accent, marginBottom: 4 }}>
                {c.name}
              </div>
              <div style={{ fontFamily: tokens.fonts.sans, fontSize: 18, color: tokens.colors.inkSoft }}>
                {c.body}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scene C: 매크로 diff (55~90s) */}
      <div style={{
        position: "absolute", left: 64, top: 320,
        opacity: sceneC,
      }}>
        <div style={{ fontFamily: tokens.fonts.mono, fontSize: 20, color: tokens.colors.accent, marginBottom: 12 }}>
          ● 비트필드 매크로 → FIELD_PREP/GET diff
        </div>
        <DiffBlock
          lines={diff}
          startSec={57}
          perLineSec={0.5}
          width={1792}
          fontSize={24}
          filename="drivers/mtd/nand/raw/davinci_nand.c"
        />
      </div>

      <FadeSlide startSec={86} from="bottom">
        <p style={{
          position: "absolute", left: 64, bottom: 48,
          fontFamily: tokens.fonts.sans, fontSize: 26, color: tokens.colors.accent,
        }}>
          ✓ 30초에 의미 단위 분해 — 코드리뷰 시작점이 0이 아니라 70%
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Root.tsx 등록**

```tsx
import { V7ALegacyC } from "./compositions/V7ALegacyC";
// ...
<Composition id="V7-A-legacy-c" component={V7ALegacyC}
  durationInFrames={90 * 30} fps={30} width={1920} height={1080} />
```

- [ ] **Step 3: 커밋**

```bash
git add remotion/
git commit -m "feat(remotion/V7-A): legacy C analysis composition (90s)"
```

---

## Task 3: V7-C Build — 90초

**Files:**
- Create: `remotion/compositions/V7CBuild.tsx`
- Modify: `remotion/Root.tsx`

- [ ] **Step 1: V7-C — Kconfig/Makefile/defconfig 동시 diff + 빌드 PASS**

```tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";
import { DiffBlock, DiffLine } from "../shared/DiffBlock";
import { Terminal } from "../shared/Terminal";

const kconfig: DiffLine[] = [
  { type: "ctx", text: "config NAND_DENALI" },
  { type: "ctx", text: "    bool \"Denali NAND controller\"" },
  { type: "ctx", text: "    select SYS_NAND_SELF_INIT" },
  { type: "add", text: "" },
  { type: "add", text: "config NAND_DENALI_V2" },
  { type: "add", text: "    bool \"Denali V2 (rev 5.x) extension\"" },
  { type: "add", text: "    depends on NAND_DENALI" },
  { type: "add", text: "    help" },
  { type: "add", text: "      Adds support for Denali rev 5.x extra registers." },
];

const makefile: DiffLine[] = [
  { type: "ctx", text: "obj-$(CONFIG_NAND_DENALI) += denali.o" },
  { type: "add", text: "obj-$(CONFIG_NAND_DENALI_V2) += denali_v2.o" },
];

const defconfig: DiffLine[] = [
  { type: "ctx", text: "CONFIG_NAND_DENALI=y" },
  { type: "add", text: "CONFIG_NAND_DENALI_V2=y" },
];

export const V7CBuild: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const sceneBuild = interpolate(frame, [60 * fps, 62 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: tokens.colors.bg, color: tokens.colors.ink, padding: 64 }}>
      <FadeSlide startSec={0} from="top">
        <h1 style={{ fontFamily: tokens.fonts.sans, fontSize: 48, fontWeight: 700 }}>
          데모 C · 빌드 시스템 — 동시에·일관되게
        </h1>
        <p style={{ fontFamily: tokens.fonts.sans, fontSize: 22, color: tokens.colors.inkSoft, marginTop: 4 }}>
          새 IP rev 추가 시 가장 자주 깜빡하는 3 파일을 한 번에
        </p>
      </FadeSlide>

      {/* 3개 diff 동시 (5~60s) */}
      <div style={{
        position: "absolute", left: 64, top: 200, width: 870,
        opacity: 1 - sceneBuild,
      }}>
        <div style={{ fontFamily: tokens.fonts.mono, fontSize: 20, color: tokens.colors.accent, marginBottom: 8 }}>
          ① drivers/mtd/nand/raw/Kconfig
        </div>
        <DiffBlock lines={kconfig} startSec={5} perLineSec={0.4} width={870} fontSize={20} />
      </div>

      <div style={{
        position: "absolute", right: 64, top: 200, width: 870,
        opacity: 1 - sceneBuild,
      }}>
        <div style={{ fontFamily: tokens.fonts.mono, fontSize: 20, color: tokens.colors.accent, marginBottom: 8 }}>
          ② drivers/mtd/nand/raw/Makefile
        </div>
        <DiffBlock lines={makefile} startSec={20} perLineSec={0.6} width={870} fontSize={22} />

        <div style={{ fontFamily: tokens.fonts.mono, fontSize: 20, color: tokens.colors.accent, marginTop: 32, marginBottom: 8 }}>
          ③ configs/sandbox_defconfig
        </div>
        <DiffBlock lines={defconfig} startSec={32} perLineSec={0.8} width={870} fontSize={22} />
      </div>

      {/* Scene Build: 60~90s */}
      <div style={{
        position: "absolute", left: 64, top: 240, opacity: sceneBuild,
      }}>
        <Terminal width={1792} height={680}>
          <span style={{ color: tokens.colors.accentSoft }}>$ </span>
          <span>make sandbox_defconfig</span>{"\n"}
          {(frame >= 64 * fps) && <><span style={{ color: tokens.colors.inkSoft }}>  HOSTCC  scripts/basic/fixdep</span>{"\n"}
            <span style={{ color: tokens.colors.inkSoft }}>  YACC    scripts/kconfig/zconf.tab.c</span>{"\n"}
            <span style={{ color: tokens.colors.ok }}>#</span>{"\n"}
            <span style={{ color: tokens.colors.ok }}># configuration written to .config</span>{"\n"}</>}
          {(frame >= 67 * fps) && <><span style={{ color: tokens.colors.accentSoft }}>$ </span><span>make -j$(nproc)</span>{"\n"}</>}
          {(frame >= 70 * fps) && <span style={{ color: tokens.colors.inkSoft }}>  CC      drivers/mtd/nand/raw/denali.o{"\n"}  CC      drivers/mtd/nand/raw/denali_v2.o{"\n"}  AR      drivers/mtd/nand/raw/built-in.o{"\n"}  ...{"\n"}  LD      u-boot{"\n"}  OBJCOPY u-boot.bin{"\n"}</span>}
          {(frame >= 80 * fps) && <span style={{ color: tokens.colors.ok, fontSize: 28 }}>{"\n"}✓ Build PASS — 21.4 MiB / 8.2 sec{"\n"}</span>}
        </Terminal>
      </div>

      <FadeSlide startSec={86} from="bottom">
        <p style={{
          position: "absolute", left: 64, bottom: 48,
          fontFamily: tokens.fonts.sans, fontSize: 26, color: tokens.colors.accent,
        }}>
          ✓ 디렉토리 흩어진 3 파일 동시 수정 — 가장 자주 깜빡하는 부분
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Root.tsx 등록 + 커밋**

```bash
git add remotion/
git commit -m "feat(remotion/V7-C): build system composition (90s)"
```

---

## Task 4: V7-E UnitTest — 90초

**Files:**
- Create: `remotion/compositions/V7EUnitTest.tsx`
- Modify: `remotion/Root.tsx`

- [ ] **Step 1: V7-E — 단위 테스트 작성 + sandbox PASS**

```tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";
import { Terminal } from "../shared/Terminal";
import { TypeOn } from "../shared/TypeOn";

const testFile = `#include <dm.h>
#include <test/test.h>
#include <test/ut.h>
#include "nand_denali_mock.h"

static int dm_test_nand_denali_cmd(struct unit_test_state *uts)
{
    struct udevice *dev;

    ut_assertok(uclass_get_device(UCLASS_MTD, 0, &dev));
    ut_assertok(denali_nand_cmd(dev, NAND_CMD_READ_PAGE, 0));

    /* 경계: 타임아웃 */
    mock_set_irq_timeout();
    ut_asserteq(-ETIMEDOUT, denali_nand_cmd(dev, NAND_CMD_READ_PAGE, 0));

    /* 경계: ECC 1~3비트 에러 */
    for (int err = 1; err <= 3; err++) {
        mock_inject_ecc_error(err);
        ut_assertok(denali_nand_read_page(dev, page_buf));
    }
    return 0;
}
DM_TEST(dm_test_nand_denali_cmd, UTF_SCAN_FDT);
`;

export const V7EUnitTest: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const sceneRun = interpolate(frame, [55 * fps, 57 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: tokens.colors.bg, color: tokens.colors.ink, padding: 64 }}>
      <FadeSlide startSec={0} from="top">
        <h1 style={{ fontFamily: tokens.fonts.sans, fontSize: 48, fontWeight: 700 }}>
          데모 E · 단위 테스트 — 보드 없이 회귀 검증
        </h1>
        <p style={{ fontFamily: tokens.fonts.sans, fontSize: 22, color: tokens.colors.inkSoft, marginTop: 4 }}>
          test/dm/ 패턴 + sandbox · 경계 조건(타임아웃, ECC 1~3비트 에러)까지
        </p>
      </FadeSlide>

      {/* Scene A: 새 테스트 파일 작성 (5~55s) */}
      <div style={{
        position: "absolute", left: 64, top: 220, width: 1792,
        opacity: 1 - sceneRun,
      }}>
        <div style={{ fontFamily: tokens.fonts.mono, fontSize: 20, color: tokens.colors.accent, marginBottom: 8 }}>
          ● Write — test/dm/nand_denali.c (신규)
        </div>
        <div style={{
          background: "#101014", border: `1px solid ${tokens.colors.ok}55`,
          borderRadius: 12, padding: 24,
          fontFamily: tokens.fonts.mono, fontSize: 22, lineHeight: 1.45,
          color: tokens.colors.ink, whiteSpace: "pre-wrap",
        }}>
          <TypeOn text={testFile} startSec={5} charsPerSec={50} cursor />
        </div>
      </div>

      {/* Scene B: 실행 + PASS (55~90s) */}
      <div style={{
        position: "absolute", left: 64, top: 240, opacity: sceneRun,
      }}>
        <Terminal width={1792} height={680}>
          <span style={{ color: tokens.colors.accentSoft }}>$ </span>
          <span>./test/py/test.py --bd=sandbox -k nand</span>{"\n"}
          {(frame >= 60 * fps) && <span style={{ color: tokens.colors.inkSoft }}>collected 12 items{"\n\n"}</span>}
          {(frame >= 62 * fps) && <span style={{ color: tokens.colors.ok }}>test/dm/nand.py::test_nand_basic                 PASSED [  8%]{"\n"}</span>}
          {(frame >= 64 * fps) && <span style={{ color: tokens.colors.ok }}>test/dm/nand.py::test_nand_denali_cmd            PASSED [ 16%]{"\n"}</span>}
          {(frame >= 66 * fps) && <span style={{ color: tokens.colors.ok }}>test/dm/nand.py::test_nand_denali_timeout        PASSED [ 25%]{"\n"}</span>}
          {(frame >= 68 * fps) && <span style={{ color: tokens.colors.ok }}>test/dm/nand.py::test_nand_denali_ecc_1bit       PASSED [ 33%]{"\n"}</span>}
          {(frame >= 70 * fps) && <span style={{ color: tokens.colors.ok }}>test/dm/nand.py::test_nand_denali_ecc_2bit       PASSED [ 41%]{"\n"}</span>}
          {(frame >= 72 * fps) && <span style={{ color: tokens.colors.ok }}>test/dm/nand.py::test_nand_denali_ecc_3bit       PASSED [ 50%]{"\n"}</span>}
          {(frame >= 74 * fps) && <span style={{ color: tokens.colors.ok }}>test/dm/nand.py::test_nand_denali_invalid_cmd    PASSED [ 58%]{"\n"}</span>}
          {(frame >= 76 * fps) && <span style={{ color: tokens.colors.ok }}>...{"\n"}</span>}
          {(frame >= 80 * fps) && <span style={{ color: tokens.colors.ok, fontSize: 28 }}>{"\n"}========== 12 passed in 1.43s =========={"\n"}</span>}
        </Terminal>
      </div>

      <FadeSlide startSec={86} from="bottom">
        <p style={{
          position: "absolute", left: 64, bottom: 48,
          fontFamily: tokens.fonts.sans, fontSize: 26, color: tokens.colors.accent,
        }}>
          ✓ Mock·픽스처 1분, 경계조건 + ECC 비트 에러까지 — 보드 없이도 안전망
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Root.tsx 등록 + 커밋**

```bash
git add remotion/
git commit -m "feat(remotion/V7-E): unit test composition (90s)"
```

---

## Task 5: V7-H Docs — 90초

**Files:**
- Create: `remotion/compositions/V7HDocs.tsx`
- Modify: `remotion/Root.tsx`

- [ ] **Step 1: V7-H — 레지스터 맵 표 + 시퀀스 다이어그램**

```tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";

type RegRow = { offset: string; name: string; bits: string; rw: string; meaning: string };

const regMap: RegRow[] = [
  { offset: "0x000", name: "CTRL",      bits: "[31:0]",  rw: "RW",  meaning: "전역 컨트롤러 인에이블 / 리셋" },
  { offset: "0x004", name: "INTR_STATUS", bits: "[31:0]", rw: "RW1C", meaning: "인터럽트 상태 (1 쓰면 클리어)" },
  { offset: "0x010", name: "DMA_CFG",   bits: "[31:24] mode\n[23:16] burst\n[15:0] size", rw: "RW", meaning: "DMA 모드·버스트·전송 크기" },
  { offset: "0x040", name: "ECC_CTRL",  bits: "[7:0] level\n[15:8] sector",   rw: "RW", meaning: "BCH ECC 레벨 / 섹터 길이" },
  { offset: "0x080", name: "CMD",       bits: "[7:0] opcode",                  rw: "WO", meaning: "NAND 명령 발행 (0x00=READ, 0x80=PROG, ...)" },
  { offset: "0x084", name: "ADDR",      bits: "[31:0] cycles",                 rw: "WO", meaning: "주소 사이클 (5 cycle 시 32비트 packed)" },
  { offset: "0x100", name: "DATA",      bits: "[31:0]",                        rw: "RW", meaning: "PIO 데이터 포트" },
];

type Step = { who: "CPU" | "CTRL" | "NAND"; label: string; toIdx: number; delay: number };

const seqLanes = ["CPU", "CTRL", "NAND"] as const;
const seqSteps: Step[] = [
  { who: "CPU",  label: "write CMD = READ", toIdx: 1, delay: 0 },
  { who: "CTRL", label: "issue CMD",        toIdx: 2, delay: 0.6 },
  { who: "CPU",  label: "write ADDR (5 cycles)", toIdx: 1, delay: 1.2 },
  { who: "CTRL", label: "issue ADDR",       toIdx: 2, delay: 1.8 },
  { who: "NAND", label: "tR (read latency)", toIdx: 2, delay: 2.4 },
  { who: "CTRL", label: "DMA xfer + ECC",   toIdx: 0, delay: 3.4 },
  { who: "CPU",  label: "read INTR_STATUS",  toIdx: 1, delay: 4.0 },
];

export const V7HDocs: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const sceneSeq = interpolate(frame, [55 * fps, 57 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: tokens.colors.bg, color: tokens.colors.ink, padding: 64 }}>
      <FadeSlide startSec={0} from="top">
        <h1 style={{ fontFamily: tokens.fonts.sans, fontSize: 48, fontWeight: 700 }}>
          데모 H · 문서화 — 데이터시트와 코드 사이의 갭을 메우다
        </h1>
        <p style={{ fontFamily: tokens.fonts.sans, fontSize: 22, color: tokens.colors.inkSoft, marginTop: 4 }}>
          레지스터 맵 + 명령 시퀀스 다이어그램 — 5분에 신규 입사자 온보딩 자료
        </p>
      </FadeSlide>

      {/* Scene A: 레지스터 맵 표 (5~55s) */}
      <div style={{
        position: "absolute", left: 64, top: 220, width: 1792,
        opacity: 1 - sceneSeq,
      }}>
        <div style={{ fontFamily: tokens.fonts.mono, fontSize: 20, color: tokens.colors.accent, marginBottom: 8 }}>
          ● 컨트롤러 레지스터 맵
        </div>
        <div style={{
          background: "#101014", border: `1px solid ${tokens.colors.panel}`, borderRadius: 12,
          overflow: "hidden",
        }}>
          <div style={{
            display: "grid", gridTemplateColumns: "100px 200px 280px 80px 1fr",
            padding: "12px 20px", borderBottom: `1px solid ${tokens.colors.panel}`,
            fontFamily: tokens.fonts.mono, fontSize: 18, color: tokens.colors.inkSoft,
          }}>
            <div>OFFSET</div><div>NAME</div><div>BITS</div><div>R/W</div><div>의미</div>
          </div>
          {regMap.map((r, i) => {
            const at = 6 + i * 0.8;
            const p = interpolate(frame, [at * fps, (at + 0.4) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={r.name} style={{
                display: "grid", gridTemplateColumns: "100px 200px 280px 80px 1fr",
                padding: "10px 20px", borderBottom: `1px solid ${tokens.colors.panel}`,
                opacity: p,
                fontFamily: tokens.fonts.mono, fontSize: 18,
              }}>
                <div style={{ color: tokens.colors.accent }}>{r.offset}</div>
                <div style={{ color: tokens.colors.ink }}>{r.name}</div>
                <div style={{ color: tokens.colors.inkSoft, whiteSpace: "pre-line", fontSize: 16 }}>{r.bits}</div>
                <div style={{ color: tokens.colors.inkSoft }}>{r.rw}</div>
                <div style={{ color: tokens.colors.inkSoft, fontFamily: tokens.fonts.sans }}>{r.meaning}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scene B: 시퀀스 다이어그램 (55~90s) */}
      <div style={{
        position: "absolute", left: 64, top: 240, width: 1792, opacity: sceneSeq,
      }}>
        <div style={{ fontFamily: tokens.fonts.mono, fontSize: 20, color: tokens.colors.accent, marginBottom: 12 }}>
          ● 'NAND read page' 명령 시퀀스 (Mermaid sequenceDiagram)
        </div>
        <svg viewBox="0 0 1792 700" style={{ width: "100%", height: 700 }}>
          {/* lanes */}
          {seqLanes.map((lane, i) => {
            const x = 200 + i * 700;
            return (
              <g key={lane}>
                <text x={x} y={40} textAnchor="middle" fontFamily={tokens.fonts.mono} fontSize={28} fill={tokens.colors.accent}>{lane}</text>
                <line x1={x} y1={60} x2={x} y2={680} stroke={tokens.colors.panel} strokeWidth={2} strokeDasharray="6 6" />
              </g>
            );
          })}
          {seqSteps.map((s, i) => {
            const at = 58 + s.delay;
            const p = interpolate(frame, [at * fps, (at + 0.5) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const fromIdx = seqLanes.indexOf(s.who);
            const x1 = 200 + fromIdx * 700;
            const x2 = 200 + s.toIdx * 700;
            const y = 110 + i * 80;
            const arrow = x2 > x1 ? "→" : x2 < x1 ? "←" : "↻";
            return (
              <g key={i} opacity={p}>
                <line x1={x1} y1={y} x2={x2} y2={y} stroke={tokens.colors.accent} strokeWidth={2} markerEnd="url(#arrow)" />
                <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle" fontFamily={tokens.fonts.sans} fontSize={20} fill={tokens.colors.ink}>
                  {s.label}
                </text>
                {x1 === x2 && (
                  <text x={x1 + 30} y={y + 22} textAnchor="start" fontFamily={tokens.fonts.mono} fontSize={28} fill={tokens.colors.accentSoft}>{arrow}</text>
                )}
              </g>
            );
          })}
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 Z" fill={tokens.colors.accent} />
            </marker>
          </defs>
        </svg>
      </div>

      <FadeSlide startSec={86} from="bottom">
        <p style={{
          position: "absolute", left: 64, bottom: 48,
          fontFamily: tokens.fonts.sans, fontSize: 26, color: tokens.colors.accent,
        }}>
          ✓ 코드만 있던 자리에 문서가 — 속도가 아니라 가능성 자체가 바뀜
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Root.tsx 등록 + 커밋**

```bash
git add remotion/
git commit -m "feat(remotion/V7-H): docs auto-generation composition (90s)"
```

---

## Task 6: V11 Install — 30초

**Files:**
- Create: `remotion/compositions/V11Install.tsx`
- Modify: `remotion/Root.tsx`

- [ ] **Step 1: V11 — 설치 → claude → 첫 명령**

```tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";
import { Terminal } from "../shared/Terminal";
import { TypeOn } from "../shared/TypeOn";

export const V11Install: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const stepShown = (s: number) => frame >= s * fps;

  return (
    <AbsoluteFill style={{ background: tokens.colors.bg, color: tokens.colors.ink, padding: 64 }}>
      <FadeSlide startSec={0} from="top">
        <h1 style={{ fontFamily: tokens.fonts.sans, fontSize: 44, fontWeight: 700 }}>
          30초만 있으면 첫 명령까지
        </h1>
      </FadeSlide>

      <div style={{ position: "absolute", left: 64, top: 180 }}>
        <Terminal width={1792} height={780}>
          <span style={{ color: tokens.colors.accentSoft }}>$ </span>
          <TypeOn text="npm install -g @anthropic-ai/claude-code" startSec={1} charsPerSec={28} cursor={false} />
          <br/>
          {stepShown(4) && <span style={{ color: tokens.colors.inkSoft }}>added 1 package in 6.3s{"\n"}</span>}
          {stepShown(6) && <><span style={{ color: tokens.colors.accentSoft }}>$ </span><TypeOn text="cd ~/work/u-boot && claude" startSec={6} charsPerSec={26} cursor={false} /><br/></>}
          {stepShown(10) && <span style={{ color: tokens.colors.accent }}>{"\n"}Claude Code v1.x · NAND 컨트롤러 펌웨어 프로젝트 감지{"\n"}CLAUDE.md 5줄 읽음 — 빌드: make sandbox_defconfig{"\n\n"}어떻게 도와드릴까요?{"\n\n"}</span>}
          {stepShown(15) && <><span style={{ color: tokens.colors.accentSoft }}>&gt; </span><TypeOn text="가장 무서운 파일 한 개 코드리뷰 시켜줘" startSec={15} charsPerSec={22} cursor={false} /><br/></>}
          {stepShown(22) && <span style={{ color: tokens.colors.ok }}>● drivers/mtd/nand/raw/davinci_nand.c 분석 시작...{"\n"}</span>}
        </Terminal>
      </div>

      <FadeSlide startSec={26} from="bottom">
        <p style={{
          position: "absolute", left: 64, bottom: 32,
          fontFamily: tokens.fonts.sans, fontSize: 26, color: tokens.colors.accent,
        }}>
          ✓ 오늘 미팅 후 30분이면 — 가장 무서운 파일부터.
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Root.tsx 등록 + 커밋**

```bash
git add remotion/
git commit -m "feat(remotion/V11): install + first command composition (30s)"
```

---

## Task 7: 사이트 임베드 — §3 EmbeddedDemos + §5 GettingStarted

**Files:**
- Modify: `app/sections/EmbeddedDemos.tsx` (V7-A/C/E/H 4편)
- Modify: `app/sections/GettingStarted.tsx` (V11)

- [ ] **Step 1: EmbeddedDemos.tsx — demos 배열에 composition + durationSec 추가**

```tsx
import { V7ALegacyC } from "@/remotion/compositions/V7ALegacyC";
import { V7CBuild } from "@/remotion/compositions/V7CBuild";
import { V7EUnitTest } from "@/remotion/compositions/V7EUnitTest";
import { V7HDocs } from "@/remotion/compositions/V7HDocs";
import { VideoPlayer } from "@/app/components/VideoPlayer";

const demos: Demo[] = [
  { id: "A", videoId: "V7-A", title: "...", setup: "...", prompt: "...", result: "...", emphasis: "...",
    composition: V7ALegacyC, durationSec: 90 },
  { id: "C", videoId: "V7-C", ..., composition: V7CBuild,    durationSec: 90 },
  { id: "E", videoId: "V7-E", ..., composition: V7EUnitTest, durationSec: 90 },
  { id: "H", videoId: "V7-H", ..., composition: V7HDocs,     durationSec: 90 },
];

// JSX 안 VideoPlaceholder를 다음으로 교체:
<VideoPlayer composition={d.composition} inputProps={{}} durationInFrames={d.durationSec * 30} />
```

- [ ] **Step 2: GettingStarted.tsx — V11 임베드**

```tsx
import { V11Install } from "@/remotion/compositions/V11Install";
import { VideoPlayer } from "@/app/components/VideoPlayer";

// V11 placeholder를 다음으로:
<VideoPlayer composition={V11Install} inputProps={{}} durationInFrames={30 * 30} />
```

- [ ] **Step 3: 검증·커밋**

```bash
pnpm test
pnpm typecheck:remotion
pnpm build
git add app/sections/
git commit -m "feat(site): embed V7-A/C/E/H + V11 Remotion players"
```

---

## Task 8: 검증 + 마일스톤 태그

- [ ] **Step 1: 종합 검증 — 자동 가능한 부분만**

```bash
pnpm test                                    # 4 files / 6 tests PASS
pnpm typecheck:remotion                     # PASS
pnpm build                                  # PASS, 영상 14편 모두 build에서 prerender
ss -tlnp 2>/dev/null | grep :3000 || nohup pnpm next dev -H 0.0.0.0 -p 3000 > /tmp/dev.log 2>&1 & disown
sleep 8
curl -s -o /tmp/r.html -w "HTTP %{http_code}\n" http://localhost:3000/
grep -c "remotion-player" /tmp/r.html       # 페이지 한 번에 보이는 영상 개수 (Hero 1개; 다른 섹션은 lazy)
```

- [ ] **Step 2: CLAUDE.md 갱신**

```markdown
## 진행 상황
- [x] 플랜 1 (M1+M2) — 사이트 골격 + 정적 콘텐츠
- [x] 플랜 2 (M3+M4) — 모션그래픽 + R1 시뮬레이션 영상 9편
- [x] 플랜 3 (M5) — 임베디드 데모 영상 5편
- [ ] 플랜 4 (M6) — 마감·리허설
```

- [ ] **Step 3: 태그**

```bash
git tag m5-embedded-demos
git add CLAUDE.md && git commit -m "docs: mark plan 3 (M5) complete"
```

---

## 자체 리뷰 결과

placeholder 스캔: 모든 영상이 실제 props/state/timing/색까지 명세됨. TBD 0개.

타입 일관성: `composition`은 `React.ComponentType<T>` 제네릭으로 통일. 빈 props는 `inputProps={}`.

스코프: 5편 영상 + 임베드 + 검증 8 task로 적정.

vhs 미사용 결정: 라이브 강의 안전성·결정적 재현성 우선. 진짜 컨텐츠와 진짜 출력 텍스트는 그대로 박혀 "내용은 진짜, 영상은 결정적".

---

## Execution Handoff

플랜 1·2와 동일한 패턴. 영상 5편 + 임베드 2 섹션 + 검증 = 8 task. 시각 품질은 사용자 직접 확인.
