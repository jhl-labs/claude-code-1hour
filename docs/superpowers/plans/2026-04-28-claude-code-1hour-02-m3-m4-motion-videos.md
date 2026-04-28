# Claude Code 1시간 강의 — 플랜 2 / 4 (M3·M4: 모션그래픽 + R1 시뮬레이션 영상 9편)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hero·§1·§2·§4의 영상 자리(V0/V1/V2/V3/V4/V5/V6/V8/V9) 9편을 Remotion Composition으로 만들고, 사이트의 `VideoPlaceholder`를 실제 `VideoPlayer`로 교체한다. 임베디드 데모 영상(V7-A/C/E/H, V11)은 플랜 3에서 처리.

**Architecture:** Remotion 5(실제 4.0.452) Composition을 9개 추가 등록(`remotion/Root.tsx`). 공통 모션 요소(터미널 시뮬레이션, 스톱워치, 막대 차트, 콜아웃)는 `remotion/shared/`에 분리해 영상 간 재사용. 사이트는 섹션 파일에서 `VideoPlaceholder` 임포트를 `VideoPlayer`로 바꾸면서 해당 Composition 모듈을 동적으로 가져와 `composition` prop에 전달. 영상은 `@remotion/player`로 브라우저에서 직접 재생 — mp4 export 불필요.

**Tech Stack:** Remotion 4 (Composition·useCurrentFrame·spring·interpolate), `@remotion/player`, React 19, TypeScript, Tailwind CSS (영상 외 UI), Pretendard/Inter/JetBrains Mono.

---

## 영상 카탈로그 (9편)

| ID | 길이(초) | fps | 형식 | 핵심 모션 |
|---|---|---|---|---|
| V0 | 15초(루프) | 30 | Remotion 합성 | Hero 배경. 글리치 + 코드 라인 흐름. 순수 모션그래픽 (실 데모 클립은 플랜 4에서 합성 가능) |
| V1 | 90초 | 30 | 순수 Remotion | Anthropic 2021 → Claude 1/2/3 → Claude Code 2025-02 → 2026 현재 타임라인 |
| V2 | 60초 | 30 | R1 터미널 시뮬레이션 | `claude` 실행 → 자연어 프롬프트 → 사고/도구/관찰 루프 시각화 |
| V3 | 45초 | 30 | Remotion 모션그래픽 | "빈 프로젝트" → CLAUDE.md 작성 → 다음 세션이 이미 알고 시작 |
| V4 | 60초 | 30 | R1 터미널 시뮬레이션 | Read/Edit/Bash/Grep 도구 호출이 차례로 떠오름 |
| V5 | 60초 | 30 | Remotion 다이어그램 | Claude Code ↔ 외부 시스템 연결 — 노드 점진적 등장 |
| V6 | 90초 | 30 | Remotion 모션그래픽 | Skills / Subagents / Hooks 세 개념 각 30초 |
| V8 | 90초 | 30 | Remotion 분할화면 | 사람 vs Claude 같은 작업 — 27분 vs 2분 30초 스톱워치 |
| V9 | 60초 | 30 | 순수 Remotion 차트 | "코드 이해 -85%, 단위테스트 -90%, 문서화 0→1" 막대 그래프 애니 |

해상도 모두 1920×1080. 영상 합계 ≈ 9.5분 (Hero 루프 제외 시 ~9분).

---

## 파일 구조

```
remotion/
├─ Root.tsx                       # 10개 Composition 등록 (placeholder 1 + V0~V9 9개)
├─ index.ts                       # 변경 없음
├─ tokens.ts                      # 변경 없음 (이미 G2에서 정의)
├─ compositions/
│   ├─ V0HeroLoop.tsx             # 15초, 루프
│   ├─ V1Timeline.tsx             # 90초
│   ├─ V2CliLoop.tsx              # 60초
│   ├─ V3ClaudeMd.tsx             # 45초
│   ├─ V4Tools.tsx                # 60초
│   ├─ V5Mcp.tsx                  # 60초
│   ├─ V6SkillsSubagentsHooks.tsx # 90초
│   ├─ V8BeforeAfter.tsx          # 90초
│   └─ V9SavingsChart.tsx         # 60초
└─ shared/                        # 공용 영상 컴포넌트
    ├─ Terminal.tsx               # 터미널 창 + 타이핑 애니 + ANSI 컬러
    ├─ Stopwatch.tsx              # 디지털 스톱워치 (분:초)
    ├─ AnimatedBar.tsx            # 막대 차트 애니 1줄
    ├─ Callout.tsx                # 영상용 콜아웃 박스
    ├─ FadeSlide.tsx              # 페이드 + 슬라이드 진입 헬퍼
    ├─ TypeOn.tsx                 # 글자 타이핑 애니
    └─ utils.ts                   # easing, useFrameProgress 등 헬퍼

app/sections/
├─ Hero.tsx                       # V0 임베드
├─ History.tsx                    # V1 임베드
├─ Features.tsx                   # V2~V6 임베드
├─ Impact.tsx                     # V8/V9 임베드
└─ (EmbeddedDemos.tsx, GettingStarted.tsx, QA.tsx 변경 없음 — 플랜 3에서 V7/V11)
```

원칙: 한 영상 = 한 Composition 파일. shared/는 모션 빌딩 블록 — 재사용 우선. 영상 간 텍스트 콘텐츠는 컴포넌트 내부 const로 두지만 절감 차트(V9)는 plan 1의 표 데이터를 import 또는 재정의(YAGNI 차원에서 V9 자체에 const).

---

## 디자인 토큰 (영상 공통)

`remotion/tokens.ts` (이미 G2에서 정의됨). 모든 영상에서 다음 보장:
- 배경 `#0a0a0a` (Hero) / `#141414` (panel feel)
- 강조 색 `#e4843c` (accent), 보조 `#f2a268` (accent soft)
- 임베디드 톤 `#0d1b2a` (midnight) — V8 Before 사이드, V5 외부 시스템 사이드
- ok `#5ae27c` / err `#ff6b6b` — V8 결과, V9 다른 색 막대
- 폰트: 본문 `Pretendard Variable, Inter` / 코드 `JetBrains Mono`
- 이징: `[0.22, 1, 0.36, 1]` (smooth)

타이핑 속도 약 40 wpm × 1.3 (`tokens.fps` 기준 약 9 chars/초).

---

## Task 1: Remotion shared 빌딩 블록 추가

**Files:**
- Create: `remotion/shared/utils.ts`
- Create: `remotion/shared/FadeSlide.tsx`
- Create: `remotion/shared/TypeOn.tsx`
- Create: `remotion/shared/Terminal.tsx`
- Create: `remotion/shared/Stopwatch.tsx`
- Create: `remotion/shared/AnimatedBar.tsx`
- Create: `remotion/shared/Callout.tsx`

- [ ] **Step 1: utils.ts**

