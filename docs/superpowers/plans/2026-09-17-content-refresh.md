# 콘텐츠 최신화 (2026-09) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `V1Timeline.tsx`의 마일스톤, `History.tsx`의 변곡점 카드, `Features.tsx`의 Skills/MCP 카드, `QA.tsx`의 문항 하나를 2026-09 현재(Claude 5 계열, Workflow 오케스트레이션, Plugins 마켓플레이스) 기준으로 갱신한다.

**Architecture:** 기존 컴포넌트 구조·데이터 배열 형태를 그대로 두고 배열 항목/문자열만 추가·수정한다. 새 컴포넌트, 새 영상, 새 라우트 없음. 각 데이터 배열(`milestones`, `faqs`)을 export해 Vitest로 배열 길이/핵심 문자열 포함 여부를 검증한다.

**Tech Stack:** Next.js 15 (App Router) + React 19 + TypeScript, Tailwind CSS, Remotion 5.x, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-17-content-refresh-design.md` (§0.1 정정본 기준 — 원래 계획인 §9은 실행하지 않음)

## Global Constraints

- 신규 영상 제작·기존 영상(V0~V11, 14편) 폐기/교체 없음 — 스펙 §0.1, §6.
- 사이트 기술 스택·디렉토리 구조 변경 없음 — 스펙 §6.
- `V1Timeline`을 사용하는 `History.tsx`의 `durationInFrames={90 * 30}` (90초) 값은 변경하지 않는다 — 스펙 §2.
- `QA.tsx`의 `faqs` 배열 항목 수는 10개를 유지한다 — 스펙 §5.
- 모든 변경 후 `pnpm build`와 `pnpm test`가 통과해야 한다 — 스펙 §7.

---

### Task 1: `V1Timeline.tsx` 마일스톤 갱신 + 테스트

**Files:**
- Modify: `remotion/compositions/V1Timeline.tsx:6-23`
- Test: `tests/remotion/V1Timeline.test.ts` (신규)

**Interfaces:**
- Produces: `V1Timeline.tsx`에서 `export const milestones: Milestone[]` (현재 파일 내부 `const`로 선언되어 있음 — export 키워드만 추가, 타입/구조 변경 없음). 이후 Task에서는 이 배열을 참조하지 않으므로 인터페이스 영향 없음.

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/remotion/V1Timeline.test.ts` 신규 생성:

```ts
import { describe, expect, it } from "vitest";
import { milestones } from "@/remotion/compositions/V1Timeline";

describe("V1Timeline milestones", () => {
  it("has 8 milestones ending with Workflow orchestration", () => {
    expect(milestones).toHaveLength(8);
    expect(milestones[milestones.length - 1]).toMatchObject({
      year: "2026 현재",
      title: "Workflow 오케스트레이션",
    });
  });

  it("includes the Claude 5 lineup milestone", () => {
    const claude5 = milestones.find((m) => m.title.includes("Claude 5"));
    expect(claude5).toBeDefined();
    expect(claude5?.title).toContain("Opus 5");
    expect(claude5?.title).toContain("Sonnet 5");
    expect(claude5?.title).toContain("Fable 5.1");
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `pnpm vitest run tests/remotion/V1Timeline.test.ts`
Expected: FAIL — `milestones` is not exported from `V1Timeline.tsx` (또는 배열 길이가 6이라 실패)

- [ ] **Step 3: `V1Timeline.tsx` 수정**

`remotion/compositions/V1Timeline.tsx`의 8~23행을 아래로 교체 (`const milestones` → `export const milestones`, 배열 마지막 항목 교체 + 2개 추가):

```ts
export const milestones: Milestone[] = [
  { year: "2021", title: "Anthropic 창립", sub: "안전한 AI 연구" },
  { year: "2022~2023", title: "Claude 1 / 2", sub: "대화형 LLM 라인업 시작" },
  {
    year: "2024",
    title: "Claude 3 (Opus/Sonnet/Haiku)",
    sub: "에이전틱 도구 사용",
  },
  { year: "2025-02", title: "Claude Code 베타", sub: "터미널 코드 동료" },
  { year: "2025 GA", title: "정식 출시 + Plugins/Skills", sub: "생태계 확장" },
  {
    year: "2026",
    title: "Subagent · Hook · MCP · IDE",
    sub: "어디서든 같은 에이전틱 루프",
  },
  {
    year: "2026",
    title: "Claude 5 계열 (Opus 5 · Sonnet 5 · Fable 5.1)",
    sub: "장시간 에이전트 작업 품질 도약",
  },
  {
    year: "2026 현재",
    title: "Workflow 오케스트레이션",
    sub: "여러 서브에이전트를 동시에 조율",
  },
];
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `pnpm vitest run tests/remotion/V1Timeline.test.ts`
Expected: PASS

