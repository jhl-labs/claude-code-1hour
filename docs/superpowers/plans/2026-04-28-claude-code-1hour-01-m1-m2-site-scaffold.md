# Claude Code 1시간 강의 — 플랜 1 / 4 (M1·M2: 사이트 골격 + 정적 콘텐츠)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 영상 placeholder만 있는, 그 자체로 줌 라이브 강의가 가능한 강의 사이트 골격을 완성한다(스크롤형 단일 페이지 + 6섹션 + 사이드 인덱스 + 진행도 + 정적 콘텐츠).

**Architecture:** Next.js 15 App Router 단일 페이지(`app/page.tsx`)에 6개 섹션 컴포넌트(`app/sections/*`)를 배치. `useInView` 훅으로 뷰포트 진입을 감지해 `SideIndex` 하이라이트와 `ScrollSection`의 자동재생 트리거를 연결. Remotion은 5.x로 통합하되 본 플랜에서는 빈 `Root.tsx`만 등록(영상은 플랜 2~3에서 추가). 영상 자리에는 검은 placeholder + 라벨을 표시.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, Tailwind CSS 3, shadcn/ui, Remotion 5, `@remotion/player`, Mermaid, Vitest + React Testing Library, Pretendard / Inter / JetBrains Mono.

---

## 파일 구조

플랜 1에서 다루는 파일들. 각 파일의 단일 책임을 잠금.

| 경로 | 책임 |
|---|---|
| `package.json` | 의존성·스크립트 |
| `tsconfig.json` | TS 설정 (Next.js 표준 + path alias `@/*`) |
| `next.config.ts` | Next.js 설정 (Remotion 모듈 외부화 등) |
| `tailwind.config.ts` | Tailwind 토큰(색·폰트·이징) |
| `postcss.config.mjs` | Tailwind v3 호환 |
| `app/globals.css` | 전역 폰트·테마 |
| `app/layout.tsx` | 루트 레이아웃(폰트·다크 모드) |
| `app/page.tsx` | 6개 섹션을 순서대로 배치하는 단일 페이지 |
| `app/lib/sections.ts` | 섹션 메타데이터 단일 진실원(SideIndex·ProgressBar 공유) |
| `app/lib/useInView.ts` | IntersectionObserver 훅 |
| `app/components/SideIndex.tsx` | 좌측 고정 인덱스 |
| `app/components/ProgressBar.tsx` | 우측 하단 진행도/시간 가이드 |
| `app/components/ScrollSection.tsx` | 섹션 래퍼(진입/이탈 콜백) |
| `app/components/VideoPlayer.tsx` | `@remotion/player` 래퍼(자동재생 정책) |
| `app/components/Mermaid.tsx` | Mermaid 다이어그램 |
| `app/components/CodeBlock.tsx` | 코드 블록(`react-syntax-highlighter`) |
| `app/components/Card.tsx` | 카드 |
| `app/components/Callout.tsx` | 콜아웃 |
| `app/components/VideoPlaceholder.tsx` | 영상 자리(검은 박스 + 영상 ID 라벨) |
| `app/sections/Hero.tsx` | Hero — 후킹 + V0 자리 |
| `app/sections/History.tsx` | §1 — 한 줄 정의 + V1 자리 + 동향 카드 |
| `app/sections/Features.tsx` | §2 — 5개 기능 카드 + V2~V6 자리 |
| `app/sections/EmbeddedDemos.tsx` | §3 — 4종 데모 카드 + V7-A/C/E/H 자리 |
| `app/sections/Impact.tsx` | §4 — Before/After + 차트 + 대상별 이득 |
| `app/sections/GettingStarted.tsx` | §5 — 설치 + 템플릿 + 체크리스트 + QR |
| `remotion/Root.tsx` | Remotion Composition 등록 — 본 플랜은 빈 골격만 |
| `remotion/tokens.ts` | 디자인 토큰(영상에서도 사용) |
| `remotion.config.ts` | Remotion CLI 설정 |
| `demos/scripts/install-tools.sh` | vhs / agg 설치 |
| `demos/scripts/clone-uboot.sh` | U-Boot clone (얕은 복제) |
| `.gitignore` | node_modules, demos/uboot, demos/recordings, public/rendered |
| `CLAUDE.md` | 이 프로젝트용 메모리(빌드 명령·관습) |
| `vitest.config.ts` | Vitest |
| `tests/setup.ts` | RTL setup |
| `tests/lib/sections.test.ts` | 섹션 메타 sanity |
| `tests/lib/useInView.test.ts` | 훅 동작 |
| `tests/components/ProgressBar.test.tsx` | 진행도 계산 |
| `tests/components/SideIndex.test.tsx` | 현재 섹션 결정 로직 |

원칙: 한 컴포넌트 = 한 가지 책임. 섹션 컴포넌트는 텍스트·placeholder만 담고, 동작은 `components/`로 분리.

---

## Task 1: 프로젝트 초기화 & 기본 매니페스트

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `CLAUDE.md`
- Create: `tsconfig.json`

- [ ] **Step 1: package.json 작성**

```json
{
  "name": "claude-code-1hour",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "remotion:studio": "remotion studio",
    "demos:install-tools": "bash demos/scripts/install-tools.sh",
    "demos:clone-uboot": "bash demos/scripts/clone-uboot.sh"
  },
  "packageManager": "pnpm@9.0.0"
}
```

- [ ] **Step 2: .gitignore 작성**

```
node_modules/
.next/
out/
.turbo/

# 강의 데모 산출물 (외부 리소스)
demos/uboot/
demos/recordings/

# Remotion 최종 export
public/rendered/

# 환경
.env*
!.env.example

# OS
.DS_Store
Thumbs.db
```

- [ ] **Step 3: CLAUDE.md 작성 (이 프로젝트 작업용)**