```ts
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { tokens } from "../tokens";

export const SMOOTH = tokens.ease.smooth;

/** 0~1 진행도. fromFrame 시작, 길이 lengthFrames. */
export function useProgress(fromFrame: number, lengthFrames: number) {
  const frame = useCurrentFrame();
  return interpolate(frame, [fromFrame, fromFrame + lengthFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * t * (3 - 2 * t),
  });
}

/** 시간(초) → 프레임 수 (composition fps 기준) */
export function useFps() {
  return useVideoConfig().fps;
}

export function secondsToFrames(seconds: number, fps: number) {
  return Math.round(seconds * fps);
}
```

- [ ] **Step 2: FadeSlide.tsx — 간단한 진입 헬퍼**

```tsx
import React from "react";
import { useProgress } from "./utils";

type Props = {
  startSec: number;
  durationSec?: number;
  from?: "left" | "right" | "bottom" | "top";
  distance?: number;
  children: React.ReactNode;
};

export const FadeSlide: React.FC<Props> = ({
  startSec, durationSec = 0.6, from = "bottom", distance = 24, children,
}) => {
  const fps = 30;
  const p = useProgress(startSec * fps, durationSec * fps);
  const offset = (1 - p) * distance;
  const tx = from === "left" ? -offset : from === "right" ? offset : 0;
  const ty = from === "top" ? -offset : from === "bottom" ? offset : 0;
  return (
    <div style={{ opacity: p, transform: `translate(${tx}px, ${ty}px)` }}>
      {children}
    </div>
  );
};
```

- [ ] **Step 3: TypeOn.tsx — 한 줄 타이핑 애니**

```tsx
import React from "react";
import { useCurrentFrame } from "remotion";

type Props = {
  text: string;
  startSec: number;
  charsPerSec?: number;
  cursor?: boolean;
  style?: React.CSSProperties;
};

export const TypeOn: React.FC<Props> = ({
  text, startSec, charsPerSec = 40, cursor = true, style,
}) => {
  const fps = 30;
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startSec * fps);
  const charsShown = Math.min(text.length, Math.floor((elapsed / fps) * charsPerSec));
  const visible = text.slice(0, charsShown);
  const showCursor = cursor && Math.floor(frame / 15) % 2 === 0;
  return (
    <span style={style}>
      {visible}
      {showCursor && <span style={{ opacity: 0.7 }}>▍</span>}
    </span>
  );
};
```

- [ ] **Step 4: Terminal.tsx — 터미널 창 시뮬레이션**

```tsx
import React from "react";
import { tokens } from "../tokens";

type Props = {
  width?: number;
  height?: number;
  title?: string;
  children: React.ReactNode;
};

export const Terminal: React.FC<Props> = ({ width = 1280, height = 760, title = "claude", children }) => {
  return (
    <div
      style={{
        width, height,
        background: "#101014",
        borderRadius: 12,
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        border: `1px solid ${tokens.colors.panel}`,
        overflow: "hidden",
        fontFamily: tokens.fonts.mono,
        color: tokens.colors.ink,
      }}
    >
      <div style={{
        height: 36, background: tokens.colors.panel, display: "flex",
        alignItems: "center", padding: "0 16px", gap: 8,
      }}>
        <span style={{ width: 12, height: 12, borderRadius: 6, background: "#ff5f57" }} />
        <span style={{ width: 12, height: 12, borderRadius: 6, background: "#febc2e" }} />
        <span style={{ width: 12, height: 12, borderRadius: 6, background: "#28c840" }} />
        <span style={{ marginLeft: 16, color: tokens.colors.inkSoft, fontSize: 13 }}>{title}</span>
      </div>
      <div style={{ padding: 24, fontSize: 22, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
        {children}
      </div>
    </div>
  );
};
```

- [ ] **Step 5: Stopwatch.tsx — 디지털 스톱워치**

```tsx
import React from "react";
import { tokens } from "../tokens";

type Props = {
  totalSeconds: number;
  startSec: number;
  durationSec: number;
  color?: string;
  label?: string;
};

export const Stopwatch: React.FC<Props> = ({ totalSeconds, startSec, durationSec, color = tokens.colors.accent, label }) => {
  const fps = 30;
  const elapsedFrames = Math.max(0, useFrame() - startSec * fps);
  const t = Math.min(1, elapsedFrames / (durationSec * fps));
  const shown = totalSeconds * t;
  const min = Math.floor(shown / 60);
  const sec = Math.floor(shown % 60);
  const label2 = `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  return (
    <div style={{ display: "inline-block", textAlign: "center" }}>
      {label && <div style={{ color: tokens.colors.inkSoft, fontSize: 22, marginBottom: 8, fontFamily: tokens.fonts.sans }}>{label}</div>}
      <div style={{
        fontFamily: tokens.fonts.mono, fontSize: 96, color, fontWeight: 700,
        letterSpacing: "0.02em",
      }}>{label2}</div>
    </div>
  );
};

// remotion useCurrentFrame을 export 인덱스 충돌 없이 쓰기 위해 재import
import { useCurrentFrame as useFrame } from "remotion";
```

- [ ] **Step 6: AnimatedBar.tsx — 막대 1줄**

```tsx
import React from "react";
import { tokens } from "../tokens";
import { useProgress } from "./utils";

type Props = {
  label: string;
  startSec: number;
  durationSec?: number;
  /** 0~1: 절감률 또는 막대 길이 비율 */
  value: number;
  color?: string;
  /** 우측에 보일 라벨 (예: "85%", "0 → 1") */
  valueLabel: string;
  width?: number;
};

export const AnimatedBar: React.FC<Props> = ({
  label, startSec, durationSec = 1.0, value, color = tokens.colors.accent, valueLabel, width = 900,
}) => {
  const p = useProgress(startSec * 30, durationSec * 30);
  return (
    <div style={{ width, display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: tokens.fonts.sans, fontSize: 28, color: tokens.colors.ink }}>{label}</span>
        <span style={{ fontFamily: tokens.fonts.mono, fontSize: 36, color, fontWeight: 700 }}>{valueLabel}</span>
      </div>
      <div style={{ width: "100%", height: 24, background: "#1a1a1f", borderRadius: 12, overflow: "hidden" }}>
        <div style={{
          width: `${value * p * 100}%`, height: "100%", background: color,
          borderRadius: 12, transition: "none",
        }} />
      </div>
    </div>
  );
};
```

- [ ] **Step 7: Callout.tsx (영상용)**

```tsx
import React from "react";
import { tokens } from "../tokens";

type Props = {
  children: React.ReactNode;
  color?: string;
  width?: number;
};

