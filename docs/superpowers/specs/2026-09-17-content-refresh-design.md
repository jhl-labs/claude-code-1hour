---
date: 2026-09-17
status: draft
audience: 메모리 컨트롤러 SW 엔지니어 (임베디드)
delivery: 줌 라이브 1시간
supersedes-partially: docs/superpowers/specs/2026-04-28-claude-code-1hour-design.md
---

# Claude Code 1시간 강의 — 콘텐츠 최신화 설계서 (2026-09)

## 0. 배경

`2026-04-28` 설계서 기준으로 플랜1~3(사이트 골격, 모션그래픽/R1 시뮬레이션, 임베디드 데모 5편)까지 구현 완료. 이후 5개월간 Claude / Claude Code가 발전(Claude 5 계열 모델, Workflow 다중 에이전트 오케스트레이션, Plugins 생태계 확대)했으나 §1(역사) 타임라인이 이를 반영하지 못하고 있음. 본 문서는 **콘텐츠 최신화**만 다룬다 — 사이트 기술 스택, 디렉토리 구조, 데모 제작 파이프라인(vhs+Remotion)은 기존 설계서(4-28) 그대로 유지한다.

## 0.1 실제 코드 확인 후 정정 (2026-09-17)

브레인스토밍 단계에서는 실제 코드를 읽지 않고 설계했다. `Features.tsx`, `V6SkillsSubagentsHooks.tsx`, `QA.tsx`, `GettingStarted.tsx`를 직접 확인한 결과 **Skills·Subagents·Hooks·MCP는 이미 상세히 구현되어 있음**을 확인했다(§2 "기능 도입 순서" 표에 Skills/MCP/Subagents 도입 시점까지 이미 정리돼 있음). 원래 계획했던 V4/V6 영상 폐기, V6-A/V6-B 신규 제작은 불필요한 중복이라 철회한다. 실제 갭은 다음 세 가지뿐이다.

1. `V1Timeline.tsx`의 마일스톤이 "2024 Claude 3 (Opus/Sonnet/Haiku)" → "2026 현재: Subagent·Hook·MCP·IDE"에서 멈춰 있음.
2. `History.tsx`의 "왜 지금 실전 도구가 됐나" 카드 3개(eyebrow: 2024 / 2025 / 2025~2026)도 동일한 시점에서 멈춰 있음.
3. `Features.tsx`의 Skills/Subagents/Hooks 카드(V6)와 MCP 카드(V5)에 "여러 서브에이전트를 동시에 오케스트레이션(Workflow)"과 "Plugins 마켓플레이스" 개념이 빠져 있음.

원래(정정 전) 계획 전문은 §10에 기록만 남긴다 — 실행하지 않는다.

## 1. 변경 범위 요약 (정정본)

| 파일 | 변경 여부 | 내용 |
|---|---|---|
| `remotion/compositions/V1Timeline.tsx` | **내용 갱신** | 마일스톤 배열에 2026 항목 2개 추가 |
| `app/sections/History.tsx` | **내용 갱신** | 카드 3개의 eyebrow/본문을 2026까지 연장 |
| `app/sections/Features.tsx` | **텍스트만 확장** | V6 카드 본문에 Workflow 오케스트레이션 1줄, V5 카드에 Plugins 마켓플레이스 1줄 추가. 영상 교체·신규 제작 없음 |
| `app/sections/QA.tsx` | **문항 1개 교체** | 시의성 낮은 문항 1개를 "Workflow로 여러 서브에이전트를 동시에 돌리면 뭐가 달라지나요?"로 교체 |
| §2 임베디드 데모 4종 / §4 효과 / §5 시작하기 | **변경 없음** | 이미 구현된 텍스트가 시의성 문제 없음(그레핑 결과 stale 참조 없음) |

## 2. `V1Timeline.tsx` 갱신 내용

현재 배열(파일 8~23행):
```ts
const milestones: Milestone[] = [
  { year: "2021", title: "Anthropic 창립", sub: "안전한 AI 연구" },
  { year: "2022~2023", title: "Claude 1 / 2", sub: "대화형 LLM 라인업 시작" },
  { year: "2024", title: "Claude 3 (Opus/Sonnet/Haiku)", sub: "에이전틱 도구 사용" },
  { year: "2025-02", title: "Claude Code 베타", sub: "터미널 코드 동료" },
  { year: "2025 GA", title: "정식 출시 + Plugins/Skills", sub: "생태계 확장" },
  { year: "2026 현재", title: "Subagent · Hook · MCP · IDE", sub: "어디서든 같은 에이전틱 루프" },
];
```