```markdown
# claude-code-1hour

임베디드(메모리 컨트롤러) 엔지니어 대상 줌 라이브 60분 강의 교안.
설계서: `docs/superpowers/specs/2026-04-28-claude-code-1hour-design.md`
구현 플랜: `docs/superpowers/plans/`

## 빌드/실행
- `pnpm install`
- `pnpm dev` — 로컬 개발 (라이브 강의도 이걸로)
- `pnpm build` — 정적 빌드 백업
- `pnpm test` — Vitest

## 영상
- 모션 영상은 `remotion/compositions/V*.tsx`. `pnpm remotion:studio`로 미리보기.
- 임베디드 데모 영상은 `demos/tapes/*.tape` → vhs 렌더 → Remotion 합성.

## 관습
- 사용자 시스템 정보(호스트명, 사용자명, IP)가 절대 코드/스크립트에 노출되지 않게 한다.
- 다크 모드 기본. 한국어 본문, 코드 영문.
- 컴포넌트는 한 가지 일만. 길어지면 분리.
```

- [ ] **Step 4: tsconfig.json 작성**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "demos/uboot"]
}
```

- [ ] **Step 5: 커밋**

```bash
git add package.json .gitignore CLAUDE.md tsconfig.json
git commit -m "chore: project scaffold (package.json, gitignore, tsconfig)"
```

---

## Task 2: Next.js · React · 기본 의존성 설치

**Files:**
- Modify: `package.json` (의존성 추가)
- Create: `next.config.ts`
- Create: `next-env.d.ts` (자동 생성)
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`

- [ ] **Step 1: 의존성 설치**

```bash
pnpm add next@15 react@19 react-dom@19
pnpm add -D typescript @types/node @types/react @types/react-dom
```

- [ ] **Step 2: next.config.ts 작성**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Remotion 일부 모듈은 서버에서 번들 제외 (Next 15.5+ API)
  serverExternalPackages: ["@remotion/renderer"],
};

export default nextConfig;
```

- [ ] **Step 3: app/globals.css (최소 골격)**

```css
:root { color-scheme: dark; }
html, body { margin: 0; padding: 0; background: #0a0a0a; color: #f5f5f5; }
* { box-sizing: border-box; }
```

- [ ] **Step 4: app/layout.tsx**

```tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Code 1시간 — 임베디드 엔지니어를 위한 강의",
  description: "메모리 컨트롤러 SW 엔지니어를 위한 60분 강의 교안",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: app/page.tsx (자리만)**

```tsx
export default function Page() {
  return (
    <main style={{ minHeight: "100vh", padding: 32 }}>
      <h1>Claude Code 1시간 — 작업 중</h1>
    </main>
  );
}
```

- [ ] **Step 6: 동작 확인**

```bash
pnpm dev
```
브라우저에서 `http://localhost:3000` 접속. "Claude Code 1시간 — 작업 중" 표시 확인. Ctrl+C로 종료.

- [ ] **Step 7: 커밋**

```bash
git add package.json pnpm-lock.yaml next.config.ts next-env.d.ts app/
git commit -m "feat: bootstrap Next.js 15 with empty home page"
```

---

## Task 3: Tailwind CSS + 다크 토큰

**Files:**
- Modify: `package.json` (의존성)
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Modify: `app/globals.css` (Tailwind directives)

- [ ] **Step 1: 의존성 설치**

```bash
pnpm add -D tailwindcss@3 postcss autoprefixer @tailwindcss/typography
```

- [ ] **Step 2: tailwind.config.ts**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./remotion/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Claude 차콜 + 따뜻한 오렌지 + 임베디드 미드나잇
        bg: { DEFAULT: "#0a0a0a", soft: "#141414", panel: "#1a1a1f" },
        ink: { DEFAULT: "#f5f5f5", soft: "#cfcfd4", muted: "#8e8e94" },
        accent: { DEFAULT: "#e4843c", soft: "#f2a268" },
        midnight: { DEFAULT: "#0d1b2a", soft: "#1b2a3a" },
        ok: "#5ae27c",
        warn: "#f2c14e",
        err: "#ff6b6b",
      },
      fontFamily: {
        sans: ["Pretendard", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
```

- [ ] **Step 3: postcss.config.mjs**

```js
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

- [ ] **Step 4: app/globals.css 갱신**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: dark; }
html, body { margin: 0; padding: 0; }
body { @apply bg-bg text-ink font-sans antialiased; }
* { box-sizing: border-box; }
```

- [ ] **Step 5: app/page.tsx에서 Tailwind 클래스 적용 확인**

```tsx
export default function Page() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-accent">Claude Code 1시간 — 작업 중</h1>
    </main>
  );
}
```

- [ ] **Step 6: `pnpm dev`로 다크 배경 + 오렌지 헤딩 확인 후 종료**

- [ ] **Step 7: 커밋**

```bash
git add package.json pnpm-lock.yaml tailwind.config.ts postcss.config.mjs app/globals.css app/page.tsx
git commit -m "feat: add Tailwind dark theme with brand tokens"
```

---

## Task 4: 폰트 셋업 (Pretendard / Inter / JetBrains Mono)

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Inter / JetBrains Mono — Google Fonts via `next/font`**

`app/layout.tsx` 갱신:

```tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Claude Code 1시간 — 임베디드 엔지니어를 위한 강의",
  description: "메모리 컨트롤러 SW 엔지니어를 위한 60분 강의 교안",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`dark ${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Pretendard — CDN 변수 폰트로 import**

`app/globals.css` 상단에 추가:

```css
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css");
```

- [ ] **Step 3: tailwind에서 CSS 변수와 연결**

`tailwind.config.ts`의 `fontFamily`를 다음으로 교체:

```ts
fontFamily: {
  sans: ["Pretendard Variable", "var(--font-inter)", "system-ui", "sans-serif"],
  mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
},
```

- [ ] **Step 4: `pnpm dev`에서 한글이 Pretendard로, 영문/코드가 Inter/JetBrains Mono로 보이는지 확인**

`app/page.tsx`에 일시 검증 텍스트:

```tsx
<p className="mt-4 text-ink-soft">한글 본문 / English body / <code className="font-mono">code()</code></p>
```

확인 후 검증 텍스트는 그대로 두고 종료.

- [ ] **Step 5: 커밋**

```bash
git add app/layout.tsx app/globals.css tailwind.config.ts app/page.tsx
git commit -m "feat: wire Pretendard, Inter, JetBrains Mono fonts"
```

---

## Task 5: Remotion 통합 + 빈 Root

**Files:**
- Modify: `package.json` (의존성)
- Create: `remotion.config.ts`
- Create: `remotion/Root.tsx`
- Create: `remotion/index.ts`
- Create: `remotion/tokens.ts`

- [ ] **Step 1: 의존성 설치**

```bash
pnpm add remotion @remotion/cli @remotion/player @remotion/bundler @remotion/renderer
```

- [ ] **Step 2: remotion.config.ts**

```ts
import { Config } from "@remotion/cli/config";
Config.setVideoImageFormat("jpeg");
Config.setEntryPoint("./remotion/index.ts");
Config.setOverwriteOutput(true);
```

- [ ] **Step 3: remotion/index.ts (CLI 엔트리)**

```ts
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";
registerRoot(RemotionRoot);
```

- [ ] **Step 4: remotion/tokens.ts (영상 공유 토큰)**

```ts
export const tokens = {
  fps: 30,
  width: 1920,
  height: 1080,
  colors: {
    bg: "#0a0a0a",
    panel: "#1a1a1f",
    ink: "#f5f5f5",
    inkSoft: "#cfcfd4",
    accent: "#e4843c",
    accentSoft: "#f2a268",
    midnight: "#0d1b2a",
    ok: "#5ae27c",
    err: "#ff6b6b",
  },
  fonts: {
    sans: "Pretendard Variable, Inter, system-ui, sans-serif",
    mono: "JetBrains Mono, ui-monospace, monospace",
  },
  ease: { smooth: [0.22, 1, 0.36, 1] as const },
};
```

- [ ] **Step 5: remotion/Root.tsx (빈 골격)**

```tsx
import { Composition } from "remotion";

// 본 플랜에서는 영상을 만들지 않고 placeholder Composition 1개만 등록.
// 플랜 2~3에서 실제 V0~V11을 추가한다.
const Placeholder: React.FC = () => null;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="placeholder"
        component={Placeholder}
        durationInFrames={30}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
```

- [ ] **Step 6: `pnpm remotion:studio` 실행 → Remotion Studio가 열리고 placeholder가 보이는지 확인 → 종료**

- [ ] **Step 7: 커밋**

```bash
git add package.json pnpm-lock.yaml remotion.config.ts remotion/
git commit -m "feat: integrate Remotion 5 with empty Root and design tokens"
```

---

## Task 6: 데모 도구 셋업 스크립트 (vhs / agg / U-Boot)

**Files:**
- Create: `demos/scripts/install-tools.sh`
- Create: `demos/scripts/clone-uboot.sh`

- [ ] **Step 1: install-tools.sh — vhs와 agg 설치**

```bash
#!/usr/bin/env bash
set -euo pipefail

# vhs (charm sh) — 결정적 터미널 영상 생성
if ! command -v vhs >/dev/null 2>&1; then
  echo "[install] vhs"
  VHS_VERSION="0.7.2"
  TMP=$(mktemp -d)
  curl -L "https://github.com/charmbracelet/vhs/releases/download/v${VHS_VERSION}/vhs_${VHS_VERSION}_Linux_x86_64.tar.gz" \
    -o "$TMP/vhs.tgz"
  tar -xzf "$TMP/vhs.tgz" -C "$TMP"
  install -m 0755 "$TMP/vhs" "$HOME/.local/bin/vhs"
  rm -rf "$TMP"
fi

# agg (asciinema → gif) — 보조 도구
if ! command -v agg >/dev/null 2>&1; then
  echo "[install] agg"
  AGG_VERSION="1.4.3"
  curl -L "https://github.com/asciinema/agg/releases/download/v${AGG_VERSION}/agg-x86_64-unknown-linux-gnu" \
    -o "$HOME/.local/bin/agg"
  chmod 0755 "$HOME/.local/bin/agg"
fi

if ! command -v ttyd >/dev/null 2>&1; then
  echo "[note] ttyd 미설치 — vhs 동작에는 무관, 무시"
fi

echo "[done] vhs $(vhs --version) / agg $(agg --version 2>&1 | head -1)"
```

`chmod +x demos/scripts/install-tools.sh` 잊지 말 것.

- [ ] **Step 2: clone-uboot.sh — 얕은 복제**

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEST="$ROOT/demos/uboot"

if [ -d "$DEST/.git" ]; then
  echo "[clone-uboot] 이미 존재: $DEST"
  exit 0
fi

mkdir -p "$ROOT/demos"
echo "[clone-uboot] U-Boot 얕은 복제 (depth=1)"
git clone --depth=1 https://github.com/u-boot/u-boot.git "$DEST"

echo "[clone-uboot] sandbox 빌드 사전 점검"
cd "$DEST"
make sandbox_defconfig >/dev/null
echo "[done] $DEST 준비 완료"
```

`chmod +x demos/scripts/clone-uboot.sh`.

- [ ] **Step 3: 두 스크립트가 syntax-clean인지 검증**

```bash
bash -n demos/scripts/install-tools.sh
bash -n demos/scripts/clone-uboot.sh
```

(설치/clone 자체는 본 플랜에서 실행하지 않음. 플랜 3에서 실행. 본 단계는 스크립트 존재 + 문법 OK까지.)

- [ ] **Step 4: 커밋**

```bash
git add demos/scripts/
git commit -m "feat: add vhs/agg installer and U-Boot clone scripts"
```

---

## Task 7: 섹션 메타데이터 (단일 진실원)

**Files:**
- Create: `app/lib/sections.ts`
- Create: `tests/lib/sections.test.ts`
- Modify: `package.json` (vitest 의존성)

- [ ] **Step 1: vitest + RTL 의존성**

```bash
pnpm add -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @vitejs/plugin-react
```

- [ ] **Step 2: vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
  },
});
```

- [ ] **Step 3: tests/setup.ts**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: 테스트 작성 (실패하는)**

`tests/lib/sections.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { sections, totalDurationMinutes } from "@/app/lib/sections";

describe("sections", () => {
  it("정확히 6개 섹션 + 1 Q&A 메타", () => {
    expect(sections).toHaveLength(7);
    expect(sections.map((s) => s.id)).toEqual([
      "hero", "history", "features", "embedded-demos", "impact", "getting-started", "qa",
    ]);
  });

  it("총 시간이 60분 슬롯에 들어맞는다 (±2분)", () => {
    const total = totalDurationMinutes();
    expect(total).toBeGreaterThanOrEqual(58);
    expect(total).toBeLessThanOrEqual(62);
  });
});
```

- [ ] **Step 5: 실행해서 fail 확인**

```bash
pnpm test
```
Expected: FAIL — `sections`를 찾을 수 없음.

- [ ] **Step 6: 구현**

`app/lib/sections.ts`:

```ts
export type SectionMeta = {
  id: "hero" | "history" | "features" | "embedded-demos" | "impact" | "getting-started" | "qa";
  number: number | null;     // 인덱스에 보이는 번호 (Hero/QA는 null)
  title: string;             // 짧은 제목 (사이드 인덱스용)
  longTitle: string;         // 본문 헤딩
  durationMinutes: number;   // 강의 시간 배분
};

export const sections: readonly SectionMeta[] = [
  { id: "hero",            number: null, title: "Hero",     longTitle: "Claude Code 1시간",                              durationMinutes: 2 },
  { id: "history",         number: 1,    title: "Claude Code란?", longTitle: "Claude Code란? + 짧은 역사",              durationMinutes: 3 },
  { id: "features",        number: 2,    title: "핵심 기능",  longTitle: "핵심 기능 투어",                                durationMinutes: 13 },
  { id: "embedded-demos",  number: 3,    title: "임베디드 데모", longTitle: "임베디드 라이브 데모 — U-Boot 메모리 서브시스템", durationMinutes: 27 },
  { id: "impact",          number: 4,    title: "효과",       longTitle: "효과 — 한 사람의 생산성이 어떻게 바뀌나",          durationMinutes: 5 },
  { id: "getting-started", number: 5,    title: "시작하기",   longTitle: "시작하기 + 다음 스텝",                            durationMinutes: 3 },
  { id: "qa",              number: null, title: "Q&A",       longTitle: "Q&A",                                            durationMinutes: 5 },
];

export function totalDurationMinutes(): number {
  return sections.reduce((acc, s) => acc + s.durationMinutes, 0);
}
```

- [ ] **Step 7: 테스트 통과 확인**

```bash
pnpm test
```
Expected: PASS.

- [ ] **Step 8: 커밋**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts tests/ app/lib/sections.ts
git commit -m "feat: add section metadata as single source of truth"
```

---

## Task 8: `useInView` 훅

**Files:**
- Create: `app/lib/useInView.ts`
- Create: `tests/lib/useInView.test.ts`

- [ ] **Step 1: 테스트 작성 (실패)**

`tests/lib/useInView.test.ts`:

```ts
import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInView } from "@/app/lib/useInView";

class MockObserver {
  static instances: MockObserver[] = [];
  cb: IntersectionObserverCallback;
  el: Element | null = null;
  constructor(cb: IntersectionObserverCallback) {
    this.cb = cb;
    MockObserver.instances.push(this);
  }
  observe(el: Element) { this.el = el; }
  disconnect() {}
  trigger(isIntersecting: boolean) {
    this.cb(
      [{ isIntersecting, target: this.el!, intersectionRatio: isIntersecting ? 1 : 0 } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

beforeEach(() => {
  MockObserver.instances = [];
  // @ts-expect-error
  globalThis.IntersectionObserver = MockObserver;
});

describe("useInView", () => {
  it("진입 시 true, 이탈 시 false", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>());
    const div = document.createElement("div");
    act(() => { (result.current.ref as React.MutableRefObject<HTMLDivElement>).current = div; });
    const obs = MockObserver.instances[0];
    expect(obs).toBeDefined();
    act(() => obs.trigger(true));
    expect(result.current.inView).toBe(true);
    act(() => obs.trigger(false));
    expect(result.current.inView).toBe(false);
  });
});
```

- [ ] **Step 2: 실행해서 fail 확인**

```bash
pnpm test useInView
```
Expected: FAIL.

- [ ] **Step 3: 구현**

`app/lib/useInView.ts`:

```ts
"use client";
import { useEffect, useRef, useState } from "react";

export function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4, ...options },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
pnpm test useInView
```
Expected: PASS.

- [ ] **Step 5: 커밋**

```bash
git add app/lib/useInView.ts tests/lib/useInView.test.ts
git commit -m "feat: add useInView hook with intersection observer"
```

---

## Task 9: ScrollSection 래퍼

**Files:**
- Create: `app/components/ScrollSection.tsx`

- [ ] **Step 1: 구현**

`app/components/ScrollSection.tsx`:

```tsx
"use client";
import { useEffect } from "react";
import { useInView } from "@/app/lib/useInView";
import type { SectionMeta } from "@/app/lib/sections";

type Props = {
  section: SectionMeta;
  onEnter?: (id: SectionMeta["id"]) => void;
  children: React.ReactNode;
};

export function ScrollSection({ section, onEnter, children }: Props) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.5 });
  useEffect(() => {
    if (inView) onEnter?.(section.id);
  }, [inView, section.id, onEnter]);
  return (
    <section
      ref={ref}
      id={section.id}
      data-section-id={section.id}
      className="min-h-screen flex flex-col justify-center px-12 py-20"
    >
      {children}
    </section>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add app/components/ScrollSection.tsx
git commit -m "feat: add ScrollSection wrapper with viewport callback"
```

---

## Task 10: SideIndex 컴포넌트

**Files:**
- Create: `app/components/SideIndex.tsx`
- Create: `tests/components/SideIndex.test.tsx`

- [ ] **Step 1: 테스트 (실패)**

`tests/components/SideIndex.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SideIndex } from "@/app/components/SideIndex";

describe("SideIndex", () => {
  it("7개 항목을 렌더하고 active를 강조", () => {
    render(<SideIndex activeId="features" />);
    expect(screen.getByText("Hero")).toBeInTheDocument();
    expect(screen.getByText(/핵심 기능/)).toBeInTheDocument();
    const active = screen.getByText(/핵심 기능/).closest("a");
    expect(active).toHaveAttribute("data-active", "true");
  });
});
```

- [ ] **Step 2: 실행해서 fail 확인**

```bash
pnpm test SideIndex
```

- [ ] **Step 3: 구현**

`app/components/SideIndex.tsx`:

```tsx
"use client";
import { sections } from "@/app/lib/sections";

type Props = { activeId: string | null };

export function SideIndex({ activeId }: Props) {
  return (
    <nav
      aria-label="강의 인덱스"
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
    >
      <ul className="space-y-3 text-sm">
        {sections.map((s) => {
          const isActive = s.id === activeId;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                data-active={isActive}
                className={
                  "flex items-center gap-3 py-1 transition-colors duration-300 ease-smooth " +
                  (isActive ? "text-accent" : "text-ink-muted hover:text-ink-soft")
                }
              >
                <span
                  aria-hidden
                  className={
                    "block h-2 w-2 rounded-full " +
                    (isActive ? "bg-accent" : "bg-ink-muted/50")
                  }
                />
                <span>{s.number !== null ? `§${s.number} ` : ""}{s.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
pnpm test SideIndex
```

- [ ] **Step 5: 커밋**

```bash
git add app/components/SideIndex.tsx tests/components/SideIndex.test.tsx
git commit -m "feat: add SideIndex with active section highlight"
```

---

## Task 11: ProgressBar 컴포넌트 (강사용 진행도/시간 가이드)

**Files:**
- Create: `app/components/ProgressBar.tsx`
- Create: `tests/components/ProgressBar.test.tsx`

- [ ] **Step 1: 테스트 (실패)**

`tests/components/ProgressBar.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "@/app/components/ProgressBar";

describe("ProgressBar", () => {
  it("현재 섹션과 남은 시간을 표시한다", () => {
    render(<ProgressBar activeId="features" />);
    expect(screen.getByText(/§2 핵심 기능/)).toBeInTheDocument();
    // features 13 + embedded 27 + impact 5 + getting 3 + qa 5 = 53분
    expect(screen.getByText(/남은 ~53분/)).toBeInTheDocument();
  });

  it("activeId가 null이면 숨긴다", () => {
    const { container } = render(<ProgressBar activeId={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: 실행해서 fail 확인**

```bash
pnpm test ProgressBar
```

- [ ] **Step 3: 구현**

`app/components/ProgressBar.tsx`:

```tsx
"use client";
import { sections, type SectionMeta } from "@/app/lib/sections";

type Props = { activeId: SectionMeta["id"] | null };

export function ProgressBar({ activeId }: Props) {
  if (!activeId) return null;
  const idx = sections.findIndex((s) => s.id === activeId);
  if (idx < 0) return null;
  const current = sections[idx];
  const remaining = sections.slice(idx).reduce((a, s) => a + s.durationMinutes, 0);
  const percent = Math.round(((idx + 1) / sections.length) * 100);
  const label = current.number !== null ? `§${current.number} ${current.title}` : current.title;
  return (
    <aside
      aria-label="강사 진행 가이드"
      className="fixed bottom-6 right-6 z-40 rounded-md bg-bg-panel/90 backdrop-blur px-4 py-3 text-xs text-ink-soft shadow-lg ring-1 ring-white/5 hidden lg:block"
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-accent">{label}</span>
        <span className="text-ink-muted">·</span>
        <span>남은 ~{remaining}분</span>
        <span className="text-ink-muted">·</span>
        <span>{percent}%</span>
      </div>
    </aside>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
pnpm test ProgressBar
```

- [ ] **Step 5: 커밋**

```bash
git add app/components/ProgressBar.tsx tests/components/ProgressBar.test.tsx
git commit -m "feat: add ProgressBar showing current section and remaining time"
```

---

## Task 12: 공용 표시 컴포넌트 — Card / Callout / CodeBlock / VideoPlaceholder

**Files:**
- Create: `app/components/Card.tsx`
- Create: `app/components/Callout.tsx`
- Create: `app/components/CodeBlock.tsx`
- Create: `app/components/VideoPlaceholder.tsx`
- Modify: `package.json` (`react-syntax-highlighter`)

- [ ] **Step 1: react-syntax-highlighter 설치**

```bash
pnpm add react-syntax-highlighter
pnpm add -D @types/react-syntax-highlighter
```

- [ ] **Step 2: Card.tsx**

```tsx
type Props = {
  title?: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
};
export function Card({ title, eyebrow, children, className = "" }: Props) {
  return (
    <article className={`rounded-lg bg-bg-soft p-6 ring-1 ring-white/5 ${className}`}>
      {eyebrow && <div className="mb-1 text-xs uppercase tracking-wider text-accent">{eyebrow}</div>}
      {title && <h3 className="mb-3 text-xl font-semibold">{title}</h3>}
      <div className="text-ink-soft leading-relaxed">{children}</div>
    </article>
  );
}
```

- [ ] **Step 3: Callout.tsx**

```tsx
type Tone = "info" | "warn" | "ok";
type Props = { tone?: Tone; title?: string; children: React.ReactNode };

const toneClass: Record<Tone, string> = {
  info: "border-accent/40 bg-accent/5",
  warn: "border-warn/40 bg-warn/5",
  ok: "border-ok/40 bg-ok/5",
};
export function Callout({ tone = "info", title, children }: Props) {
  return (
    <div className={`rounded-md border-l-4 px-4 py-3 ${toneClass[tone]}`}>
      {title && <div className="mb-1 font-semibold">{title}</div>}
      <div className="text-ink-soft">{children}</div>
    </div>
  );
}
```

- [ ] **Step 4: CodeBlock.tsx**

```tsx
"use client";
import { Prism } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = { lang?: string; children: string };
export function CodeBlock({ lang = "bash", children }: Props) {
  return (
    <div className="rounded-md overflow-hidden text-sm">
      <Prism language={lang} style={vscDarkPlus} customStyle={{ margin: 0, background: "#101014" }}>
        {children.trim()}
      </Prism>
    </div>
  );
}
```

- [ ] **Step 5: VideoPlaceholder.tsx — 검은 박스 + 영상 ID 라벨**

```tsx
type Props = { videoId: string; aspect?: "video" | "square"; note?: string };
export function VideoPlaceholder({ videoId, aspect = "video", note }: Props) {
  const aspectClass = aspect === "square" ? "aspect-square" : "aspect-video";
  return (
    <div
      className={`relative ${aspectClass} w-full overflow-hidden rounded-md bg-bg-panel ring-1 ring-white/10`}
      aria-label={`영상 자리: ${videoId}`}
    >
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-mono text-3xl text-accent">{videoId}</div>
          <div className="mt-2 text-sm text-ink-muted">영상 자리 · 플랜 2~3에서 채워짐</div>
          {note && <div className="mt-2 text-xs text-ink-muted">{note}</div>}
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] [background-image:repeating-linear-gradient(0deg,transparent_0_2px,#fff_2px_3px)]"
      />
    </div>
  );
}
```

- [ ] **Step 6: `pnpm test`로 깨지는 게 없는지 확인**

```bash
pnpm test
```
Expected: 기존 테스트 모두 PASS.

- [ ] **Step 7: 커밋**

```bash
git add package.json pnpm-lock.yaml app/components/
git commit -m "feat: add display primitives (Card, Callout, CodeBlock, VideoPlaceholder)"
```

---

## Task 13: VideoPlayer (Remotion 통합) + Mermaid

**Files:**
- Create: `app/components/VideoPlayer.tsx`
- Create: `app/components/Mermaid.tsx`
- Modify: `package.json` (`mermaid`)

- [ ] **Step 1: Mermaid 설치**

```bash
pnpm add mermaid
```

- [ ] **Step 2: VideoPlayer.tsx**

```tsx
"use client";
import { Player } from "@remotion/player";
import { useInView } from "@/app/lib/useInView";

type Props<T> = {
  composition: React.ComponentType<T>;
  inputProps: T;
  durationInFrames: number;
  fps?: number;
  width?: number;
  height?: number;
};

export function VideoPlayer<T>({
  composition,
  inputProps,
  durationInFrames,
  fps = 30,
  width = 1920,
  height = 1080,
}: Props<T>) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.5 });
  return (
    <div ref={ref} className="overflow-hidden rounded-md ring-1 ring-white/10">
      <Player
        component={composition as React.ComponentType<unknown>}
        inputProps={inputProps as unknown}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={width}
        compositionHeight={height}
        style={{ width: "100%", aspectRatio: `${width} / ${height}` }}
        autoPlay={inView}
        controls
        loop={false}
      />
    </div>
  );
}
```

- [ ] **Step 3: Mermaid.tsx — DOMParser로 안전하게 SVG 삽입**

```tsx
"use client";
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

type Props = { chart: string; id?: string };
let initialized = false;

export function Mermaid({ chart, id = "m" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({ startOnLoad: false, theme: "dark", securityLevel: "strict" });
      initialized = true;
    }
    const host = ref.current;
    if (!host) return;
    const uid = `${id}-${Math.random().toString(36).slice(2)}`;
    let cancelled = false;
    mermaid.render(uid, chart).then(({ svg }) => {
      if (cancelled || !host) return;
      // mermaid는 securityLevel: "strict" 로 자체 sanitize 하지만,
      // innerHTML 직접 할당을 피하기 위해 DOMParser로 파싱 후 노드 교체.
      const parsed = new DOMParser().parseFromString(svg, "image/svg+xml");
      const svgEl = parsed.documentElement;
      host.replaceChildren(svgEl);
    });
    return () => { cancelled = true; };
  }, [chart, id]);
  return <div ref={ref} className="overflow-x-auto" />;
}
```

- [ ] **Step 4: `pnpm test` 깨지지 않는지 확인 + `pnpm dev`로 import 에러 없음 확인**

```bash
pnpm test
pnpm dev   # http://localhost:3000 에러 없는지 확인 후 종료
```

- [ ] **Step 5: 커밋**

```bash
git add package.json pnpm-lock.yaml app/components/
git commit -m "feat: add VideoPlayer (Remotion player) and Mermaid component"
```

---

## Task 14: 페이지 골격 — 빈 7 섹션 + SideIndex + ProgressBar

**Files:**
- Modify: `app/page.tsx`
- Create: `app/sections/Hero.tsx` (빈 자리)
- Create: `app/sections/History.tsx`
- Create: `app/sections/Features.tsx`
- Create: `app/sections/EmbeddedDemos.tsx`
- Create: `app/sections/Impact.tsx`
- Create: `app/sections/GettingStarted.tsx`
- Create: `app/sections/QA.tsx`

- [ ] **Step 1: 각 섹션 빈 컴포넌트 7개 생성**

7개 모두 같은 패턴. 예시 — `app/sections/Hero.tsx`:

```tsx
import { ScrollSection } from "@/app/components/ScrollSection";
import { sections } from "@/app/lib/sections";

const meta = sections.find((s) => s.id === "hero")!;

export function Hero({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <h2 className="text-2xl text-ink-muted">{meta.longTitle}</h2>
      <p className="mt-2 text-sm text-ink-muted">콘텐츠는 다음 task에서 채워짐</p>
    </ScrollSection>
  );
}
```

같은 패턴으로 `History.tsx`, `Features.tsx`, `EmbeddedDemos.tsx`, `Impact.tsx`, `GettingStarted.tsx`, `QA.tsx` 6개 더 — `id`만 자기 섹션으로.

- [ ] **Step 2: app/page.tsx 갱신 — 7섹션 + SideIndex + ProgressBar**

```tsx
"use client";
import { useState } from "react";
import { SideIndex } from "@/app/components/SideIndex";
import { ProgressBar } from "@/app/components/ProgressBar";
import { Hero } from "@/app/sections/Hero";
import { History } from "@/app/sections/History";
import { Features } from "@/app/sections/Features";
import { EmbeddedDemos } from "@/app/sections/EmbeddedDemos";
import { Impact } from "@/app/sections/Impact";
import { GettingStarted } from "@/app/sections/GettingStarted";
import { QA } from "@/app/sections/QA";
import type { SectionMeta } from "@/app/lib/sections";

export default function Page() {
  const [activeId, setActiveId] = useState<SectionMeta["id"] | null>(null);
  return (
    <main>
      <SideIndex activeId={activeId} />
      <ProgressBar activeId={activeId} />
      <Hero onEnter={setActiveId} />
      <History onEnter={setActiveId} />
      <Features onEnter={setActiveId} />
      <EmbeddedDemos onEnter={setActiveId} />
      <Impact onEnter={setActiveId} />
      <GettingStarted onEnter={setActiveId} />
      <QA onEnter={setActiveId} />
    </main>
  );
}
```

- [ ] **Step 3: `pnpm dev` 확인**

```bash
pnpm dev
```
- 7개 빈 섹션이 위→아래 스크롤됨
- 좌측 인덱스가 현재 섹션 따라 하이라이트
- 우측 하단 진행도가 "§N 제목 · 남은 ~XX분 · NN%" 표시
- 종료

- [ ] **Step 4: 커밋**

```bash
git add app/sections/ app/page.tsx
git commit -m "feat: scaffold all 7 sections with SideIndex and ProgressBar wiring"
```

---

## Task 15: Hero 섹션 — 후킹 + V0 자리

**Files:**
- Modify: `app/sections/Hero.tsx`

- [ ] **Step 1: 콘텐츠 채우기**

```tsx
import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlaceholder } from "@/app/components/VideoPlaceholder";
import { sections } from "@/app/lib/sections";

const meta = sections.find((s) => s.id === "hero")!;

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
            U-Boot의 NAND 컨트롤러 드라이버 위에서, 가짜 데모 없이 직접 보여드립니다.
          </p>
          <div className="mt-10 text-sm text-ink-muted">↓ 시작</div>
        </div>
        <div className="opacity-90">
          <VideoPlaceholder videoId="V0" note="Hero 배경 루프 · 임베디드 데모 하이라이트 (15초)" />
        </div>
      </div>
    </ScrollSection>
  );
}
```

- [ ] **Step 2: `pnpm dev` 확인 후 종료**

- [ ] **Step 3: 커밋**

```bash
git add app/sections/Hero.tsx
git commit -m "feat: build Hero section with hook and V0 placeholder"
```

---

## Task 16: §1 History — 한 줄 정의 + V1 + 동향 카드

**Files:**
- Modify: `app/sections/History.tsx`

- [ ] **Step 1: 콘텐츠**

```tsx
import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlaceholder } from "@/app/components/VideoPlaceholder";
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
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.4fr] gap-10 items-start">
        <div className="space-y-6">
          <Callout tone="info" title="한 줄 정의">
            <p className="font-mono text-lg">
              Claude Code = 터미널에서 자율적으로 일하는 코드 동료
            </p>
          </Callout>
          <p className="text-ink-soft">
            웹 개발자만의 도구가 아닙니다. C/C++, 빌드 시스템, 디바이스 트리, 펌웨어 — 메모리 컨트롤러 엔지니어가 매일 만지는 영역에서 Claude Code는 강합니다.
          </p>
        </div>
        <div>
          <VideoPlaceholder videoId="V1" note="역사 타임라인 (90초)" />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card eyebrow="최근 6개월" title="Plugins / Skills">
          호출 가능한 절차와 커뮤니티 스킬 생태계가 폭발적으로 확장.
        </Card>
        <Card eyebrow="최근 6개월" title="Subagent / Hook 표준화">
          큰 작업 위임과 자동 트리거가 1급 시민으로 자리 잡음.
        </Card>
        <Card eyebrow="최근 6개월" title="SDK · IDE 통합">
          VS Code · JetBrains · Web · CLI 어디서든 같은 에이전틱 루프.
        </Card>
      </div>
    </ScrollSection>
  );
}
```

- [ ] **Step 2: 확인 + 커밋**

```bash
pnpm dev   # 시각 확인 후 종료
git add app/sections/History.tsx
git commit -m "feat: build §1 History with one-liner, V1 placeholder, and trend cards"
```

---

## Task 17: §2 Features — 5개 핵심 기능 + V2~V6 자리

**Files:**
- Modify: `app/sections/Features.tsx`

- [ ] **Step 1: 콘텐츠**

```tsx
import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlaceholder } from "@/app/components/VideoPlaceholder";
import { Card } from "@/app/components/Card";
import { sections } from "@/app/lib/sections";

const meta = sections.find((s) => s.id === "features")!;

const features = [
  {
    videoId: "V2",
    title: "CLI + 에이전틱 루프",
    body: "사람이 한 번 시키면, Claude가 사고 → 도구 호출 → 관찰 → 다음 행동을 스스로 반복. 보드 디버깅 때 '이거 보고, 저거 시도하고...' 하는 그 루프와 똑같음.",
    note: "CLI 60초 시뮬레이션",
  },
  {
    videoId: "V3",
    title: "CLAUDE.md = 프로젝트의 기억",
    body: "팀의 빌드 명령·코딩 규칙·하드웨어 제약을 적어두면 Claude가 매 세션마다 그걸 알고 시작. 신규 입사자에게 알려주듯이 한 번만.",
    note: "CLAUDE.md 45초 모션",
  },
  {
    videoId: "V4",
    title: "도구 사용 (Read · Edit · Bash · Grep)",
    body: "말만 하는 게 아니라 실제로 파일을 읽고 고치고 빌드를 돌림. 이게 ChatGPT 웹 채팅과의 결정적 차이.",
    note: "도구 호출 60초",
  },
  {
    videoId: "V5",
    title: "MCP — 외부 시스템과의 다리",
    body: "GitHub · DB · Jira · 내부 시스템에 Claude가 직접 접근. JTAG 디버거나 측정장비도 MCP로 연결 가능.",
    note: "MCP 다이어그램 60초",
  },
  {
    videoId: "V6",
    title: "Skills · Subagents · Hooks",
    body: "Skill = 자주 하는 절차의 호출 가능한 형태. Subagent = 큰 작업의 위임. Hook = 자동 트리거(예: 커밋 전 단위테스트).",
    note: "세 개념 90초",
  },
];

export function Features({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <header className="mb-10">
        <div className="text-xs uppercase tracking-wider text-accent">§2</div>
        <h2 className="mt-1 text-4xl font-semibold">{meta.longTitle}</h2>
        <p className="mt-2 text-ink-muted">5개 영상 + 5개 슬라이드, 약 13분</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {features.map((f) => (
          <Card key={f.videoId} eyebrow={f.videoId} title={f.title}>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr,1fr] gap-4 items-start">
              <p>{f.body}</p>
              <VideoPlaceholder videoId={f.videoId} note={f.note} />
            </div>
          </Card>
        ))}
      </div>
    </ScrollSection>
  );
}
```

- [ ] **Step 2: 확인 + 커밋**

```bash
pnpm dev   # 종료 후
git add app/sections/Features.tsx
git commit -m "feat: build §2 Features with 5 capability cards and V2-V6 placeholders"
```

---

## Task 18: §3 EmbeddedDemos — 4종 데모 카드 + V7-A/C/E/H + 절감 표

**Files:**
- Modify: `app/sections/EmbeddedDemos.tsx`

- [ ] **Step 1: 콘텐츠**

```tsx
import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlaceholder } from "@/app/components/VideoPlaceholder";
import { Card } from "@/app/components/Card";
import { Callout } from "@/app/components/Callout";
import { CodeBlock } from "@/app/components/CodeBlock";
import { sections } from "@/app/lib/sections";

const meta = sections.find((s) => s.id === "embedded-demos")!;

type Demo = {
  id: "A" | "C" | "E" | "H";
  videoId: string;
  title: string;
  setup: string;
  prompt: string;
  result: string;
  emphasis: string;
};

const demos: Demo[] = [
  {
    id: "A", videoId: "V7-A",
    title: "레거시 C 분석·리팩토링",
    setup: "U-Boot drivers/mtd/nand/raw/ 의 NAND 컨트롤러 드라이버 (600~800라인, 레거시).",
    prompt: "이 NAND 컨트롤러 드라이버의 함수별 책임을 정리하고, 명령 시퀀서·ECC·DMA 부분을 책임 단위로 분리할 수 있게 리팩토링을 제안해줘. 비트필드 매크로 가독성 개선 포함.",
    result: "함수 책임 마크다운 표 + Mermaid 다이어그램 + 매크로 → FIELD_PREP/FIELD_GET 변환 diff",
    emphasis: "10년 된 코드를 30초에 의미 단위로 분리해 읽음. 코드리뷰 시작점이 0이 아니라 70%.",
  },
  {
    id: "C", videoId: "V7-C",
    title: "빌드 시스템 다루기",
    setup: "새 IP rev(가칭 V2) 지원을 위해 Kconfig 옵션·Makefile·defconfig 동시 수정.",
    prompt: "CONFIG_NAND_DENALI_V2 Kconfig 옵션 추가. 관련 Makefile, defconfig까지 일관되게. sandbox 빌드가 깨지지 않게.",
    result: "Kconfig·Makefile·defconfig 동시 diff + `make sandbox_defconfig && make` 실제 통과",
    emphasis: "여러 디렉토리에 흩어진 빌드 파일을 동시에·일관되게. 가장 자주 깜빡하는 부분.",
  },
  {
    id: "E", videoId: "V7-E",
    title: "단위 테스트 자동 생성",
    setup: "NAND 컨트롤러 핵심 함수에 단위테스트가 0개임을 강조.",
    prompt: "이 함수의 unit test를 sandbox에서 돌릴 수 있게 작성. 정상 + 경계 조건(타임아웃·잘못된 명령·ECC 비트 1~3개 에러). test/dm/ 패턴 따라서.",
    result: "test/dm/nand_<ctrl>.c 신규 + Mock 레지스터 + Kconfig·Makefile 등록 + ./test/py/test.py PASS",
    emphasis: "Mock·픽스처가 귀찮아 미루던 단위테스트가 1분에 만들어지고 host에서 돌아감. 보드 없이 회귀 검증.",
  },
  {
    id: "H", videoId: "V7-H",
    title: "문서화 자동 생성",
    setup: "데모 A와 같은 드라이버. 문서가 0줄임 강조.",
    prompt: "이 드라이버의 컨트롤러 레지스터 맵을 마크다운 표로(오프셋·비트필드·의미). 'NAND read page' 명령 흐름을 Mermaid 시퀀스 다이어그램으로(CPU/컨트롤러/NAND chip).",
    result: "레지스터 맵 표 + Mermaid 시퀀스 다이어그램 + 메모리 트레이닝 흐름도",
    emphasis: "데이터시트와 코드 사이의 갭을 5분에 메움. 속도가 아니라 '안 하던 걸 하게 됨'.",
  },
];

export function EmbeddedDemos({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
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
              <VideoPlaceholder videoId={d.videoId} note="플랜 3에서 vhs+Remotion 합성" />
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
```

- [ ] **Step 2: 확인 + 커밋**

```bash
pnpm dev   # 종료 후
git add app/sections/EmbeddedDemos.tsx
git commit -m "feat: build §3 EmbeddedDemos with 4 demo cards, prompts, and savings table"
```

---

## Task 19: §4 Impact — Before/After + 차트 + 대상별 이득

**Files:**
- Modify: `app/sections/Impact.tsx`

- [ ] **Step 1: 콘텐츠**

```tsx
import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlaceholder } from "@/app/components/VideoPlaceholder";
import { Card } from "@/app/components/Card";
import { sections } from "@/app/lib/sections";

const meta = sections.find((s) => s.id === "impact")!;

const audiences = [
  { who: "시니어",   gain: "혼자 보던 코드를 둘이 보는 효과 — 검토자 역할로 격상" },
  { who: "주니어",   gain: "베테랑 옆에서 일하는 환경 — 쉬운 질문이 쉬워짐" },
  { who: "PL/리더",  gain: "문서화·온보딩이 비용이 아니라 부산물이 됨" },
  { who: "리뷰어",   gain: "리뷰 시작점이 0% → 70%에서 시작" },
];

export function Impact({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <header className="mb-10">
        <div className="text-xs uppercase tracking-wider text-accent">§4</div>
        <h2 className="mt-1 text-4xl font-semibold">{meta.longTitle}</h2>
        <p className="mt-2 text-ink-muted">한 마디: 도구가 아니라 '동시에 일하는 한 명의 동료'.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-muted">V8 · 90초</div>
          <h3 className="mt-1 mb-3 text-xl font-semibold">Before / After</h3>
          <VideoPlaceholder videoId="V8" note="좌: 사람 / 우: Claude — 27분 vs 2분 30초" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-muted">V9 · 60초</div>
          <h3 className="mt-1 mb-3 text-xl font-semibold">시간 절감 차트</h3>
          <VideoPlaceholder videoId="V9" note="막대 그래프 애니. 마지막 막대(문서화)는 다른 색 — 0 → 1" />
        </div>
      </div>

      <div className="mt-10">
        <h3 className="mb-3 text-xl font-semibold">하루/주간 워크플로우는 이렇게 바뀐다</h3>
        <p className="text-ink-soft max-w-3xl">
          회의·디버그·문서·리뷰 슬롯이 재배치됨. 회의·검토·아키텍처에 시간이 오히려 늘어나고, 보드·디버거·로직 애널라이저와 만나는 시간이 더 중요해진다.
          내 일이 줄어드는 게 아니라 내 일의 <em className="text-accent not-italic">밀도</em>가 올라간다.
        </p>
      </div>

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
    </ScrollSection>
  );
}
```

- [ ] **Step 2: 확인 + 커밋**

```bash
pnpm dev   # 종료 후
git add app/sections/Impact.tsx
git commit -m "feat: build §4 Impact with V8/V9 placeholders and audience cards"
```

---

## Task 20: §5 GettingStarted — 설치 + 템플릿 + 체크리스트 + QR

**Files:**
- Modify: `app/sections/GettingStarted.tsx`
- Modify: `package.json` (`qrcode.react`)

- [ ] **Step 1: QR 라이브러리**

```bash
pnpm add qrcode.react
```

- [ ] **Step 2: 콘텐츠**

```tsx
import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlaceholder } from "@/app/components/VideoPlaceholder";
import { CodeBlock } from "@/app/components/CodeBlock";
import { Card } from "@/app/components/Card";
import { Callout } from "@/app/components/Callout";
import { sections } from "@/app/lib/sections";
import { QRCodeSVG } from "qrcode.react";

const meta = sections.find((s) => s.id === "getting-started")!;

const claudeMdTemplate = `# 우리 프로젝트
이 프로젝트는 NAND 컨트롤러 펌웨어다.

## 빌드/실행
- 빌드: \`make sandbox_defconfig && make -j$(nproc)\`
- 단위테스트: \`./test/py/test.py --bd=sandbox\`

## 관습
- 새 컨트롤러 드라이버는 drivers/mtd/nand/raw/ 에.
- 비트필드는 FIELD_PREP/FIELD_GET 사용.

## 하드웨어 제약
- ECC: BCH-8, OOB 64바이트
- 페이지 크기: 4KB
`;

export function GettingStarted({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <header className="mb-10">
        <div className="text-xs uppercase tracking-wider text-accent">§5</div>
        <h2 className="mt-1 text-4xl font-semibold">{meta.longTitle}</h2>
        <p className="mt-2 text-ink-muted">오늘 미팅 후 30분이면 첫 명령까지.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-8 items-start">
        <div className="space-y-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-muted">V11 · 30초</div>
            <h3 className="mt-1 mb-3 text-xl font-semibold">설치 & 첫 명령</h3>
            <VideoPlaceholder videoId="V11" note="설치 → claude → 첫 질문" />
          </div>
          <Card eyebrow="템플릿" title="CLAUDE.md 첫 5~10줄">
            <CodeBlock lang="markdown">{claudeMdTemplate}</CodeBlock>
          </Card>
        </div>
        <div className="space-y-6">
          <Card eyebrow="오늘 안 해보면 손해" title="체크리스트">
            <ul className="space-y-2 text-ink-soft">
              <li>☐ <code className="font-mono">npm install -g @anthropic-ai/claude-code</code></li>
              <li>☐ 프로젝트 루트에 CLAUDE.md 5줄 작성</li>
              <li>☐ 가장 무서운 파일을 Claude에 코드리뷰 시키기</li>
              <li>☐ 단위테스트 1개 작성 시키기 (sandbox)</li>
            </ul>
          </Card>
          <Callout tone="info" title="더 알고 싶을 때">
            공식 문서 · 사내 슬랙 채널 · vibe-project-lesson(자가학습 28모듈).
          </Callout>
          <div className="rounded-lg bg-bg-soft p-6 ring-1 ring-white/5 grid place-items-center">
            <div className="text-xs uppercase tracking-wider text-ink-muted mb-3">이 강의 페이지</div>
            <QRCodeSVG value="https://example.invalid/claude-code-1hour" size={140} bgColor="#1a1a1f" fgColor="#f5f5f5" />
            <p className="mt-3 text-xs text-ink-muted">발표 직전 실제 URL로 교체</p>
          </div>
        </div>
      </div>
    </ScrollSection>
  );
}
```

- [ ] **Step 3: 확인 + 커밋**

```bash
pnpm dev   # 종료 후
git add package.json pnpm-lock.yaml app/sections/GettingStarted.tsx
git commit -m "feat: build §5 GettingStarted with install video, CLAUDE.md template, checklist, QR"
```

---

## Task 21: QA 섹션 — FAQ 카드

**Files:**
- Modify: `app/sections/QA.tsx`

- [ ] **Step 1: FAQ 카드 (라이브 Q&A의 백업)**

```tsx
import { ScrollSection } from "@/app/components/ScrollSection";
import { Card } from "@/app/components/Card";
import { sections } from "@/app/lib/sections";

const meta = sections.find((s) => s.id === "qa")!;

const faqs = [
  { q: "보안상 코드를 클라우드에 보내도 됩니까?",
    a: "엔터프라이즈 플랜은 학습 미사용 + 데이터 보존 정책 통제 가능. 자세한 내용은 보안팀 정책에 따라." },
  { q: "C 임베디드 코드를 잘 이해합니까?",
    a: "오늘 보신 U-Boot 데모가 답입니다. C/C++, Kconfig, Makefile, RTOS 코드 모두 강함." },
  { q: "하드웨어 없이 검증 안 되는 코드는?",
    a: "AI가 80%를 만들고, 사람이 보드 위에서 마무리. 일의 분담이 바뀌는 것이지 사람이 빠지는 게 아님." },
  { q: "메모리 제약·실시간성은 무시하지 않나요?",
    a: "CLAUDE.md에 제약을 명시하면 Claude가 이를 고려. 데모 H의 레지스터 맵 자동 정리도 같은 메커니즘." },
];

export function QA({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <header className="mb-10">
        <h2 className="text-4xl font-semibold">{meta.longTitle}</h2>
        <p className="mt-2 text-ink-muted">자주 묻는 질문 · 라이브 5분</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map((f) => (
          <Card key={f.q} title={f.q}>{f.a}</Card>
        ))}
      </div>
    </ScrollSection>
  );
}
```

- [ ] **Step 2: 확인 + 커밋**

```bash
pnpm dev   # 종료 후
git add app/sections/QA.tsx
git commit -m "feat: build QA section with FAQ cards"
```

---

## Task 22: 스크롤 부드러움

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: 스크롤 부드러움 적용**

`app/globals.css` 의 `html, body` 규칙을 다음으로 교체:

```css
html { scroll-behavior: smooth; }
html, body { margin: 0; padding: 0; }
body { @apply bg-bg text-ink font-sans antialiased; }
```

- [ ] **Step 2: SideIndex 항목 클릭 → 부드럽게 점프 확인**

```bash
pnpm dev   # 좌측 인덱스 클릭으로 이동 → 부드러운지 확인 후 종료
```

- [ ] **Step 3: 커밋**

```bash
git add app/globals.css
git commit -m "feat: enable smooth scroll behavior site-wide"
```

---

## Task 23: 정적 빌드 검증 + 1080p 시각 검증

**Files:**
- (변경 없음 — 검증만)

- [ ] **Step 1: 정적 빌드 통과 확인**

```bash
pnpm build
```
Expected: 빌드 성공. 에러 0.

- [ ] **Step 2: 1080p 검증**

```bash
pnpm dev
```
- 브라우저 창을 1920×1080으로 (Chrome DevTools `Cmd/Ctrl+Shift+M` → "1920×1080")
- 좌측 인덱스 보임, 우측 진행도 보임
- 7섹션 모두 스크롤 가능
- 본문 텍스트가 너무 작거나 줄바꿈이 어색하지 않음

종료 후 발견된 시각 이슈는 다음 step에서 수정.

- [ ] **Step 3: 명백한 시각 이슈가 있으면 수정 (없으면 skip)**

자주 나오는 이슈와 수정 예:
- Hero 헤딩이 너무 크면 `text-5xl lg:text-6xl` → `text-4xl lg:text-5xl`
- 카드 내부 패딩이 좁으면 `p-6` → `p-7`

수정 후 한 번 더 확인.

- [ ] **Step 4: 커밋 (수정이 있었으면)**

```bash
git add -A
git commit -m "fix: visual polish for 1920x1080"
```

---

## Task 24: M1+M2 검증 체크리스트 통과

**Files:**
- (검증 + CLAUDE.md 진행 상황 갱신)

- [ ] **Step 1: 검증 체크리스트 (모두 ✓ 되어야 통과)**

| # | 체크 |
|---|---|
| 1 | `pnpm install`이 깨끗이 통과 |
| 2 | `pnpm test`가 모두 PASS (sections, useInView, SideIndex, ProgressBar) |
| 3 | `pnpm dev`로 7섹션이 위→아래 스크롤 |
| 4 | 좌측 인덱스가 현재 섹션 따라 하이라이트 |
| 5 | 우측 하단 진행도가 "§N · 남은 ~XX분 · NN%" 표시 |
| 6 | Hero / §1 / §2 / §3 / §4 / §5 / Q&A 콘텐츠 모두 보임 |
| 7 | 영상 자리(V0~V11)가 검은 placeholder + 라벨로 표시 |
| 8 | `pnpm build`가 성공 |
| 9 | 영상이 빠진 채로도 강사가 1바퀴 발표 가능 |
| 10 | `pnpm remotion:studio`가 placeholder Composition을 보여줌 |
| 11 | 사용자 시스템 정보(호스트명/IP/사용자명)가 코드·스크립트에 노출되지 않음 |

- [ ] **Step 2: 모두 통과하면 마일스톤 태그**

```bash
git tag m1-m2-site-scaffold
git log --oneline -10
```

- [ ] **Step 3: 다음 플랜 안내 메모를 CLAUDE.md에 추가**

`CLAUDE.md` 끝에 추가:

```markdown

## 진행 상황
- [x] 플랜 1 (M1+M2) — 사이트 골격 + 정적 콘텐츠
- [ ] 플랜 2 (M3+M4) — 모션그래픽 + R1 시뮬레이션 영상 9편
- [ ] 플랜 3 (M5) — 임베디드 데모 영상 5편
- [ ] 플랜 4 (M6) — 마감·리허설
```

- [ ] **Step 4: 커밋**

```bash
git add CLAUDE.md
git commit -m "docs: mark plan 1 (M1+M2) complete"
```

---

## 자체 리뷰 결과

스펙 §1~§9 커버리지:
- §1 목표·청중·톤 → 사이트 메타·Hero 후킹·QA(보안 등) 카드에서 다룸
- §2 정보 아키텍처 → Task 14에서 7섹션 + 인덱스 + 진행도 구현
- §3 임베디드 데모 4종 → Task 18에서 카드·프롬프트·결과·강조·절감표 모두 정적 구현 (영상은 플랜 3)
- §4 영상 카탈로그 14편 → 본 플랜은 placeholder만 (영상 본체는 플랜 2~3)
- §5 기술 스택·디렉토리 → Task 1~6, Task 12~13에서 구현
- §6 컴포넌트 책임 → 각 컴포넌트 한 가지 일 원칙 유지(Card·Callout·CodeBlock·VideoPlayer·SideIndex·ProgressBar·ScrollSection)
- §7 마일스톤 — M1·M2 부분만 본 플랜 → ✓
- §8 Done 기준 — 본 플랜의 Task 24 검증 체크리스트가 M1+M2 부분 충족
- §9 다루지 않는 것 — 영상 본체·실제 데모 녹화·리허설은 플랜 2~4

플레이스홀더 스캔: TBD/TODO 0개. 영상 자리는 의도된 `VideoPlaceholder` 컴포넌트로, 플레이스홀더가 아니라 본 플랜의 산출물 자체.

타입 일관성: `SectionMeta["id"]`는 7개 리터럴 유니온으로 모든 섹션·인덱스·진행도에서 동일 사용. `useInView`의 ref 타입은 제네릭으로 통일. `Mermaid` 컴포넌트는 DOMParser + replaceChildren 패턴으로 안전하게 SVG 삽입 (XSS 우려 회피).

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-04-28-claude-code-1hour-01-m1-m2-site-scaffold.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — 각 task마다 새 서브에이전트가 실행, task 사이에 리뷰. 빠른 반복.

**2. Inline Execution** — 이 세션에서 그대로 실행, 체크포인트마다 검토.

플랜 2~4는 본 플랜이 통과된 뒤에 작성한다 — 각 마일스톤이 끝날 때 다음 플랜의 입력이 더 명확해지기 때문(특히 플랜 3의 vhs 시나리오는 실제 Claude Code 출력 캡처에 의존).