export const Callout: React.FC<Props> = ({ children, color = tokens.colors.accent, width = 1100 }) => {
  return (
    <div style={{
      width, padding: "20px 28px",
      background: `${color}1A`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 8,
      fontFamily: tokens.fonts.sans,
      fontSize: 28, color: tokens.colors.ink, lineHeight: 1.5,
    }}>
      {children}
    </div>
  );
};
```

- [ ] **Step 8: typecheck:remotion 통과 확인 + 커밋**

```bash
pnpm typecheck:remotion
git add remotion/shared/
git commit -m "feat(remotion): add shared motion building blocks"
```

---

## Task 2: V9 SavingsChart — 60초 (가장 단순한 영상부터 시작)

**Files:**
- Create: `remotion/compositions/V9SavingsChart.tsx`
- Modify: `remotion/Root.tsx` (Composition 등록)

- [ ] **Step 1: V9SavingsChart.tsx**

```tsx
import React from "react";
import { AbsoluteFill } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";
import { AnimatedBar } from "../shared/AnimatedBar";

const items: { label: string; value: number; valueLabel: string; color?: string }[] = [
  { label: "데모 A · 레거시 C 분석",       value: 0.85, valueLabel: "-85%" },
  { label: "데모 C · 빌드 시스템",         value: 0.80, valueLabel: "-80%" },
  { label: "데모 E · 단위 테스트",         value: 0.90, valueLabel: "-90%" },
  { label: "데모 H · 문서화",              value: 1.00, valueLabel: "0 → 1", color: tokens.colors.ok },
];

export const V9SavingsChart: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: tokens.colors.bg, padding: 96, color: tokens.colors.ink }}>
      <FadeSlide startSec={0} from="left">
        <h1 style={{ fontFamily: tokens.fonts.sans, fontSize: 64, fontWeight: 700, marginBottom: 8 }}>
          한 사람의 시간이 어디로 갔나
        </h1>
      </FadeSlide>
      <FadeSlide startSec={0.4} from="left">
        <p style={{ fontFamily: tokens.fonts.sans, fontSize: 28, color: tokens.colors.inkSoft, marginBottom: 56 }}>
          U-Boot 메모리 컨트롤러 작업 기준
        </p>
      </FadeSlide>
      <div style={{ marginLeft: 8 }}>
        {items.map((it, i) => (
          <AnimatedBar
            key={it.label}
            label={it.label}
            startSec={1.5 + i * 0.9}
            durationSec={1.0}
            value={it.value}
            valueLabel={it.valueLabel}
            color={it.color}
          />
        ))}
      </div>
      <FadeSlide startSec={6} from="bottom">
        <p style={{
          marginTop: 32, fontFamily: tokens.fonts.sans, fontSize: 28,
          color: tokens.colors.accent, fontWeight: 600,
        }}>
          마지막 막대는 속도가 아니라 가능성 자체가 바뀐 영역.
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: remotion/Root.tsx에 등록**

```tsx
import { Composition } from "remotion";
import { V9SavingsChart } from "./compositions/V9SavingsChart";

const Placeholder: React.FC = () => null;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="placeholder" component={Placeholder} durationInFrames={30} fps={30} width={1920} height={1080} />
      <Composition id="V9-savings-chart" component={V9SavingsChart}
        durationInFrames={60 * 30} fps={30} width={1920} height={1080} />
    </>
  );
};
```

- [ ] **Step 3: `pnpm typecheck:remotion` 통과 + `pnpm remotion:studio`로 V9 미리보기 → ✓ → 종료 → 커밋**

```bash
git add remotion/compositions/V9SavingsChart.tsx remotion/Root.tsx
git commit -m "feat(remotion/V9): savings chart composition (60s)"
```

---

## Task 3: V1 Timeline — 90초

**Files:**
- Create: `remotion/compositions/V1Timeline.tsx`
- Modify: `remotion/Root.tsx`

- [ ] **Step 1: V1Timeline.tsx — Anthropic 2021 → 2026 마일스톤**

```tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";

type Milestone = { year: string; title: string; sub: string };

const milestones: Milestone[] = [
  { year: "2021",        title: "Anthropic 창립",                    sub: "안전한 AI 연구" },
  { year: "2022~2023",   title: "Claude 1 / 2",                       sub: "대화형 LLM 라인업 시작" },
  { year: "2024",        title: "Claude 3 (Opus/Sonnet/Haiku)",       sub: "에이전틱 도구 사용" },
  { year: "2025-02",     title: "Claude Code 베타",                  sub: "터미널 코드 동료" },
  { year: "2025 GA",     title: "정식 출시 + Plugins/Skills",         sub: "생태계 확장" },
  { year: "2026 현재",   title: "Subagent · Hook · MCP · IDE",        sub: "어디서든 같은 에이전틱 루프" },
];

export const V1Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  // 라인 진행: 2초~14초 (12초)
  const lineP = interpolate(frame, [2 * fps, 14 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: tokens.colors.bg, padding: 96, color: tokens.colors.ink }}>
      <FadeSlide startSec={0} from="left">
        <h1 style={{ fontFamily: tokens.fonts.sans, fontSize: 64, fontWeight: 700 }}>Claude Code 짧은 역사</h1>
      </FadeSlide>
      <FadeSlide startSec={0.5} from="left">
        <p style={{ fontFamily: tokens.fonts.sans, fontSize: 28, color: tokens.colors.inkSoft, marginBottom: 64 }}>
          5년의 흐름을 90초에
        </p>
      </FadeSlide>
      <div style={{ position: "relative", height: 380, marginTop: 32 }}>
        {/* 가로 라인 */}
        <div style={{
          position: "absolute", left: 40, right: 40, top: 200, height: 4,
          background: "#1a1a1f", borderRadius: 2,
        }}>
          <div style={{ width: `${lineP * 100}%`, height: "100%", background: tokens.colors.accent, borderRadius: 2 }} />
        </div>
        {milestones.map((m, i) => {
          const start = 2 + i * 2;
          const dotP = interpolate(frame, [start * fps, (start + 0.5) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const left = `${(i / (milestones.length - 1)) * 100}%`;
          return (
            <div key={m.year} style={{
              position: "absolute", left, top: 0, transform: "translateX(-50%)",
              width: 240, textAlign: "center",
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 10,
                background: tokens.colors.accent,
                margin: "190px auto 0",
                transform: `scale(${dotP})`, opacity: dotP,
                boxShadow: `0 0 ${20 * dotP}px ${tokens.colors.accent}`,
              }} />
              <div style={{
                fontFamily: tokens.fonts.mono, fontSize: 22, color: tokens.colors.accent,
                marginTop: 16, opacity: dotP,
              }}>{m.year}</div>
              <div style={{
                fontFamily: tokens.fonts.sans, fontSize: 22, fontWeight: 600,
                marginTop: 4, opacity: dotP,
              }}>{m.title}</div>
              <div style={{
                fontFamily: tokens.fonts.sans, fontSize: 18, color: tokens.colors.inkSoft,
                marginTop: 4, opacity: dotP,
              }}>{m.sub}</div>
            </div>
          );
        })}
      </div>
      <FadeSlide startSec={15} from="bottom">
        <p style={{ marginTop: 80, fontFamily: tokens.fonts.sans, fontSize: 28, color: tokens.colors.accent }}>
          웹 개발자의 도구가 아니다 — 임베디드까지 통한다.
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Root.tsx 등록**

```tsx
import { V1Timeline } from "./compositions/V1Timeline";
// ...
<Composition id="V1-timeline" component={V1Timeline}
  durationInFrames={90 * 30} fps={30} width={1920} height={1080} />