`{ year: "2026 현재", ... }` 항목을 `{ year: "2026", ... }`로 바꾸고, 그 뒤에 아래 2개를 추가한다(총 8개 마일스톤):

```ts
  { year: "2026", title: "Claude 5 계열 (Opus 5 · Sonnet 5 · Fable 5.1)", sub: "장시간 에이전트 작업 품질 도약" },
  { year: "2026 현재", title: "Workflow 오케스트레이션", sub: "여러 서브에이전트를 동시에 조율" },
```

타임라인 진행 애니메이션(`lineP`, 2~14초 구간)과 전체 영상 길이(90초, `V1Timeline`을 사용하는 `History.tsx`의 `durationInFrames={90 * 30}`)는 그대로 유지 — 마일스톤 렌더링 컴포넌트가 이미 배열 길이에 맞춰 자동 배치되는지 실제 렌더 컴포넌트(`AbsoluteFill` 이후 부분, 40행~파일 끝)를 먼저 확인하고, 8개 항목이 90초 안에 겹치지 않고 배치되는지 확인 후 필요 시 `lineP` 구간만 미세 조정한다.

## 3. `History.tsx` 갱신 내용

현재 3개 카드(파일 48~67행): eyebrow `2024`/`2025`/`2025~2026`, 각각 "대화형에서 작업형으로" / "큰 저장소를 스스로 탐색" / "팀 규칙을 함께 쓴다".

3개 카드 구성(`grid-cols-3`)은 유지하되, 세 번째 카드("팀 규칙을 함께 쓴다")의 eyebrow를 `2025~2026`에서 `2026`으로, 본문 마지막 문장에 Workflow 오케스트레이션 한 줄을 추가한다:

> "팀의 작업 방식"으로 붙는다는 점이 변곡점입니다. 여기에 더해 **Workflow**로 여러 서브에이전트를 동시에 굴려 사람이 결과만 취합하는 단계까지 왔습니다.

새 카드를 추가하지 않는 이유: 3열 그리드가 이미 "왜 지금인가"의 3단 논리(대화→탐색→팀 규칙)를 완결하고 있고, Workflow는 세 번째 논리("팀의 작업 방식")의 연장선이지 별도 논리축이 아니다.

## 4. `Features.tsx` 갱신 내용

- V6 카드(파일 165~182행, `title: "Skills · Subagents · Hooks"`) `body` 배열의 Subagent 설명 문장 뒤에 한 문장 추가:
  > "여러 Subagent를 한 번에 계획·팬아웃하는 Workflow로 묶으면, 데모 A/C/E/H 같은 작업을 병렬로 동시에 돌릴 수도 있습니다."
- V5 카드(파일 144~164행, `title: "MCP — 외부 시스템과의 다리"`) `body` 배열 두 번째 문장 뒤에 한 문장 추가:
  > "서드파티가 만든 MCP 서버·Skill 묶음을 Plugins 마켓플레이스에서 그대로 설치할 수도 있습니다."
- "기능 도입 순서" 표(파일 249~273행)는 변경 없음 — 이미 Skills(Week 2)·MCP(Month 1)·Subagents/Hooks(Month 2) 도입 시점이 정리돼 있어 Workflow를 별도 행으로 추가하지 않고 Subagents/Hooks 행 설명에 자연스럽게 포함되게 문구만 다듬는다: "자동 게이트와 금기 정의" → "자동 게이트·금기 정의 + Workflow로 반복 작업 팬아웃".
- 영상 컴포넌트(V2~V6) 교체·신규 제작 없음. `durationSec` 값 변경 없음.

## 5. `QA.tsx` 갱신 내용