- [ ] **Step 5: 90초 안에서 8개 항목이 겹치거나 잘리지 않는지 렌더 확인**

`remotion/compositions/V1Timeline.tsx`의 25행 이후 렌더 로직을 읽고, 마일스톤 배열 길이에 따라 세로/가로 간격이 자동으로 나뉘는지 확인한다. 만약 항목 수가 고정 상수(예: 6등분 grid)로 하드코딩돼 있다면 8등분에 맞게 그 상수만 수정한다(레이아웃 재설계는 하지 않는다 — 값만 6→8로).

Run: `pnpm remotion:studio` 로 `V1Timeline` composition을 열어 90초 재생 중 텍스트 겹침/잘림이 없는지 육안 확인.
Expected: 8개 마일스톤이 순서대로 나타나고 겹치지 않음.

- [ ] **Step 6: Commit**

```bash
git add remotion/compositions/V1Timeline.tsx tests/remotion/V1Timeline.test.ts
git commit -m "feat(content): 타임라인에 Claude 5 계열·Workflow 마일스톤 추가"
```

---

### Task 2: `History.tsx` 변곡점 카드 문구 갱신

**Files:**
- Modify: `app/sections/History.tsx:61-66`

**Interfaces:**
- Consumes: 없음 (독립적인 JSX 텍스트 변경).
- Produces: 없음 (다른 Task가 참조하지 않음).

이 파일은 정적 JSX 텍스트라 별도 유닛 테스트 대상이 아니다(기존 테스트 스위트에도 섹션 컴포넌트 스냅샷 테스트가 없음). `pnpm build`가 통과하면 타입/문법 오류가 없다는 뜻이므로 이를 검증 수단으로 삼는다.

- [ ] **Step 1: 카드 텍스트 수정**

`app/sections/History.tsx`의 61~66행:

```tsx
          <Card eyebrow="2025~2026" title="팀 규칙을 함께 쓴다">
            <p>
              `CLAUDE.md`, Skills, Hooks 로 팀 절차를 반복 가능하게 만들 수 있습니다.
              개인 요령이 아니라 <strong>팀의 작업 방식</strong>으로 붙는다는 점이 변곡점입니다.
            </p>
          </Card>
```

를 아래로 교체:

```tsx
          <Card eyebrow="2026" title="팀 규칙을 함께 쓴다">
            <p>
              `CLAUDE.md`, Skills, Hooks 로 팀 절차를 반복 가능하게 만들 수 있습니다.
              개인 요령이 아니라 <strong>팀의 작업 방식</strong>으로 붙는다는 점이 변곡점입니다.
              여기에 더해 <strong>Workflow</strong>로 여러 서브에이전트를 동시에 굴려 사람이
              결과만 취합하는 단계까지 왔습니다.
            </p>
          </Card>
```

- [ ] **Step 2: 빌드로 검증**

Run: `pnpm build`
Expected: 빌드 성공, 타입 에러 없음.

- [ ] **Step 3: 로컬에서 육안 확인**

Run: `pnpm dev` 후 브라우저로 §1(역사) 섹션의 세 번째 카드가 새 문구로 렌더되는지, 카드 높이가 다른 두 카드와 크게 어긋나지 않는지(3열 grid가 `items-start`라 카드 높이가 달라도 레이아웃은 깨지지 않음, `app/sections/History.tsx:48`의 `grid-cols-1 md:grid-cols-3 gap-4` 확인) 확인한다.

- [ ] **Step 4: Commit**