```

- [ ] **Step 3: 검증·커밋**

```bash
pnpm typecheck:remotion
git add remotion/
git commit -m "feat(remotion/V1): timeline composition (90s)"
```

---

## Task 4: V3 CLAUDE.md — 45초

**Files:**
- Create: `remotion/compositions/V3ClaudeMd.tsx`
- Modify: `remotion/Root.tsx`

- [ ] **Step 1: V3ClaudeMd.tsx — 빈 프로젝트 → CLAUDE.md → 다음 세션이 알고 시작**

```tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";
import { TypeOn } from "../shared/TypeOn";

const claudeMd = `# 우리 프로젝트
NAND 컨트롤러 펌웨어.

## 빌드
- make sandbox_defconfig && make
- ./test/py/test.py --bd=sandbox

## 관습
- 비트필드는 FIELD_PREP / FIELD_GET 사용
- ECC: BCH-8, OOB 64바이트
`;

export const V3ClaudeMd: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  // Scene A 0~8s: 빈 프로젝트 + 의문
  // Scene B 8~25s: CLAUDE.md 작성 (typing)
  // Scene C 25~45s: 다음 세션, Claude가 이미 안다
  const sceneB = interpolate(frame, [8 * fps, 9 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sceneC = interpolate(frame, [25 * fps, 27 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: tokens.colors.bg, color: tokens.colors.ink, padding: 96 }}>
      <FadeSlide startSec={0} from="bottom">
        <h1 style={{ fontFamily: tokens.fonts.sans, fontSize: 64, fontWeight: 700 }}>
          CLAUDE.md = 프로젝트의 기억
        </h1>
      </FadeSlide>
      <FadeSlide startSec={0.5} from="bottom">
        <p style={{ fontFamily: tokens.fonts.sans, fontSize: 28, color: tokens.colors.inkSoft, marginBottom: 48 }}>
          한 번만 적어두면, 매 세션 알고 시작합니다.
        </p>
      </FadeSlide>

      {/* Scene A: 빈 폴더 */}
      <div style={{ position: "absolute", left: 96, top: 320, opacity: 1 - sceneB }}>
        <div style={{
          width: 420, padding: 24, background: tokens.colors.panel, borderRadius: 12,
          fontFamily: tokens.fonts.mono, fontSize: 22, color: tokens.colors.inkSoft,
        }}>
          $ ls<br/>
          (텅 빈 프로젝트)
        </div>
        <div style={{ marginTop: 32, fontFamily: tokens.fonts.sans, fontSize: 26, color: tokens.colors.inkSoft, maxWidth: 420 }}>
          "Claude, 우리 빌드 명령이 뭐였더라..."<br/>
          (매번 처음부터 알려주기)
        </div>
      </div>

      {/* Scene B: CLAUDE.md 타이핑 */}
      <div style={{
        position: "absolute", left: 720, top: 320, opacity: sceneB * (1 - sceneC * 0.7),
        width: 1100, padding: 28, background: "#101014", borderRadius: 12,
        border: `1px solid ${tokens.colors.panel}`,
        fontFamily: tokens.fonts.mono, fontSize: 22, color: tokens.colors.ink, lineHeight: 1.5,
        whiteSpace: "pre-wrap",
      }}>
        <TypeOn text={claudeMd} startSec={9} charsPerSec={20} cursor />
      </div>

      {/* Scene C: 다음 세션 */}
      <FadeSlide startSec={26} from="right">
        <div style={{
          position: "absolute", left: 96, top: 720, width: 1700,
          padding: 28, background: `${tokens.colors.accent}14`,
          border: `1px solid ${tokens.colors.accent}66`, borderRadius: 12,
          fontFamily: tokens.fonts.mono, fontSize: 24, color: tokens.colors.ink,
          opacity: sceneC,
        }}>
          $ claude "이 NAND 드라이버에 ECC 함수 추가해줘"<br/>
          <span style={{ color: tokens.colors.accent }}>Claude:</span> BCH-8 / OOB 64바이트 / FIELD_PREP 패턴 — 이 프로젝트 관습대로 작업합니다.
        </div>
      </FadeSlide>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Root.tsx 등록 + 검증·커밋**

```bash
git add remotion/
git commit -m "feat(remotion/V3): CLAUDE.md memory composition (45s)"
```

---

## Task 5: V5 MCP — 60초

**Files:**
- Create: `remotion/compositions/V5Mcp.tsx`
- Modify: `remotion/Root.tsx`

- [ ] **Step 1: V5Mcp.tsx — 외부 시스템 연결 다이어그램**

```tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";

type Node = { id: string; label: string; sub: string; x: number; y: number; appearAtSec: number; color?: string };

const center = { x: 960, y: 600 };
const nodes: Node[] = [
  { id: "github",  label: "GitHub",      sub: "PR · Issue",        x: 240,  y: 220, appearAtSec: 5,  color: "#9b9bff" },
  { id: "db",      label: "DB",          sub: "Postgres / Mongo",   x: 1680, y: 220, appearAtSec: 6.5 },
  { id: "slack",   label: "Slack",       sub: "Team channels",      x: 200,  y: 980, appearAtSec: 8,  color: "#a1d3ff" },
  { id: "jira",    label: "Jira / Linear", sub: "Tickets",          x: 1700, y: 980, appearAtSec: 9.5, color: "#f2c14e" },
  { id: "jtag",    label: "JTAG",        sub: "디버거 · 로직 애널라이저", x: 960,  y: 120, appearAtSec: 11, color: tokens.colors.accent },
];

export const V5Mcp: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  return (
    <AbsoluteFill style={{ background: tokens.colors.bg, color: tokens.colors.ink, padding: 80 }}>
      <FadeSlide startSec={0} from="top">
        <h1 style={{ fontFamily: tokens.fonts.sans, fontSize: 64, fontWeight: 700 }}>
          MCP — 외부 시스템과의 다리
        </h1>
      </FadeSlide>
      <FadeSlide startSec={0.5} from="top">
        <p style={{ fontFamily: tokens.fonts.sans, fontSize: 28, color: tokens.colors.inkSoft }}>
          Claude가 GitHub · DB · Slack · 측정장비까지 직접 다룸
        </p>
      </FadeSlide>

      <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 1920 1080">
        {/* 중앙 노드 */}
        {(() => {
          const p = interpolate(frame, [2 * fps, 3 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <g transform={`translate(${center.x}, ${center.y})`} opacity={p}>
              <circle r={130} fill={`${tokens.colors.accent}22`} stroke={tokens.colors.accent} strokeWidth={3} />
              <text textAnchor="middle" y={-10} fontFamily={tokens.fonts.sans} fontSize={36} fontWeight={700} fill={tokens.colors.ink}>Claude Code</text>
              <text textAnchor="middle" y={32} fontFamily={tokens.fonts.mono} fontSize={22} fill={tokens.colors.accent}>MCP host</text>
            </g>
          );
        })()}
        {/* 노드 + 엣지 */}
        {nodes.map((n) => {
          const p = interpolate(frame, [n.appearAtSec * fps, (n.appearAtSec + 0.6) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const color = n.color ?? tokens.colors.inkSoft;
          return (
            <g key={n.id} opacity={p}>
              <line x1={center.x} y1={center.y} x2={n.x} y2={n.y}
                stroke={color} strokeWidth={2} strokeDasharray="6 6" opacity={0.4} />
              <g transform={`translate(${n.x}, ${n.y})`}>
                <circle r={70} fill={`${color}22`} stroke={color} strokeWidth={2} />
                <text textAnchor="middle" y={-4} fontFamily={tokens.fonts.sans} fontSize={26} fontWeight={600} fill={tokens.colors.ink}>{n.label}</text>
                <text textAnchor="middle" y={28} fontFamily={tokens.fonts.sans} fontSize={18} fill={tokens.colors.inkSoft}>{n.sub}</text>
              </g>
            </g>
          );
        })}
      </svg>

      <FadeSlide startSec={14} from="bottom">
        <p style={{
          position: "absolute", left: 96, bottom: 60,
          fontFamily: tokens.fonts.sans, fontSize: 30, color: tokens.colors.accent,
          maxWidth: 1700,
        }}>
          하드웨어와 만나는 지점에 다리를 놓는다 — JTAG·로직 애널라이저까지.
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Root.tsx 등록 + 검증·커밋**

```bash
git add remotion/
git commit -m "feat(remotion/V5): MCP diagram composition (60s)"
```

---

## Task 6: V6 Skills/Subagents/Hooks — 90초

**Files:**
- Create: `remotion/compositions/V6SkillsSubagentsHooks.tsx`
- Modify: `remotion/Root.tsx`

- [ ] **Step 1: V6 — 세 개념 각 30초**

```tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";

type Concept = {
  name: string;
  tagline: string;
  body: string;
  example: string;
  startSec: number;
};

const concepts: Concept[] = [
  {
    name: "Skill",
    tagline: "자주 하는 절차를 호출 가능한 형태로",
    body: "한 번 정의해두면 어디서든 호출. 'NAND 레지스터 맵 정리해줘'를 명령처럼.",
    example: "$ /register-map drivers/mtd/nand/raw/davinci.c",
    startSec: 2,
  },
  {
    name: "Subagent",
    tagline: "큰 작업을 부하 직원에게 위임",
    body: "코드리뷰 전담, 테스트 작성 전담. 메인 컨텍스트 보호.",
    example: "[ subagent: code-reviewer → 결과 요약 ]",
    startSec: 32,
  },
  {
    name: "Hook",
    tagline: "자동 트리거",
    body: "커밋 직전 자동 단위테스트, 푸시 직전 자동 빌드. 사람이 잊어도 안전망.",
    example: "PreCommit → ./test/py/test.py --bd=sandbox",
    startSec: 62,
  },
];

export const V6SkillsSubagentsHooks: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  return (
    <AbsoluteFill style={{ background: tokens.colors.bg, color: tokens.colors.ink, padding: 96 }}>
      <FadeSlide startSec={0} from="top">
        <h1 style={{ fontFamily: tokens.fonts.sans, fontSize: 60, fontWeight: 700 }}>
          Skills · Subagents · Hooks
        </h1>
        <p style={{ fontFamily: tokens.fonts.sans, fontSize: 28, color: tokens.colors.inkSoft, marginTop: 8 }}>
          Claude Code를 팀 도구로 키우는 세 가지 축
        </p>
      </FadeSlide>

      {concepts.map((c, i) => {
        const p = interpolate(frame, [c.startSec * fps, (c.startSec + 1) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const out = i < 2
          ? interpolate(frame, [(c.startSec + 28) * fps, (c.startSec + 29) * fps], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : 1;
        const opacity = p * out;
        return (
          <div key={c.name} style={{
            position: "absolute", left: 96, top: 280, width: 1728,
            opacity,
          }}>
            <div style={{ fontFamily: tokens.fonts.mono, fontSize: 28, color: tokens.colors.accent, marginBottom: 8 }}>
              {String(i + 1).padStart(2, "0")} / 03
            </div>
            <div style={{ fontFamily: tokens.fonts.sans, fontSize: 96, fontWeight: 700, lineHeight: 1.05 }}>
              {c.name}
            </div>
            <div style={{ fontFamily: tokens.fonts.sans, fontSize: 36, color: tokens.colors.accentSoft, marginTop: 12 }}>
              {c.tagline}
            </div>
            <div style={{ fontFamily: tokens.fonts.sans, fontSize: 28, color: tokens.colors.inkSoft, marginTop: 28, maxWidth: 1500, lineHeight: 1.5 }}>
              {c.body}
            </div>
            <div style={{
              fontFamily: tokens.fonts.mono, fontSize: 26, color: tokens.colors.ink,
              marginTop: 40, padding: "20px 28px",
              background: "#101014", border: `1px solid ${tokens.colors.panel}`, borderRadius: 12,
              maxWidth: 1500,
            }}>
              {c.example}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Root.tsx 등록 + 검증·커밋**

```bash
git add remotion/
git commit -m "feat(remotion/V6): Skills Subagents Hooks composition (90s)"
```

---

## Task 7: V8 Before/After — 90초

**Files:**
- Create: `remotion/compositions/V8BeforeAfter.tsx`
- Modify: `remotion/Root.tsx`

- [ ] **Step 1: V8 — 분할화면 + 스톱워치**

```tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";
import { Stopwatch } from "../shared/Stopwatch";

export const V8BeforeAfter: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const splitP = interpolate(frame, [1 * fps, 2 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const verdictP = interpolate(frame, [78 * fps, 80 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: tokens.colors.bg }}>
      <FadeSlide startSec={0} from="top">
        <div style={{
          position: "absolute", top: 48, left: 0, right: 0, textAlign: "center",
          fontFamily: tokens.fonts.sans, fontSize: 56, fontWeight: 700, color: tokens.colors.ink,
        }}>
          같은 작업 · 다른 두 시간
        </div>
        <div style={{
          position: "absolute", top: 124, left: 0, right: 0, textAlign: "center",
          fontFamily: tokens.fonts.sans, fontSize: 26, color: tokens.colors.inkSoft,
        }}>
          U-Boot davinci_nand.c — 함수별 책임 분리 + 비트필드 매크로 정리
        </div>
      </FadeSlide>

      {/* 좌: 사람 */}
      <div style={{
        position: "absolute", top: 240, left: 60, width: 880, height: 760,
        background: `linear-gradient(180deg, ${tokens.colors.midnight}, ${tokens.colors.bg})`,
        borderRadius: 16, padding: 48, opacity: splitP,
        border: `1px solid ${tokens.colors.midnight}`,
      }}>
        <div style={{ fontFamily: tokens.fonts.mono, color: "#f2a268", fontSize: 28 }}>BEFORE · 사람</div>
        <div style={{ fontFamily: tokens.fonts.sans, fontSize: 30, fontWeight: 600, marginTop: 8, color: tokens.colors.ink }}>
          정독 · 메모 · 화이트보드
        </div>
        <ul style={{
          marginTop: 24, fontFamily: tokens.fonts.sans, fontSize: 24,
          color: tokens.colors.inkSoft, lineHeight: 1.6,
        }}>
          <li>함수 600라인 1줄씩 읽기</li>
          <li>매크로 → 의미 추적</li>
          <li>회의실 화이트보드에 정리</li>
          <li>다음 날 다시 봄...</li>
        </ul>
        <div style={{ marginTop: 56 }}>
          <Stopwatch totalSeconds={27 * 60} startSec={3} durationSec={70} color="#f2a268" label="경과" />
        </div>
      </div>

      {/* 우: Claude Code */}
      <div style={{
        position: "absolute", top: 240, right: 60, width: 880, height: 760,
        background: `linear-gradient(180deg, #1a1a1f, ${tokens.colors.bg})`,
        borderRadius: 16, padding: 48, opacity: splitP,
        border: `1px solid ${tokens.colors.accent}66`,
      }}>
        <div style={{ fontFamily: tokens.fonts.mono, color: tokens.colors.accent, fontSize: 28 }}>AFTER · Claude Code</div>
        <div style={{ fontFamily: tokens.fonts.sans, fontSize: 30, fontWeight: 600, marginTop: 8, color: tokens.colors.ink }}>
          한 번의 프롬프트, 의미 단위 분해
        </div>
        <ul style={{
          marginTop: 24, fontFamily: tokens.fonts.sans, fontSize: 24,
          color: tokens.colors.inkSoft, lineHeight: 1.6,
        }}>
          <li>함수 책임 표 자동 생성</li>
          <li>책임 분리 다이어그램</li>
          <li>매크로 → FIELD_PREP/GET diff</li>
          <li>리뷰 시작점 70%</li>
        </ul>
        <div style={{ marginTop: 56 }}>
          <Stopwatch totalSeconds={2 * 60 + 30} startSec={3} durationSec={6} color={tokens.colors.accent} label="경과" />
        </div>
      </div>

      {/* 결과 */}
      <div style={{
        position: "absolute", top: 1010, left: 0, right: 0, textAlign: "center",
        fontFamily: tokens.fonts.sans, fontSize: 36, fontWeight: 700,
        color: tokens.colors.accent, opacity: verdictP,
      }}>
        27분 → 2분 30초 · 사람은 검토자 역할로 격상
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Root.tsx 등록 + 검증·커밋**

```bash
git add remotion/
git commit -m "feat(remotion/V8): before/after split-screen composition (90s)"
```

---

## Task 8: V2 CLI Loop — 60초 (R1 터미널 시뮬레이션)

**Files:**
- Create: `remotion/compositions/V2CliLoop.tsx`
- Modify: `remotion/Root.tsx`

- [ ] **Step 1: V2 — Terminal + 사고/도구/관찰 루프**

```tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";
import { Terminal } from "../shared/Terminal";
import { TypeOn } from "../shared/TypeOn";

export const V2CliLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const stepP = (s: number) => interpolate(frame, [s * fps, (s + 0.6) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: tokens.colors.bg, color: tokens.colors.ink, padding: 64 }}>
      <FadeSlide startSec={0} from="top">
        <h1 style={{ fontFamily: tokens.fonts.sans, fontSize: 56, fontWeight: 700 }}>
          CLI + 에이전틱 루프
        </h1>
        <p style={{ fontFamily: tokens.fonts.sans, fontSize: 26, color: tokens.colors.inkSoft, marginTop: 4 }}>
          한 번 시키면 사고 → 도구 → 관찰 → 다음 행동을 스스로 반복
        </p>
      </FadeSlide>

      <div style={{ position: "absolute", left: 80, top: 200 }}>
        <Terminal width={1180} height={780} title="claude — drivers/mtd/nand/raw">
          <span style={{ color: tokens.colors.accentSoft }}>$ </span>
          <TypeOn text="claude 'davinci_nand.c 함수별 책임 정리해줘'" startSec={2} charsPerSec={26} cursor={false} />
          <br/><br/>
          {stepP(7) > 0 && <span style={{ opacity: stepP(7), color: tokens.colors.accent }}>● 사고: 600라인 코드 스캔, 함수 7개 식별 중...{"\n"}</span>}
          {stepP(11) > 0 && <span style={{ opacity: stepP(11) }}>● 도구: <span style={{ color: tokens.colors.accent }}>Read</span>(davinci_nand.c){"\n"}</span>}
          {stepP(15) > 0 && <span style={{ opacity: stepP(15) }}>● 도구: <span style={{ color: tokens.colors.accent }}>Grep</span>("FIELD_PREP|FIELD_GET"){"\n"}</span>}
          {stepP(19) > 0 && <span style={{ opacity: stepP(19), color: "#9ca3af" }}>  관찰: 매크로 12개, 함수 7개 발견{"\n"}</span>}
          {stepP(23) > 0 && <span style={{ opacity: stepP(23) }}>● 사고: 명령 시퀀서 / ECC / DMA 책임 분리 가능{"\n"}</span>}
          {stepP(28) > 0 && <span style={{ opacity: stepP(28) }}>● 도구: <span style={{ color: tokens.colors.accent }}>Write</span>(REFACTOR.md){"\n"}</span>}
          {stepP(33) > 0 && <span style={{ opacity: stepP(33), color: tokens.colors.ok }}>✓ 함수 책임 표 + diagram + 매크로 변환 diff 완료{"\n"}</span>}
        </Terminal>
      </div>

      {/* 우측 라벨 */}
      <div style={{ position: "absolute", right: 80, top: 240, width: 480 }}>
        {[
          { label: "사고", desc: "다음에 무엇을 할지 결정", c: tokens.colors.accent, at: 7 },
          { label: "도구", desc: "Read · Edit · Bash · Grep", c: tokens.colors.accentSoft, at: 11 },
          { label: "관찰", desc: "도구 결과 분석", c: "#9ca3af", at: 19 },
          { label: "반복", desc: "끝날 때까지 스스로", c: tokens.colors.ok, at: 33 },
        ].map((x) => (
          <div key={x.label} style={{ marginBottom: 32, opacity: stepP(x.at) }}>
            <div style={{ fontFamily: tokens.fonts.mono, fontSize: 22, color: x.c, marginBottom: 4 }}>{x.label}</div>
            <div style={{ fontFamily: tokens.fonts.sans, fontSize: 24, color: tokens.colors.ink }}>{x.desc}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Root.tsx 등록 + 검증·커밋**

```bash
git add remotion/
git commit -m "feat(remotion/V2): CLI loop terminal simulation (60s)"
```

---

## Task 9: V4 Tools — 60초 (도구 호출)

**Files:**
- Create: `remotion/compositions/V4Tools.tsx`
- Modify: `remotion/Root.tsx`

- [ ] **Step 1: V4 — 4개 도구 카드가 차례로**

```tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";

type Tool = { name: string; description: string; example: string; startSec: number; color: string };

const tools: Tool[] = [
  { name: "Read",  description: "파일 내용 읽기",            example: "Read('drivers/mtd/nand/raw/davinci_nand.c')", startSec: 4,  color: tokens.colors.accent },
  { name: "Edit",  description: "파일 수정",                 example: "Edit('drivers/.../denali.c', oldText, newText)", startSec: 17, color: tokens.colors.accentSoft },
  { name: "Bash",  description: "셸 명령 실행",              example: "Bash('make sandbox_defconfig && make -j$(nproc)')", startSec: 30, color: tokens.colors.ok },
  { name: "Grep",  description: "코드 검색",                 example: "Grep('FIELD_PREP', glob='**/*.c')",          startSec: 43, color: "#9b9bff" },
];

export const V4Tools: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  return (
    <AbsoluteFill style={{ background: tokens.colors.bg, color: tokens.colors.ink, padding: 96 }}>
      <FadeSlide startSec={0} from="top">
        <h1 style={{ fontFamily: tokens.fonts.sans, fontSize: 60, fontWeight: 700 }}>
          도구 사용 — 말하지 않고, 직접 한다
        </h1>
        <p style={{ fontFamily: tokens.fonts.sans, fontSize: 28, color: tokens.colors.inkSoft, marginTop: 6 }}>
          Read · Edit · Bash · Grep — 파일을 직접 읽고 고치고 빌드를 돌린다.
        </p>
      </FadeSlide>

      <div style={{ marginTop: 64, display: "flex", flexDirection: "column", gap: 32 }}>
        {tools.map((t) => {
          const p = interpolate(frame, [t.startSec * fps, (t.startSec + 0.5) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const slide = (1 - p) * 60;
          return (
            <div key={t.name} style={{
              opacity: p, transform: `translateX(-${slide}px)`,
              padding: "28px 36px",
              border: `1px solid ${t.color}55`, borderLeft: `6px solid ${t.color}`,
              borderRadius: 12,
              background: `${t.color}10`,
              display: "flex", alignItems: "center", gap: 32,
              maxWidth: 1700,
            }}>
              <div style={{
                fontFamily: tokens.fonts.mono, fontSize: 44, fontWeight: 700, color: t.color,
                minWidth: 160,
              }}>{t.name}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: tokens.fonts.sans, fontSize: 26, color: tokens.colors.ink, marginBottom: 6 }}>{t.description}</div>
                <div style={{ fontFamily: tokens.fonts.mono, fontSize: 22, color: tokens.colors.inkSoft }}>
                  {t.example}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <FadeSlide startSec={56} from="bottom">
        <p style={{
          marginTop: 48,
          fontFamily: tokens.fonts.sans, fontSize: 28, color: tokens.colors.accent,
        }}>
          ChatGPT 웹 채팅과의 결정적 차이 — 실행한다.
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Root.tsx 등록 + 검증·커밋**

```bash
git add remotion/
git commit -m "feat(remotion/V4): tools showcase composition (60s)"
```

---

## Task 10: V0 Hero Loop — 15초

**Files:**
- Create: `remotion/compositions/V0HeroLoop.tsx`
- Modify: `remotion/Root.tsx`

- [ ] **Step 1: V0 — Hero 배경 (글리치 + 코드 라인 흐름)**

```tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";

const codeLines = [
  "#define NAND_CMD_READ_PAGE   0x00",
  "FIELD_PREP(DENALI_DMA_CFG_AMODE, mode)",
  "ecc_bch_calc(&ctrl->ecc, page, oob)",
  "wait_event_timeout(ctrl->irq_wait, ...)",
  "writel(reg, ctrl->base + REG_CMD)",
  "$ make sandbox_defconfig && make -j$(nproc)",
  "✓ test/dm/nand_denali — PASS",
  "claude '이 드라이버 함수 책임 분리해줘'",
];

export const V0HeroLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  return (
    <AbsoluteFill style={{ background: tokens.colors.bg, overflow: "hidden" }}>
      {/* 흐르는 코드 라인 */}
      {codeLines.map((line, i) => {
        const speed = 90 + (i % 3) * 30;       // px/sec
        const offset = (frame / fps) * speed;
        const x = (i * 250 - offset) % 2300;
        const y = 100 + (i * 110) % 880;
        const opacity = 0.18 + (i % 3) * 0.04;
        return (
          <div key={i} style={{
            position: "absolute", left: x - 200, top: y,
            fontFamily: tokens.fonts.mono, fontSize: 26, color: tokens.colors.ink,
            opacity, whiteSpace: "nowrap",
          }}>
            {line}
          </div>
        );
      })}
      {/* 글리치 오버레이 */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(180deg, transparent 0, ${tokens.colors.bg} 80%)`,
      }} />
      {/* 중앙 강조 */}
      <div style={{
        position: "absolute", inset: 0, display: "grid", placeItems: "center",
      }}>
        <div style={{
          fontFamily: tokens.fonts.mono, fontSize: 28, color: tokens.colors.accent,
          padding: "12px 24px", border: `1px solid ${tokens.colors.accent}66`, borderRadius: 999,
          background: `${tokens.colors.accent}1A`,
          letterSpacing: "0.3em",
          opacity: interpolate(frame % (fps * 5), [0, fps * 0.6, fps * 4.4, fps * 5], [0, 1, 1, 0]),
        }}>
          U-BOOT NAND · LIVE
        </div>
      </div>
      {/* 스캔라인 */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.025) 2px 3px)",
      }} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Root.tsx 등록 (loop 옵션은 Composition 자체엔 없고, Player에서 loop=true로 처리)**

```tsx
<Composition id="V0-hero-loop" component={V0HeroLoop}
  durationInFrames={15 * 30} fps={30} width={1920} height={1080} />
```

- [ ] **Step 3: 검증·커밋**

```bash
git add remotion/
git commit -m "feat(remotion/V0): hero background loop (15s)"
```

---

## Task 11: 사이트 임베드 — VideoPlaceholder → VideoPlayer 교체

**Files:**
- Modify: `app/sections/Hero.tsx`         (V0)
- Modify: `app/sections/History.tsx`      (V1)
- Modify: `app/sections/Features.tsx`     (V2~V6)
- Modify: `app/sections/Impact.tsx`       (V8, V9)
- Modify: `app/components/VideoPlayer.tsx` (loop prop 추가 — Hero 배경용)

- [ ] **Step 1: VideoPlayer에 loop prop 추가**

기존 `<Player ... loop={false}>` 부분을 props에서 받게:

```tsx
type Props<T> = {
  composition: React.ComponentType<T>;
  inputProps: T;
  durationInFrames: number;
  fps?: number;
  width?: number;
  height?: number;
  loop?: boolean;
  controls?: boolean;
};

export function VideoPlayer<T>({
  composition, inputProps, durationInFrames,
  fps = 30, width = 1920, height = 1080,
  loop = false, controls = true,
}: Props<T>) {
  // ... 동일, <Player ... loop={loop} controls={controls} />
}
```

- [ ] **Step 2: Hero.tsx에 V0 임베드 (loop=true, controls=false, muted)**

```tsx
import { VideoPlayer } from "@/app/components/VideoPlayer";
import { V0HeroLoop } from "@/remotion/compositions/V0HeroLoop";
// VideoPlaceholder 임포트 제거 — 또는 Hero에서만 제거

// JSX 안에서:
<VideoPlayer
  composition={V0HeroLoop}
  inputProps={{}}
  durationInFrames={15 * 30}
  loop
  controls={false}
/>
```

- [ ] **Step 3: History.tsx에 V1 임베드**

```tsx
import { V1Timeline } from "@/remotion/compositions/V1Timeline";
// JSX:
<VideoPlayer composition={V1Timeline} inputProps={{}} durationInFrames={90 * 30} />
```

- [ ] **Step 4: Features.tsx에 V2~V6 임베드**

`features` 배열에 `composition` + `durationFrames` 필드 추가:

```tsx
import { V2CliLoop } from "@/remotion/compositions/V2CliLoop";
import { V3ClaudeMd } from "@/remotion/compositions/V3ClaudeMd";
import { V4Tools } from "@/remotion/compositions/V4Tools";
import { V5Mcp } from "@/remotion/compositions/V5Mcp";
import { V6SkillsSubagentsHooks } from "@/remotion/compositions/V6SkillsSubagentsHooks";
import { VideoPlayer } from "@/app/components/VideoPlayer";

const features = [
  { videoId: "V2", title: "...", body: "...", note: "...", composition: V2CliLoop,            durationSec: 60 },
  { videoId: "V3", title: "...", body: "...", note: "...", composition: V3ClaudeMd,           durationSec: 45 },
  { videoId: "V4", title: "...", body: "...", note: "...", composition: V4Tools,              durationSec: 60 },
  { videoId: "V5", title: "...", body: "...", note: "...", composition: V5Mcp,                durationSec: 60 },
  { videoId: "V6", title: "...", body: "...", note: "...", composition: V6SkillsSubagentsHooks, durationSec: 90 },
];

// JSX 안 VideoPlaceholder를 다음으로 교체:
<VideoPlayer composition={f.composition} inputProps={{}} durationInFrames={f.durationSec * 30} />
```

- [ ] **Step 5: Impact.tsx에 V8, V9 임베드**

```tsx
import { V8BeforeAfter } from "@/remotion/compositions/V8BeforeAfter";
import { V9SavingsChart } from "@/remotion/compositions/V9SavingsChart";

<VideoPlayer composition={V8BeforeAfter} inputProps={{}} durationInFrames={90 * 30} />
<VideoPlayer composition={V9SavingsChart} inputProps={{}} durationInFrames={60 * 30} />
```

- [ ] **Step 6: `pnpm test` / `pnpm typecheck:remotion` / `pnpm build` 모두 통과 확인**

- [ ] **Step 7: 커밋**

```bash
git add app/components/VideoPlayer.tsx app/sections/
git commit -m "feat(site): embed V0/V1/V2-V6/V8/V9 Remotion players in sections"
```

---

## Task 12: 마일스톤 검증 + 태그

**Files:**
- (선택) `CLAUDE.md` 진행 상황 갱신

- [ ] **Step 1: 종합 검증**

```bash
pnpm test                    # 4 files / 6 tests PASS (변경 없음)
pnpm typecheck:remotion      # PASS
pnpm build                   # PASS
```

- [ ] **Step 2: dev 서버에서 시각 검증 (사용자 몫). subagent는 다음으로 대체:**

```bash
nohup pnpm next dev -H 0.0.0.0 -p 3000 > /tmp/dev.log 2>&1 & disown
sleep 8
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3000/
```

- [ ] **Step 3: CLAUDE.md 진행 상황 표시**

```markdown
## 진행 상황
- [x] 플랜 1 (M1+M2) — 사이트 골격 + 정적 콘텐츠
- [x] 플랜 2 (M3+M4) — 모션그래픽 + R1 시뮬레이션 영상 9편
- [ ] 플랜 3 (M5) — 임베디드 데모 영상 5편
- [ ] 플랜 4 (M6) — 마감·리허설
```

- [ ] **Step 4: 태그**

```bash
git tag m3-m4-motion-videos
git add CLAUDE.md && git commit -m "docs: mark plan 2 (M3+M4) complete"
```

---

## 자체 리뷰 체크리스트 (작성자용)

- 9개 영상 ID(V0/V1/V2/V3/V4/V5/V6/V8/V9) 모두 Composition 등록되었나
- 각 영상이 Tailwind 의존하지 않는가 (Remotion은 inline style 권장 — 모두 inline 사용)
- 사이트 임베드 시 SSR/CSR 충돌이 없나 (`@remotion/player`는 client only — VideoPlayer가 `"use client"`로 마크됨, 검증 필요)
- 사용자 시스템 정보 노출 0건
- 영상 텍스트 콘텐츠가 plan 1(특히 §3 EmbeddedDemos)의 메시지와 일관된가

## 자체 리뷰 결과

placeholder 스캔: 모든 영상이 "이런 모션이다" 레벨이 아니라 실제 props/state/timing/색까지 명세됨. TBD 0개.

타입 일관성: `composition` prop은 `React.ComponentType<T>` 제네릭으로 통일. 영상에 `inputProps={}`로 빈 객체 전달.

스코프: 9개 영상 + 사이트 임베드 + 검증 12 task로 적정. 너무 크면 V0/V8을 후순위로 미룰 수 있음.

---

## Execution Handoff

플랜 1과 동일하게 superpowers:subagent-driven-development로 task-by-task 진행. 다만 영상 시각 품질은 사용자 직접 확인 필요 — subagent는 typecheck/build/curl까지만 검증 가능.