10문항(faqs 배열, 파일 10~61행) 중 우선순위가 가장 낮은 "잘 쓰는 사람과 못 쓰는 사람 격차가 커지지 않을까요?" (tag: 활용, 53~55행) 를 아래로 교체한다. 이 문항을 고른 이유: 나머지 9문항은 도구 자체의 본질(비교/기술/특성/검증/도입)을 다루는 반면 이 문항은 조직 문화 이슈로 본 강의 톤(§1.3 "회의감을 정면으로 다루기보다 데모로 증명")과 결이 다르고, 대체 문항이 오늘 배운 Subagents/Workflow 개념을 곧바로 복습시켜 §2와의 연결이 더 강하다.

```ts
{
  tag: "활용",
  q: "Workflow로 여러 Subagent를 동시에 돌리면 뭐가 달라지나요?",
  a: "지금까지는 한 Subagent에게 한 디렉토리를 맡기는 정도였다면, Workflow는 리드 에이전트가 작업을 여러 단계·여러 파일로 쪼개 병렬 Subagent에 동시에 위임하고 결과만 취합합니다. 예를 들어 오늘 본 데모 A(분석)·H(문서화)를 같은 드라이버에 대해 동시에 돌려 검토 자료를 한 번에 받는 식입니다. 단, 서브에이전트 수가 늘수록 검토 부담도 커지므로 처음엔 2~3개로 시작하는 걸 권장합니다.",
},
```

배열 순서·개수(10개) 유지, `tag` 컬럼 값도 기존 톤에 맞춰 "활용" 유지.

## 6. 작업 범위 밖

- 데모 4종(A/C/E/H) 재촬영·신규 데모 추가 — 하지 않음.
- 사이트 기술 스택/디렉토리 구조 변경 — 하지 않음.
- 신규 영상 제작(V6-A/V6-B 등) — 하지 않음. 기존 V0~V11 14편 그대로.
- §4 효과 수치 재측정 — 이번 범위 밖.
- Hero, EmbeddedDemos.tsx, Impact.tsx, GettingStarted.tsx — 그레핑 결과 stale 참조 없어 변경 없음.
- 자가학습용 확장 — 여전히 비목표.

## 7. Done의 기준

1. `V1Timeline.tsx`가 8개 마일스톤을 렌더하고, 90초 안에서 텍스트가 겹치거나 잘리지 않는다(로컬 `pnpm remotion:studio`로 확인).
2. `History.tsx` 세 번째 카드가 Workflow 문장을 포함해 렌더된다.
3. `Features.tsx`의 V6/V5 카드에 추가 문장이 표시되고, 기존 레이아웃(그리드·카드 크기)이 깨지지 않는다.
4. `QA.tsx`가 여전히 10문항을 렌더하며, 교체된 문항이 §2 개념과 자연스럽게 이어진다.
5. `pnpm build` 정적 빌드가 성공한다.
6. `pnpm test` (Vitest)가 기존과 동일하게 통과한다(내용 텍스트 변경이 스냅샷 테스트를 깨는 경우 스냅샷을 갱신한다).

## 8. 향후 검토 (본 리팩토링 범위 밖, 참고용)

- Claude Code CLI 실제 명령어(`claude mcp add`, `/permissions`, `Shift+Tab` Plan mode 등)가 2026-09 기준으로도 유효한지는 별도 세션에서 실제 CLI로 재검증 권장 — 본 리팩토링은 문서/영상 텍스트 스코프만 다루므로 CLI 동작 자체는 검증하지 않았다.
- §4 효과 수치(30~60분, 2~4시간 등)의 재측정.

## 9. 원래(정정 전) 계획 — 실행하지 않음, 기록용

브레인스토밍 단계에서 실제 코드를 읽기 전에 세웠던 계획. §0.1에서 철회했으며 아래는 참고용으로만 남긴다.

> §2 핵심 기능 투어를 CLI/메모리/Skills(독립)/Subagents+Workflow(독립)/MCP+Plugins 5슬롯으로 재설계하고, 기존 V4(도구 사용)·V6(Skills/Subagent/Hooks 90초 묶음) 영상을 폐기한 뒤 V6-A(Skills, 60초)·V6-B(Subagents+Workflow, 75초) 신규 영상 2편을 제작한다는 계획이었음. 실제로는 V6가 이미 Skills·Subagents·Hooks를 상세히 다루고 있어 이 계획은 불필요한 중복 작업이었다.