```bash
git add app/sections/History.tsx
git commit -m "feat(content): 역사 섹션 세 번째 카드에 Workflow 오케스트레이션 반영"
```

---

### Task 3: `Features.tsx` V5/V6 카드 본문 확장

**Files:**
- Modify: `app/sections/Features.tsx:144-182`

**Interfaces:**
- Consumes: 없음.
- Produces: 없음.

- [ ] **Step 1: V5(MCP) 카드 `body` 배열 수정**

`app/sections/Features.tsx` 144~164행 중 V5 feature 객체의 `body` 필드(148~151행):

```ts
    body: [
      "GitHub · DB · Jira · 내부 시스템에 Claude 가 직접 접근. Model Context Protocol 이 표준 인터페이스.",
      "사내에 이미 있는 도구를 Claude 와 잇는 표준 방법. 매번 별도 통합 코드를 짤 필요가 없습니다.",
    ],
```

를 아래로 교체 (두 번째 문장 뒤에 한 문장 추가):

```ts
    body: [
      "GitHub · DB · Jira · 내부 시스템에 Claude 가 직접 접근. Model Context Protocol 이 표준 인터페이스.",
      "사내에 이미 있는 도구를 Claude 와 잇는 표준 방법. 매번 별도 통합 코드를 짤 필요가 없습니다.",
      "서드파티가 만든 MCP 서버·Skill 묶음을 Plugins 마켓플레이스에서 그대로 설치할 수도 있습니다.",
    ],
```

- [ ] **Step 2: V6(Skills/Subagents/Hooks) 카드 `body` 배열 수정**

같은 파일 165~182행 중 V6 feature 객체의 `body` 필드(169~173행):

```ts
    body: [
      "Skill = 자주 하는 절차의 호출 가능한 형태(릴리즈 노트 작성·MISRA 점검).",
      "Subagent = 큰 작업의 위임. 메인 컨텍스트를 더럽히지 않고 “이 디렉토리만 정리” 같은 분담.",
      "Hook = 자동 트리거. 커밋 전 단위테스트, 빌드 후 정적 분석, 위험 명령 차단까지.",
    ],
```

를 아래로 교체 (Subagent 문장 뒤에 한 문장 추가):

```ts
    body: [
      "Skill = 자주 하는 절차의 호출 가능한 형태(릴리즈 노트 작성·MISRA 점검).",
      "Subagent = 큰 작업의 위임. 메인 컨텍스트를 더럽히지 않고 “이 디렉토리만 정리” 같은 분담.",
      "여러 Subagent를 한 번에 계획·팬아웃하는 Workflow로 묶으면, 데모 A/C/E/H 같은 작업을 병렬로 동시에 돌릴 수도 있습니다.",
      "Hook = 자동 트리거. 커밋 전 단위테스트, 빌드 후 정적 분석, 위험 명령 차단까지.",
    ],
```

- [ ] **Step 3: "기능 도입 순서" 표의 Month 2 행 문구 수정**

같은 파일 266행:

```tsx
              <tr><td className="px-4 py-2.5 font-mono text-xs text-accent">Month 2</td><td>Subagents · Hooks</td><td>팀 워크플로우 표준화</td><td>자동 게이트와 금기 정의</td></tr>
```

를 아래로 교체 (마지막 열만 수정):

```tsx
              <tr><td className="px-4 py-2.5 font-mono text-xs text-accent">Month 2</td><td>Subagents · Hooks</td><td>팀 워크플로우 표준화</td><td>자동 게이트·금기 정의 + Workflow로 반복 작업 팬아웃</td></tr>
```

- [ ] **Step 4: 빌드로 검증**

Run: `pnpm build`
Expected: 빌드 성공.

- [ ] **Step 5: 육안 확인**

Run: `pnpm dev` 후 §2(핵심 기능 투어)의 MCP 카드, Skills/Subagents/Hooks 카드 본문이 3~4문장으로 늘어나도 카드 레이아웃(`grid-cols-1 sm:grid-cols-[1fr,1fr]`, `app/sections/Features.tsx:218`)이 깨지지 않는지 확인. 문장이 늘어 카드가 길어지는 것은 허용(다른 카드와 높이가 달라도 `items-start` grid라 문제 없음).

- [ ] **Step 6: Commit**

```bash
git add app/sections/Features.tsx
git commit -m "feat(content): MCP/Skills 카드에 Plugins·Workflow 오케스트레이션 반영"
```

---

### Task 4: `QA.tsx` 문항 교체 + 테스트

**Files:**
- Modify: `app/sections/QA.tsx:6-61`
- Test: `tests/sections/QA.test.ts` (신규)

**Interfaces:**
- Produces: `app/sections/QA.tsx`에서 `export const faqs: FAQ[]` (기존 `type FAQ`도 함께 export 필요 — 현재 파일 내부 타입/상수, export 키워드만 추가).

- [ ] **Step 1: 실패하는 테스트 작성**

`tests/sections/QA.test.ts` 신규 생성:

```ts
import { describe, expect, it } from "vitest";
import { faqs } from "@/app/sections/QA";

describe("QA faqs", () => {
  it("keeps exactly 10 questions", () => {
    expect(faqs).toHaveLength(10);
  });

  it("replaces the skill-gap question with a Workflow question", () => {
    const hasOldQuestion = faqs.some((f) =>
      f.q.includes("잘 쓰는 사람과 못 쓰는 사람"),
    );
    expect(hasOldQuestion).toBe(false);

    const workflowFaq = faqs.find((f) => f.q.includes("Workflow"));
    expect(workflowFaq).toBeDefined();
    expect(workflowFaq?.tag).toBe("활용");
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `pnpm vitest run tests/sections/QA.test.ts`
Expected: FAIL — `faqs` is not exported from `QA.tsx` (또는 옛 문항이 아직 존재해 실패)

- [ ] **Step 3: `QA.tsx` 수정**

`app/sections/QA.tsx` 6~10행의 타입/배열 선언에 `export` 추가:

```ts
export type FAQ = { q: string; a: string; tag?: string };

export const faqs: FAQ[] = [
```

같은 파일 52~55행:

```ts
  {
    tag: "활용",
    q: "잘 쓰는 사람과 못 쓰는 사람 격차가 커지지 않을까요?",
    a: "초반엔 벌어집니다. 잘 쓰는 사람의 요령은 대부분 “좋은 CLAUDE.md · 좋은 프롬프트 · 자주 쓰는 Skill”. 그래서 개인 노트로 두지 말고 공용 자산으로 굳혀야 합니다 — 격차가 개인 숙련도가 아니라 팀 자산이 됩니다.",
  },
```

를 아래로 교체:

```ts
  {
    tag: "활용",
    q: "Workflow로 여러 Subagent를 동시에 돌리면 뭐가 달라지나요?",
    a: "지금까지는 한 Subagent에게 한 디렉토리를 맡기는 정도였다면, Workflow는 리드 에이전트가 작업을 여러 단계·여러 파일로 쪼개 병렬 Subagent에 동시에 위임하고 결과만 취합합니다. 예를 들어 오늘 본 데모 A(분석)·H(문서화)를 같은 드라이버에 대해 동시에 돌려 검토 자료를 한 번에 받는 식입니다. 단, 서브에이전트 수가 늘수록 검토 부담도 커지므로 처음엔 2~3개로 시작하는 걸 권장합니다.",
  },
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `pnpm vitest run tests/sections/QA.test.ts`
Expected: PASS

- [ ] **Step 5: 빌드 + 전체 테스트 스위트 확인**

Run: `pnpm build && pnpm test`
Expected: 둘 다 성공.

- [ ] **Step 6: Commit**

```bash
git add app/sections/QA.tsx tests/sections/QA.test.ts
git commit -m "feat(content): QA 문항 하나를 Workflow 오케스트레이션 질문으로 교체"
```

---

## 최종 검증 (모든 Task 완료 후)

- [ ] `pnpm build` 성공
- [ ] `pnpm test` 전체 통과
- [ ] `pnpm dev`로 로컬 구동 후 §1(History), §2(Features), QA 섹션을 스크롤하며 신규 문구가 레이아웃 깨짐 없이 렌더되는지 최종 육안 확인
- [ ] `git log --oneline -4`로 4개 커밋(Task 1~4) 확인 후 사용자 지시에 따라 push
